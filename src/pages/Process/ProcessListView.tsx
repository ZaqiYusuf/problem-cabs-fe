// src/components/ProcessListView.tsx
import React, { useCallback, useMemo, useState, useEffect } from "react";
import TableContainer from "Common/TableContainer";

import { getEntryPermits, updateEntryPermits, postEntryPermits, deleteEntryPermits } from "helpers/backend_helper";



// Icons
import {
  Search,
  Trash2,
  Plus,
  FileEdit,
  Info,
  Download,
  CheckCircle2,
  XCircle,
  Printer,
} from "lucide-react";
import DeleteModal from "Common/DeleteModal";
import Modal from "Common/Components/Modal"; // Pastikan path import sesuai
import { useNavigate } from "react-router-dom";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// jsPDF
import jsPDF from "jspdf";

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
  customer_id: string;
  tenant_id: string;
  total_cost: string | null;
  item: string;

  status_imk: boolean;
  status_sticker: boolean;
  stickerPrinted?: boolean; // Added to track sticker print status
  
  permitted: PermittedVehicle[];
  personnels: Personnel[];
}

const ProcessListView = () => {
  const navigate = useNavigate();

  // Dummy Data
  const [processes, setProcesses] = useState<ProcessIMK[]>([]);
  
  const [filteredProcess, setFilteredProcess] = useState<ProcessIMK[]>(processes);



  const getCustomer = async () => {
    try {
      const response: any = await getEntryPermits();
      console.log("Respons dari API:", response);

      if (Array.isArray(response.process_imks)) {
        const mappedProcess = response.process_imks.map((item: any) => ({
          id: item.id,
          imk_number: item.imk_number,
          document_number: item.document_number,
          registration_date: item.registration_date,
          customer_id: item.customer.name_customer,
          tenant_id: item.tenant_id,
          total_cost: item.total_cost || null,
          item: item.item || "",
          status_imk: item.status_imk,
          status_sticker: true,
          stickerPrinted: true,
          permitted: item.vehicles || [],
          personnels: item.personnels || [],
        }));

        console.log("Data yang sudah dipetakan:", mappedProcess);
        setProcesses(mappedProcess);
        setFilteredProcess(mappedProcess);
      } else {
        console.error("process_imks bukan array:", response.process_imks);
        setProcesses([]);
        setFilteredProcess([]);
      }
    } catch (error) {
      console.error("Error saat memuat data:", error);
      setProcesses([]);
      setFilteredProcess([]);
    }
  }

    // const [isEdit, setIsEdit] = useState<boolean>(false);
    const deleteSettings = async (data: any) => {
      await deleteEntryPermits(data.id).then(() => {
        getCustomer();
      });
    };
    


  useEffect(() => {
    getCustomer()
  }, []);




  const [filteredProcesses, setFilteredProcesses] =
    useState<ProcessIMK[]>(processes);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [eventData, setEventData] = useState<ProcessIMK | undefined>(undefined);

  // New states for Sticker Preview Modal
  const [isStickerPreviewOpen, setIsStickerPreviewOpen] =
    useState<boolean>(false);
  const [stickerPreviewURL, setStickerPreviewURL] = useState<string>("");
  const [currentStickerProcess, setCurrentStickerProcess] = useState<
    ProcessIMK | undefined
  >(undefined);

  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);




  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setProcesses((prevProcesses) =>
        prevProcesses.filter((proc) => proc.id !== eventData.id)
      );
      setFilteredProcesses((prevFiltered) =>
        prevFiltered.filter((proc) => proc.id !== eventData.id)
      );
      deleteSettings(eventData)
      toast.success("Proses IMK berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Detail
  const handleDetailClick = useCallback(
    (proc: ProcessIMK) => {
      // Navigate to /permitted-vehicle with process data
      navigate("/permitted-vehicle", {
        state: { processId: proc.imk_number, permittedList: proc.permitted },
      });
    },
    [navigate]
  );

  const handlePersonnelClick = useCallback(
    (proc: ProcessIMK) => {
      // Navigate to /personnel with process data
      navigate("/permitted-personnel", {
        state: { processId: proc.imk_number, personnelList: proc.personnels },
      });
    },
    [navigate]
  );

  // Mapping location_id to location names (example)
  const locationMap: { [key: number]: string } = {
    201: "Location A",
    301: "Location B",
    // Add other mappings as necessary
  };

  // Handle PDF Download without autoTable
  const handlePDFClick = useCallback(
    (proc: ProcessIMK) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const lineHeight = 7;
      let currentY = margin;
  
      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("IZIN MASUK KAWASAN KIE", pageWidth / 2, currentY, { align: "center" });
      currentY += lineHeight * 2;
  
      // Details Section
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nomor Register: ${proc.imk_number}`, margin, currentY);
      doc.text(`Perusahaan Yang Mengajukan: ${proc.customer_id}`, margin, currentY + lineHeight);
      doc.text(`Status: ${proc.status_imk ? "Active" : "Non Tenant"}`, margin, currentY + lineHeight * 2);
      doc.text(
        `Total Biaya: ${
          proc.total_cost
            ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(proc.total_cost))
            : "Rp0"
        }`,
        pageWidth - margin - 50,
        currentY + lineHeight * 2
      );
      currentY += lineHeight * 4;
  
      // Garis Pemisah
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += lineHeight;
  
      // Kendaraan Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("KENDARAAN", margin, currentY);
      currentY += lineHeight;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
  
      const kendaraanHeaders = [
        "No", "Plat\nKendaraan", "No\nLambung", "Driver\nName", "Cargo", "Origin",
        "Periode\nMulai", "Periode\nBerakhir", "Biaya", "Keterangan"
      ];
      const kendaraanColWidths = [10, 25, 20, 30, 25, 25, 20, 20, 20, 25];
      const kendaraanXPositions = kendaraanColWidths.reduce((acc, width, index) => {
        acc.push((acc[index - 1] || margin) + width);
        return acc;
      }, [] as number[]);
  
      // Draw Kendaraan Table Header with bold and centered text
      
      doc.setFont('helvetica', 'bold');
      kendaraanHeaders.forEach((header, index) => {
        doc.text(header, kendaraanXPositions[index] - kendaraanColWidths[index] / 2, currentY, { align: "center" });
      });
      currentY += lineHeight;
  
      // Garis Pemisah Header
      doc.setLineWidth(0.3);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += lineHeight;
  
      // Draw Kendaraan Rows with borders and proper alignment
      proc.permitted.forEach((item, index) => {
        const details = [
          `${index + 1}`,
          item.plate_number || "N/A",
          item.no_lambung || "N/A",
          item.driver_name || "N/A",
          item.cargo || "N/A",
          item.origin || "N/A",
          new Date(item.start_date).toLocaleDateString("id-ID"),
          new Date(item.expired_at).toLocaleDateString("id-ID"),
          item.total_cost
            ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(item.total_cost))
            : "Rp0",
          // item.notes || "",
        ];
  
        details.forEach((detail, colIndex) => {
          doc.text(detail, kendaraanXPositions[colIndex] - kendaraanColWidths[colIndex] / 2, currentY, { align: "center" });
        });
        currentY += lineHeight;
  
        // Garis Pemisah Tabel
        doc.setLineWidth(0.3);
        doc.line(margin, currentY, pageWidth - margin, currentY);
  
        // Check for page overflow and add a new page if necessary
        if (currentY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentY = margin;
        }
      });
  
      // Add space between sections
      currentY += lineHeight;
  
      // Personil Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("PERSONIL", margin, currentY);
      currentY += lineHeight;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
  
      const personilHeaders = [
        "No", "Nama", "No KTP/SIM", "Lokasi Kerja", "Periode", "Keterangan"
      ];
      const personilColWidths = [10, 40, 30, 35, 20, 25];
      const personilXPositions = personilColWidths.reduce((acc, width, index) => {
        acc.push((acc[index - 1] || margin) + width);
        return acc;
      }, [] as number[]);
  
      // Draw Personil Table Header with bold and centered text
      doc.setFont('helvetica', 'bold');
      personilHeaders.forEach((header, index) => {
        doc.text(header, personilXPositions[index] - personilColWidths[index] / 2, currentY, { align: "center" });
      });
      currentY += lineHeight;
  
      // Garis Pemisah Header
      doc.setLineWidth(0.3);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += lineHeight;
  
      // Draw Personil Rows with borders and proper alignment
      proc.personnels.forEach((person, index) => {
        const details = [
          `${index + 1}`,
          person.name || "N/A",
          person.identity_number || "N/A",
          locationMap[person.location_id] || "N/A",
          "1 Bulan", // Adjust if you have actual period data
          person.notes || "",
        ];
  
        details.forEach((detail, colIndex) => {
          doc.text(detail, personilXPositions[colIndex] - personilColWidths[colIndex] / 2, currentY, { align: "center" });
        });
        currentY += lineHeight;
  
        // Garis Pemisah Tabel
        doc.setLineWidth(0.3);
        doc.line(margin, currentY, pageWidth - margin, currentY);
  
        // Check for page overflow and add a new page if necessary
        if (currentY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentY = margin;
        }
      });
  
      // Footer Section
      currentY += lineHeight; // Space before Footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("NOTE:", margin, currentY);
      currentY += lineHeight;
      const notes = [
        "Pembayaran dapat dilakukan via transfer ke rekening PT. Kaltim Industrial Estate",
        "Bank Mandiri 1480090676255, BRI: 0565010000007307, BNI: 0084209391",
        "Berikan Bukti Pembayaran ke Petugas KIE untuk ditindak lanjuti surat ijin masuk kawasan KIE"
      ];
      notes.forEach(note => {
        doc.text(note, margin, currentY);
        currentY += lineHeight;
      });
  
      // Signatures Section
      currentY += lineHeight;
      doc.text("Bontang, 30 Juni 2024", pageWidth - margin - 50, currentY);
      currentY += lineHeight;
      doc.text("Diketahui Oleh,", pageWidth - margin - 50, currentY);
      currentY += lineHeight * 2;
      doc.text("Rugun Sitohang", pageWidth - margin - 50, currentY);
      currentY += lineHeight;
      doc.text("Manager Rekons & Kawasan", pageWidth - margin - 50, currentY);
  
      // Save PDF
      doc.save(`IMK_${proc.imk_number}.pdf`);
      toast.success(`PDF untuk Proses IMK ${proc.imk_number} telah diunduh!`);
    },
    [locationMap]
  );

  
  const handleUpdateDataClick = useCallback(
    (vehicle: ProcessIMK) => {
      navigate("/process-form", {
        state: { id: vehicle.id, vehicle, isEdit: true },
      });
    },
    [navigate]
  );

  // New function to handle Sticker Preview
  const handleStickerClick = useCallback(async (proc: ProcessIMK) => {
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
      { x: 10, y: 10 }, // Stiker kiri atas
      { x: 110, y: 10 }, // Stiker kanan atas
      { x: 10, y: 150 }, // Stiker kiri bawah
      { x: 110, y: 150 }, // Stiker kanan bawah
    ];

    // Fungsi untuk menambahkan gambar stiker di posisi yang ditentukan
    const addSticker = (x: number, y: number) => {
      // Tambahkan gambar di posisi x, y dengan ukuran stiker
      doc.addImage(bgSticker, "PNG", x, y, stickerWidth, stickerHeight);
    };

    // Menambahkan empat stiker pada posisi yang telah ditentukan
    positions.forEach(({ x, y }) => {
      addSticker(x, y);
    });

    try {
      // Menghasilkan PDF sebagai blob
      const blob = await doc.output("blob");

      // Membuat URL blob dari blob
      const blobURL = URL.createObjectURL(blob);

      setStickerPreviewURL(blobURL);
      setCurrentStickerProcess(proc);
      setIsStickerPreviewOpen(true);
    } catch (error) {
      console.error("Error generating sticker preview:", error);
      toast.error("Terjadi kesalahan saat membuat pratinjau stiker.");
    }
  }, []);

  // Handle Print from Preview Modal
  const handlePrintPreview = useCallback(() => {
    if (stickerPreviewURL) {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = stickerPreviewURL;
      document.body.appendChild(iframe);
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
      toast.success(
        `Stiker untuk Proses IMK ${currentStickerProcess?.imk_number} telah dicetak!`
      );
      setIsStickerPreviewOpen(false);
      // Hapus URL blob setelah dicetak
      URL.revokeObjectURL(stickerPreviewURL);
      setStickerPreviewURL("");
      setCurrentStickerProcess(undefined);
    }
  }, [stickerPreviewURL, currentStickerProcess]);

  // Handle Add Proses
  const handleAddProses = useCallback(() => {
    navigate("/process-form");
  }, [navigate]);

  // Separate Delete Handler for button
  const onClickDelete = useCallback((proc: ProcessIMK) => {
    setDeleteModal(true);
    setEventData(proc);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredProcesses(
        processes.filter(
          (proc) =>
            proc.imk_number.toLowerCase().includes(search) ||
            proc.document_number.toLowerCase().includes(search) ||
            proc.customer_id.toLowerCase().includes(search) // Added customer search
        )
      );
    },
    [processes]
  );

  // Columns
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "IMK Number",
        accessorKey: "imk_number",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Document Number",
        accessorKey: "document_number",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customer_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Tenant",
        accessorKey: "tenant_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Total Cost",
        accessorKey: "total_cost",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            {cell.getValue()
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(cell.getValue()))
              : "N/A"}
          </div>
        ),
      },
      {
        header: "Registration Date",
        accessorKey: "registration_date",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            {new Date(cell.getValue()).toLocaleDateString("id-ID")}
          </div>
        ),
      },
      {
        header: "Sticker Printed",
        accessorKey: "stickerPrinted",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {cell.getValue() === true ? (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-green-500 border-transparent text-green-50 dark:bg-green-500/20 dark:border-transparent">
                <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1" />
                Printed
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-500 border-transparent text-red-50 dark:bg-red-500/20 dark:border-transparent">
                <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                Not Printed
              </span>
            )}
          </>
        ),
      },
      {
        header: "Status IMK",
        accessorKey: "status_imk",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {cell.getValue() === true ? (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-green-500 border-transparent text-green-50 dark:bg-green-500/20 dark:border-transparent">
                <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-500 border-transparent text-red-50 dark:bg-red-500/20 dark:border-transparent">
                <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                Inactive
              </span>
            )}
          </>
        ),
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onClick={() => handleStickerClick(cell.row.original)}
              aria-label={`Preview stiker untuk proses IMK ${cell.row.original.imk_number}`}
            >
              <Printer className="mr-1 size-4" />
              Preview Sticker
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete proses IMK ${cell.row.original.imk_number}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handleDetailClick(cell.row.original)}
              aria-label={`Detail proses IMK ${cell.row.original.imk_number}`}
            >
              <Info className="mr-1 size-4" />
              Detail Vehicles
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              // aria-label={`Edit tenant for ${cell.row.original.document_number}`}
            >
              <FileEdit className="mr-1 size-4" /> Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handlePersonnelClick(cell.row.original)}
              aria-label={`Detail proses IMK ${cell.row.original.imk_number}`}
            >
              <Info className="mr-1 size-4" />
              Detail Personnels
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => handlePDFClick(cell.row.original)}
              aria-label={`Download PDF untuk proses IMK ${cell.row.original.imk_number}`}
            >
              <Download className="mr-1 size-4" />
              Print Permit
            </button>
          </div>
        ),
      },
    ],
    [
      navigate,
      onClickDelete,
      handleDetailClick,
      handlePDFClick,
      handleStickerClick,
      handleUpdateDataClick
    ]
  );

  // Update filteredProcesses when processes change
  useEffect(() => {
    setFilteredProcesses(processes);
  }, [processes]);

  return (
    <React.Fragment>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />

      {/* Sticker Preview Modal */}
      <Modal
        show={isStickerPreviewOpen}
        onHide={() => {
          setIsStickerPreviewOpen(false);
          setStickerPreviewURL("");
          setCurrentStickerProcess(undefined);
        }}
        id="stickerPreviewModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[80rem] h-screen bg-white shadow rounded-md dark:bg-zinc-600"
      >
        <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zinc-300/20">
          <Modal.Title className="text-lg font-semibold">
            Sticker Preview
          </Modal.Title>
          <button
            onClick={() => {
              setIsStickerPreviewOpen(false);
              setStickerPreviewURL("");
              setCurrentStickerProcess(undefined);
            }}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-zink-300"
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body className="flex-1 p-4 overflow-auto h-full">
          {stickerPreviewURL ? (
            <iframe
              src={stickerPreviewURL}
              title="Sticker Preview"
              className="w-full h-full"
            />
          ) : (
            <div className="text-center text-gray-500">Loading Preview...</div>
          )}
        </Modal.Body>
        <Modal.Footer className="p-4 border-t dark:border-zinc-300/20">
          <button
            onClick={handlePrintPreview}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!stickerPreviewURL}
          >
            Print Sticker
          </button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer closeButton={false} limit={1} />

      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="processTable">
            {/* Header */}
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h6 className="text-[28px]">List Area Entry Permits</h6>
                </div>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAddProses}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">
                      Add Process
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-3">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Search by IMK Number, Document Number, or Customer"
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional Filters Can Be Added Here */}
                </div>
              </form>
            </div>

            {/* Processes Table */}
            <div className="card-body">
              {filteredProcesses && filteredProcesses.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredProcesses || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5 overflow-x-auto"
                  tableclassName="w-full whitespace-nowrap"
                  theadclassName="text-left bg-slate-100 dark:bg-zink-600"
                  thclassName="px-6 py-2.5 font-semibold"
                  tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">
                      Maaf! Tidak Ada Hasil yang Ditemukan
                    </h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      Kami telah mencari melalui semua proses tetapi tidak dapat
                      menemukan catatan yang cocok.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProcessListView;
