import Modal from "Common/Components/Modal";
import React, { useState, useEffect } from "react";
import Select from "react-select";




// Definisi Tipe Props dan Data
interface Personnels {
  id: number;
  name: string;
  identity_number: string,
  location_id: string;
  package_id: number;

}


// Props Type
interface AddPermittedProps {
  formData: any; // Struktur data formData Anda
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AddPermitted: React.FC<AddPermittedProps> = ({ formData, setFormData }) => {
  const [isOpenPersonnelsModal, setIsOpenPersonnelsModal] = useState(false);
  const [isOpenPackageModal, setIsOpenPackageModal] = useState(false);


  useEffect(() => {
    if (formData.personnels.length === 0) {
      setFormData((prevData: any) => ({
        ...prevData,
        personnels: [
          {
            id: 1,
            name: "",
            identity_number: "",
            location_id: "",
            package_id: null,
          },
        ],
      }));
    }
  }, [formData, setFormData]);

  // Fungsi untuk menambahkan personnel
  const addPersonnel = () => {
    const newPersonnel = {
      id: formData.personnels.length + 1,
      name: "",
      identity_number: "",
      location_id: "",
      package_id: null,

    };


    // Update formData dengan personnel baru
    setFormData((prevData: any) => ({
      ...prevData,
      personnels: [...prevData.personnels, newPersonnel],
    }));
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simpan file asli ke dalam formData
      handlePersonnelChange(id, field, file);
    }
  };
  

  // Fungsi Update Data personnel
  const handlePersonnelChange = (id: number, field: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      personnels: prevData.personnels.map((personnel: Personnels) =>
        personnel.id === id ? { ...personnel, [field]: value } : personnel
      ),
    }));
  };

  // Fungsi untuk menghapus personnel
  const removePersonnel = (id: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      personnels: prevData.personnels.filter((item: any) => item.id !== id),
    }));
  };

  // Handler untuk mengupdate data personnel

  // Opsi paket dan lokasi kerja
  const packageOptions = [
    { label: "Non Tenant Light personnel (Non Niaga) Accidental", value: 1 },
    { label: "Non Tenant Light personnel (Niaga) 6 Bulan", value: 2 },
    { label: "Tenant Medium personnel 12 Bulan", value: 3 },
  ];

  const workingLocationOptions = [
    { label: "Tj Harapan", value: "1" },
    { label: "Tursina", value: "2" },
  ];

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Tambah Personnel</h2>
        <button className="mr-5" onClick={addPersonnel}>
          <i className="fi fi-sr-add text-[32px]"></i>
        </button>
      </div>

      {/* Render List personnel */}
      {formData.personnels.length > 0 && formData.personnels.map((personnel: any) => (
          <div
            key={personnel.id}
            className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md shadow-sm bg-white"
          >
            <div className="grid grid-cols-3 gap-4">

              <div className="w-full">
                <label htmlFor={`name-${personnel.id}`} className="block text-gray-700 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  id={`name-${personnel.id}`}
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={personnel.name}
                  onChange={(e) => handlePersonnelChange(personnel.id, "name", e.target.value)}
                />
              </div>

              <div className="w-full">
                <label htmlFor={`origin-${personnel.id}`} className="block text-gray-700 mb-3">
                  identity_number
                </label>
                <input
                  type="text"
                  id={`identity-number-${personnel.id}`}
                  placeholder="IdentityNumber"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={personnel.identity_number}
                  onChange={(e) => handlePersonnelChange(personnel.id, "identity_number", e.target.value)}
                />
              </div>

              {/* Lokasi Kerja */}
              <div className="w-full">
                <label htmlFor={`location_id-${personnel.id}`} className="block text-gray-700 mb-3">
                  Lokasi Kerja
                </label>
                <Select
                  id={`location_id-${personnel.id}`}
                  options={workingLocationOptions}
                  className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                  placeholder="Pilih Lokasi Kerja"
                  onChange={(selectedOption) =>
                    handlePersonnelChange(personnel.id, "location_id", selectedOption?.value)
                  }
                />
              </div>

              <div className="w-full">
                <label htmlFor={`package-${personnel.id}`} className="block text-gray-700 mb-3">
                  Paket
                </label>
                <Select
                  id={`package-${personnel.id}`}
                  options={packageOptions}
                  className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                  placeholder="Pilih Paket"
                  onChange={(selectedOption) =>
                    handlePersonnelChange(personnel.id, "package_id", selectedOption?.value)
                  }
                />
              </div>

            </div>

              {/* Hapus personnel */}
              <div className="flex justify-end mt-4">
                <button onClick={() => removePersonnel(personnel.id)}>
                  <i className="fi fi-ss-trash-xmark text-[32px]"></i>
                </button>
              </div>

            
            {/* personnel & Driver Modal */}
      <Modal
        show={isOpenPersonnelsModal}
        onHide={() => setIsOpenPersonnelsModal(false)}
        id="personnelModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[80rem] bg-white shadow rounded-md dark:bg-zinc-600"
      >
        <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zinc-300/20">
          <Modal.Title className="text-lg font-semibold">
            Add personnel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(100vh_-_180px)] p-4 overflow-y-auto">
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Input Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor={`driver-name-${personnel.id}`} className="block text-gray-700 mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      id={`name-${personnel.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={personnel?.name || ""}
                      onChange={(e) => handlePersonnelChange(personnel.id, "name", e.target.value)}
                    />
                </div>
              </div>

              {/* Right Column: Centered Preview Upload Images */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Preview Upload Image for STNK */}
              {/* Preview Upload Image for STNK */}
              <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                {personnel.stnk instanceof File ? (
                  <img
                    src={URL.createObjectURL(personnel.stnk)} // Buat URL dari file
                    alt={`Preview STNK ${personnel.id}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-center text-gray-700">No STNK Uploaded</span>
                )}
              </div>


              <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                {personnel.sim instanceof File ? (
                  <img
                    src={URL.createObjectURL(personnel.sim)} // Buat URL dari file
                    alt={`Preview SIM ${personnel.id}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-center text-gray-700">No SIM Uploaded</span>
                )}
              </div>



              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-red-500 transition-all duration-200 ease-linear bg-white border border-gray-300 rounded-md hover:text-red-600 focus:outline-none dark:bg-zinc-500 dark:border-zinc-500"
                onClick={() => setIsOpenPersonnelsModal(false)}
              >
                Cancel
              </button>
              <button
              type="button"
                className="px-4 py-2 text-white transition-all duration-200 ease-linear bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={() => setIsOpenPersonnelsModal(false)}
              >
                Save
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Package Selection Modal */}
      <Modal
        show={isOpenPackageModal}
        onHide={() => setIsOpenPackageModal(false)}
        id="packageModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zinc-600"
      >
        <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zinc-300/20">
          <Modal.Title className="text-lg font-semibold">
            Select Package
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(100vh_-_180px)] p-4 overflow-y-auto">
          <div className="space-y-4">
            <button className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none">
              Package 1
            </button>
            <button className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none">
              Package 2
            </button>
            <button className="w-full px-4 py-2 text-left border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none">
              Package 3
            </button>
          </div>
        </Modal.Body>
      </Modal>
      </div>
        ))}
    </React.Fragment>
  );
};

export default AddPermitted;



