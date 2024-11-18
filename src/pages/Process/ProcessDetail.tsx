// src/components/ProcessDetail.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface Permitted {
  id: number;
  name: string;
}

interface ProcessIMK {
  id: number;
  imk_number: string;
  document_number: string;
  customer_id: string;
  location_id: string;
  tenant_id: string;
  total_cost: string | null;
  join_date: string; // ISO date string
  status_imk: boolean;
  permitted: Permitted[];
}

const ProcessDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const process: ProcessIMK = (location.state as { process: ProcessIMK })?.process;

  if (!process) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Proses tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zink-800 p-4">
      <div className="bg-white dark:bg-zink-600 p-6 rounded-md shadow-md w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-zink-200 dark:hover:text-zink-400"
          onClick={() => navigate(-1)}
          aria-label="Close detail view"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Detail Permitted</h2>

        {/* Permitted Data */}
        <div className="mb-4">
          {process.permitted && process.permitted.length > 0 ? (
            <ul className="list-disc list-inside">
              {process.permitted.map((perm) => (
                <li key={perm.id}>{perm.name}</li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada data permitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessDetail;
