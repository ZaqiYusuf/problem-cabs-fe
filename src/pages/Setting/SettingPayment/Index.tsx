import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";

// Icons
import {
  Search,
  Trash2,
  Plus,
  FileEdit,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSettingAPI, postSettingAPI, updateSettingAPI, deleteSettingAPI } from "helpers/backend_helper";

// TypeScript interfaces
interface PaymentGateway {
  id: number;
  merchant_id: string;
  client_key: string;
  server_key: string;
  environment: "sandbox" | "production";
  status: "active" | "inactive";
}

const PaymentGatewaySettingsView = () => {
  // Dummy data state
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [filteredPaymentGateways, setFilteredPaymentGateways] =
    useState<PaymentGateway[]>(paymentGateways);

  const getSetting = async () => {
    await getSettingAPI().then((response: any) => {
      console.log(response);
      setPaymentGateways(response.settings);
      setFilteredPaymentGateways(response.settings);
    });
  };


  const updateSetting = async (data:any) => {
    await updateSettingAPI(data).then(()=>{
      getSetting();
    });
  };


  const deleteSettings = async (data: any) => {
    await deleteSettingAPI(data.id).then(() => {
      getSetting();
    });
  };

  const postSetting = async (data:any) => {
    await postSettingAPI(data).then(()=>{
      getSetting();
    });
  };

  useEffect(() => {
    getSetting();
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<PaymentGateway | undefined>(
    undefined
  );

  // State to manage visibility of Server Key
  const [showServerKey, setShowServerKey] = useState<boolean>(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback( async() => {
    if (eventData) {
      setPaymentGateways((prevGateways) =>
        prevGateways.filter((gw) => gw.id !== eventData.id)
      );
      setFilteredPaymentGateways((prevFiltered) =>
        prevFiltered.filter((gw) => gw.id !== eventData.id)
      );

      await deleteSettings(eventData);
      toast.success("Payment gateway deleted successfully!");
      setDeleteModal(false);
    }
  }, [eventData]);


  // Handle Update
  const handleUpdateDataClick = useCallback((gw: PaymentGateway) => {
    setEventData({ ...gw });
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
  const onClickDelete = useCallback((gw: PaymentGateway) => {
    setDeleteModal(true);
    setEventData(gw);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPaymentGateways(
        paymentGateways.filter(
          (gw) =>
            gw.merchant_id.toLowerCase().includes(search) ||
            gw.client_key.toLowerCase().includes(search) ||
            gw.server_key.toLowerCase().includes(search) ||
            gw.environment.toLowerCase().includes(search) ||
            gw.status.toLowerCase().includes(search)
        )
      );
    },
    [paymentGateways]
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
        header: "Merchant ID",
        accessorKey: "merchant_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Client Key",
        accessorKey: "client_key",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{"******"}</div> // Masking client key
        ),
      },
      {
        header: "Server Key",
        accessorKey: "server_key",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{"******"}</div> // Masking server key
        ),
      },
      {
        header: "Environment",
        accessorKey: "environment",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5 capitalize">{cell.getValue()}</div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {cell.getValue() === "active" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-green-500 border-transparent text-green-50 dark:bg-green-500/20 dark:border-transparent">
                <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1"></CheckCircle2>
                active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-500 border-transparent text-red-50 dark:bg-red-500/20 dark:border-transparent">
                <XCircle className="size-3 ltr:mr-1 rtl:ml-1"></XCircle>
                inactive
              </span>
            )}
          </>
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
              aria-label={`Edit payment gateway with ID ${cell.row.original.id}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete payment gateway with ID ${cell.row.original.id}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, paymentGateways]
  );

  // Formik Validation
  interface FormValues {
    merchant_id: string;
    client_key: string;
    server_key: string;
    environment: "sandbox" | "production";
    status: "active" | "inactive";
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      merchant_id: isEdit && eventData ? eventData.merchant_id : "",
      client_key: isEdit && eventData ? eventData.client_key : "",
      server_key: isEdit && eventData ? eventData.server_key : "",
      environment: isEdit && eventData ? eventData.environment : "sandbox",
      status: isEdit && eventData ? eventData.status : "active",
    },

    validationSchema: Yup.object({
      merchant_id: Yup.string()
        .required("Please enter the Merchant ID")
        .matches(/^[A-Za-z0-9]+$/, "Merchant ID must be alphanumeric"),
      client_key: Yup.string()
        .required("Please enter the Client Key")
        .min(10, "Client Key must be at least 10 characters"),
      server_key: Yup.string()
        .required("Please enter the Server Key")
        .min(10, "Server Key must be at least 10 characters"),
      environment: Yup.mixed<"sandbox" | "production">()
        .oneOf(["sandbox", "production"], "Invalid environment")
        .required("Please select the environment"),
      status: Yup.mixed<"active" | "inactive">()
        .oneOf(["active", "inactive"], "Invalid status")
        .required("Please select the status"),
    }),

    onSubmit: async(values) => {
      if (isEdit && eventData) {
        // Update payment gateway
        const updatedGateway: PaymentGateway = {
          ...eventData,
          merchant_id: values.merchant_id,
          client_key: values.client_key,
          server_key: values.server_key,
          environment: values.environment,
          status: values.status,
        };
        setPaymentGateways((prevGateways) =>
          prevGateways.map((gw) =>
            gw.id === updatedGateway.id ? updatedGateway : gw
          )
        );
        setFilteredPaymentGateways((prevFiltered) =>
          prevFiltered.map((gw) =>
            gw.id === updatedGateway.id ? updatedGateway : gw
          )
        );

        toggle();

        await updateSetting(updatedGateway);
        toast.success("Payment gateway updated successfully!");
      } else {
        // Add new payment gateway
        const newGateway: PaymentGateway = {
          id: paymentGateways.length
            ? Math.max(...paymentGateways.map((gw) => gw.id)) + 1
            : 1,
          merchant_id: values.merchant_id,
          client_key: values.client_key,
          server_key: values.server_key,
          environment: values.environment,
          status: values.status,
        };
        setPaymentGateways((prevGateways) => [...prevGateways, newGateway]);
        setFilteredPaymentGateways((prevFiltered) => [
          ...prevFiltered,
          newGateway,
        ]);

        toggle();

        await postSetting(newGateway)
        toast.success("Payment gateway added successfully!");
      }
    },
  });

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData(undefined);
      setIsEdit(false);
      validation.resetForm();
      setShowServerKey(false);
    } else {
      setShow(true);
      setEventData(undefined);
      validation.resetForm();
      setShowServerKey(false);
    }
  }, [show, validation]);

  return (
    <React.Fragment>
      <BreadCrumb
        title="Payment Gateway Settings"
        pageTitle="Payment Gateways"
      />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="paymentGatewaysTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Payment Gateways List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">
                      Add Payment Gateway
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
                      placeholder="Search by Merchant ID, Client Key, Server Key, Environment, or Status..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Payment Gateways Table */}
            <div className="card-body">
              {filteredPaymentGateways && filteredPaymentGateways.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPaymentGateways || []}
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
                      We've searched through all payment gateways but couldn't
                      find any matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="paymentGatewayModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg overflow-y-auto"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Payment Gateway" : "Add Payment Gateway"}
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
            {/* Merchant ID Field */}
            <div className="mb-3">
              <label
                htmlFor="merchantIdInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Merchant ID
              </label>
              <input
                type="text"
                id="merchantIdInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter Merchant ID"
                name="merchant_id"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.merchant_id}
              />
              {validation.touched.merchant_id &&
              validation.errors.merchant_id ? (
                <p className="text-red-400">{validation.errors.merchant_id}</p>
              ) : null}
            </div>

            {/* Client Key Field */}
            <div className="mb-3">
              <label
                htmlFor="clientKeyInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Client Key
              </label>
              <input
                type="text"
                id="clientKeyInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter Client Key"
                name="client_key"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.client_key}
              />
              {validation.touched.client_key && validation.errors.client_key ? (
                <p className="text-red-400">{validation.errors.client_key}</p>
              ) : null}
            </div>

            {/* Server Key Field */}
            <div className="mb-3">
              <label
                htmlFor="serverKeyInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Server Key
              </label>



              <div className="relative">
                <input
                  type={showServerKey ? "text" : "password"}
                  id="serverKeyInput"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200 w-full"
                  placeholder="Enter Server Key"
                  name="server_key"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.server_key}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500"
                  onClick={() => setShowServerKey((prev) => !prev)}
                >
                  {showServerKey ? "Hide" : "Show"}
                </button>
              </div>
              {validation.touched.server_key && validation.errors.server_key ? (
                <p className="text-red-400">{validation.errors.server_key}</p>
              ) : null}
            </div>

            

            {/* Environment Field */}
            <div className="mb-3">
              <label
                htmlFor="environmentSelect"
                className="inline-block mb-2 text-base font-medium"
              >
                Environment
              </label>
              <select
                id="environmentSelect"
                className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-full"
                name="environment"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.environment}
              >
                <option value="sandbox">Sandbox</option>
                <option value="production">Production</option>
              </select>
              {validation.touched.environment &&
              validation.errors.environment ? (
                <p className="text-red-400">{validation.errors.environment}</p>
              ) : null}
            </div>

            {/* Status Field */}
            <div className="mb-3">
              <label
                htmlFor="statusSelect"
                className="inline-block mb-2 text-base font-medium"
              >
                Status
              </label>
              <select
                id="statusSelect"
                className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 w-full"
                name="status"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.status === "active" ? "active" : "inactive"}
                >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
              {validation.touched.status && validation.errors.status ? (
                <p className="text-red-400">{validation.errors.status}</p>
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
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default PaymentGatewaySettingsView;
