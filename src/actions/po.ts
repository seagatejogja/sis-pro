'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPurchaseOrders() {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      orderBy: { date: 'desc' },
      include: {
        supplier: true,
        items: true,
      }
    });
    return { success: true, data: pos }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createPurchaseOrder(data: {
  po_no: string;
  supplier_id: string;
  notes?: string;
  items: { product_id: string; qty: number; unit_price: number }[];
}) {
  try {
    // Check if supplier exists, if not create a dummy one for demo
    let supplier = await prisma.contact.findUnique({ where: { id: data.supplier_id } });
    if (!supplier) {
      supplier = await prisma.contact.create({
        data: {
          id: data.supplier_id,
          name: 'Supplier ' + data.supplier_id,
          type: 'Supplier'
        }
      });
    }

    const total = data.items.reduce((acc, item) => acc + (item.qty * item.unit_price), 0);

    const po = await prisma.purchaseOrder.create({
      data: {
        po_no: data.po_no,
        supplier_id: data.supplier_id,
        notes: data.notes,
        total_est: total,
        status: 'SENT',
        created_by: 'Admin',
        items: {
          create: data.items.map(i => ({
            product_id: i.product_id,
            qty: i.qty,
            unit_price: i.unit_price,
            subtotal: i.qty * i.unit_price
          }))
        }
      }
    });
    revalidatePath('/po');
    return { success: true, data: po }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
