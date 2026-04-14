import { Bell, Search, User } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 sticky top-0">
      {/* Mobile Menu Button - to be built later */}
      <div className="flex md:hidden">
        <span className="font-bold text-slate-800">SIS Mobile</span>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search className="h-5 w-5 ml-2" />
          </div>
          <input
            name="search"
            className="block w-full h-10 pl-10 pr-3 rounded-full bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none sm:text-sm transition-all"
            placeholder="Cari PO, Invoice, atau Barang..."
            type="search"
          />
        </div>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center space-x-4 ml-auto">
        <button className="text-gray-400 hover:text-gray-500 relative">
          <span className="sr-only">Notifikasi</span>
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ml-2">
            A
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">Admin ITI</span>
        </div>
      </div>
    </header>
  );
}
