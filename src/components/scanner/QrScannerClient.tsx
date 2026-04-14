'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function QrScannerClient() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Only initialize Html5Qrcode on the client side
    scannerRef.current = new Html5Qrcode("reader");

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!scannerRef.current) return;
    setScanResult(null);
    setIsScanning(true);
    
    try {
      await scannerRef.current.start(
        { facingMode: "environment" }, // Prefer back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback
          setScanResult(decodedText);
          scannerRef.current?.stop().catch(console.error);
          setIsScanning(false);
        },
        (errorMessage) => {
          // Ignore frequent error callbacks regarding unfound codes
        }
      );
    } catch (err) {
      setIsScanning(false);
      alert("Gagal mengakses kamera. Harap izinkan akses kamera browser Anda: " + err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto space-y-6">
      <div className="text-center w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Pindai Barcode / QR Produk</h2>
        <p className="text-gray-500 text-sm">Arahkan kamera perangkat Anda (HP/Tablet) langsung ke label QR Code di fisik Inverter atau Panel Surya.</p>
      </div>

      {/* Kamera Viewport */}
      <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-slate-100 flex items-center justify-center">
        {!isScanning && !scanResult && (
           <div className="text-center">
             <Camera className="w-16 h-16 text-slate-500 mx-auto mb-3 opacity-50" />
             <p className="text-slate-400 font-medium tracking-wide">Kamera Non-aktif</p>
           </div>
        )}
        
        {scanResult && (
           <div className="text-center bg-emerald-500 w-full h-full flex flex-col items-center justify-center text-white p-6">
             <CheckCircle2 className="w-20 h-20 mb-4 animate-bounce" />
             <p className="font-bold text-xl mb-1">Berhasil Terbaca!</p>
             <p className="text-emerald-100 font-mono text-sm break-all">{scanResult}</p>
           </div>
        )}
        
        <div id="reader" className={`w-full h-full ${!isScanning ? 'hidden' : 'block'}`}></div>
      </div>

      {/* Kontrol */}
      <div className="flex gap-4 w-full">
        {!isScanning ? (
          <button 
            onClick={startScanning} 
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold font-lg shadow-lg hover:bg-blue-700 transition active:scale-95 flex items-center justify-center"
          >
            {scanResult ? 'Pindai Ulang' : 'Nyalakan Kamera Scanner'}
          </button>
        ) : (
          <button 
            onClick={stopScanning} 
            className="flex-1 py-4 bg-red-500 text-white rounded-xl font-bold font-lg shadow-lg hover:bg-red-600 transition active:scale-95 flex items-center justify-center"
          >
             Matikan Kamera
          </button>
        )}
      </div>

      {/* Simulasi Info Fetch */}
      {scanResult && (
        <div className="w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm mt-4 animate-in slide-in-from-bottom-5">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-gray-800">Detail Kode Produk</h3>
             <button className="text-blue-600 outline-none hover:rotate-180 transition duration-500 p-1">
               <RefreshCw className="w-4 h-4" />
             </button>
           </div>
           
           <div className="space-y-3 font-mono text-sm text-gray-600">
             <div className="flex justify-between border-b border-gray-50 pb-2">
                 <span>QR Value:</span>
                 <span className="font-bold text-gray-900 border px-1 bg-gray-50 rounded">{scanResult}</span>
             </div>
             <p className="text-blue-600 font-sans text-xs pt-1 italic">
                (Sistem akan mencari ID ini di database dan akan langsung menampilkan sisa stok dari Batch FIFO).
             </p>
           </div>
        </div>
      )}

    </div>
  );
}
