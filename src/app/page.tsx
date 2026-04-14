import { PackageCheck, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Eksekutif</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition">
            Buat Invoice Baru
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Penjualan (Bulan Ini)</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">Rp 125.000.000</span>
                  <span className="ml-2 text-sm font-semibold text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1"/> 12%
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-lg">
              <PackageCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Barang Masuk (Batch)</dt>
                <dd className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">24</span>
                  <span className="ml-2 text-sm text-gray-500">Transact</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="mb-2">Area visualisasi Laba & Rugi (P&L Chart) akan dirender di sini via Chart.js / Recharts.</p>
          <p className="text-sm">Menarik data dari Supabase dalam 0.1 Detik ⚡</p>
        </div>
      </div>
    </div>
  );
}
