'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
  try {
    const invs = await prisma.invoice.findMany({
      orderBy: { date: 'desc' },
      include: {
        installer: true,
        items: true,
      }
    });
    return { success: true, data: invs }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createInvoice(data: {
  inv_no: string;
  installer_id: string;
  notes?: string;
  items: { product_id: string; qty: number; sell_price: number }[];
}) {
  try {
    // Demo installer setup
    let installer = await prisma.contact.findUnique({ where: { id: data.installer_id } });
    if (!installer) {
      installer = await prisma.contact.create({
        data: {
          id: data.installer_id,
          name: 'Installer / Klien ' + data.installer_id,
          type: 'Installer'
        }
      });
    }

    // ==========================================
    // ALGORITMA FIFO HPP & PROFIT SHARING 
    // ==========================================
    let total_amount = 0;
    let total_hpp = 0;
    const invoiceItemsPayload = [];

    // Lakukan deduplikasi atau proses per item
    for (const reqItem of data.items) {
      // Cari stok batch produk ini di gudang yang belum habis, urut FIFO (tanggal masuk terlama) 
      const batches = await prisma.stockBatch.findMany({
        where: { 
          product_id: reqItem.product_id,
          qty_remaining: { gt: 0 }
        },
        orderBy: { entry_date: 'asc' }
      });

      let remainingToFulfill = reqItem.qty;
      let itemTotalHpp = 0;
      let qtySuccessfullyTaken = 0;

      // Deduct dari Batch
      for (const batch of batches) {
        if (remainingToFulfill <= 0) break;

        const takeQty = Math.min(batch.qty_remaining, remainingToFulfill);
        
        // Simpan pemotongan secara fisik ke database batch
        await prisma.stockBatch.update({
          where: { batch_id: batch.batch_id },
          data: { qty_remaining: batch.qty_remaining - takeQty }
        });

        // Kalkulasi Harga Pokok Penjualan (HPP) untuk cuplikan pengeluaran Stok ini
        itemTotalHpp += (takeQty * batch.buy_price);
        qtySuccessfullyTaken += takeQty;
        remainingToFulfill -= takeQty;
      }

      // Jika stok fisik habis ditarik
      if (remainingToFulfill > 0) {
        // Tembak peringatan bahwa Stok tidak cukup untuk Invoice ini! (Gagal)
        throw new Error(`Stok fisik barang ${reqItem.product_id} tidak mencukupi untuk memenuhi pesanan.`);
      }

      const hpp_per_unit = itemTotalHpp / reqItem.qty; // Rata-rata HPP gabungan dari batch yg diambil
      const subtotal = reqItem.qty * reqItem.sell_price;

      total_amount += subtotal;
      total_hpp += itemTotalHpp;

      invoiceItemsPayload.push({
        product_id: reqItem.product_id,
        qty: reqItem.qty,
        sell_price: reqItem.sell_price,
        subtotal: subtotal,
        hpp_per_unit: hpp_per_unit,
        hpp_subtotal: itemTotalHpp
      });
    }

    // Create Invoice with FIFO-tracked Items
    const inv = await prisma.invoice.create({
      data: {
        inv_no: data.inv_no,
        installer_id: data.installer_id,
        notes: data.notes,
        total_amount: total_amount,
        total_hpp: total_hpp,
        status: 'PAID', // Auto asumsi cair
        created_by: 'Sistem Pusat',
        items: {
          create: invoiceItemsPayload
        }
      }
    });

    // Pindah perhitungan Profit Sharing ke Backend/Analytics Dashboard
    // Laba kotor = total_amount - total_hpp
    // Bagi Hasil 20% Investor = ...

    revalidatePath('/invoices');
    revalidatePath('/') // Revalidate dashboard
    return { success: true, data: inv }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
