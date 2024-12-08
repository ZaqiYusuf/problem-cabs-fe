import React from "react";
import AuthIcon from "pages/AuthenticationInner/AuthIcon";
import { useDispatch, useSelector } from "react-redux";
// import { registerUser, resetRegisterFlag } from "slices/thunk";
import { createSelector } from 'reselect';
import { Facebook, Github, Mail, Twitter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik as useFormic } from "formik";

// Image
import logoLight from "assets/images/logo-light.png";
import logoDark from "assets/images/logo-dark.png";
import { RootState } from "slices";

import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import {postCustomer, getTenantAPI} from "helpers/backend_helper";



const Register = () => {

    document.title = "Register | Tailwick - React Admin & Dashboard Template";

    const dispatch = useDispatch<any>();
    const navigation = useNavigate(); // Use the useNavigate hook

    const selectRegister = createSelector(
        (state: RootState) => state.Register,
        (register) => ({
            success: register.success
        })
    )

    const { success } = useSelector(selectRegister)

    const validation = useFormic({
        enableReinitialize: true,
        initialValues: {
            user_id: "",
            name_customer: "",
            tenant_id: "",
            address: "",
            email: "",
            pic: "",
            pic_number: "",
            upload_file: null,
        },
        validationSchema: Yup.object({
            // user_id: Yup.string().required("User ID is required"),
            name_customer: Yup.string().required("Customer name is required"),
            tenant_id: Yup.string().required("Tenant ID is required"),
            address: Yup.string().required("Address is required"),
            email: Yup.string().email().required("Email is required"),
            pic: Yup.string().required("PIC is required"),
            pic_number: Yup.string().required("PIC Number is required"),
            upload_file: Yup.mixed().required("File upload is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    formData.append(key, value as Blob | string);
                });

                // const response = await postCustomer(formData);
                
                const response = await postCustomer(formData);
                console.log("Response:", response);
                alert("Customer registered successfully!");
                resetForm();
                navigation("/login"); // Redirect to login page
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to register customer.");
            }
        },
    });


    React.useEffect(() => {

        if (success) {
            navigation('/login')
        }

        setTimeout(() => {
            // dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, navigation]);

    

    React.useEffect(() => {
        const bodyElement = document.body;

        bodyElement.classList.add('flex', 'items-center', 'justify-center', 'min-h-screen', 'py-16', 'lg:py-10', 'bg-slate-50', 'dark:bg-zink-800', 'dark:text-zink-100', 'font-public');

        return () => {
            bodyElement.classList.remove('flex', 'items-center', 'justify-center', 'min-h-screen', 'py-16', 'lg:py-10', 'bg-slate-50', 'dark:bg-zink-800', 'dark:text-zink-100', 'font-public');
        }
    }, []);

    return (
        <React.Fragment>
            <div className="relative">

                <AuthIcon />

                <div className="mb-0 w-screen lg:w-[500px] card shadow-lg border-none shadow-slate-100 relative">
                    <div className="!px-10 !py-12 card-body">
                        <Link to="/">
                            <img src={logoLight} alt="" className="hidden h-6 mx-auto dark:block" />
                            <img src={logoDark} alt="" className="block h-6 mx-auto dark:hidden" />
                        </Link>

                        <div className="mt-8 text-center">
                            <h4 className="mb-1 text-custom-500 dark:text-custom-500">Create your free account</h4>
                            <p className="text-slate-500 dark:text-zink-200">Get your free Tailwick account now</p>
                        </div>

                        <form action="/" className="mt-10" id="registerForm"
                            onSubmit={(event: any) => {
                                event.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Input: Name Customer */}
                                <div className="mb-3">
                                    <label htmlFor="name_customer-field" className="inline-block mb-2 text-base font-medium">Customer Name</label>
                                    <input
                                        type="text"
                                        id="name_customer-field"
                                        name="name_customer"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter customer name"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.name_customer || ""} />
                                    {validation.touched.name_customer && validation.errors.name_customer ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.name_customer}</div>
                                    ) : null}
                                </div>

                                {/* Input: Tenant ID */}
                                <div className="mb-3">
                                    <label htmlFor="tenant_id-field" className="inline-block mb-2 text-base font-medium">Tenant</label>
                                    <input
                                        type="text"
                                        id="tenant_id-field"
                                        name="tenant_id"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter tenant ID"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.tenant_id || ""} />
                                    {validation.touched.tenant_id && validation.errors.tenant_id ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.tenant_id}</div>
                                    ) : null}
                                </div>

                                {/* Input: Address */}
                                <div className="mb-3">
                                    <label htmlFor="address-field" className="inline-block mb-2 text-base font-medium">Address</label>
                                    <input
                                        type="text"
                                        id="address-field"
                                        name="address"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter address"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.address || ""} />
                                    {validation.touched.address && validation.errors.address ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.address}</div>
                                    ) : null}
                                </div>

                                {/* Input: Email */}
                                <div className="mb-3">
                                    <label htmlFor="email-field" className="inline-block mb-2 text-base font-medium">Email</label>
                                    <input
                                        type="text"
                                        id="email-field"
                                        name="email"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter email"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.email || ""} />
                                    {validation.touched.email && validation.errors.email ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.email}</div>
                                    ) : null}
                                </div>

                                {/* Input: PIC */}
                                <div className="mb-3">
                                    <label htmlFor="pic-field" className="inline-block mb-2 text-base font-medium">PIC</label>
                                    <input
                                        type="text"
                                        id="pic-field"
                                        name="pic"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter PIC"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.pic || ""} />
                                    {validation.touched.pic && validation.errors.pic ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.pic}</div>
                                    ) : null}
                                </div>

                                {/* Input: PIC Number */}
                                <div className="mb-3">
                                    <label htmlFor="pic_number-field" className="inline-block mb-2 text-base font-medium">PIC Number</label>
                                    <input
                                        type="text"
                                        id="pic_number-field"
                                        name="pic_number"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        placeholder="Enter PIC number"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.pic_number || ""} />
                                    {validation.touched.pic_number && validation.errors.pic_number ? (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.pic_number}</div>
                                    ) : null}
                                </div>

                                {/* Input: File Upload */}
                                <div className="mb-3 col-span-2">
                                    <label htmlFor="upload_file" className="inline-block mb-2 text-base font-medium">Upload File</label>
                                    <input
                                        type="file"
                                        id="upload_file"
                                        name="upload_file"
                                        className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500"
                                        onChange={(event) => validation.setFieldValue("upload_file", event.target.files?.[0])} />
                                    {validation.touched.upload_file && validation.errors.upload_file && (
                                        <div className="mt-1 text-sm text-red-500">{validation.errors.upload_file}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10">
                                <button type="submit" className="w-full text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:bg-custom-600 hover:border-custom-600">Sign In</button>
                            </div>

                            <div className="mt-10 text-center">
                                <p className="mb-0 text-slate-500 dark:text-zink-200">Already have an account ? <Link to="/login" className="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500">Login</Link> </p>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
}

export default Register;