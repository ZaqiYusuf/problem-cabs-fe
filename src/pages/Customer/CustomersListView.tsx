import React, { useCallback, useMemo, useState, useEffect } from "react";
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

import { getCustomerApi } from "helpers/backend_helper";


// TypeScript interfaces
interface Customer {
  id: number;
  name_customer: string;
  tenant: string;
}

const CustomersListView = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const getCustomer = async () => {
    setIsLoading(true);
    await getCustomerApi().then((response: any) => {

      const mappedCustomers = response.processImks.map((item: any) => ({
        id: item.tenant_id,
        name_customer: item.customer?.name_customer || "N/A",
        tenant: item.tenant?.name_tenant || "Unknown Tenant",
      }));
    
      setCustomers(mappedCustomers);
      setFilteredCustomers(mappedCustomers); // Atur berdasarkan data langsung
      setIsLoading(false);
    });
  };
  
  useEffect(() => {
    getCustomer();
  }, []);
  

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Customer | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== eventData.id)
      );
      setFilteredCustomers((prevFiltered) =>
        prevFiltered.filter((customer) => customer.id !== eventData.id)
      );
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((customer: Customer) => {
    setEventData({ ...customer });
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
  const onClickDelete = useCallback((customer: Customer) => {
    setDeleteModal(true);
    setEventData(customer);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredCustomers(
        customers.filter((customer) =>
          customer.tenant.toLowerCase().includes(search)
        )
      );
    },
    [customers]
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
        header: "Customer",
        accessorKey: "name_customer",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Tenant",
        accessorKey: "tenant",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Action",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit ${cell.row.original.name_customer}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete ${cell.row.original.name_customer}`}
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
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name_customer: isEdit && eventData ? eventData.name_customer : "",
      tenant: isEdit && eventData ? eventData.tenant : "",
    },
    validationSchema: Yup.object({
      name_customer: Yup.string().required("Please enter a customer name"),
      tenant: Yup.string().required("Please enter tenant information"),
    }),
    onSubmit: (values) => {
      if (isEdit && eventData) {
        const updatedCustomer: Customer = {
          ...eventData,
          name_customer: values.name_customer,
          tenant: values.tenant,
        };
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          )
        );
        setFilteredCustomers((prevFiltered) =>
          prevFiltered.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          )
        );
      } else {
        const newCustomer: Customer = {
          id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
          name_customer: values.name_customer,
          tenant: values.tenant,
        };
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        setFilteredCustomers((prevFiltered) => [...prevFiltered, newCustomer]);
      }
      toggle();
    },
  });

  const toggle = useCallback(() => {
    setShow((prev) => !prev);
    setEventData(undefined);
    setIsEdit(false);
    validation.resetForm();
  }, [validation]);

  return (
    <React.Fragment>
      <BreadCrumb title="Customers" pageTitle="Users" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="flex justify-center mt-20">
        <div className="w-full max-w-4xl xl:max-w-3xl">
          <div className="card" id="customersTable">
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Customers List</h6>
              </div>
            </div>

            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-6">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                      placeholder="Search by tenant..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                </div>
              </form>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
              <div className="w-16 h-16 border-8 border-t-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            ) : (
            <div className="card-body">
              {filteredCustomers && filteredCustomers.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={filteredCustomers}
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
                    <p className="mb-0 text-slate-500">
                      We've searched through all customers but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={toggle}
        id="customerModal"
        modal-center="true"
        className="fixed inset-0 z-drawer flex items-center justify-center"
        dialogClassName="w-[90%] md:w-[40rem] max-w-full h-auto bg-white shadow-lg rounded-md relative"
      >
        <Modal.Header className="flex items-center justify-between p-4 border-b">
          <Modal.Title>{isEdit ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form onSubmit={validation.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nameCustomerInput" className="mb-2 font-medium">
                Customer Name
              </label>
              <input
                type="text"
                id="nameCustomerInput"
                className="form-input border-slate-200 focus:outline-none focus:border-custom-500"
                placeholder="Enter customer name"
                name="name_customer"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name_customer}
              />
              {validation.touched.name_customer && validation.errors.name_customer && (
                <p className="text-red-400">{validation.errors.name_customer}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="tenantInput" className="mb-2 font-medium">
                Tenant
              </label>
              <input
                type="text"
                id="tenantInput"
                className="form-input border-slate-200 focus:outline-none focus:border-custom-500"
                placeholder="Enter tenant"
                name="tenant"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.tenant}
              />
              {validation.touched.tenant && validation.errors.tenant && (
                <p className="text-red-400">{validation.errors.tenant}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="text-red-500 bg-white border border-white btn hover:text-red-600"
                onClick={toggle}
              >
                Cancel
              </button>
              <button type="submit" className="text-white bg-custom-500 btn">
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default CustomersListView;
