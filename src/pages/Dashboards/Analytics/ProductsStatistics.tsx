import TableContainer from "Common/TableContainer";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsStatisticsData } from "Common/data";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import filterDataBySearch from "Common/filterDataBySearch";

import { getPayments } from "helpers/backend_helper";


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

const ProductsStatistics = () => {
  // const [data, setData] = useState(ProductsStatisticsData);
  const [processes, setProcesses] = useState<FormValues[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<FormValues[]>([]);



  const getCustomer = async () => {
    try {
      const response: any = await getPayments();
      console.log("Respons dari API:", response.payment);
  
      if (Array.isArray(response.payment)) {
        // Map data dari API ke dalam format yang diinginkan
        const mappedProcess = response.payment.map((item: any) => ({
        id: item.id,
          user_id: item.user_id,
          id_customer: item.id_customer,
          id_imk: item.id_imk,
          pay_method: item.pay_method,
          pay_date: item.pay_date,
          amount_pay: item.amount_pay,
          status_pay: item.status_pay,
          name_pay: item.name_pay,
          order_id: item.order_id,
          note_pay: item.note_pay,
          customer_name: item.customer?.name_customer || "Unknown Customer",
          email: item.customer?.email || "Unknown Email",
          tenant_id: item.customer?.tenant_id || "Unknown Tenant",
          user_email: item.user?.email || "Unknown User Email",
          redirect_url: item.redirect_url || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
  
        console.log("Data yang sudah dipetakan:", mappedProcess);
        setProcesses(mappedProcess);
        setFilteredProcesses(mappedProcess);
      } else {
        console.error("Respons bukan array:", response);
        setProcesses([]);
        setFilteredProcesses([]);
      }
    } catch (error) {
      console.error("Error saat memuat data:", error);
      setProcesses([]);
      setFilteredProcesses([]);
    }
  };
  
  // Memuat data pertama kali
  useEffect(() => {
    getCustomer();
  }, []);

  // Fungsi untuk filter data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredProcesses(
        processes.filter(
          (proc) =>
            proc.name_pay.toLowerCase().includes(search) ||
            proc.status_pay.toLowerCase().includes(search) ||
            proc.pay_method.toLowerCase().includes(search)
        )
      );
    },
    [processes]
  );



const columns = useMemo(
  () => [
    {
      header: () => (
        <div className="flex items-center h-full">
          <input
            id="productsCheck1"
            className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
            type="checkbox"
          />
        </div>
      ),
      accessorKey: "id",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cell: any) => (
        <>
          <div className="flex items-center h-full">
            <input
              id="productsCheck1"
              className="size-4 cursor-pointer bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800"
              type="checkbox"
            />
          </div>
        </>
      ),
    },
    {
      header: "IMK ID",
      accessorKey: "id_imk",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Customer Name",
      accessorKey: "customer_name",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "User Email",
      accessorKey: "user_email",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Payment Method",
      accessorKey: "pay_method",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Payment Date",
      accessorKey: "pay_date",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Amount Paid",
      accessorKey: "amount_pay",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Payment Status",
      accessorKey: "status_pay",
      enableColumnFilter: false,
      enableSorting: true,
      cell: (cell: any) => {
        const status = cell.row.original.status_pay;
        return (
          <>
            {status === "paid" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-green-500 border-transparent text-green-50 dark:bg-green-500/20 dark:border-transparent">
                <CheckCircle2 className="size-3 ltr:mr-1 rtl:ml-1" />
                Paid
              </span>
            ) : status === "pending" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-yellow-500 border-transparent text-yellow-50 dark:bg-yellow-500/20 dark:border-transparent">
                <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                Pending
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded border bg-red-500 border-transparent text-red-50 dark:bg-red-500/20 dark:border-transparent">
                <XCircle className="size-3 ltr:mr-1 rtl:ml-1" />
                Expired
              </span>
            )}
          </>
        );
      },
    },
    {
      header: "Order ID",
      accessorKey: "order_id",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      enableColumnFilter: false,
      enableSorting: true,
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      enableColumnFilter: false,
      enableSorting: true,
    },
  ],
  []
);




  return (
    <React.Fragment>
      <div className="order-11 col-span-12 2xl:order-1 card 2xl:col-span-12">
        <div className="card-body">
          <div className="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <h6 className="text-[28px]">Recap Entry Permits KIE</h6>
            </div>
            <div className="xl:col-span-3 xl:col-start-10">
              <div className="flex gap-3">
                <div className="relative grow">
                  <input
                    type="text"
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Search for ..."
                    autoComplete="off"
                    onChange={(e) => filterSearchData(e)}
                  />
                  <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600"></Search>
                </div>
                <button
                  type="button"
                  className="bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                >
                  <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-download-2-line"></i>{" "}
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {filteredProcesses && filteredProcesses.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredProcesses || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5 overflow-x-auto"
                  tableclassName="w-full whitespace-nowrap"
                  theadclassName="text-left bg-slate-100 dark:bg-zink-600"
                  thclassName="px-6 py-2.5 font-semibold"
                  tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">
                      Maaf! Tidak Ada Hasil yang Ditemukan
                    </h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      Kami telah mencari melalui semua proses tetapi tidak dapat
                      menemukan catatan yang cocok.
                    </p>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductsStatistics;
