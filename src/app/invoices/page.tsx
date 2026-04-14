export const dynamic = 'force-dynamic';

import { FileBox, Printer, Search } from 'lucide-react';
import { getInvoices } from '@/actions/invoices';
import { getProducts } from '@/actions/products';
import CreateInvoiceModal from '@/components/invoices/CreateInvoiceModal';

export default async function InvoicesPage() {
  const [invRes, prodRes] = await Promise.all([
    getInvoices(),
    getProducts()
  ]);

  const invoices = invRes.success && invRes.data ? invRes.data : [];
  const products = prodRes.success && prodRes.data ? prodRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Penjualan (Invoices)</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar Tagihan penjualan produk PLTS ke Installer / Klien</p>
        </div>
        <CreateInvoiceModal products={products} />
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pencarian Nomor Tagihan..." 
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Tagihan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Installer / Klien</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Nilai Transaksi</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Tagihan</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!invoices || invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">Invoices Kosong</h3>
                    <p className="text-xs">Catatan penjualan / tagihan barang PLTS akan tercatat otomatis di sini.</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv: any) => (
                  <tr key={inv.inv_no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{inv.inv_no}</div>
                      <div className="text-xs text-gray-500">{new Date(inv.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inv.installer?.name || inv.installer_id}</div>
                      <div className="text-xs text-gray-500">{inv.items?.length || 0} Item Terjual</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                      Rp {inv.total_amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-indigo-600 font-medium px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded transition flex items-center inline-flex">
                        <Printer className="w-4 h-4 mr-1" /> Cetak PDF
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
