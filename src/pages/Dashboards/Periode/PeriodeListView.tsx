import React, { useCallback, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";

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
interface Periode {
  id: number;
  duration: string;
  tipe: 'Bulan' | 'Tahun' | 'Accidental';
  category_id: string;
  cost: string;
}

const PeriodesListView = () => {
  // Dummy data state
  const [periodes, setPeriodes] = useState<Periode[]>([
    {
      id: 1,
      duration: "none",
      tipe: "Accidental",
      category_id: "Non tenant Medium Vehicle (Non Niaga)",
      cost: "5000",
    },
    {
      id: 2,
      duration: "6",
      tipe: "Bulan",
      category_id: "Tenant light vehicle",
      cost: "120000",
    },
    // Add more periodes as needed
  ]);

  const [filteredPeriodes, setFilteredPeriodes] = useState<Periode[]>(periodes);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Periode | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setPeriodes((prevPeriodes) =>
        prevPeriodes.filter((periode) => periode.id !== eventData.id)
      );
      setFilteredPeriodes((prevFiltered) =>
        prevFiltered.filter((periode) => periode.id !== eventData.id)
      );
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((periode: Periode) => {
    setEventData({ ...periode });
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
  const onClickDelete = useCallback((periode: Periode) => {
    setDeleteModal(true);
    setEventData(periode);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPeriodes(
        periodes.filter((periode) =>
          periode.category_id.toLowerCase().includes(search)
        )
      );
    },
    [periodes]
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
        header: "Duration",
        accessorKey: "duration",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Tipe",
        accessorKey: "tipe",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
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
        header: "Cost",
        accessorKey: "cost",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(Number(cell.getValue()))}
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
              aria-label={`Edit periode for ${cell.row.original.category_id}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete periode for ${cell.row.original.category_id}`}
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
    duration: string | "";
    tipe: 'Bulan' | 'Tahun' | 'Accidental';
    category_id: string;
    cost: string;
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      duration: isEdit && eventData ? eventData.duration : "",
      tipe: isEdit && eventData ? eventData.tipe : "Bulan",
      category_id: isEdit && eventData ? eventData.category_id : "",
      cost: isEdit && eventData ? eventData.cost : "",
    },

    validationSchema: Yup.object({
      duration: Yup.number()
        .typeError("Duration must be a number")
        .positive("Duration must be positive")
        .required("Please enter an duration"),
      tipe: Yup.string()
        .oneOf(['Bulan', 'Tahun', 'Accidental'], "Invalid tipe")
        .required("Please select a tipe"),
      category_id: Yup.string()
        .min(1, "Category ID must be at least 1 character")
        .required("Please enter a category ID"),
      cost: Yup.string()
        .min(1, "Cost must be at least 1 character")
        .required("Please enter a cost"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update periode
        const updatedPeriode: Periode = {
          ...eventData,
          duration: values.duration,
          tipe: values.tipe,
          category_id: values.category_id,
          cost: values.cost,
        };
        setPeriodes((prevPeriodes) =>
          prevPeriodes.map((periode) =>
            periode.id === updatedPeriode.id ? updatedPeriode : periode
          )
        );
        setFilteredPeriodes((prevFiltered) =>
          prevFiltered.map((periode) =>
            periode.id === updatedPeriode.id ? updatedPeriode : periode
          )
        );
      } else {
        // Add new periode
        const newPeriode: Periode = {
          id: periodes.length
            ? Math.max(...periodes.map((p) => p.id)) + 1
            : 1,
          duration: values.duration,
          tipe: values.tipe,
          category_id: values.category_id,
          cost: values.cost,
        };
        setPeriodes((prevPeriodes) => [...prevPeriodes, newPeriode]);
        setFilteredPeriodes((prevFiltered) => [...prevFiltered, newPeriode]);
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
      <BreadCrumb title="Manage Periodes" pageTitle="Periodes" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="periodesTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Periodes List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle">Add Periode</span>
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
                      placeholder="Search by category ID..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Periodes Table */}
            <div className="card-body">
              {filteredPeriodes && filteredPeriodes.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPeriodes || []}
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
                      We've searched through all periodes but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Periode Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="periodeModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Periode" : "Add Periode"}
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
            {/* duration Field */}
            <div className="mb-3">
              <label
                htmlFor="durationInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Duration
              </label>
              <input
                type="string"
                id="durationInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter duration"
                name="duration"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.duration}
              />
              {validation.touched.duration && validation.errors.duration ? (
                <p className="text-red-400">{validation.errors.duration}</p>
              ) : null}
            </div>

            {/* Tipe Field */}
            <div className="mb-3">
              <label
                htmlFor="tipeInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Tipe
              </label>
              <select
                id="tipeInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                name="tipe"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.tipe}
              >
                <option value="Bulan">Bulan</option>
                <option value="Tahun">Tahun</option>
                <option value="Accidental">Accidental</option>
              </select>
              {validation.touched.tipe && validation.errors.tipe ? (
                <p className="text-red-400">{validation.errors.tipe}</p>
              ) : null}
            </div>

            {/* Category ID Field */}
            <div className="mb-3">
              <label
                htmlFor="categoryIDInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Category ID
              </label>
              <input
                type="text"
                id="categoryIDInput"
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

            {/* Cost Field */}
            <div className="mb-3">
              <label
                htmlFor="costInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Cost
              </label>
              <input
                type="text"
                id="costInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter cost"
                name="cost"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.cost}
              />
              {validation.touched.cost && validation.errors.cost ? (
                <p className="text-red-400">{validation.errors.cost}</p>
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
                {isEdit ? "Update Periode" : "Add Periode"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default PeriodesListView;
