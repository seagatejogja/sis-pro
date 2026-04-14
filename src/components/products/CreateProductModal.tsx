'use client';

import { useState } from 'react';
import { PackagePlus, X } from 'lucide-react';
import { createProduct } from '@/actions/products';

export default function CreateProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await createProduct({
      id: formData.get('id') as string,
      category: formData.get('category') as string,
      brand: formData.get('brand') as string,
      model_name: formData.get('model_name') as string,
      unit: formData.get('unit') as string,
      min_stock: Number(formData.get('min_stock')),
      qr_code: formData.get('qr_code') as string || undefined,
    });

    if (res.success) {
      setIsOpen(false);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition flex items-center"
      >
        <PackagePlus className="w-4 h-4 mr-2" />
        Tambah Produk
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Tambah Produk Baru</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">SKU / ID Produk *</label>
                  <input required name="id" placeholder="Cth: PRD-001" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Kategori *</label>
                  <select required name="category" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                    <option value="Solar Panel">Solar Panel</option>
                    <option value="Inverter">Inverter</option>
                    <option value="Baterai">Baterai</option>
                    <option value="Kabel">Kabel & Konektor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Merek (Brand) *</label>
                  <input required name="brand" placeholder="Cth: Growatt" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Tipe / Model *</label>
                  <input required name="model_name" placeholder="Cth: 10KTL3-X" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Satuan *</label>
                  <input required name="unit" placeholder="Unit, Roll..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Min. Stok</label>
                  <input required type="number" name="min_stock" defaultValue="0" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-1.5 focus-within:text-blue-600">
                  <label className="text-sm font-medium text-gray-700 transition-colors">Kode QR Target</label>
                  <input name="qr_code" placeholder="Kosongi untuk auto" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                  Batal
                </button>
                <button disabled={loading} type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition disabled:opacity-50">
                  {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
