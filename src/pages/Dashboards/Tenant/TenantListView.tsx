import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { ToastContainer } from "react-toastify";
import { Search, Trash2, Plus, FileEdit } from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { deleteTenantAPI, getTenantAPI, postTenantAPI, updateTenantAPI } from "helpers/backend_helper";

// TypeScript interfaces
interface Tenant {
  id: number;
  name_tenant: string;
}

const TenantsListView = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>(tenants);

  const getTenants = async () => {
    await getTenantAPI().then((response:any)=>{
      setTenants(response.tenants)
      setFilteredTenants(response.tenants)
    });
  };

  const postTenants = async (data:any) => {
    await postTenantAPI(data).then(()=>{
      getTenants();
    });
  };

  const updateTenants = async (data:any) => {
    await updateTenantAPI(data).then(()=>{
      getTenants();
    });
  };

  const deleteTenants = async (data:any) => {
    await deleteTenantAPI(data.id).then(()=>{
      getTenants();
    });
  };

  useEffect(() => {
    getTenants();
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Tenant | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  const handleDelete = useCallback(() => {
    if (eventData) {
      deleteTenants(eventData);
      setDeleteModal(false);
    }
  }, [eventData]);

  const handleUpdateDataClick = useCallback((tenant: Tenant) => {
    setEventData({ ...tenant });
    setIsEdit(true);
    setShow(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEventData(undefined);
    setIsEdit(false);
    setShow(true);
  }, []);

  const onClickDelete = useCallback((tenant: Tenant) => {
    setDeleteModal(true);
    setEventData(tenant);
  }, []);

  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredTenants(
        tenants.filter((tenant) =>
          tenant.name_tenant.toLowerCase().includes(search)
        )
      );
    },
    [tenants]
  );

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
        accessorKey: "name_tenant",
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
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit tenant for ${cell.row.original.name_tenant}`}
            >
              <FileEdit className="mr-1 size-4" /> Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete tenant for ${cell.row.original.name_tenant}`}
            >
              <Trash2 className="mr-1 size-4" /> Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, tenants]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name_tenant: isEdit && eventData ? eventData.name_tenant : "",
    },
    validationSchema: Yup.object({
      name_tenant: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Please enter a tenant name"),
    }),
    onSubmit: async(values) => {
      if (isEdit && eventData) {
        const updatedTenant: Tenant = {
          ...eventData,
          id: eventData.id,
          name_tenant: values.name_tenant,
        };
        await updateTenants(updatedTenant);
      } else {
        const newTenant: Tenant = {
          id: tenants.length ? Math.max(...tenants.map((t) => t.id)) + 1 : 1,
          name_tenant: values.name_tenant,
        };
        await postTenants(newTenant);
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
      <BreadCrumb title="Tenants" pageTitle="Data Master" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="flex justify-center mt-20">
        <div className="w-full max-w-4xl xl:max-w-3xl">
          <div className="card" id="tenantsTable">
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Tenants List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">Add Tenant</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-6">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                      placeholder="Search by tenant name..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                </div>
              </form>
            </div>

            <div className="card-body">
              {filteredTenants && filteredTenants.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredTenants}
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
                      We've searched through all tenants but couldn't find any
                      matching records.
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
        dialogClassName="w-[90%] md:w-[40rem] max-w-full h-auto bg-white shadow-lg rounded-md relative"
      >
        <Modal.Header className="p-4 border-b flex items-center justify-between">
          <Modal.Title>{isEdit ? "Edit Tenant" : "Add Tenant"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div className="mb-6">
              <label
                htmlFor="nameTenantInput"
                className="block mb-3 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="nameTenantInput"
                className="ltr:pl-5 rtl:pr-8 py-2 w-full form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                placeholder="Enter tenant name"
                name="name_tenant"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name_tenant}
                aria-label="Tenant name input"
              />
              {validation.touched.name_tenant &&
                validation.errors.name_tenant && (
                  <p className="text-red-400 mt-1 text-sm">
                    {validation.errors.name_tenant}
                  </p>
                )}
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

export default TenantsListView;
