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
import { deleteLocationAPI, getLocationAPI, postLocationAPI, updateLocationAPI } from "helpers/backend_helper";
import { get } from "http";

// TypeScript interfaces
interface Location {
  id: number;
  location: string;
}

const LocationsListView = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);

  const getLocations = async () => {
    await getLocationAPI().then((response: any) => {
      setLocations(response.locations);
      setFilteredLocations(response.locations);
    });
  };
  const postLocations = async (data: any) => {
    await postLocationAPI(data).then(() => {
      getLocations();
    });
  };
  const updateLocations = async (data: any) => {
    await updateLocationAPI(data).then(() => {
      getLocations();
    });
  };
  const deleteLocations = async (data: any) => {
    await deleteLocationAPI(data.id).then(() => {
      getLocations();
    });
  };

  useEffect(() => {
    getLocations();
  }, []);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Location | undefined>(undefined);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  const handleDelete = useCallback(() => {
    if (eventData) {
      deleteLocations(eventData);
      setDeleteModal(false);
    }
  }, [eventData]);

  const handleUpdateDataClick = useCallback((loc: Location) => {
    setEventData({ ...loc });
    setIsEdit(true);
    setShow(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEventData(undefined);
    setIsEdit(false);
    setShow(true);
  }, []);

  const onClickDelete = useCallback((loc: Location) => {
    setDeleteModal(true);
    setEventData(loc);
  }, []);

  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredLocations(
        locations.filter((loc) => loc.location.toLowerCase().includes(search))
      );
    },
    [locations]
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
        header: "Location",
        accessorKey: "location",
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
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200"
              onClick={() => handleUpdateDataClick(cell.row.original)}
            >
              <FileEdit className="mr-1 size-4" /> Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200"
              onClick={() => onClickDelete(cell.row.original)}
            >
              <Trash2 className="mr-1 size-4" /> Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, locations]
  );

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: { location: isEdit && eventData ? eventData.location : "" },
    validationSchema: Yup.object({
      location: Yup.string()
        .min(3, "Location must be at least 3 characters")
        .required("Please enter a location"),
    }),
    onSubmit: async(values) => {
      if (isEdit && eventData) {
        const updatedLocation: Location = {
          ...eventData,
          id: eventData.id,
          location: values.location,
        };
        await updateLocations(updatedLocation);
      } else {
        const newLocation: Location = {
          id: locations.length
            ? Math.max(...locations.map((l) => l.id)) + 1
            : 1,
          location: values.location,
        };
        await postLocations(newLocation);
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
      validation.resetForm();
    }
  }, [show, validation]);

  return (
    <React.Fragment>
      <BreadCrumb title="Locations" pageTitle="Data Master" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="flex justify-center mt-20">
        <div className="w-full max-w-4xl xl:max-w-3xl">
          <div className="card" id="locationsTable">
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Locations List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">
                      Add Location
                    </span>
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
                      placeholder="Search by location..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                </div>
              </form>
            </div>

            <div className="card-body">
              {filteredLocations && filteredLocations.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredLocations}
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
                      We've searched through all locations but couldn't find any
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
        id="locationModal"
        modal-center="true"
        className="fixed inset-0 z-drawer flex items-center justify-center"
        dialogClassName="w-[90%] md:w-[40rem] max-w-full h-auto bg-white shadow-lg rounded-md relative"
      >
        <Modal.Header className="p-4 border-b flex items-center justify-between">
          <Modal.Title>{isEdit ? "Edit Location" : "Add Location"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <div className="mb-6">
              <label htmlFor="locationInput" className="block mb-3 font-medium">
                Location
              </label>
              <input
                type="text"
                id="locationInput"
                className="form-input w-full border-slate-200 rounded-md focus:outline-none focus:border-custom-500 px-3 py-2"
                placeholder="Enter location"
                name="location"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.location}
                aria-label="Location input"
              />
              {validation.touched.location && validation.errors.location && (
                <p className="text-red-400 mt-1 text-sm">
                  {validation.errors.location}
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

export default LocationsListView;
