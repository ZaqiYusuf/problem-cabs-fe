import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import filterDataBySearch from "Common/filterDataBySearch";
import { VehicleData } from "Common/data/dashboard";
import Modal from "./Modal";

const Table = () => {
  const [data, setData] = useState(VehicleData);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Search Data
  const filterSearchData = (e: any) => {
    const search = e.target.value;
    const keysToSearch = ["numberStiker"];
    filterDataBySearch(VehicleData, search, keysToSearch, setData);
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
        header: "Plate Number",
        accessorKey: "platNumber",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => <div className="text-left">{info.getValue()}</div>,
      },
      {
        header: "No. Lambung",
        accessorKey: "noLambung",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (info) => <div className="text-left">{info.getValue()}</div>,
      },
      {
        accessorKey: "No. Stiker",
        header: "numberStiker",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => (
          <div className="text-start">{cell.row.index + 1}</div>
        ),
      },
      {
        header: "STNK",
        accessorKey: "image",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => (
          <div className="text-left">
            <img
              src={cell.row.original.image}
              alt=""
              className="h-10 rounded-full cursor-pointer"
              onClick={() => {
                setSelectedImage(cell.row.original.image);
                setModalOpen(true);
              }}
            />
          </div>
        ),
      },
      {
        header: "Action",
        accessorKey: "action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => (
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

  const handleEdit = (vehicle:  any) => {
    console.log("Edit vehicle: ", vehicle);
  };

  const handleDelete = (vehicle:  any) => {
    console.log("Delete vehicle: ", vehicle);
  };

  return (
    <React.Fragment>
      <div className="order-11 col-span-12 2xl:order-1 card 2xl:col-span-12">
        <div className="card-body">
          <div className="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <h6 className="text-15">Vehicle List</h6>
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
                Add Driver
              </button>
            </div>
          </div>

          {/* Table Implementation */}
          <table className="min-w-full divide-y divide-slate-200 dark:divide-zink-500">
            <thead className="bg-slate-100 text-slate-500 dark:bg-zink-600 dark:text-zink-200">
              <tr>
                <th className="px-4 py-2 text-start font-semibold">No</th>
                <th className="px-4 py-2 text-left font-semibold">Plate Number</th>
                <th className="px-4 py-2 text-left font-semibold">STNK</th>
                <th className="px-4 py-2 text-left font-semibold">No. Lambung</th>
                <th className="px-4 py-2 text-left font-semibold">No. Stiker</th>
                <th className="px-4 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 dark:bg-zink-700 dark:divide-zink-500">
              {data.map((vehicle, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-start">{index + 1}</td>
                  <td className="px-4 py-2">{vehicle.plateNumber}</td>
                  <td className="px-4 py-2">
                    <img
                      src={vehicle.image}
                      alt=""
                      className="h-10 rounded-full cursor-pointer"
                      onClick={() => {
                        setSelectedImage(vehicle.image);
                        setModalOpen(true);
                      }}
                    />
                  </td>
                  <td className="px-4 py-2">{vehicle.noLambung}</td>
                  <td className="px-4 py-2">{vehicle.numberStiker}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 px-3 py-1 rounded"
                        onClick={() => handleEdit(vehicle)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 px-3 py-1 rounded"
                        onClick={() => handleDelete(vehicle)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for Image */}
          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} imageUrl={selectedImage} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Table;
