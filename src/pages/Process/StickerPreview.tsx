// src/components/StickerPreview.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { CheckCircle2, XCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import background image for sticker
import bgSticker from "assets/images/bg-stiker.png"; 

// TypeScript interfaces
interface PermittedVehicle {
  id: number;
  package_id: number;
  plate_number: string;
  no_lambung: string;
  stnk: string;
  driver_name: string;
  sim: string;
  number_stiker: number;
  location_id: number;
  cargo: string;
  origin: string;
  start_date: string; // ISO date string
  expired_at: string; // ISO date string
  total_cost?: string | null;
  notes?: string;
}

interface Personnel {
  id: number;
  name: string;
  identity_number: string;
  location_id: number;
  package_id: number;
  notes?: string;
}

interface ProcessIMK {
  id: number;
  imk_number: string;
  document_number: string;
  registration_date: string; // ISO date string
  customer: string;
  tenant_id: string;
  total_cost: string | null;
  item: string;
  status_imk: boolean;
  status_sticker: boolean;
  stickerPrinted?: boolean;
  permitted: PermittedVehicle[];
  personnels: Personnel[];
}

const StickerPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [process, setProcess] = useState<ProcessIMK | null>(null);
  const [stickerPDF, setStickerPDF] = useState<string>("");

  // Mapping location_id to location names (example)
  const locationMap: { [key: number]: string } = {
    201: "Location A",
    301: "Location B",
    // Add other mappings as necessary
  };

  useEffect(() => {
    // Mengambil data proses dari state navigasi
    const state = location.state as { process: ProcessIMK };
    if (state && state.process) {
      setProcess(state.process);
    } else {
      // Jika tidak ada data, kembali ke halaman utama atau tampilkan pesan
      toast.error("Tidak ada data proses untuk ditampilkan.");
      navigate(-1); // Kembali ke halaman sebelumnya
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (process) {
      generateStickerPDF(process);
    }
  }, [process]);

  const generateStickerPDF = useCallback((proc: ProcessIMK) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Tentukan ukuran dan posisi stiker dalam satuan mm
    const stickerWidth = 90;
    const stickerHeight = 90;

    // Posisi manual untuk empat stiker pada halaman A4
    const positions = [
      { x: 10, y: 10 },   // Stiker kiri atas
      { x: 110, y: 10 },  // Stiker kanan atas
      { x: 10, y: 150 },  // Stiker kiri bawah
      { x: 110, y: 150 }, // Stiker kanan bawah
    ];

    // Fungsi untuk menambahkan gambar stiker di posisi yang ditentukan
    const addSticker = (x: number, y: number) => {
      // Tambahkan gambar di posisi x, y dengan ukuran stiker
      doc.addImage(bgSticker, "PNG", x, y, stickerWidth, stickerHeight);
      // Tambahkan teks atau informasi lain di dalam stiker jika diperlukan
      doc.setFontSize(10);
      doc.text(`IMK: ${proc.imk_number}`, x + 5, y + 20);
      doc.text(`Plat: ${proc.permitted[0]?.plate_number || "N/A"}`, x + 5, y + 30);
      doc.text(`Driver: ${proc.permitted[0]?.driver_name || "N/A"}`, x + 5, y + 40);
      // Tambahkan informasi lain sesuai kebutuhan
    };

    // Menambahkan empat stiker pada posisi yang telah ditentukan
    positions.forEach(({ x, y }) => {
      addSticker(x, y);
    });

    // Menyimpan PDF sebagai data URL
    const pdfDataUrl = doc.output("dataurlstring");
    setStickerPDF(pdfDataUrl);
  }, []);

  // Handle Print Sticker
  const handlePrintSticker = useCallback(() => {
    if (stickerPDF) {
      const printWindow = window.open(stickerPDF, "_blank");
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
        toast.success(`Stiker untuk Proses IMK ${process?.imk_number} telah dicetak!`);
      } else {
        toast.error("Gagal membuka jendela cetak.");
      }
    }
  }, [stickerPDF, process]);

  return (
    <React.Fragment>
      {/* Toast Notifications */}
      <ToastContainer closeButton={false} limit={1} />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-800 p-4">
        {stickerPDF ? (
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Sticker Preview</h2>
            <iframe
              src={stickerPDF}
              title="Sticker Preview"
              className="w-full h-96 border"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePrintSticker}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Print Sticker
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">Generating sticker preview...</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default StickerPreview;
