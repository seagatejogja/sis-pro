export const dynamic = 'force-dynamic';

import { getFinancialReports } from '@/actions/reports';
import { AreaChart, Wallet, Scale, ArrowUpRight, ArrowDownRight, HandCoins } from 'lucide-react';

export default async function ReportsPage() {
  const res = await getFinancialReports();
  const report = res.success ? res.data : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-2xl p-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">Laporan Keuangan & Bagi Hasil</h1>
          <p className="text-indigo-200">Rekapitulasi otomatis tarikan algoritma FIFO HPP & Profit Margin Invoices</p>
        </div>
        <div className="hidden md:block bg-indigo-800/50 p-4 rounded-xl border border-indigo-700/50 backdrop-blur-md">
           <p className="text-sm text-indigo-300 font-medium mb-1">Status Periode</p>
           <h3 className="font-bold text-xl text-white">🟢 Aktif & Lancar</h3>
        </div>
      </div>

      {!report ? (
        <div className="text-center p-12 text-gray-500 bg-white rounded-xl shadow-sm">Gagal memuat laporan kalkulasi.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Pendapatan (Omzet)</p>
                    <h3 className="text-2xl font-bold text-gray-900">Rp {report.totalRevenue.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-6 h-6" /></div>
               </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total HPP (Modal FIFO)</p>
                    <h3 className="text-2xl font-bold text-gray-900">Rp {report.totalHpp.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Scale className="w-6 h-6" /></div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Laba Kotor</p>
                    <h3 className="text-2xl font-bold text-emerald-600">Rp {report.grossProfit.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpRight className="w-6 h-6" /></div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-xl border border-orange-200 shadow-sm hover:shadow-md transition text-white">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-orange-100 mb-1">Bagi Hasil Investor (20%)</p>
                    <h3 className="text-2xl font-bold text-white">Rp {report.investorShare.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="p-2 bg-white/20 rounded-lg"><HandCoins className="w-6 h-6 text-white" /></div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
              <div className="flex items-center mb-6">
                 <AreaChart className="w-5 h-5 mr-2 text-indigo-600" />
                 <h2 className="text-lg font-bold text-gray-900">Grafik Laba (Realtime Dashboard)</h2>
              </div>
              <div className="h-64 flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500 px-6 text-center">
                 <p className="font-medium text-gray-700 mb-2">Integrasi Visual Kosong</p>
                 <p className="text-sm">Silahkan setujui penambahan modul `recharts` / `chart.js` jika Anda ingin visualisasi grafis tren Profit Sharing di area ini.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Postur Distribusi</h2>
                <div className="space-y-4">
                  <div className="border border-gray-100 rounded-lg p-4">
                      <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Porsi PT. ITI (80%)</p>
                      <h4 className="text-xl font-bold text-gray-800">Rp {report.itiShare.toLocaleString('id-ID')}</h4>
                  </div>
                  <div className="border border-blue-100 bg-blue-50 rounded-lg p-4">
                      <p className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">Jumlah Transaksi Invoice</p>
                      <h4 className="text-xl font-bold text-blue-900">{report.transactions} Tiket Valid</h4>
                  </div>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
