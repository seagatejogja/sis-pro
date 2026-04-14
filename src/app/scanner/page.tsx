import QrScannerClient from '@/components/scanner/QrScannerClient';

export default function ScannerPage() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scanner Opname Gudang</h1>
          <p className="text-gray-500 text-sm mt-1">Gunakan perangkat seluler Anda untuk mendata keluar/masuk barang</p>
        </div>
      </div>
      
      {/* Container utama dilempar ke Client Component supaya bisa akses API Hardware kamera */}
      <QrScannerClient />
    </div>
  );
}
