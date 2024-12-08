// src/components/PackagesListView.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";

// Icons
import { Search, Trash2, Plus, FileEdit } from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletePackageAPI, getPackageAPI, postPackageAPI, updatePackageAPI } from "helpers/backend_helper";

// TypeScript interfaces
interface Package {
  id: number;
  item: string;
  periode: string;
  price: number;
  type: "Vehicle" | "Personnel";
  periodeType: "Months" | "Accidental";
  detail: string;
}

const PackagesListView = () => {
  // Dummy data state
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(packages);

  const getPackages = async () => {
    await getPackageAPI().then((response: any) => {
      // console.log(response);
      setPackages(response.packages);
      setFilteredPackages(response.packages);
    });
  };

  const postPackages = async (data: any) => {
    await postPackageAPI(data).then(() => {
      getPackages();
    });
  };

  const deletePackages = async (data:any) => {
    await deletePackageAPI(data.id).then(() => {
      getPackages();
    })
  }

  useEffect(() => {
    getPackages();
  },[]);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Package | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== eventData.id)
      );
      setFilteredPackages((prevFiltered) =>
        prevFiltered.filter((pkg) => pkg.id !== eventData.id)
      );
      deletePackages(eventData);
      toast.success("Package berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((pkg: Package) => {
    setEventData({ ...pkg });
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
  const onClickDelete = useCallback((pkg: Package) => {
    setDeleteModal(true);
    setEventData(pkg);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPackages(
        packages.filter(
          (pkg) =>
            pkg.item.toLowerCase().includes(search) ||
            pkg.periode.toLowerCase().includes(search) ||
            pkg.type.toLowerCase().includes(search) || // Include type in search
            pkg.detail.toLowerCase().includes(search) // Include detail in search
        )
      );
    },
    [packages]
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
        header: "Item",
        accessorKey: "item",
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
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Detail",
        accessorKey: "detail",
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
            Rp {cell.getValue().toLocaleString()}
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
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit package for ${cell.row.original.item}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete package for ${cell.row.original.item}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, packages]
  );

  // Formik Validation
  // interface FormValues {
  //   item: string;
  //   periode: string;
  //   periodeType: "Months" | "Accidental";
  //   price: number | "";
  //   type: "Vehicle" | "Personnel";
  //   detail: string;
  // }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      item: isEdit && eventData ? eventData.item : "",
      periode: isEdit && eventData ? eventData.periode : "",
      periodeType: isEdit && eventData ? eventData.periodeType : "Months",
      price: isEdit && eventData ? eventData.price : "",
      type: isEdit && eventData ? eventData.type : "Vehicle",
      detail: isEdit && eventData ? eventData.detail : "",
    },

    validationSchema: Yup.object({
      item: Yup.string()
        .min(3, "Item ID harus minimal 3 karakter")
        .required("Silakan masukkan Item ID"),
      periode: Yup.string()
        .min(1, "Periode harus minimal 1 karakter")
        .required("Silakan masukkan Periode"),
      periodeType: Yup.string()
        .oneOf(["Months", "Accidental"], "Invalid Periode Type") // Validation for periodeType
        .required("Silakan pilih Periode Type"),
      price: Yup.number()   
        .typeError("Harga harus berupa angka")
        .positive("Harga harus lebih besar dari 0")
        .required("Silakan masukkan Harga"),
      type: Yup.string()
        .oneOf(["Vehicle", "Personnel"], "Invalid Type")
        .required("Silakan pilih Type"),
      detail: Yup.string()
        .min(5, "Detail harus minimal 5 karakter")
        .required("Silakan masukkan Detail"),
    }),

    onSubmit: async(values) => {
      if (isEdit && eventData) {
        const updatedPackage: Package = {
          ...eventData,
          item: values.item,
          periode: values.periode,
          price: Number(values.price),
          type: values.type,
          detail: values.detail,
        };
        updatedPackage.periode = `${updatedPackage.periode} ${updatedPackage.periodeType}`;
        setPackages((prevPackages) =>
          prevPackages.map((pkg) =>
            pkg.id === updatedPackage.id ? updatedPackage : pkg
          )
        );
        setFilteredPackages((prevFiltered) =>
          prevFiltered.map((pkg) =>
            pkg.id === updatedPackage.id ? updatedPackage : pkg
          )
        );
        toggle();
        await updatePackageAPI(updatedPackage);
        toast.success("Package berhasil diperbarui!");
      } else {
        const newPackage: Package = {
          id: packages.length ? Math.max(...packages.map((p) => p.id)) + 1 : 1,
          item: values.item,
          periode: values.periode,
          periodeType: values.periodeType,
          price: Number(values.price),
          type: values.type,
          detail: values.detail,
        };
        newPackage.periode = `${newPackage.periode} ${newPackage.periodeType}`;
        // console.log(newPackage.periode);
        toggle();
        await postPackages(newPackage);
        toast.success("Package berhasil ditambahkan!");
      }
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
      <BreadCrumb title="Packages" pageTitle="Data Master" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="packagesTable">
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Packages List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">
                      Add Package
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
                      placeholder="Search by Item ID, Type, Detail, or Periode..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                </div>
              </form>
            </div>

            {/* Packages Table */}
            <div className="card-body">
              {filteredPackages && filteredPackages.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPackages || []}
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
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched through all packages but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Package Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="packageModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[50vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Package" : "Add Package"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item ID Field */}
              <div>
                <label
                  htmlFor="itemInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Item
                </label>
                <select
                  name="item"
                  id="itemInput"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-full px-3 py-2 rounded-md"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.item}
                >
                  <option value="" disabled hidden>
                    Select Item
                  </option>
                  <option value="Tenant">Tenant</option>
                  <option value="Non Tenant">Non Tenant</option>
                </select>
                {validation.touched.item && validation.errors.item ? (
                  <p className="text-red-400">{validation.errors.item}</p>
                ) : null}
              </div>

              {/* Periode Field */}
              <div>
                <label
                  htmlFor="periode"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Periode
                </label>
                <div className="flex space-x-2">
                  {/* Numeric Input for Period */}
                  <input
                    type="number"
                    id="periode"
                    className="form-input w-1/2 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Enter Periode"
                    name="periode"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.periode}
                  />

                  {/* Dropdown for Period Type */}
                  <select
                    id="periodeType"
                    name="periodeType"
                    className="form-select w-1/2 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.periodeType}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="Months">Months</option>
                    <option value="Accidental">Accidental</option>
                  </select>
                </div>
                {/* Display validation errors for periode */}
                {(validation.touched.periode && validation.errors.periode) ||
                (validation.touched.periode && validation.errors.periode) ? (
                  <p className="text-red-400">
                    {validation.errors.periode || validation.errors.periode}
                  </p>
                ) : null}
              </div>

              {/* Price Field */}
              <div>
                <label
                  htmlFor="priceInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Price (Rp)
                </label>
                <input
                  type="number"
                  id="priceInput"
                  name="price"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Price"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.price}
                />
                {validation.touched.price && validation.errors.price ? (
                  <p className="text-red-400">{validation.errors.price}</p>
                ) : null}
              </div>

              {/* Type Field */}
              <div>
                <label
                  htmlFor="typeInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Type
                </label>
                <select
                  id="typeInput"
                  name="type"
                  className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-full px-3 py-2 rounded-md"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.type}
                >
                  <option value="" disabled hidden>
                    Select Type
                  </option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Personnel">Personnel</option>
                </select>
                {validation.touched.type && validation.errors.type && (
                  <p className="text-red-400">{validation.errors.type}</p>
                )}
              </div>

              {/* Detail Field */}
              <div>
                <label
                  htmlFor="detailInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Detail
                </label>
                <input
                  type="text"
                  id="detailInput"
                  name="detail"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-full px-3 py-2 rounded-md"
                  placeholder="Enter details"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.detail}
                />
                {validation.touched.detail && validation.errors.detail && (
                  <p className="text-red-400">{validation.errors.detail}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="text-white transition-all duration-200 ease-linear bg-red-500 border border-white btn hover:bg-red-300 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500 px-4 py-2 rounded"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600 px-4 py-2 rounded"
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

export default PackagesListView;
