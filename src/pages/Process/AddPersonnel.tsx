import React, { useState } from "react";

const AddPersonnel = () => {
  const [personnels, setPersonnels] = useState([
    {
      id: 1,
      name: "",
      noktp_sim: "",
      location: "",
      periode: "",
      // cost: "",
    },
  ]);

  const addPersonnel = () => {
    setPersonnels([
      ...personnels,
      {
        id: personnels.length + 1,
        name: "",
        noktp_sim: "",
        location: "",
        periode: "",
        // cost: "",
      },
    ]);
  };

  const removePersonnel = (id: number) => {
    setPersonnels(personnels.filter((personnel) => personnel.id !== id));
  };

  return (
    <React.Fragment>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Personnel</h2>
          <button
            className="mr-5"
            onClick={addPersonnel}
          >
            <i className="fi fi-sr-add text-[32px]"></i>
          </button>
        </div>
        {personnels.length > 0 &&
          personnels.map((personnel) => (
            <div
              key={personnel.id}
              className="grid grid-cols-1 bg-white sm:grid-cols-5 gap-4 mb-4 p-4 border rounded-md shadow-sm"
            >
              <div>
                <label htmlFor={`name-${personnel.id}`} className="block text-gray-700 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  id={`name-${personnel.id}`}
                  placeholder="Enter Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`noktp-sim-${personnel.id}`} className="block text-gray-700 mb-3">
                  No KTP/SIM
                </label>
                <input
                  type="text"
                  id={`noktp-sim-${personnel.id}`}
                  placeholder="Enter No KTP/SIM"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`location-${personnel.id}`} className="block text-gray-700 mb-3">
                  Location
                </label>
                <select
                  id={`location-${personnel.id}`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Location
                  </option>
                  <option value="Location1">Location 1</option>
                  <option value="Location2">Location 2</option>
                  <option value="Location3">Location 3</option>
                </select>
              </div>
              <div>
                <label htmlFor={`periode-${personnel.id}`} className="block text-gray-700 mb-3">
                  Package
                </label>
                <select
                  id={`periode-${personnel.id}`}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Package
                  </option>
                  <option value="package1">6 Bulan</option>
                  {/* <option value="package2">Accidental</option> */}
                </select>
              </div>
              {/* <div>
                <label htmlFor={`cost-${personnel.id}`} className="block text-gray-700">
                  Cost
                </label>
                <input
                  type="number"
                  id={`cost-${personnel.id}`}
                  placeholder="Enter Cost"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
              <div className="flex items-center justify-end">
              <button
                  // className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={() => removePersonnel(personnel.id)}
                >
                  <i className="fi fi-ss-trash-xmark text-[32px]"></i>
                </button>
              </div>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default AddPersonnel;
