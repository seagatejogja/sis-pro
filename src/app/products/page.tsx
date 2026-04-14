export const dynamic = 'force-dynamic';

import { getProducts } from '@/actions/products';
import { QrCode, Search, Trash2 } from 'lucide-react';
import CreateProductModal from '@/components/products/CreateProductModal';

export default async function ProductsPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Produk</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola seluruh barang inventaris dan sparepart PLTS</p>
        </div>
        <CreateProductModal />
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari ID, Brand, atau Model..." 
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center font-medium">
            <QrCode className="w-4 h-4 mr-2" />
            Cetak Label QR
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU / ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Min. Stok</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!res.success ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-red-500 font-bold bg-red-50 border border-red-200 rounded">
                    KONEKSI DATABASE TERPUTUS KARENA FIREWALL KAMPUS: <br/><br/>
                    {res.error}
                  </td>
                </tr>
              ) : !products || products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                    Belum ada data produk aktif di Supabase.
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                        {p.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{p.brand}</div>
                      <div className="text-sm text-gray-500">{p.model_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {p.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {p.min_stock} {p.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
