'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function simulatePoReception(po_no: string) {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { po_no },
      include: { items: true }
    });
    
    if (!po) throw new Error("PO tidak ditemukan");
    if (po.status === 'RECEIVED') throw new Error("PO ini sudah pernah diterima");

    // Simulasi gudang dummy jika data gudang kosong
    let wh = await prisma.warehouse.findFirst();
    if (!wh) {
       wh = await prisma.warehouse.create({
         data: { id: "WH-DEMO", warehouse_name: "Gudang Utama Pabrik ITI" }
       });
    }

    // Suntik PO Items menjadi StockBatch ke Gudang
    for (const item of po.items) {
      await prisma.stockBatch.create({
        data: {
          batch_id: `BTH-${po.po_no}-${item.product_id}-${Math.floor(Math.random()*100)}`,
          po_no: po.po_no,
          product_id: item.product_id,
          warehouse_id: wh.id,
          qty_initial: item.qty,
          qty_remaining: item.qty,
          buy_price: item.unit_price,
          manual_ref: `Penerimaan Sistem PO ${po.po_no}`
        }
      });
    }

    await prisma.purchaseOrder.update({
      where: { po_no },
      data: { status: 'RECEIVED' }
    });

    revalidatePath('/po');
    revalidatePath('/products');
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
