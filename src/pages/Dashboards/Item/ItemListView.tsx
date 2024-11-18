// src/components/ItemListView.tsx
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

// React Router
import { useNavigate } from "react-router-dom";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TypeScript interfaces
interface Item {
  id: number;
  item: string;
}

const ItemListView = () => {
  // Dummy data state
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      item: "Tenant",
    },
    {
      id: 2,
      item: "Non Tenant",
    },
    // Tambahkan lebih banyak item sesuai kebutuhan
  ]);

  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Item | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== eventData.id));
      setFilteredItems((prevFiltered) => prevFiltered.filter((item) => item.id !== eventData.id));
      toast.success("Item berhasil dihapus!");
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((item: Item) => {
    setEventData({ ...item });
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
  const onClickDelete = useCallback((item: Item) => {
    setDeleteModal(true);
    setEventData(item);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredItems(
        items.filter((item) => item.item.toLowerCase().includes(search))
      );
    },
    [items]
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
        header: "Item",
        accessorKey: "item",
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
              className="flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit item for ${cell.row.original.item}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete item for ${cell.row.original.item}`}
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
    item: string;
  }

  const validation = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      item: isEdit && eventData ? eventData.item : "",
    },

    validationSchema: Yup.object({
      item: Yup.string()
        .min(3, "Item harus minimal 3 karakter")
        .required("Silakan masukkan item"),
    }),

    onSubmit: (values) => {
      if (isEdit && eventData) {
        // Update item
        const updatedItem: Item = {
          ...eventData,
          item: values.item,
        };
        setItems((prevItems) =>
          prevItems.map((itm) =>
            itm.id === updatedItem.id ? updatedItem : itm
          )
        );
        setFilteredItems((prevFiltered) =>
          prevFiltered.map((itm) =>
            itm.id === updatedItem.id ? updatedItem : itm
          )
        );
        toast.success("Item berhasil diperbarui!");
      } else {
        // Add new item
        const newItem: Item = {
          id: items.length
            ? Math.max(...items.map((c) => c.id)) + 1
            : 1,
          item: values.item,
        };
        setItems((prevItems) => [...prevItems, newItem]);
        setFilteredItems((prevFiltered) => [...prevFiltered, newItem]);
        toast.success("Item berhasil ditambahkan!");
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
      <BreadCrumb title="Manage Items" pageTitle="Items" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="itemsTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Items List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle">Add Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-6">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Search by item..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Items Table */}
            <div className="card-body">
              {filteredItems && filteredItems.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredItems || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5 overflow-x-auto"
                  tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap"
                  theadclassName="text-left bg-slate-100 dark:bg-zink-600"
                  thclassName="px-3.5 py-2.5 font-semibold"
                  tdclassName="px-3.5 py-2.5"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We've searched through all items but couldn't find any matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Item Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="itemModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit Item" : "Add Item"}
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
            {/* Item Field */}
            <div className="mb-3">
              <label
                htmlFor="itemInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Item
              </label>
              <input
                type="text"
                id="itemInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Masukkan item"
                name="item"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.item}
              />
              {validation.touched.item && validation.errors.item ? (
                <p className="text-red-400">{validation.errors.item}</p>
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
                {isEdit ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ItemListView;
