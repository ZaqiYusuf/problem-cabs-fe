import React, { useCallback, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from "react-select";
import TableContainer from "Common/TableContainer";
import {
  Search,
  Trash2,
  Plus,
  FileEdit,
  ArrowLeft,
} from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface PermittedPersonnel {
  id: number;
  name: string;
  noKTPorSIM: string;
  location: string;
  package: string;
}

interface Option {
  readonly label: string;
  readonly value?: string;
  readonly options?: Option[];
  readonly isDisabled?: boolean;
}

const PermittedPersonnelListView = () => {
  const navigate = useNavigate();

  const [permittedPersonnel, setPermittedPersonnel] = useState<PermittedPersonnel[]>([
    {
      id: 1,
      name: "Agus",
      noKTPorSIM: "1234567890",
      location: "Jakarta",
      package: "Non Tenant Light Vehicle (Non Niaga) Accidental",
    },
    {
      id: 2,
      name: "Dadang",
      noKTPorSIM: "0987654321",
      location: "Bandung",
      package: "Tenant Light Vehicle (Non Niaga) 6 Bulan",
    },
  ]);

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

  const [filteredPermittedPersonnel, setFilteredPermittedPersonnel] = useState<PermittedPersonnel[]>(permittedPersonnel);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<PermittedPersonnel | undefined>(undefined);

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  const handleDelete = useCallback(() => {
    if (eventData) {
      setPermittedPersonnel((prevPersonnel) =>
        prevPersonnel.filter((person) => person.id !== eventData.id)
      );
      setFilteredPermittedPersonnel((prevFiltered) =>
        prevFiltered.filter((person) => person.id !== eventData.id)
      );
      toast.success("Permitted Personnel berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  const validation = useFormik({
    initialValues: {
      name: eventData?.name || "",
      noKTPorSIM: eventData?.noKTPorSIM || "",
      location: eventData?.location || "",
      package: eventData?.package || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      noKTPorSIM: Yup.string().required("Required"),
      location: Yup.string().required("Required"),
      package: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (isEdit && eventData) {
        setPermittedPersonnel((prevPersonnel) =>
          prevPersonnel.map((person) =>
            person.id === eventData.id ? { ...person, ...values } : person
          )
        );
        toast.success("Permitted Personnel updated successfully!");
      } else {
        const newPersonnel = { id: Date.now(), ...values } as PermittedPersonnel;
        setPermittedPersonnel((prevPersonnel) => [...prevPersonnel, newPersonnel]);
        toast.success("Permitted Personnel added successfully!");
      }
      setShow(false);
      setEventData(undefined);
    },
  });

  const handleUpdateDataClick = useCallback((person: PermittedPersonnel) => {
    setEventData({ ...person });
    setIsEdit(true);
    setShow(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEventData(undefined);
    setIsEdit(false);
    setShow(true);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onClickDelete = useCallback((person: PermittedPersonnel) => {
    setDeleteModal(true);
    setEventData(person);
  }, []);

  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPermittedPersonnel(
        permittedPersonnel.filter(
          (person) =>
            person.name.toLowerCase().includes(search) ||
            person.location.toLowerCase().includes(search)
        )
      );
    },
    [permittedPersonnel]
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
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "No KTP/SIM",
        accessorKey: "noKTPorSIM",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Location",
        accessorKey: "location",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Package",
        accessorKey: "package",
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
              aria-label={`Edit permitted personnel with ID ${cell.row.original.id}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete permitted personnel with ID ${cell.row.original.id}`}
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

  return (
    <React.Fragment>
      <BreadCrumb
        title="Manage Permitted Personnel"
        pageTitle="Permitted Personnel"
      />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="permittedPersonnelTable">
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
                  <h6 className="text-[28px]">Permitted Personnel List</h6>
                </div>
                <button
                  type="button"
                  className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                  onClick={handleAdd}
                >
                  <Plus className="inline-block size-4 mr-1" />
                  <span className="align-middle text-[16px]">
                    Add Personnel
                  </span>
                </button>
              </div>
            </div>

            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <div className="relative xl:col-span-3">
                  <input
                    type="text"
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                    placeholder="Search by name or location..."
                    autoComplete="off"
                    onChange={filterSearchData}
                  />
                  <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                </div>
              </div>
            </div>

            <div className="card-body">
              {filteredPermittedPersonnel && filteredPermittedPersonnel.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPermittedPersonnel || []}
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
                      We've searched through all permitted personnel but couldn't
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
        id="personnelModal"
        modal-center="true"
        className="fixed inset-0 z-drawer flex items-center justify-center"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header className="p-4 border-b flex items-center justify-between">
          <Modal.Title>{isEdit ? "Edit Personnel" : "Add Personnel"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ```javascript
              mb-6">
              <div>
                <label htmlFor="nameInput" className="block mb-3 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="nameInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter name"
                  {...validation.getFieldProps("name")}
                  aria-label="Name input"
                />
                {validation.touched.name && validation.errors.name && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="noKTPorSIMInput" className="block mb-3 font-medium">
                  No KTP/SIM
                </label>
                <input
                  type="text"
                  id="noKTPorSIMInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter No KTP/SIM"
                  {...validation.getFieldProps("noKTPorSIM")}
                  aria-label="No KTP/SIM input"
                />
                {validation.touched.noKTPorSIM && validation.errors.noKTPorSIM && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.noKTPorSIM}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="locationInput" className="block mb-3 font-medium">
                  Location
                </label>
                <input
                  type="text"
                  id="locationInput"
                  className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  placeholder="Enter location"
                  {...validation.getFieldProps("location")}
                  aria-label="Location input"
                />
                {validation.touched.location && validation.errors.location && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.location}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="packageInput" className="block mb-3 font-medium">
                  Package
                </label>
                <Select
                  id="packageInput"
                  options={packageOptions}
                  className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 rounded-md"
                  placeholder="Select Package"
                  onChange={(option) => validation.setFieldValue("package", option?.value)}
                  aria-label="Package select"
                />
                {validation.touched.package && validation.errors.package && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.package}
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

export default PermittedPersonnelListView;