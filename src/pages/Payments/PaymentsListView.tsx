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

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface Payment {
  id: number;
  // user_id: string;
  // id_customer: string;
  id_imk: string;
  pay_date: string; // ISO date string
  amount_pay: string;
  status_pay:
    | "capture"
    | "pending"
    | "cancel"
    | "expire"
    | "refund"
    | "failure";
  name_pay: string;
  payment_method: string; // New Field
  // redirect_url: string;
  order_id: string;
  note_pay: string;
  created_at: string;
  updated_at: string;
}

const PaymentsListView = () => {
  // Dummy data state
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      // user_id: "1",
      // id_customer: "PT. Angkasa Pura I",
      id_imk: "IMK 001/KIE/X/2024",
      pay_date: "2024-04-25",
      amount_pay: "1000",
      status_pay: "capture",
      name_pay: "Satria",
      payment_method: "Manual", // New Field
      // redirect_url: "https://example.com/redirect",
      order_id: "ORDER001",
      note_pay: "First payment",
      created_at: "2024-04-20T10:00:00Z",
      updated_at: "2024-04-20T10:00:00Z",
    },
    {
      id: 2,
      // user_id: "2",
      // id_customer: "PT. Citra Mandiri",
      id_imk: "IMK 002/KIE/X/2024",
      pay_date: "2024-05-15",
      amount_pay: "2000",
      status_pay: "pending",
      name_pay: "-",
      payment_method: "Payment Gateaway", // New Field
      // redirect_url: "https://example.com/redirect",
      order_id: "ORDER002",
      note_pay: "Second payment",
      created_at: "2024-04-21T11:00:00Z",
      updated_at: "2024-04-21T11:00:00Z",
    },
    // Add more payments as needed
  ]);

  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(payments);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Payment | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setPayments((prevPayments) =>
        prevPayments.filter((pay) => pay.id !== eventData.id)
      );
      setFilteredPayments((prevFiltered) =>
        prevFiltered.filter((pay) => pay.id !== eventData.id)
      );
      toast.success("Payment berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((pay: Payment) => {
    setEventData({ ...pay });
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
  const onClickDelete = useCallback((pay: Payment) => {
    setDeleteModal(true);
    setEventData(pay);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredPayments(
        payments.filter(
          (pay) =>
            pay.name_pay.toLowerCase().includes(search) ||
            pay.order_id.toLowerCase().includes(search)
        )
      );
    },
    [payments]
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
      // {
      //   header: "User ID",
      //   accessorKey: "user_id",
      //   enableColumnFilter: false,
      //   cell: (cell: any) => (
      //     <div className="px-3.5 py-2.5">{cell.getValue()}</div>
      //   ),
      // },
      // {
      //   header: "Customer",
      //   accessorKey: "id_customer",
      //   enableColumnFilter: false,
      //   cell: (cell: any) => (
      //     <div className="px-3.5 py-2.5">{cell.getValue()}</div>
      //   ),
      // },
      {
        header: "IMK Number",
        accessorKey: "id_imk",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Payment Date",
        accessorKey: "pay_date",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Amount Pay",
        accessorKey: "amount_pay",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">
            {cell.getValue()
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(cell.getValue()))
              : "N/A"}
          </div>
        ),
      },
      {
        header: "Status Payment",
        accessorKey: "status_pay",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5 capitalize">{cell.getValue()}</div>
        ),
      },
      {
        header: "Payer Name",
        accessorKey: "name_pay",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Payment Method", // New Column
        accessorKey: "payment_method",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue() || "N/A"}</div>
        ),
      },
      // {
      //   header: "Order ID",
      //   accessorKey: "order_id",
      //   enableColumnFilter: false,
      //   cell: (cell: any) => (
      //     <div className="px-3.5 py-2.5">{cell.getValue()}</div>
      //   ),
      // },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit payment for ${cell.row.original.name_pay}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete payment for ${cell.row.original.name_pay}`}
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
    // user_id: string;
    // id_customer: string;
    id_imk: string;
    pay_date: string;
    amount_pay: string;
    status_pay:
      | "capture"
      | "pending"
      | "cancel"
      | "expire"
      | "refund"
      | "failure";
    name_pay: string;
    payment_method: string; // New Field
    // redirect_url: string;
    order_id: string;
    note_pay: string;
    // upload_file?: string | null; // Optional if needed
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      // user_id: isEdit && eventData ? eventData.user_id : "",
      // id_customer: isEdit && eventData ? eventData.id_customer : "",
      id_imk: isEdit && eventData ? eventData.id_imk : "",
      pay_date: isEdit && eventData ? eventData.pay_date : "",
      amount_pay: isEdit && eventData ? eventData.amount_pay : "",
      status_pay: isEdit && eventData ? eventData.status_pay : "pending",
      name_pay: isEdit && eventData ? eventData.name_pay : "",
      payment_method: isEdit && eventData ? eventData.payment_method : "", // New Field
      // redirect_url: isEdit && eventData ? eventData.redirect_url : "",
      order_id: isEdit && eventData ? eventData.order_id : "",
      note_pay: isEdit && eventData ? eventData.note_pay : "",
      // upload_file: isEdit && eventData ? eventData.upload_file : null, // If needed
    },

    validationSchema: Yup.object({
      // user_id: Yup.string().required("Please enter a user ID"),
      // id_customer: Yup.string().required("Please enter a customer ID"),
      id_imk: Yup.string().required("Please enter an IMK ID"),
      pay_date: Yup.date().required("Please select a payment date"),
      amount_pay: Yup.string().required("Please enter the payment amount"),
      status_pay: Yup.mixed<
        "capture" | "pending" | "cancel" | "expire" | "refund" | "failure"
      >()
        .oneOf(
          ["capture", "pending", "cancel", "expire", "refund", "failure"],
          "Invalid payment status"
        )
        .required("Please select a payment status"),
      name_pay: Yup.string().required("Please enter the payer's name"),
      payment_method: Yup.string().required("Please enter a payment method"), // New Field
      // redirect_url: Yup.string()
      //   .url("Invalid URL")
      //   .required("Please enter a redirect URL"),
      order_id: Yup.string().required("Please enter an order ID"),
      note_pay: Yup.string().required("Please enter a note"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update payment
        const updatedPayment: Payment = {
          ...eventData,
          // user_id: values.user_id,
          // id_customer: values.id_customer,
          id_imk: values.id_imk,
          pay_date: values.pay_date,
          amount_pay: values.amount_pay,
          status_pay: values.status_pay,
          name_pay: values.name_pay,
          payment_method: values.payment_method, // New Field
          // redirect_url: values.redirect_url,
          order_id: values.order_id,
          note_pay: values.note_pay,
          // upload_file: values.upload_file || null, // If needed
          updated_at: new Date().toISOString(),
        };
        setPayments((prevPayments) =>
          prevPayments.map((pay) =>
            pay.id === updatedPayment.id ? updatedPayment : pay
          )
        );
        setFilteredPayments((prevFiltered) =>
          prevFiltered.map((pay) =>
            pay.id === updatedPayment.id ? updatedPayment : pay
          )
        );
        toast.success("Payment berhasil diperbarui!");
      } else {
        // Add new payment
        const newPayment: Payment = {
          id: payments.length ? Math.max(...payments.map((p) => p.id)) + 1 : 1,
          // user_id: values.user_id,
          // id_customer: values.id_customer,
          id_imk: values.id_imk,
          pay_date: values.pay_date,
          amount_pay: values.amount_pay,
          status_pay: values.status_pay,
          name_pay: values.name_pay,
          payment_method: values.payment_method, // New Field
          // redirect_url: values.redirect_url,
          order_id: values.order_id,
          note_pay: values.note_pay,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // upload_file: values.upload_file || null, // If needed
        };
        setPayments((prevPayments) => [...prevPayments, newPayment]);
        setFilteredPayments((prevFiltered) => [...prevFiltered, newPayment]);
        toast.success("Payment berhasil ditambahkan!");
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
      <BreadCrumb title="Manage Payments" pageTitle="Payments" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="paymentsTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Payments List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">
                      Add Payment
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
                      placeholder="Search by payer's name or order ID..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Payments Table */}
            <div className="card-body">
              {filteredPayments && filteredPayments.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredPayments || []}
                  customPageSize={10}
                  divclassName="-mx-5 overflow-x-auto"
                  tableclassName="w-full whitespace-nowrap"
                  theadclassName="ltr:text-left rtl:text-right bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600"
                  thclassName="px-6 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-slate-200 dark:border-zink-500 w-10"
                  tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-slate-200 dark:border-zink-500"
                  PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched through all payments but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="paymentModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Payment" : "Add Payment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 overflow-y-auto">
          <form
            action="#!"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer ID Field */}
              {/*<div>
                 <label
                  htmlFor="customerIdInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Customer ID
                </label>
                <input
                  type="text"
                  id="customerIdInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter customer ID"
                  name="id_customer"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.id_customer}
                />
                {validation.touched.id_customer &&
                validation.errors.id_customer ? (
                  <p className="text-red-400">
                    {validation.errors.id_customer}
                  </p>
                ) : null}
              </div> */}

              {/* IMK ID Field */}
              <div>
                <label
                  htmlFor="imkIdInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Number IMK
                </label>
                <input
                  type="text"
                  id="imkIdInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter IMK ID"
                  name="id_imk"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.id_imk}
                />
                {validation.touched.id_imk && validation.errors.id_imk ? (
                  <p className="text-red-400">{validation.errors.id_imk}</p>
                ) : null}
              </div>

              {/* Pay Date Field */}
              <div>
                <label
                  htmlFor="payDateInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Pay Date
                </label>
                <input
                  type="date"
                  id="payDateInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  name="pay_date"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.pay_date}
                />
                {validation.touched.pay_date && validation.errors.pay_date ? (
                  <p className="text-red-400">{validation.errors.pay_date}</p>
                ) : null}
              </div>

              {/* Amount Pay Field */}
              <div>
                <label
                  htmlFor="amountPayInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Amount Pay
                </label>
                <input
                  type="number"
                  id="amountPayInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter amount"
                  name="amount_pay"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.amount_pay}
                />
                {validation.touched.amount_pay &&
                validation.errors.amount_pay ? (
                  <p className="text-red-400">{validation.errors.amount_pay}</p>
                ) : null}
              </div>

              {/* Status Pay Field */}
              <div>
                <label
                  htmlFor="statusPayInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Status Pay
                </label>
                <select
                  id="statusPayInput"
                  className="form-select w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                  name="status_pay"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.status_pay}
                >
                  <option value="">Select status</option>
                  <option value="capture">Capture</option>
                  <option value="pending">Pending</option>
                  <option value="cancel">Cancel</option>
                  <option value="expire">Expire</option>
                  <option value="refund">Refund</option>
                  <option value="failure">Failure</option>
                </select>
                {validation.touched.status_pay &&
                validation.errors.status_pay ? (
                  <p className="text-red-400">
                    {validation.errors.status_pay}
                  </p>
                ) : null}
              </div>

              {/* Name Pay Field */}
              <div>
                <label
                  htmlFor="namePayInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Name Pay
                </label>
                <input
                  type="text"
                  id="namePayInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter payer's name"
                  name="name_pay"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.name_pay}
                />
                {validation.touched.name_pay && validation.errors.name_pay ? (
                  <p className="text-red-400">{validation.errors.name_pay}</p>
                ) : null}
              </div>

              {/* Payment Method Field */} {/* New Field */}
              <div>
                <label
                  htmlFor="paymentMethodInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Payment Method
                </label>
                <input
                  type="text"
                  id="paymentMethodInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter payment method"
                  name="payment_method"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.payment_method}
                />
                {validation.touched.payment_method &&
                validation.errors.payment_method ? (
                  <p className="text-red-400">
                    {validation.errors.payment_method}
                  </p>
                ) : null}
              </div>

              {/* Order ID Field */}
              {/* <div>
                <label
                  htmlFor="orderIdInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderIdInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter order ID"
                  name="order_id"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.order_id}
                />
                {validation.touched.order_id && validation.errors.order_id ? (
                  <p className="text-red-400">{validation.errors.order_id}</p>
                ) : null}
              </div> */}

              {/* Note Pay Field */}
              <div className="col-span-1 md:col-span-2">
                <label
                  htmlFor="notePayInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Note Pay
                </label>
                <textarea
                  id="notePayInput"
                  className="form-textarea w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter note"
                  name="note_pay"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.note_pay}
                  rows={3}
                ></textarea>
                {validation.touched.note_pay && validation.errors.note_pay ? (
                  <p className="text-red-400">{validation.errors.note_pay}</p>
                ) : null}
              </div>
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
                {isEdit ? "Update Payment" : "Add Payment"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default PaymentsListView;
