

import Modal from "Common/Components/Modal";
import React, { useState, useEffect } from "react";
import Select from "react-select";


import { getLocationAPI, getPackageAPI } from "helpers/backend_helper";




// Definisi Tipe Props dan Data
interface Vehicle {
  id: number;
  package_id: number | null;
  cargo: string;
  origin: string;
  location_id: string;
  start_date: string;
  expired_at: string;
  plate_number: string;
  no_lambung: string;
  stnk: null;
  driver_name: string;
  sim: null;

}


interface Location {
  id: number;
  location: string;
  created_at: string;
  updated_at: string;
}



interface Package {
  id: number,
  item: string,
  periode: string,
  periodeType: string,
  type: string,
  price: number,
  detail: string,
}




// Props Type
interface AddPermittedProps {
  formData: any; // Struktur data formData Anda
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AddPermitted: React.FC<AddPermittedProps> = ({ formData, setFormData }) => {
  const [isOpenVehicleModal, setIsOpenVehicleModal] = useState(false);
  const [isOpenPackageModal, setIsOpenPackageModal] = useState(false);

  const [location, setLocation] = useState<Location[]>([]); 
  const [packages, setPackage] = useState<Package[]>([]); 


  
  const getLocation = async () => {
    try {
      const response: any = await getLocationAPI();
      if (response.success && response.locations) {
        setLocation(response.locations); 
      } else {
        console.error("Gagal mendapatkan data location:", response);
      }
    } catch (error) {
      console.error("Error saat memuat location:", error);
    }
  };

  
  const getPackage = async () => {
    try {
      const response: any = await getPackageAPI();
      if (response.success && response.packages) {
        setPackage(response.packages); 
      } else {
        console.error("Gagal mendapatkan data packages:", response);
      }
    } catch (error) {
      console.error("Error saat memuat packages:", error);
    }
  };

  useEffect(() => {
    getLocation();
    getPackage();
  }, []); // Hanya sekali saat komponen mount
  
  useEffect(() => {
    if (formData.vehicles.length === 0) {
      const updatedVehicles = [
        {
          id: 1,
          package_id: null,
          cargo: "",
          origin: "",
          location_id: "",
          start_date: "",
          expired_at: "",
          plate_number: "",
          no_lambung: "",
          stnk: null,
          driver_name: "",
          sim: null,
        },
      ];
      setFormData((prevData: any) => ({
        ...prevData,
        vehicles: updatedVehicles,
      }));
    }
  }, [formData.vehicles.length, setFormData]);
  

  // Fungsi untuk menambahkan kendaraan
  const addVehicle = () => {
    const newVehicle = {
      id: formData.vehicles.length + 1,
      package_id: null,
      cargo: "",
      origin: "",
      location_id: "",
      start_date: "",
      expired_at: "",
      plate_number: "",
      no_lambung: "",
      stnk: null,
      driver_name: "",
      sim: null

    };


    // Update formData dengan kendaraan baru
    setFormData((prevData: any) => ({
      ...prevData,
      vehicles: [...prevData.vehicles, newVehicle],
    }));
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: number, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simpan file asli ke dalam formData
      handleVehicleChange(id, field, file);
    }
  };
  

  // Fungsi Update Data Kendaraan
  const handleVehicleChange = (id: number, field: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      vehicles: prevData.vehicles.map((vehicle: Vehicle) =>
        vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
      ),
    }));
  };

  // Fungsi untuk menghapus kendaraan
  const removeVehicle = (id: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      vehicles: prevData.vehicles.filter((item: any) => item.id !== id),
    }));
  };

  // Handler untuk mengupdate data kendaraan

  // // Opsi paket dan lokasi kerja
  // const packageOptions = [
  //   { label: "Non Tenant Light Vehicle (Non Niaga) Accidental", value: 1 },
  //   { label: "Non Tenant Light Vehicle (Niaga) 6 Bulan", value: 2 },
  //   { label: "Tenant Medium Vehicle 12 Bulan", value: 3 },
  // ];


  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Tambah Kendaraan</h2>
        <button className="mr-5" onClick={addVehicle}>
          <i className="fi fi-sr-add text-[32px]"></i>
        </button>
      </div>

      {/* Render List Kendaraan */}
      {formData.vehicles.length > 0 && formData.vehicles.map((vehicle: any) => (
          <div
            key={vehicle.id}
            className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md shadow-sm bg-white"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Pilih Paket */}
              <div>
                <label className="block mb-2 text-gray-700">Paket</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleVehicleChange(vehicle.id, "package_id", e.target.value)}
                  value={vehicle.location_id || ""}
                >
                  <option value="">Select Paket</option>
                  {packages.map((t) => (
                    <option key={t.id} value={t.id}>
                      {`${t.item} - ${t.type}  (${t.periode})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cargo */}
              <div className="w-full">
                <label htmlFor={`cargo-${vehicle.id}`} className="block text-gray-700 mb-3">
                  Cargo
                </label>
                <input
                  type="text"
                  id={`cargo-${vehicle.id}`}
                  placeholder="Cargo"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vehicle.cargo}
                  onChange={(e) => handleVehicleChange(vehicle.id, "cargo", e.target.value)}
                />
              </div>

              {/* Origin */}
              <div className="w-full">
                <label htmlFor={`origin-${vehicle.id}`} className="block text-gray-700 mb-3">
                  Origin
                </label>
                <input
                  type="text"
                  id={`origin-${vehicle.id}`}
                  placeholder="Origin"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vehicle.origin}
                  onChange={(e) => handleVehicleChange(vehicle.id, "origin", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Lokasi Kerja */}
              <div>
                <label className="block mb-2 text-gray-700">Lokasi Kerja</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleVehicleChange(vehicle.id, "location_id", e.target.value)}
                  value={vehicle.location_id || ""}
                >
                  <option value="">Select Location</option>
                  {location.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label htmlFor={`start-date-${vehicle.id}`} className="block text-gray-700 mb-3">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  id={`start-date-${vehicle.id}`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vehicle.start_date}
                  onChange={(e) => handleVehicleChange(vehicle.id, "start_date", e.target.value)}
                />
              </div>
              <div className="w-full">
                <label htmlFor={`expired-at-${vehicle.id}`} className="block text-gray-700 mb-3">
                  Tanggal Berakhir
                </label>
                <input
                  type="date"
                  id={`expired-at-${vehicle.id}`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={vehicle.expired_at}
                  onChange={(e) => handleVehicleChange(vehicle.id, "expired_at", e.target.value)}
                />
              </div>
                {/* Vehicle & Driver Modal Trigger */}
                <div className="w-full">
                  <label
                    htmlFor={`vehicle-driver-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Vehicle & Driver
                  </label>
                  <span
                    onClick={() => setIsOpenVehicleModal(true)}
                    className="block w-full px-4 py-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    Select Vehicle
                  </span>
                </div>
              </div>

              {/* Hapus Kendaraan */}
              <div className="flex justify-end mt-4">
                <button onClick={() => removeVehicle(vehicle.id)}>
                  <i className="fi fi-ss-trash-xmark text-[32px]"></i>
                </button>
              </div>

            
            {/* Vehicle & Driver Modal */}
      <Modal
        show={isOpenVehicleModal}
        onHide={() => setIsOpenVehicleModal(false)}
        id="vehicleModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[80rem] bg-white shadow rounded-md dark:bg-zinc-600"
      >
        <Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zinc-300/20">
          <Modal.Title className="text-lg font-semibold">
            Add Vehicle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(100vh_-_180px)] p-4 overflow-y-auto">
          <form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Input Fields */}
              <div className="space-y-4">
                {/* Plate Number Field */}
                <div>
                <label htmlFor={`plate-number-${vehicle.id}`} className="block text-gray-700 mb-3">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    id={`plate-number-${vehicle.id}`}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={vehicle?.plate_number || ""}
                    onChange={(e) => handleVehicleChange(vehicle.id, "plate_number", e.target.value)}
                  />
                </div>


                {/* No Lambung Field */}
                <div>
                  <label htmlFor={`no-lambung-${vehicle.id}`} className="block text-gray-700 mb-3">
                      No. Lambung
                    </label>
                    <input
                      type="text"
                      id={`no-lambung-${vehicle.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={vehicle?.no_lambung || ""}
                      onChange={(e) => handleVehicleChange(vehicle.id, "no_lambung", e.target.value)}
                    />
                </div>

                {/* STNK File Upload */}
                <div>
                  <label htmlFor={`stnk-${vehicle.id}`} className="block text-gray-700 mb-3">
                      STNK - File
                  </label>
                  <input
                      type="file"
                      id={`stnk-${vehicle.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      // value={vehicle?.stnk || ""}
                      onChange={(event) => handleFileChange(event, vehicle.id, "stnk")}
                  />
                </div>

                {/* Divider Line */}
                <hr className="border-gray-300" />

                {/* Driver Name Field */}
                <div>
                  <label htmlFor={`driver-name-${vehicle.id}`} className="block text-gray-700 mb-3">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      id={`driver-name-${vehicle.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={vehicle?.driver_name || ""}
                      onChange={(e) => handleVehicleChange(vehicle.id, "driver_name", e.target.value)}
                    />
                </div>

                {/* SIM File Upload */}
                <div>
                  <label htmlFor={`sim-${vehicle.id}`} className="block text-gray-700 mb-3">
                      SIM - File
                  </label>
                  <input
                      type="file"
                      id={`sim-${vehicle.id}`}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      // value={vehicle?.stnk || ""}
                      onChange={(event) => handleFileChange(event, vehicle.id, "sim")}
                  />
                </div>
              </div>

              {/* Right Column: Centered Preview Upload Images */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Preview Upload Image for STNK */}
              {/* Preview Upload Image for STNK */}
              <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                {vehicle.stnk instanceof File ? (
                  <img
                    src={URL.createObjectURL(vehicle.stnk)} // Buat URL dari file
                    alt={`Preview STNK ${vehicle.id}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-center text-gray-700">No STNK Uploaded</span>
                )}
              </div>


              <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                {vehicle.sim instanceof File ? (
                  <img
                    src={URL.createObjectURL(vehicle.sim)} // Buat URL dari file
                    alt={`Preview SIM ${vehicle.id}`}
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
                onClick={() => setIsOpenVehicleModal(false)}
              >
                Cancel
              </button>
              <button
              type="button"
                className="px-4 py-2 text-white transition-all duration-200 ease-linear bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={() => setIsOpenVehicleModal(false)}
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
