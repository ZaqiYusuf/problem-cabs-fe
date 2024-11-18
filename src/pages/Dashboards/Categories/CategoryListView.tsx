// src/components/CategoriesListView.tsx
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

// React Router
import { useNavigate } from "react-router-dom";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface Category {
  id: number;
  nama: string;
  noKtpSim: string;
  lokasiId: string;
  periode: string;
  price: number; // Bidang baru ditambahkan
}

const CategoriesListView = () => {
  // Dummy data state
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      nama: "Dadang",
      noKtpSim: "1234567890",
      lokasiId: "Tj Harapan",
      periode: "6 Bulan",
      price: 1500000, // Harga dalam angka (misalnya, 1.500.000)
    },
    {
      id: 2,
      nama: "Agus",
      noKtpSim: "0987654321",
      lokasiId: "Tursina",
      periode: "Accidental",
      price: 2000000, // Harga dalam angka (misalnya, 2.000.000)
    },
    // Tambahkan lebih banyak kategori sesuai kebutuhan
  ]);

  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Category | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== eventData.id)
      );
      setFilteredCategories((prevFiltered) =>
        prevFiltered.filter((cat) => cat.id !== eventData.id)
      );
      toast.success("Kategori berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((cat: Category) => {
    setEventData({ ...cat });
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
  const onClickDelete = useCallback((cat: Category) => {
    setDeleteModal(true);
    setEventData(cat);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredCategories(
        categories.filter((cat) => cat.nama.toLowerCase().includes(search))
      );
    },
    [categories]
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
        header: "Nama",
        accessorKey: "nama",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "No KTP/SIM",
        accessorKey: "noKtpSim",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Lokasi ID",
        accessorKey: "lokasiId",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Periode",
        accessorKey: "periode",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Price",
        accessorKey: "price",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(cell.getValue())}
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
              aria-label={`Edit category for ${cell.row.original.nama}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete category for ${cell.row.original.nama}`}
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
    nama: string;
    noKtpSim: string;
    lokasiId: string;
    periode: string;
    price: number;
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      nama: isEdit && eventData ? eventData.nama : "",
      noKtpSim: isEdit && eventData ? eventData.noKtpSim : "",
      lokasiId: isEdit && eventData ? eventData.lokasiId : "",
      periode: isEdit && eventData ? eventData.periode : "",
      price: isEdit && eventData ? eventData.price : 0,
    },

    validationSchema: Yup.object({
      nama: Yup.string()
        .min(3, "Nama harus minimal 3 karakter")
        .required("Silakan masukkan nama"),
      noKtpSim: Yup.string()
        .matches(/^\d+$/, "No KTP/SIM harus berupa angka")
        .min(10, "No KTP/SIM harus minimal 10 digit")
        .required("Silakan masukkan No KTP/SIM"),
      lokasiId: Yup.string()
        .min(2, "Lokasi ID harus minimal 2 karakter")
        .required("Silakan masukkan Lokasi ID"),
      periode: Yup.string()
        .min(3, "Periode harus minimal 3 karakter")
        .required("Silakan masukkan periode"),
      price: Yup.number()
        .typeError("Harga harus berupa angka")
        .positive("Harga harus positif")
        .required("Silakan masukkan harga"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update category
        const updatedCategory: Category = {
          ...eventData,
          nama: values.nama,
          noKtpSim: values.noKtpSim,
          lokasiId: values.lokasiId,
          periode: values.periode,
          price: values.price,
        };
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        setFilteredCategories((prevFiltered) =>
          prevFiltered.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        toast.success("Kategori berhasil diperbarui!");
      } else {
        // Add new category
        const newCategory: Category = {
          id: categories.length
            ? Math.max(...categories.map((c) => c.id)) + 1
            : 1,
          nama: values.nama,
          noKtpSim: values.noKtpSim,
          lokasiId: values.lokasiId,
          periode: values.periode,
          price: values.price,
        };
        setCategories((prevCategories) => [...prevCategories, newCategory]);
        setFilteredCategories((prevFiltered) => [...prevFiltered, newCategory]);
        toast.success("Kategori berhasil ditambahkan!");
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
      <BreadCrumb title="Manage Categories" pageTitle="Categories" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="categoriesTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Categories List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle">Add Category</span>
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
                      placeholder="Search by nama..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Categories Table */}
            <div className="card-body">
              {filteredCategories && filteredCategories.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredCategories || []}
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
                      We've searched through all categories but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="categoryModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Category" : "Add Category"}
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
            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Field */}
              <div>
                <label
                  htmlFor="namaInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Nama
                </label>
                <input
                  type="text"
                  id="namaInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Masukkan nama"
                  name="nama"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.nama}
                />
                {validation.touched.nama && validation.errors.nama ? (
                  <p className="text-red-400 text-sm mt-1">{validation.errors.nama}</p>
                ) : null}
              </div>

              {/* No KTP/SIM Field */}
              <div>
                <label
                  htmlFor="noKtpSimInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  No KTP/SIM
                </label>
                <input
                  type="text"
                  id="noKtpSimInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Masukkan No KTP/SIM"
                  name="noKtpSim"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.noKtpSim}
                />
                {validation.touched.noKtpSim && validation.errors.noKtpSim ? (
                  <p className="text-red-400 text-sm mt-1">{validation.errors.noKtpSim}</p>
                ) : null}
              </div>

              {/* Lokasi ID Field */}
              <div>
                <label
                  htmlFor="lokasiIdInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Lokasi ID
                </label>
                <input
                  type="text"
                  id="lokasiIdInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Masukkan Lokasi ID"
                  name="lokasiId"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.lokasiId}
                />
                {validation.touched.lokasiId && validation.errors.lokasiId ? (
                  <p className="text-red-400 text-sm mt-1">{validation.errors.lokasiId}</p>
                ) : null}
              </div>

              {/* Periode Field */}
              <div>
                <label
                  htmlFor="periodeInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Periode
                </label>
                <input
                  type="text"
                  id="periodeInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Masukkan Periode"
                  name="periode"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.periode}
                />
                {validation.touched.periode && validation.errors.periode ? (
                  <p className="text-red-400 text-sm mt-1">{validation.errors.periode}</p>
                ) : null}
              </div>

              {/* Price Field */}
              <div className="md:col-span-2">
                <label
                  htmlFor="priceInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="priceInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Masukkan Harga"
                  name="price"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.price}
                />
                {validation.touched.price && validation.errors.price ? (
                  <p className="text-red-400 text-sm mt-1">{validation.errors.price}</p>
                ) : null}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6">
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
                {isEdit ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default CategoriesListView;
