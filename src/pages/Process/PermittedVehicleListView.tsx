import React, { useCallback, useMemo, useState, useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from "react-select";
import TableContainer from "Common/TableContainer";
import {
  Search,
  Trash2,
  Plus,
  FileEdit,
  ArrowLeft,
  Printer,
} from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { getEntryPermits, updateEntryPermits } from "helpers/backend_helper";




// TypeScript interfaces
interface PermittedVehicle {
  id: number;
  id_imk: string;
  periode_id: string;
  vehicle_id: string;
  driver_id: string;
  cargo: string;
  origin: string;
  sticker_number: string; // New field for Sticker Number
  location: string; // New field for Location
  start_date: string | null;
  expired_at: string | null;
}


interface Option {
  readonly label: string;
  readonly value?: string;
  readonly options?: Option[];
  readonly isDisabled?: boolean;
}

const locationOptions: Option[] = [
  { label: "Jakarta", value: "Jakarta" },
  { label: "Bandung", value: "Bandung" },
  { label: "Surabaya", value: "Surabaya" },
  { label: "Medan", value: "Medan" },
  { label: "Bali", value: "Bali" },
];




const PermittedVehicleListView = () => {
  const navigate = useNavigate();
  const [permittedVehicles, setPermittedVehicles] = useState<PermittedVehicle[]>([]);



  const packageOptions: Option[] = [
    {
      label: "Non Tenant Light Vehicle (Non Niaga) Accidental",
      value: "Non Tenant Light Vehicle (Non Niaga) Accidental",
    },
    {
      label: "Non Tenant Light Vehicle (Niaga) 6 Bulan",
      value: "Non Tenant Light Vehicle (Niaga) 6 Bulan",
    },
    {
      label: "Tenant Medium Vehicle 12 Bulan",
      value: "Tenant Medium Vehicle 12 Bulan",
    },
  ];

  const [filteredPermittedVehicles, setFilteredPermittedVehicles] = useState<PermittedVehicle[]>(permittedVehicles);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<PermittedVehicle | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  const handleDelete = useCallback(() => {
    if (eventData) {
      setPermittedVehicles((prevVehicles) => prevVehicles.filter((veh ) => veh.id !== eventData.id));
      setFilteredPermittedVehicles((prevFiltered) => prevFiltered.filter((veh) => veh.id !== eventData.id));
      toast.success("Permitted Vehicle berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);



  const getCustomer = async () => {
    try {
      const response: any = await getEntryPermits();
      console.log("Respons dari API:", response);

      if (Array.isArray(response.process_imks)) {
        const mappedVehicles = response.process_imks.flatMap((process: any) =>
          (process.vehicles || []).map((vehicle: any) => ({
            id: vehicle.id,
            id_imk: process.imk_number,
            periode_id: vehicle.package?.periode || "Unknown",
            vehicle_id: vehicle.plate_number || "Unknown",
            driver_id: vehicle.driver_name || "Unknown",
            cargo: vehicle.cargo || "Unknown",
            origin: vehicle.origin || "Unknown",
            plate_number: vehicle.plate_number || "Unknown", // Tambahkan field ini
            sticker_number: vehicle.number_stiker || "Unknown",
            location: vehicle.location?.location || "Unknown",
            start_date: vehicle.start_date || null,
            expired_at: vehicle.expired_at || null,
          }))
        );
        

        console.log("Data yang sudah dipetakan:", mappedVehicles);
        setPermittedVehicles(mappedVehicles);
        setFilteredPermittedVehicles(mappedVehicles);
      } else {
        console.error("process_imks bukan array:", response.process_imks);
        setPermittedVehicles([]);
        setFilteredPermittedVehicles([]);
      }
    } catch (error) {
      console.error("Error saat memuat data:", error);
      setPermittedVehicles([]);
      setFilteredPermittedVehicles([]);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);




  const validation = useFormik({
    initialValues: {
      id_imk: eventData?.id_imk || "",
      periode_id: eventData?.periode_id || "",
      vehicle_id: eventData?.vehicle_id || "",
      driver_id: eventData?.driver_id || "",
      cargo: eventData?.cargo || "",
      origin: eventData?.origin || "",
      sticker_number: eventData?.sticker_number || "",
      location: eventData?.location || "", // New field for location
      start_date: eventData?.start_date || "",
      expired_at: eventData?.expired_at || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      id_imk: Yup.string().required("Required"),
      periode_id: Yup.string().required("Required"),
      vehicle_id: Yup.string().required("Required"),
      driver_id: Yup.string().required("Required"),
      cargo: Yup.string().required("Required"),
      origin: Yup.string().required("Required"),
      sticker_number: Yup.string().required("Required"),
      location: Yup.string().required("Required"), // Validation for location
      start_date: Yup.string().nullable(),
      expired_at: Yup.string().nullable(),
    }),
    onSubmit: async(values) => {
      if (isEdit && eventData) {
        setPermittedVehicles((prevVehicles) =>
          prevVehicles.map((veh) => (veh.id === eventData.id ? { ...veh, ...values } : veh))
        );

        await updateEntryPermits(eventData);
        toast.success("Permitted Vehicle updated successfully!");
      } else {
        const newVehicle = { id: Date.now(), ...values } as PermittedVehicle;
        setPermittedVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
        toast.success("Permitted Vehicle added successfully!");
      }
      setShow(false);
      setEventData(undefined);
    },
  });

  const handleUpdateDataClick = useCallback((veh: PermittedVehicle) => {
    setEventData({ ...veh });
    setIsEdit(true);
    setShow(true);
  }, []);

  const handlePrintSticker = useCallback((veh: PermittedVehicle) => {
    toast.info(`Printing sticker for vehicle ID ${veh.vehicle_id}`);
    // Add actual printing logic here
  }, []);

  const handleAdd = useCallback(() => {
    setEventData(undefined);
    setIsEdit(false);
    setShow(true);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onClickDelete = useCallback((veh: PermittedVehicle) => {
    setDeleteModal(true);
    setEventData(veh);
  }, []);

  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPermittedVehicles(
        permittedVehicles.filter(
          (veh) =>
            veh.cargo.toLowerCase().includes(search) ||
            veh.origin.toLowerCase().includes(search)
        )
      );
    },
    [permittedVehicles]
  );

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData(undefined);
      setIsEdit(false);
      validation.resetForm();
    } else {
      setShow(true);
      setEventData(undefined);
      validation.resetForm();
    }
  }, [show, validation]);

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
        header: "ID IMK",
        accessorKey: "id_imk",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Package",
        accessorKey: "periode_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Sticker Number",
        accessorKey: "sticker_number",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3. 5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Vehicle",
        accessorKey: "vehicle_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Driver",
        accessorKey: "driver_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Cargo",
        accessorKey: "cargo",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Origin",
        accessorKey: "origin",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Location", // New column for Location
        accessorKey: "location",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit permitted vehicle with ID ${cell.row.original.id}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete permitted vehicle with ID ${cell.row.original.id}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => handlePrintSticker(cell.row.original)}
              aria-label={`Print sticker for vehicle with ID ${cell.row.original.vehicle_id}`}
            >
              <Printer className="mr-1 size-4" />
              Print Sticker
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, handlePrintSticker]
  );

  return (
    <React.Fragment>
      <BreadCrumb
        title="Manage Permitted Vehicles"
        pageTitle="Permitted Vehicles"
      />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="permittedVehiclesTable">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={handleBack}
                    aria-label="Back to previous page"
                  >
                    <ArrowLeft className="mr-1 size-4" />
                    Back
                  </button>
                  <h6 className="text-[28px]">Permitted Vehicles List</h6>
                </div>
                <button
                  type="button"
                  className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom- 600"
                  onClick={handleAdd}
                >
                  <Plus className="inline-block size-4 mr-1" />
                  <span className="align-middle text-[16px]">
                    Add Permitted
                  </span>
                </button>
              </div>
            </div>

            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-3">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                      placeholder="Search by cargo or origin..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                </div>
              </form>
            </div>

            <div className="card-body">
              {filteredPermittedVehicles && filteredPermittedVehicles.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPermittedVehicles || []}
                  customPageSize={10}
                  divclassName="-mx-5 overflow-x-auto"
                  tableclassName="w-full whitespace-nowrap"
                  theadclassName="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600"
                  thclassName="px-6 py-2.5 first:pl-8 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500 w-10"
                  tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
                  PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="text-slate-500">
                      We've searched through all permitted vehicles but couldn't
                      find any matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={toggle}
        id="tenantModal"
        modal-center="true"
        className="fixed inset-0 z-drawer flex items-center justify-center"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header className="p-4 border-b flex items-center justify-between">
          <Modal.Title>{isEdit ? "Edit Vehicles" : "Add Vehicles"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="idImkInput" className="block mb-3 font-medium">
                  ID IMK
                </label>
                <input
                  type="text"
                  id="idImkInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter ID IMK"
                  {...validation.getFieldProps("id_imk")}
                  aria-label="ID IMK input"
                />
                {validation.touched.id_imk && validation.errors.id_imk && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.id_imk}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="periodeIdInput"
                  className="block mb-3 font-medium"
                >
                  Package
                </label>
                <Select id="periodeIdInput"
                  options={packageOptions}
                  className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                  placeholder="Select Package"
                  {...validation.getFieldProps("periode_id")}
                  onChange={(option) => validation.setFieldValue("periode_id", option?.value)}
                  aria-label="Package select"
                />
                {validation.touched.periode_id && validation.errors.periode_id && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.periode_id}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stickerNumberInput"
                  className="block mb-3 font-medium"
                >
                  Sticker Number
                </label>
                <input
                  type="text"
                  id="stickerNumberInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter sticker number"
                  {...validation.getFieldProps("sticker_number")}
                  aria-label="Sticker number input"
                />
                {validation.touched.sticker_number && validation.errors.sticker_number && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.sticker_number}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vehicleIdInput"
                  className="block mb-3 font-medium"
                >
                  Vehicle
                </label>
                <input
                  type="text"
                  id="vehicleIdInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter vehicle ID"
                  {...validation.getFieldProps("vehicle_id")}
                  aria-label="Vehicle input"
                />
                {validation.touched.vehicle_id && validation.errors.vehicle_id && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.vehicle_id}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="driverIdInput"
                  className="block mb-3 font-medium"
                >
                  Driver
                </label>
                <input
                  type="text"
                  id="driverIdInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter driver name"
                  {...validation.getFieldProps("driver_id")}
                  aria-label="Driver input"
                />
                {validation.touched.driver_id && validation.errors.driver_id && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.driver_id}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cargoInput" className="block mb-3 font-medium">
                  Cargo
                </label>
                <input
                  type="text"
                  id="cargoInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter cargo"
                  {...validation.getFieldProps("cargo")}
                  aria-label="Cargo input"
                />
                {validation.touched.cargo && validation.errors.cargo && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.cargo}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="originInput" className="block mb-3 font-medium">
                  Origin
                </label>
                <input
                  type="text"
                  id="originInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter origin"
                  {...validation.getFieldProps("origin")}
                  aria-label="Origin input"
                />
                {validation.touched.origin && validation.errors.origin && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.origin}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="locationInput" className="block mb-3 font-medium">
                  Location
                </label>
                <Select
                  id="locationInput"
                  options={locationOptions}
                  className=" border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                  placeholder="Select Location"
                  {...validation.getFieldProps("location")}
                  onChange={(option) => validation.setFieldValue("location", option?.value)}
                  aria-label="Location select"
                />
                {validation.touched.location && validation.errors.location && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="text-white bg-red-500 border border-red-500 rounded-md px-4 py-2 hover:bg-red-300 shadow-sm"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-custom-500 rounded-md px-4 py-2 hover:bg-custom-600 shadow-sm"
              >
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default PermittedVehicleListView;