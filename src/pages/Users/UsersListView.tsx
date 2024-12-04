import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { get } from "http";
import { deleteUserAPI, getUserAPI, postUserAPI, updateUserAPI } from "helpers/backend_helper";

// TypeScript interfaces
interface User {
  id: number;
  // id_customer: string | null;
  email: string;
  level: string;
  block: string;
  password: string;
}

const UsersListView = () => {
  // Dummy data state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const getUsers = async () => {
    await getUserAPI().then((response:any) => {
      // console.log(response);
      setUsers(response.users);
      setFilteredUsers(response.users);
    });
  };

  const postUsers = async (data: any) => {
    await postUserAPI(data).then(() => {
      getUsers();
    });
  };

  const updateUsers = async (data: any) => {
    await updateUserAPI(data).then(() => {
      getUsers();
    });
  }

  const deleteUsers = async (data:any) => {
    await deleteUserAPI(data.id).then(() => {
      getUsers();
    });
  }

  useEffect(() => {
    getUsers();
  },[]);

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [eventData, setEventData] = useState<User | undefined>(undefined);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = useCallback(() => setDeleteModal((prev) => !prev), []);

  // Handle Delete
  const handleDelete = useCallback(() => {
    if (eventData) {
      deleteUsers(eventData);
      setDeleteModal(false);
    }
  }, [eventData]);

  // Handle Update
  const handleUpdateDataClick = useCallback((user: User) => {
    setEventData({ ...user });
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
  const onClickDelete = useCallback((user: User) => {
    setDeleteModal(true);
    setEventData(user);
  }, []);

  // Search Data
  const filterSearchData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const search = e.target.value.toLowerCase();
      setFilteredUsers(
        users.filter((user) => user.email.toLowerCase().includes(search))
      );
    },
    [users]
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
      //   header: "Customer",
      //   accessorKey: "id_customer",
      //   enableColumnFilter: false,
      //   cell: (cell: any) => (
      //     <div className="px-3.5 py-2.5">{cell.getValue() || "N/A"}</div>
      //   ),
      // },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Level",
        accessorKey: "level",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="px-3.5 py-2.5">{cell.getValue()}</div>
        ),
      },
      {
        header: "Block",
        accessorKey: "block",
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
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-[#016FAE] rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => handleUpdateDataClick(cell.row.original)}
              aria-label={`Edit user for ${cell.row.original.email}`}
            >
              <FileEdit className="mr-1 size-4" />
              Edit
            </button>
            <button
              className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => onClickDelete(cell.row.original)}
              aria-label={`Delete user for ${cell.row.original.email}`}
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateDataClick, onClickDelete, users]
  );


  const validation = useFormik({
    enableReinitialize: true,
  
    initialValues: {
      email: isEdit && eventData?.email ? eventData.email : "",
      level: isEdit && eventData?.level ? eventData.level : "user",
      block: isEdit && eventData?.block ? eventData.block : "NO",
      password: isEdit && eventData?.password ? eventData.password : "",
    },
  
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter an email"),
      level: Yup.string()
        .oneOf([
          "administrator",
          "admin",
          "approver",
          "finance",
          "mitra",
          "user",
        ])
        .required("Please select a level"),
      block: Yup.string()
        .oneOf(["YES", "NO"])
        .required("Please select block status"),
    }),
  
    onSubmit: async (values) => {
      if (isEdit && eventData) {
        const updatedUser: User = {
          ...eventData,
          email: values.email,
          level: values.level,
          block: values.block,
          password: values.password,
        };
        await updateUsers(updatedUser);
      } else {
        const newUser: User = {
          id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
          email: values.email,
          level: values.level,
          block: values.block,
          password: values.password,
        };
        await postUsers(newUser);
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
      <BreadCrumb title="Users" pageTitle="Users" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <ToastContainer closeButton={false} limit={1} />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="usersTable">
            {/* Card Header */}
            <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-[28px] grow">Users List</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-[#064777] border-custom-500 hover:bg-custom-600 focus:bg-custom-600 active:bg-custom-600"
                    onClick={handleAdd}
                  >
                    <Plus className="inline-block size-4 mr-1" />
                    <span className="align-middle text-[16px]">Add User</span>
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
                      placeholder="Search by email..."
                      autoComplete="off"
                      onChange={filterSearchData}
                    />
                    <Search className="inline-block size-4 absolute left-2.5 top-2.5 text-slate-500 dark:text-zink-200" />
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              </form>
            </div>

            {/* Users Table */}
            <div className="card-body">
              {filteredUsers && filteredUsers.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={filteredUsers || []}
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
                      We've searched through all users but couldn't find any
                      matching records.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <Modal
        show={show}
        onHide={toggle}
        id="userModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[60rem] lg:w-[70rem] max-h-[100vh] bg-white shadow-lg rounded-lg dark:bg-zink-600 overflow-y-auto"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {isEdit ? "Edit User" : "Add User"}
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
            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="emailInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="emailInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter email"
                name="email"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.email}
              />
              {validation.touched.email && validation.errors.email ? (
                <p className="text-red-400">{validation.errors.email}</p>
              ) : null}
            </div>

            {/* Level Field */}
            <div className="mb-3">
              <label
                htmlFor="levelInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Level
              </label>
              <select
                id="levelInput"
                name="level"
                className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.level}
              >
                <option value="user">User</option>
                <option value="administrator">Administrator</option>
                <option value="admin">Admin</option>
                <option value="approver">Approver</option>
                <option value="finance">Finance</option>
                <option value="mitra">Mitra</option>
              </select>
              {validation.touched.level && validation.errors.level ? (
                <p className="text-red-400">{validation.errors.level}</p>
              ) : null}
            </div>

            {/* Block Field */}
            <div className="mb-3">
              <label
                htmlFor="blockInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Block
              </label>
              <select
                id="blockInput"
                name="block"
                className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.block}
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
              {validation.touched.block && validation.errors.block ? (
                <p className="text-red-400">{validation.errors.block}</p>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label
                htmlFor="passwordInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="passwordInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Enter password"
                name="password"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.password}
              />
              {validation.touched.password && validation.errors.password ? (
                <p className="text-red-400">{validation.errors.password}</p>
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

export default UsersListView;
