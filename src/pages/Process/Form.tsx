// src/App.tsx

import BreadCrumb from "Common/BreadCrumb";
import { ArrowLeft } from "lucide-react";
import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPermitted from "./AddPermitted";
import AddPersonnel from "./AddPersonnel";

// Define the type for a step
interface Step {
  id: number;
  label: string;
}

// Props for the Stepper component
interface StepperProps {
  steps: Step[];
  currentStep: number;
}

// Stepper Component
const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full mb-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            <div
              className={`flex-1 h-1 ${
                index === 0
                  ? "bg-transparent"
                  : currentStep > step.id
                  ? "bg-blue-500"
                  : currentStep - 1 === index
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors duration-300 ${
                currentStep > step.id
                  ? "bg-blue-500 text-white"
                  : currentStep === step.id
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

          <div className="mt-2 text-center text-sm font-medium text-gray-700">
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Main App Component
const Form: React.FC = () => {
  const steps: Step[] = [
    { id: 1, label: "Input Entry Permits" },
    { id: 2, label: "Add Permitted" },
    { id: 3, label: "Add Personnel" },
    { id: 4, label: "Complete" },
  ];

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [status, setStatus] = useState<string>(""); // State for Tenant/Non Tenant selection
  const [totalPrice, setTotalPrice] = useState<number>(0); // State for total price

  // Update total price (This is just a placeholder for calculations)
  const calculateTotalPrice = () => {
    const permittedPrice = 200000; // Example price for permitted items
    const personnelPrice = 9500; // Example price for personnel items
    const price = permittedPrice + personnelPrice;
    setTotalPrice(price);
  };

  // Recalculate total price when currentStep or other dependencies change
  useEffect(() => {
    calculateTotalPrice();
  }, [currentStep]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
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
          <div className="p-6 border rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-xl font-semibold mb-6">
              Input Entry Permits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="document-number"
                  className="block text-gray-700 mb-3"
                >
                  Document Number
                </label>
                <input
                  type="text"
                  id="document-number"
                  placeholder="Document Number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="customer" className="block text-gray-700 mb-3">
                  Tenant
                </label>
                <select
                  // value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Tenant
                  </option>
                  <option value="PKT">PKT</option>
                  <option value="KMI">KMI</option>
                  <option value="KNI">KNI</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Package
                  </option>
                  <option value="Tenant">Tenant</option>
                  <option value="Non Tenant">Non Tenant</option>
                </select>
              </div>
              <div>
                <label htmlFor="tenant" className="block text-gray-700 mb-3">
                  Customer
                </label>
                <input
                  type="text"
                  id="tenant"
                  placeholder="Customer"
                  disabled={status === "Tenant"}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return <AddPermitted />;
      case 3:
        return <AddPersonnel />;
      case 4:
        return (
          <div className="p-6 border rounded-md shadow-sm bg-white mb-6">
            <h2 className="text-xl font-semibold mb-6">Summary</h2>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
              <h3 className="font-semibold text-lg mb-2">
                Entry Permit Details
              </h3>
              <table className="min-w-full bg-white">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">
                      Document Number:
                    </td>
                    <td className="px-4 py-2">153/ICP-PKT/v/2024</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Customer:</td>
                    <td className="px-4 py-2">PT Angkasa Pura</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Location:</td>
                    <td className="px-4 py-2">Tj Harapan</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-semibold">Tenant:</td>
                    <td className="px-4 py-2">PKT</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Status:</td>
                    <td className="px-4 py-2">Non Tenant</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm mb-4">
              <h3 className="font-semibold text-lg mb-2">Permitted Items</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Package
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Cargo
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Origin
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Vehicle
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Driver
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">Package 1</td>
                    <td className="px-4 py-2">Cargo 1</td>
                    <td className="px-4 py-2">Origin 1</td>
                    <td className="px-4 py-2">Vehicle A</td>
                    <td className="px-4 py-2">Driver A</td>
                    <td className="px-4 py-2">Rp. 100.000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Package 2</td>
                    <td className="px-4 py-2">Cargo 2</td>
                    <td className="px-4 py-2">Origin 2</td>
                    <td className="px-4 py-2">Vehicle B</td>
                    <td className="px-4 py-2">Driver B</td>
                    <td className="px-4 py-2">Rp. 100.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Personnel Details</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Name
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      No KTP/SIM
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Location
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Package
                    </th>
                    <th className="px-4 py-2 border-b font-semibold text-left">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">John Doe</td>
                    <td className="px-4 py-2">1234567890</td>
                    <td className="px-4 py-2">Location 1</td>
                    <td className="px-4 py-2">2023-2024</td>
                    <td className="px-4 py-2">Rp. 5000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Jane Smith</td>
                    <td className="px-4 py-2">0987654321</td>
                    <td className="px-4 py-2">Location 2</td>
                    <td className="px-4 py-2">2023-2024</td>
                    <td className="px-4 py-2">Rp. 4500</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Price Display */}
            <div className="flex justify-end mt-4">
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Total Price</h3>
                <p className="text-xl font-bold text-gray-800">
                  Rp. {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
        <BreadCrumb title="Add Entry Permits" pageTitle="Process Management" />
        <div className="card shadow-none bg-transparent">
          <div className="flex items-center space-x-4 mb-4">
            <button
              type="button"
              className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleBack}
              aria-label="Back to previous page"
            >
              <ArrowLeft className="mr-1 size-4" />
              Back
            </button>
          </div>
          <div className="mx-auto">
            <div className="bg-gray-50 rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Entry Permit Registration Form
              </h1>

              {/* Stepper Component */}
              <Stepper steps={steps} currentStep={currentStep} />

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    currentStep === 1
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length}
                  className="px-4 py-2 rounded-md font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Form;
