import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Sun, Search } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 h-full hidden md:flex flex-col text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Sun className="h-6 w-6 text-yellow-400 mr-2" />
        <span className="font-bold text-lg text-white">Solar-Track Pro</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <Link href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" />
            Dashboard
          </Link>
          <Link href="/products" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Package className="h-5 w-5 mr-3 flex-shrink-0" />
            Inventaris Gudang
          </Link>
          <Link href="/scanner" className="flex items-center px-3 py-2 text-sm font-medium border border-blue-600/30 text-blue-400 bg-blue-900/10 rounded-md hover:bg-blue-800 hover:text-white transition-colors mt-1 mb-1">
            <Search className="h-5 w-5 mr-3 flex-shrink-0" />
            Scanner Gudang
          </Link>
          <Link href="/po" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <ShoppingCart className="h-5 w-5 mr-3 flex-shrink-0" />
            Pengadaan (PO)
          </Link>
          <Link href="/invoices" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5 mr-3 flex-shrink-0" />
            Data Penjualan
          </Link>
          <Link href="/reports" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" />
            Laporan Keuangan
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link href="/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="h-5 w-5 mr-3 flex-shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
