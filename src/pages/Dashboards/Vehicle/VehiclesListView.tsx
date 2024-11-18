import React, { useCallback, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import StnkImage from "assets/images/stnk.png"; // Assuming STNK image is similar to SIM in the driver view

// Icons
import { Search, Trash2, Plus, FileEdit } from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface Vehicle {
  id: number;
  plate_number: string;
  no_lambung: string;
  number_stiker: number;
  stnk: string;
  category_id: number;
}

const VehiclesListView = () => {
  // Dummy data state
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      plate_number: "B 1234 XYZ",
      no_lambung: "L01",
      number_stiker: 101,
      stnk: StnkImage, // Path to the dummy STNK image
      category_id: 1,
    },
    {
      id: 2,
      plate_number: "D 5678 ABC",
      no_lambung: "L02",
      number_stiker: 102,
      stnk: StnkImage, // Path to the dummy STNK image
      category_id: 2,
    },
    // Add more vehicles as needed
  ]);

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Vehicle | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle.id !== eventData.id)
      );
      setFilteredVehicles((prevFiltered) =>
        prevFiltered.filter((vehicle) => vehicle.id !== eventData.id)
      );
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((vehicle: Vehicle) => {
    setEventData({ ...vehicle });
    setIsEdit(true);
    setShow(true);
  }, []);

  // Handle Add
  const handleAdd = useCallback(() => {
    setEventData(undefined);
    setIsEdit(false);
    setShow(true);
  }, []);

  // Separate Delete Handler for button
  const onClickDelete = useCallback((vehicle: Vehicle) => {
    setDeleteModal(true);
    setEventData(vehicle);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredVehicles(
        vehicles.filter((vehicle) =>
          vehicle.plate_number.toLowerCase().includes(search)
        )
      );
    },
    [vehicles]
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
        header: "Plate Number",
        accessorKey: "plate_number",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "No Lambung",
        accessorKey: "no_lambung",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Sticker Number",
        accessorKey: "number_stiker",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "STNK",
        accessorKey: "stnk",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            <img
              src={cell.getValue()}
              alt="Vehicle's STNK"
              className="w-16 h-10 object-cover rounded"
            />
          </div>
        ),
      },
      {
        header: "Category ID",
        accessorKey: "category_id",
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
              className="flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit vehicle for ${cell.row.original.plate_number}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete vehicle for ${cell.row.original.plate_number}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete]
  );

  // Formik Validation
  interface FormValues {
    plate_number: string;
    no_lambung: string;
    number_stiker: number;
    stnk: string;
    category_id: number;
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      plate_number: isEdit && eventData ? eventData.plate_number : "",
      no_lambung: isEdit && eventData ? eventData.no_lambung : "",
      number_stiker: isEdit && eventData ? eventData.number_stiker : 0,
      stnk: isEdit && eventData ? eventData.stnk : "",
      category_id: isEdit && eventData ? eventData.category_id : 1,
    },

    validationSchema: Yup.object({
      plate_number: Yup.string()
        .min(5, "Plate number must be at least 5 characters")
        .required("Please enter a plate number"),
      no_lambung: Yup.string()
        .min(2, "No lambung must be at least 2 characters")
        .required("Please enter a no lambung"),
      number_stiker: Yup.number()
        .min(1, "Sticker number must be a positive number")
        .required("Please enter a sticker number"),
      stnk: Yup.string().required("Please upload a STNK image"),
      category_id: Yup.number().required("Please select a category ID"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update vehicle
        const updatedVehicle: Vehicle = {
          ...eventData,
          plate_number: values.plate_number,
          no_lambung: values.no_lambung,
          number_stiker: values.number_stiker,
          stnk: values.stnk || "stnk.png", // Default image for STNK if none uploaded
          category_id: values.category_id,
        };
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
          )
        );
        setFilteredVehicles((prevFiltered) =>
          prevFiltered.map((vehicle) =>
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
          )
        );
      } else {
        // Add new vehicle
        const newVehicle: Vehicle = {
          id: vehicles.length
            ? Math.max(...vehicles.map((v) => v.id)) + 1
            : 1,
          plate_number: values.plate_number,
          no_lambung: values.no_lambung,
          number_stiker: values.number_stiker,
          stnk: values.stnk || "stnk.png", // Default image for STNK
          category_id: values.category_id,
        };
        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
        setFilteredVehicles((prevFiltered) => [...prevFiltered, newVehicle]);
      }
      toggle();
    },
  });

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

  return (
    <React.Fragment>
      <BreadCrumb title="Manage Vehicles" pageTitle="Vehicles" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="vehiclesTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Vehicles List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle">Add Vehicle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-6">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Search by plate number..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Vehicles Table */}
            <div className="card-body">
              {filteredVehicles && filteredVehicles.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredVehicles || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5 overflow-x-auto"
                  tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap"
                  theadclassName="text-left bg-slate-100 dark:bg-zink-600"
                  thclassName="px-3.5 py-2.5 font-semibold"
                  tdclassName="px-3.5 py-2.5"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched through all vehicles but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="vehicleModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <form
            action="#!"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            {/* Plate Number Field */}
            <div className="mb-3">
              <label
                htmlFor="plateNumberInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Plate Number
              </label>
              <input
                type="text"
                id="plateNumberInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter plate number"
                name="plate_number"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.plate_number}
              />
              {validation.touched.plate_number && validation.errors.plate_number ? (
                <p className="text-red-400">{validation.errors.plate_number}</p>
              ) : null}
            </div>

            {/* No Lambung Field */}
            <div className="mb-3">
              <label
                htmlFor="noLambungInput"
                className="inline-block mb-2 text-base font-medium"
              >
                No Lambung
              </label>
              <input
                type="text"
                id="noLambungInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter no lambung"
                name="no_lambung"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.no_lambung}
              />
              {validation.touched.no_lambung && validation.errors.no_lambung ? (
                <p className="text-red-400">{validation.errors.no_lambung}</p>
              ) : null}
            </div>

            {/* Sticker Number Field */}
            <div className="mb-3">
              <label
                htmlFor="stickerNumberInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Sticker Number
              </label>
              <input
                type="number"
                id="stickerNumberInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter sticker number"
                name="number_stiker"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.number_stiker}
              />
              {validation.touched.number_stiker && validation.errors.number_stiker ? (
                <p className="text-red-400">{validation.errors.number_stiker}</p>
              ) : null}
            </div>

            {/* STNK Field */}
            <div className="mb-3">
              <label
                htmlFor="stnkInput"
                className="inline-block mb-2 text-base font-medium"
              >
                STNK
              </label>
              <input
                type="text"
                id="stnkInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter STNK image path or upload a file"
                name="stnk"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.stnk}
              />
              {validation.touched.stnk && validation.errors.stnk ? (
                <p className="text-red-400">{validation.errors.stnk}</p>
              ) : null}
            </div>

            {/* Category ID Field */}
            <div className="mb-3">
              <label
                htmlFor="categoryIdInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Category ID
              </label>
              <input
                type="number"
                id="categoryIdInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter category ID"
                name="category_id"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.category_id}
              />
              {validation.touched.category_id && validation.errors.category_id ? (
                <p className="text-red-400">{validation.errors.category_id}</p>
              ) : null}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="text-red-500 transition-all duration-200 ease-linear bg-white border border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
              >
                {isEdit ? "Update Vehicle" : "Add Vehicle"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default VehiclesListView;
