import TableContainer from "Common/TableContainer";
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import filterDataBySearch from "Common/filterDataBySearch";
import { LocationData } from "Common/data/dashboard";

const Table = () => {
  const [data, setData] = useState(LocationData);

  // Search Data
  const filterSearchData = (e: any) => {
    const search = e.target.value;
    const keysToSearch = ["name"];
    filterDataBySearch(LocationData, search, keysToSearch, setData);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "No",
        header: "No",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="text-start">{cell.row.index + 1}</div>
        ),
      },
      {
        header: "Location",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info: any) => <div className="text-left">{info.getValue()}</div>,
      },
      {
        header: "Action",
        accessorKey: "action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="flex justify-start gap-2">
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 px-3 py-1 rounded"
              onClick={() => handleEdit(cell.row.original)}
            >
              Edit
            </button>
            <button
              className="text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 px-3 py-1 rounded"
              onClick={() => handleDelete(cell.row.original)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleEdit = (location: any) => {
    console.log("Edit location: ", location);
  };

  const handleDelete = (location: any) => {
    console.log("Delete location: ", location);
  };

  return (
    <React.Fragment>
      <div className="order-11 col-span-12 2xl:order-1 card 2xl:col-span-12">
        <div className="card-body">
          <div className="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <h6 className="text-15">Location List</h6>
            </div>
            <div className="xl:col-span-9 flex justify-end items-center">
              <div className="relative w-1/2 max-w-xs">
                <input
                  type="text"
                  className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Search"
                  autoComplete="off"
                  onChange={(e) => filterSearchData(e)}
                />
                <Search className="absolute size-4 ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
              </div>
              <button
                type="button"
                className="bg-custom-500 text-white btn hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-700 px-4 py-2 rounded-lg ml-4"
              >
                <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-add-line"></i>
                Add Location
              </button>
            </div>
          </div>

          <TableContainer
            isPagination={true}
            columns={columns || []}
            data={data || []}
            customPageSize={10}
            divclassName="-mx-5 overflow-x-auto"
            tableclassName="w-full whitespace-nowrap"
            theadclassName="bg-slate-100 text-slate-500 dark:text-zink-200 dark:bg-zink-600"
            thclassName="px-4 py-2 font-semibold border-y border-slate-200 dark:border-zink-500 text-start"
            tdclassName="px-4 py-2 border-y border-slate-200 dark:border-zink-500 text-center"
            PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Table;