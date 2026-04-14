'use client';

import { Truck } from 'lucide-react';
import { simulatePoReception } from '@/actions/receiving';
import { useState } from 'react';

export default function ReceiveButton({ po_no }: { po_no: string }) {
  const [loading, setLoading] = useState(false);

  async function handleReceive() {
    if (confirm("Masukkan stok PO ini ke Gudang Utama secara otomatis?")) {
      setLoading(true);
      const res = await simulatePoReception(po_no);
      if (!res.success) {
        alert("Gagal menerima PO: " + res.error);
      } else {
        alert("Barang berhasil dimasukkan dalam stok gudang (Stock Batch FIFO)!");
      }
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleReceive}
      disabled={loading}
      className={`font-medium px-3 py-1 rounded transition mr-2 flex items-center inline-flex
        ${loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
    >
      <Truck className="w-4 h-4 mr-1" /> {loading ? 'Memproses...' : 'Terima Barang'}
    </button>
  );
}
