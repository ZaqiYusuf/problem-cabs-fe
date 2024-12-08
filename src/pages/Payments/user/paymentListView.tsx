import React, { useCallback, useMemo, useState, useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";

// Icons
import { Search, Trash2, Plus, FileEdit, Check, CheckCircle2, XCircle, Clock, ArrowLeft} from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";
import ApproveModal from "Common/ApproveModal";
import { postPayment , getPaymentsUser, updatePayments} from "helpers/backend_helper";


// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface Payment {
  id: number;
  // id_customer: string;
  id_imk: string;
  pay_date: string; // ISO date string
  amount_pay: string;
  status_pay:
    | "capture"
    | "pending"
    | "cancel"
    | "expire"
    | "paid"
    | "refund"
    | "failure";
  name_pay: string;
  pay_method: string; // New Field
  user_id: string;
  // redirect_url: string;
  order_id: string;
  note_pay: string;
  created_at: string;
  updated_at: string;
}

const PaymentsListView = () => {
  // Dummy data state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(payments);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Payment | undefined>(undefined);


  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // State untuk Approve Modal
  const approveToggle = useCallback(() => setApproveModal((prev) => !prev), []);




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


  const updateDataPayment = async (data:any) => {
    await updatePayments(data).then(()=>{
      getPaymentsUser();
    });
  };


  const getDataPayments = async () => {
    await getPaymentsUser().then((response:any)=>{
      setPayments(response.payment)
      setFilteredPayments(response.payment)
    });
  };

  const PostDataPayment = async (data:any) => {
    await postPayment(data).then(()=>{
      getPaymentsUser();
    });
  };

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


  const onClickApprove = useCallback((pay: Payment) => {
    setApproveModal(true); // Buka modal approve
    setEventData(pay); // Simpan data pembayaran ke eventData
  }, []);

  // Handle Approve
  const handleApprove = useCallback(async () => {
    if (!eventData) {
      toast.error("Data pembayaran tidak ditemukan!");
      return;
    }

    try {
      console.log("Mencoba approve payment dengan data:", eventData);

      // Update status menjadi 'paid' di backend
      const updatedPayment: Payment = {
        ...eventData,
        status_pay: "paid", // Update status
      };

      await updatePayments(updatedPayment)
        .then(() => {
          toast.success("Payment berhasil di-approve!");
          getDataPayments(); // Refresh data setelah berhasil update
        })
        .catch((error) => {
          console.error("Error saat meng-update payment:", error);
          toast.error("Gagal mengubah status payment.");
        });
    } catch (error) {
      console.error("Error saat handleApprove:", error);
      toast.error("Terjadi kesalahan pada proses approve.");
    } finally {
      setApproveModal(false); // Tutup modal
    }
  }, [eventData, getDataPayments]);




  useEffect(() => {
    getDataPayments();
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
        cell: (cell: any) => {
          const status = cell.getValue();

          // Menentukan warna dan label berdasarkan status_pay
          const renderStatus = () => {
            switch (status) {
              case "capture":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-blue-500 border-transparent text-blue-50 dark:bg-blue-500/20 dark:border-transparent">
                    <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1" />
                    Captured
                  </span>
                );
              case "paid":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-green-500 border-transparent text-green-50 dark:bg-green-500/20 dark:border-transparent">
                    <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1" />
                    Paid
                  </span>
                );
              case "pending":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-yellow-500 border-transparent text-yellow-50 dark:bg-yellow-500/20 dark:border-transparent">
                    <Clock className="size-3 ltr:mr-1 rtl:ml-1" />
                    Pending
                  </span>
                );
              case "cancel":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-gray-500 border-transparent text-gray-50 dark:bg-gray-500/20 dark:border-transparent">
                    <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                    Cancelled
                  </span>
                );
              case "expire":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-500 border-transparent text-red-50 dark:bg-red-500/20 dark:border-transparent">
                    <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                    Expired
                  </span>
                );
              case "refund":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-purple-500 border-transparent text-purple-50 dark:bg-purple-500/20 dark:border-transparent">
                    <ArrowLeft className="size-3 ltr:mr-1 rtl:ml-1" />
                    Refunded
                  </span>
                );
              case "failure":
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-700 border-transparent text-red-50 dark:bg-red-700/20 dark:border-transparent">
                    <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                    Failed
                  </span>
                );
              default:
                return (
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-gray-300 border-transparent text-gray-600 dark:bg-gray-300/20 dark:border-transparent">
                    Unknown
                  </span>
                );
            }
          };
        
          return <>{renderStatus()}</>;
        },
        
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
        accessorKey: "pay_method",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue() || "N/A"}</div>
        ),
      },
      {
        header: "Order ID",
        accessorKey: "order_id",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
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
      | "paid"
      | "expire"
      | "refund"
      | "failure";
    name_pay: string;
    pay_method: string; // New Field
    user_id: string;
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
      pay_method: isEdit && eventData ? eventData.pay_method : "", // New Field
      user_id: isEdit && eventData ? eventData.user_id : "", // New Field
      // redirect_url: isEdit && eventData ? eventData.redirect_url : "",
      order_id: isEdit && eventData ? eventData.order_id : "",
      note_pay: isEdit && eventData ? eventData.note_pay : "",
      // upload_file: isEdit && eventData ? eventData.upload_file : null, // If needed
    },

    validationSchema: Yup.object({
      // user_id: Yup.string().required("Please enter a user ID"),
      // id_customer: Yup.string().required("Please enter a customer ID"),
      id_imk: Yup.string().required("Please enter an IMK ID"),
      // pay_date: Yup.date().required("Please select a payment date"),
      amount_pay: Yup.string().required("Please enter the payment amount"),
      status_pay: Yup.mixed<
        "capture" | "pending" | "cancel" | "expire" | "refund" | "failure" | "paid"
      >()
        .oneOf(
          ["capture", "pending", "cancel", "expire", "refund", "failure", "paid"],
          "Invalid payment status"
        )
        .required("Please select a payment status"),
      name_pay: Yup.string().required("Please enter the payer's name"),
      pay_method: Yup.string().required("Please enter a payment method"), // New Field
      // redirect_url: Yup.string()
      //   .url("Invalid URL")
      //   .required("Please enter a redirect URL"),
      order_id: Yup.string().required("Please enter an order ID"),
      note_pay: Yup.string().required("Please enter a note"),
    }),

    onSubmit: async(values) => {
      console.log("onSubmit", values)
      if (isEdit && eventData) {
        // Update payment
        const updatedPayment: Payment = {
          ...eventData,
          // user_id: values.user_id,
          // id_customer: values.id_customer,
          id_imk: values.id_imk,
          pay_date: new Date().toISOString(),
          amount_pay: values.amount_pay,
          status_pay: values.status_pay,
          name_pay: values.name_pay,
          pay_method: values.pay_method, // New Field
          user_id: values.user_id,
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
        await updateDataPayment(updatedPayment);
        toast.success("Payment berhasil diperbarui!");
      } else if(!isEdit){
        // Add new payment
        const newPayment: Payment = {
          id: payments.length ? Math.max(...payments.map((p) => p.id)) + 1 : 1,
          id_imk: values.id_imk,
          pay_date: new Date().toISOString(),
          amount_pay: values.amount_pay,
          status_pay: values.status_pay,
          name_pay: values.name_pay,
          pay_method: values.pay_method, // New Field
          user_id: values.user_id,
          order_id: values.order_id,
          note_pay: values.note_pay,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        console.log(newPayment)
        // setPayments((prevPayments) => [...prevPayments, newPayment]);
        setFilteredPayments((prevFiltered) => [...prevFiltered, newPayment]);
        await PostDataPayment(newPayment)
        toast.success("Payment berhasil ditambahkan!");
      }else{
        console.log("Payment gagal");
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
      <BreadCrumb title="Manage Payments" pageTitle="Payments" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />

      <ApproveModal
        show={approveModal}
        onHide={approveToggle} // Ganti deleteToggle dengan approveToggle
        onApprove={handleApprove} // Handler untuk Approve
      />


      <ToastContainer closeButton={false} limit={1} />

      
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="paymentsTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Payments List</h6>
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
            console.log("Form is being submitted!");
            console.log("Validation errors:", validation.errors);
            validation.handleSubmit()
            console.log("Validation errors:", validation.errors);
            console.log("finish submitted!");

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
              {/* <div>
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
              </div> */}

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


              
              <div>
                <label
                  htmlFor="paymentMethodInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  User_id
                </label>
                <input
                  type="text"
                  id="paymentMethodInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter payment method"
                  name="user_id"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.user_id}
                />
                {validation.touched.user_id &&
                validation.errors.user_id ? (
                  <p className="text-red-400">
                    {validation.errors.user_id}
                  </p>
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
                  <option value="paid">Paid</option>
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
                  name="pay_method"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.pay_method}
                />
                {validation.touched.pay_method &&
                validation.errors.pay_method ? (
                  <p className="text-red-400">
                    {validation.errors.pay_method}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="paymentMethodInput"
                  className="inline-block mb-2 text-base font-medium"
                >
                  Order_id
                </label>
                <input
                  type="text"
                  id="paymentMethodInput"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Enter payment method"
                  name="order_id"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.order_id}
                />
                {validation.touched.order_id &&
                validation.errors.order_id ? (
                  <p className="text-red-400">
                    {validation.errors.order_id}
                  </p>
                ) : null}
              </div>



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
