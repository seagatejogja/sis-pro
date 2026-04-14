'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createInvoice } from '@/actions/invoices';

export default function CreateInvoiceModal({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ product_id: '', qty: 1, sell_price: 0 }]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const validItems = items.filter(i => i.product_id !== '' && i.qty > 0);

    const res = await createInvoice({
      inv_no: formData.get('inv_no') as string,
      installer_id: formData.get('installer_id') as string,
      notes: formData.get('notes') as string,
      items: validItems
    });

    if (res.success) {
      setIsOpen(false);
    } else {
      alert("Error Checkout: " + res.error);
    }
    setLoading(false);
  }

  function addItem() {
    setItems([...items, { product_id: '', qty: 1, sell_price: 0 }]);
  }

  function updateItem(index: number, field: string, value: any) {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Buat Tagihan Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Form Tagihan / Invoice Penjualan</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700">Nomor Invoice *</label>
                  <input required name="inv_no" placeholder="Contoh: INV-2026-001" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700">ID Installer / Klien *</label>
                  <input required name="installer_id" placeholder="Cth: INS-001" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <label className="text-sm font-bold text-gray-700">Daftar Penjualan Item</label>
                  <button type="button" onClick={addItem} className="text-xs bg-gray-100 text-blue-600 font-bold px-2 py-1 rounded">
                    + Tambah Baris
                  </button>
                </div>
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                     <select 
                       required
                       value={item.product_id}
                       onChange={e => updateItem(idx, 'product_id', e.target.value)}
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                     >
                       <option value="" disabled>Pilih Produk Keluar...</option>
                       {products.map(p => (
                         <option key={p.id} value={p.id}>{p.id} - {p.model_name}</option>
                       ))}
                     </select>
                     <input 
                       required type="number" placeholder="Qty" 
                       value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))}
                       className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm" 
                     />
                     <input 
                       required type="number" placeholder="Harga Jual (Rp)" 
                       value={item.sell_price} onChange={e => updateItem(idx, 'sell_price', Number(e.target.value))}
                       className="w-36 px-3 py-2 border border-gray-300 rounded-md text-sm" 
                     />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                 <label className="text-sm font-medium text-gray-700">Catatan Invoice</label>
                 <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                  Batal
                </button>
                <button disabled={loading} type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50 transition">
                  {loading ? 'Memproses...' : 'Kirim & Terbitkan Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
