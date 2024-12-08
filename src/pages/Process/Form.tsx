import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BreadCrumb from "Common/BreadCrumb";
import { ArrowLeft } from "lucide-react";
import AddPermitted from "./AddPermitted";
import AddPersonnel from "./AddPersonnel";
import { postEntryPermits, updateEntryPermits, getTenantAPI, getCustomerAllApi } from "helpers/backend_helper";

interface Step {
  id: number;
  label: string;
}

const Stepper: React.FC<{ steps: Step[]; currentStep: number }> = ({
  steps,
  currentStep,
}) => (
  <div className="flex items-center justify-center w-full mb-6">
    {steps.map((step, index) => (
      <div key={step.id} className="flex flex-col items-center flex-1">
        <div className="flex items-center w-full">
          <div
            className={`flex-1 h-1 ${
              index === 0
                ? "bg-transparent"
                : currentStep > step.id
                ? "bg-blue-700"
                : "bg-gray-500"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= step.id
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {step.id}
          </div>
          <div
            className={`flex-1 h-1 ${
              index === steps.length - 1
                ? "bg-transparent"
                : currentStep > step.id
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          ></div>
        </div>
        <div className="mt-2 text-sm font-medium text-gray-700">{step.label}</div>
      </div>
    ))}
  </div>
);



interface Tenant {
  id: number;
  name_tenant: string;
  created_at: string;
  updated_at: string;
}



interface Customer {
  id: number;
  user_id: string;
  name_customer: string;
  tenant_id: string;
  address: string;
  email: string;
  pic: string;
  pic_number: string;
  upload_file: string;
  created_at: string; // Use `Date` if you're parsing it to a Date object
  updated_at: string; // Use `Date` if you're parsing it to a Date object
  tenants: Tenant | null; // Replace `Tenant` with the actual tenant interface if available
}



const EntryPermitForm: React.FC = () => {
  const steps: Step[] = [
    { id: 1, label: "Input Entry Permits" },
    { id: 2, label: "Add Permitted" },
    { id: 3, label: "Add Personnel" },
    { id: 4, label: "Complete" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const id = location.state?.id || "";
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);


  const [formData, setFormData] = useState({
    id: id,
    document_number: "",
    tenant_id: "",
    item: "",
    customer_id: "",
    registration_date: "",
    vehicles: [],
    personnels: [],
  });

  useEffect(() => {
    if (isEdit && location.state?.vehicle) {
      setFormData((prev) => ({
        ...prev,
        ...location.state.vehicle,
        vehicles: location.state.vehicle.vehicles || [],
        personnels: location.state.vehicle.personnels || [],
      }));
    }
  }, [isEdit, location.state?.vehicle]);


  const [tenant, setTenant] = useState<Tenant[]>([]); 
  const [customer, setCustomer] = useState<Customer[]>([]); 
  // const [filteredTenant, setFilteredTenant] = useState<Tenant[]>([]); // Menyimpan data tenant yang difilter
  

  
  

  const getDataTenant = async () => {
    try {
      const response: any = await getTenantAPI();
      if (response.success && response.tenants) {
        setTenant(response.tenants); // Simpan tenants ke state tenant
        // setFilteredTenant(response.tenants); // Jika ingin menyaring data nanti
      } else {
        console.error("Gagal mendapatkan data tenant:", response);
      }
    } catch (error) {
      console.error("Error saat memuat tenant:", error);
    }
  };

  const getCustomerAll = async () => {
    try {
      const response: any = await getCustomerAllApi();
      if (response.success && response.customers) {
        setCustomer(response.customers); // Simpan tenants ke state tenant
        // setFilteredTenant(response.tenants); // Jika ingin menyaring data nanti
      } else {
        console.error("Gagal mendapatkan data customers:", response);
      }
    } catch (error) {
      console.error("Error saat memuat customers:", error);
    }
  };



  useEffect(() => {
    getDataTenant();
    getCustomerAll();
  }, []);

  
  

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  

  const calculateTotalPrice = () => {
    const permittedPrice = 200000;
    const personnelsPrice = (formData.personnels?.length || 0) * 9500;
    setTotalPrice(permittedPrice + personnelsPrice);
  };
  
  const handleSubmit = async () => {
    try {
      // Validasi dasar
      if (!formData.document_number || !formData.tenant_id) {
        alert("Mohon lengkapi semua data yang diperlukan.");
        return;
      }
  
      const payload = {
        id: formData.id,
        document_number: formData.document_number,
        tenant_id: formData.tenant_id,
        item: formData.item,
        customer_id: formData.customer_id,
        registration_date: formData.registration_date,
        vehicles: formData.vehicles,
        personnels: formData.personnels,
      };
  
      let response;
      if (isEdit) {
        if (!formData.id) {
          console.error("ID tidak tersedia untuk proses update.");
          return;
        }
        response = await updateEntryPermits(payload);
        console.log("Data berhasil diperbarui:", response.data);
        alert("Entry Permits berhasil diperbarui!");
      } else {
        console.log("data payload: ", payload)
        response = await postEntryPermits(payload);
        console.log("Data berhasil dibuat:", response.data);
        alert("Entry Permits berhasil dibuat!");
      }
    } catch (error: any) {
      console.error("Error saat mengirim data:", error  );
      alert(
        isEdit
          ? "Gagal memperbarui Entry Permits. Silakan coba lagi."
          : "Gagal membuat Entry Permits. Silakan coba lagi."
      );
    }
  };
  
  

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.personnels]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6 border rounded-md bg-white shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-6">Input Entry Permits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">Document Number</label>
                <input
                  type="text"
                  placeholder="Document Number"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) =>
                    handleInputChange("document_number", e.target.value)
                  }
                  value={formData.document_number || ""}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Tenant</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleInputChange("tenant_id", e.target.value)}
                  value={formData.tenant_id || ""}
                >
                  <option value="">Select Tenant</option>
                  {tenant.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name_tenant}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Status</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleInputChange("item", e.target.value)}
                  value={formData.item || ""}
                >
                  <option value="">Select Status</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Non Tenant">Non Tenant</option>
                </select>
              </div>


              <div>
                <label className="block mb-2 text-gray-700">Customer</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => handleInputChange("customer_id", e.target.value)}
                  value={formData.customer_id || ""}
                >
                  <option value="">Select Customer</option>
                  {customer.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name_customer}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) =>
                    handleInputChange("registration_date", e.target.value)
                  }
                  value={formData.registration_date || ""}
                />
              </div>

              
            </div>
          </div>
        );
      case 2:
        return <AddPermitted formData={formData} setFormData={setFormData} />;
      case 3:
        return <AddPersonnel formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <div className="p-6 border rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-xl font-semibold mb-6">Summary</h2>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
              <h3 className="font-semibold text-lg mb-2">Entry Permit Details</h3>
              <table className="min-w-full bg-white">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Document Number:</td>
                    <td className="px-4 py-2">{formData.document_number}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Customer:</td>
                    <td className="px-4 py-2">{formData.customer_id}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Tenant:</td>
                    <td className="px-4 py-2">{formData.tenant_id}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Status:</td>
                    <td className="px-4 py-2">{formData.item}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Total Price</h3>
              <p className="text-lg font-medium">{`Rp ${totalPrice.toLocaleString()}`}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  

  return (
    <div>
      <div className="flex items-center mb-6">
        <ArrowLeft className="mr-2 cursor-pointer" onClick={handleBack} />
        <BreadCrumb title= {isEdit ? "Edit Entry permit" : "Add Entry permit"}pageTitle="Process Management" />
      </div>
      <Stepper steps={steps} currentStep={currentStep} />
      {renderStepContent()}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
        )}
        {currentStep < steps.length ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default EntryPermitForm;


