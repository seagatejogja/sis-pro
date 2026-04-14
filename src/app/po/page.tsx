import { FileText, Search, Truck } from 'lucide-react';
export const dynamic = 'force-dynamic';

import { getPurchaseOrders } from '@/actions/po';
import { getProducts } from '@/actions/products';
import CreatePoModal from '@/components/po/CreatePoModal';
import ReceiveButton from '@/components/po/ReceiveButton';

export default async function PurchaseOrdersPage() {
  const [poRes, prodRes] = await Promise.all([
    getPurchaseOrders(),
    getProducts()
  ]);

  const pos = poRes.success && poRes.data ? poRes.data : [];
  const products = prodRes.success && prodRes.data ? prodRes.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders (PO)</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola pemesanan barang dari Supplier pihak ketiga</p>
        </div>
        <CreatePoModal products={products} />
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pencarian Nomor PO..." 
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. PO & Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Estimasi</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!pos || pos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">Belum ada Pemesanan</h3>
                    <p className="text-xs">Daftar Purchase Order yang dibuat ke Supplier akan tampil di sini.</p>
                  </td>
                </tr>
              ) : (
                pos.map((po: any) => (
                  <tr key={po.po_no} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{po.po_no}</div>
                      <div className="text-xs text-gray-500">{new Date(po.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{po.supplier?.name || po.supplier_id}</div>
                      <div className="text-xs text-gray-500">{po.items?.length || 0} Item Pesanan</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                      Rp {po.total_est.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${po.status === 'SENT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {po.status === 'SENT' ? (
                        <ReceiveButton po_no={po.po_no} />
                      ) : (
                        <span className="text-gray-400 text-sm font-medium mr-4">Selesai</span>
                      )}
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
