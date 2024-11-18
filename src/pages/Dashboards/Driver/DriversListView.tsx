import React, { useCallback, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import Sim from "assets/images/sim.png";

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
interface Driver {
  id: number;
  name_driver: string;
  sim: string;
}

const DriversListView = () => {
  // Dummy data state
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 1,
      name_driver: "Agus",
      sim: Sim, // Path to the dummy SIM image
    },
    {
      id: 2,
      name_driver: "Dadang",
      sim: Sim, // Path to the dummy SIM image
    },
    // Add more drivers as needed
  ]);

  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(drivers);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Driver | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver.id !== eventData.id)
      );
      setFilteredDrivers((prevFiltered) =>
        prevFiltered.filter((driver) => driver.id !== eventData.id)
      );
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((driver: Driver) => {
    setEventData({ ...driver });
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
  const onClickDelete = useCallback((driver: Driver) => {
    setDeleteModal(true);
    setEventData(driver);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredDrivers(
        drivers.filter((driver) => driver.name_driver.toLowerCase().includes(search))
      );
    },
    [drivers]
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
        header: "Name",
        accessorKey: "name_driver",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "SIM",
        accessorKey: "sim",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            <img
              src={cell.getValue()}
              alt="Driver's SIM"
              className="w-16 h-10 object-cover rounded"
            />
          </div>
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
              aria-label={`Edit driver for ${cell.row.original.name_driver}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete driver for ${cell.row.original.name_driver}`}
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
    name_driver: string;
    sim: string;
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      name_driver: isEdit && eventData ? eventData.name_driver : "",
      sim: isEdit && eventData ? eventData.sim : "",
    },

    validationSchema: Yup.object({
      name_driver: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Please enter a name"),
      sim: Yup.string().required("Please upload a SIM image"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update driver
        const updatedDriver: Driver = {
          ...eventData,
          name_driver: values.name_driver,
          sim: values.sim || "sim.png", // Default image for SIM if none uploaded
        };
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver.id === updatedDriver.id ? updatedDriver : driver
          )
        );
        setFilteredDrivers((prevFiltered) =>
          prevFiltered.map((driver) =>
            driver.id === updatedDriver.id ? updatedDriver : driver
          )
        );
      } else {
        // Add new driver
        const newDriver: Driver = {
          id: drivers.length
            ? Math.max(...drivers.map((d) => d.id)) + 1
            : 1,
          name_driver: values.name_driver,
          sim: values.sim || "sim.png", // Default image for SIM
        };
        setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
        setFilteredDrivers((prevFiltered) => [...prevFiltered, newDriver]);
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
      <BreadCrumb title="Manage Drivers" pageTitle="Drivers" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="driversTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Drivers List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle">Add Driver</span>
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
                      placeholder="Search by name..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Drivers Table */}
            <div className="card-body">
              {filteredDrivers && filteredDrivers.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredDrivers || []}
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
                      We've searched through all drivers but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="driverModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Driver" : "Add Driver"}
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
            {/* Name Field */}
            <div className="mb-3">
              <label
                htmlFor="nameDriverInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="nameDriverInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter name"
                name="name_driver"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name_driver}
              />
              {validation.touched.name_driver && validation.errors.name_driver ? (
                <p className="text-red-400">{validation.errors.name_driver}</p>
              ) : null}
            </div>

            {/* SIM Field */}
            <div className="mb-3">
              <label
                htmlFor="simInput"
                className="inline-block mb-2 text-base font-medium"
              >
                SIM
              </label>
              <input
                type="text"
                id="simInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter SIM image path or upload a file"
                name="sim"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.sim}
              />
              {validation.touched.sim && validation.errors.sim ? (
                <p className="text-red-400">{validation.errors.sim}</p>
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
                {isEdit ? "Update Driver" : "Add Driver"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default DriversListView;
