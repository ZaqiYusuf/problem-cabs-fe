import Modal from "Common/Components/Modal";
import React, { useState } from "react";
import Select from 'react-select';

const AddPermitted = () => {
  const [isOpenVehicleModal, setIsOpenVehicleModal] = useState(false);
  const [isOpenPackageModal, setIsOpenPackageModal] = useState(false);

  // Dummy data for initial vehicles
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      package_id: 1,
      cargo: "Electronics",
      origin: "Jakarta",
      working_location: "Warehouse A",
      start_date: "2024-01-01",
      vehicles: {
        plate_number: "B 1234 XYZ",
        no_lambung: "L123",
        file_attachment: "",
      },
    },
  ]);

  interface Option {
    readonly label: string;
    readonly value?: string;
    readonly options?: Option[];
    readonly isDisabled?: boolean;
  }

  const packageOptions: Option[] = [
    { label: "Non Tenant Light Vehicle (Non Niaga) Accidental", value: "Non Tenant Light Vehicle (Non Niaga) Accidental" },
    { label: "Non Tenant Light Vehicle (Niaga) 6 Bulan", value: "Non Tenant Light Vehicle (Niaga) 6 Bulan" },
    { label: "Tenant Medium Vehicle 12 Bulan", value: "Tenant Medium Vehicle 12 Bulan" }
  ];

  const workingLocationOptions: Option[] = [
    { label: "Tj Harapan", value: "Tj Harapan" },
    { label: "Tursina", value: "Tursina" }
  ];

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        id: vehicles.length + 1,
        package_id: 1,
        cargo: "",
        origin: "",
        working_location: "",
        start_date: "",
        vehicles: {
          plate_number: "",
          no_lambung: "",
          file_attachment: "",
        },
      },
    ]);
  };

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <React.Fragment>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Add Permitted</h2>
          <button
            className="mr-5"
            onClick={addVehicle}
          >
            <i className="fi fi-sr-add text-[32px]"></i>
          </button>
        </div>
        {vehicles.length > 0 &&
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-md shadow-sm bg-white"
            >
              <div className="grid grid-cols-3 gap-4">
                {/* Select Package */}
                <div className="w-full">
                  <label
                    htmlFor={`package-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Package
                  </label>
                  <Select
                    id={`package-${vehicle.id}`}
                    options={packageOptions}
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                    placeholder="Select Package"
                  />
                </div>

                {/* Cargo Field */}
                <div className="w-full">
                  <label
                    htmlFor={`cargo-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Cargo
                  </label>
                  <input
                    type="text"
                    id={`cargo-${vehicle.id}`}
                    placeholder="Cargo"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={vehicle.cargo}
                  />
                </div>

                {/* Origin Field */}
                <div className="w-full">
                  <label
                    htmlFor={`origin-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Origin
                  </label>
                  <input
                    type="text"
                    id={`origin-${vehicle.id}`}
                    placeholder="Origin"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={vehicle.origin}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Working Location (using Select component) */}
                <div className="w-full">
                  <label
                    htmlFor={`working-location-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Working Location
                  </label>
                  <Select
                    id={`working-location-${vehicle.id}`}
                    options={workingLocationOptions}
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                    placeholder="Select Working Location"
                    onChange={(selectedOption) =>
                      setVehicles((prevVehicles) =>
                        prevVehicles.map((v) =>
                          v.id === vehicle.id
                            ? { ...v, working_location: selectedOption?.value || "" }
                            : v
                        )
                      )
                    }
                  />
                </div>

                {/* Start Date Field */}
                <div className="w-full">
                  <label
                    htmlFor={`start-date-${vehicle.id}`}
                    className="block text-gray-700 mb-3"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id={`start-date-${vehicle.id}`}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={vehicle.start_date}
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

              {/* Remove Vehicle Button */}
              <div className="flex justify-end mt-4">
                <button
                  // className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => removeVehicle(vehicle.id)}
                >
                  <i className="fi fi-ss-trash-xmark text-[32px]"></i>
                </button>
              </div>
            </div>
          ))}

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
                  <label
                    htmlFor="plateNumber"
                    className="block mb-2 text-base font-medium text-gray-700"
                  >
                    Plate Number
                  </label>
                  <input
                    type="text"
                    id="plateNumber"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    placeholder="Enter Plate Number"
                  />
                </div>

                {/* No Lambung Field */}
                <div>
                  <label
                    htmlFor="noLambung"
                    className="block mb-2 text-base font-medium text-gray-700"
                  >
                    No Lambung
                  </label>
                  <input
                    type="text"
                    id="noLambung"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    placeholder="Enter No Lambung"
                  />
                </div>

                {/* STNK File Upload */}
                <div>
                  <label
                    htmlFor="stnkFile"
                    className="block mb-2 text-base font-medium text-gray-700"
                  >
                    STNK - File
                  </label>
                  <input
                    type="file"
                    id="stnkFile"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Divider Line */}
                <hr className="border-gray-300" />

                {/* Driver Name Field */}
                <div>
                  <label
                    htmlFor="driverName"
                    className="block mb-2 text-base font-medium text-gray-700"
                  >
                    Driver Name
                  </label>
                  <input
                    type="text"
                    id="driverName"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    placeholder="Enter Driver Name"
                  />
                </div>

                {/* SIM File Upload */}
                <div>
                  <label
                    htmlFor="simFile"
                    className="block mb-2 text-base font-medium text-gray-700"
                  >
                    SIM - File
                  </label>
                  <input
                    type="file"
                    id="simFile"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Right Column: Centered Preview Upload Images */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Preview Upload Image for STNK */}
                <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                  <span className="text-center text-gray-700">
                    Preview STNK Image
                  </span>
                </div>

                {/* Preview Upload Image for SIM */}
                <div className="flex items-center justify-center border rounded-md h-56 w-3/4 bg-green-100">
                  <span className="text-center text-gray-700">
                    Preview SIM Image
                  </span>
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
              type="submit"
                className="px-4 py-2 text-white transition-all duration-200 ease-linear bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
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
    </React.Fragment>
  );
};

export default AddPermitted;
