import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DollarSign, FileInput, ListFilter, Users, X } from "lucide-react";
import CountUp from "react-countup";
import { Dropdown } from "Common/Components/Dropdown";
import { PerspectiveChart } from "./Charts";
import { Link } from "react-router-dom";
import { 
          deleteUserAPI,
          getUserAPI, 
          postUserAPI, 
          getPayments,          
          getCustomerApi,
          getEntryPermits
} from "helpers/backend_helper";


const Widgets = () => {

  interface User {
    // id: number;
    // email: string;
    // level: string;
    // block: string;
    // password: string;
  }

  interface Costumers {
    // id: number;
    // user_id: number;
    // name_costumers: string;
    // address: string;
    // email: string;
    // pic: string;
    // pic_number: string;
    // upload_file: any;
  }
  // interface Entry {
  //   id: number;
  //   user_id: number;
  //   name_costumers: string;
  //   address: string;
  //   email: string;
  //   pic: string;
  //   pic_number: string;
  //   upload_file: any;
  // }

  const [users, setUsers] = useState<User[]>([]);
  const [costumers, setCostumers] = useState<Costumers[]>([]);
  const [entry, setEntry] = useState<number>(0); // State untuk "entry_active"
  const [overdue, setOverdue] = useState<number>(0); // State untuk "overdue"
  const [paid, setPaid] = useState<number>(0); // State untuk "entry_active"
  const [pending, setPending] = useState<number>(0); // State untuk "overdue"



  const getImk = async () => {
    try {
      const response = await getPayments(); // Panggil API
      const data: any = response;
      console.log(data, 'imk');
      setPaid(data.paid_payment); // Set state untuk "entry_active"
      setPending(data.pending_payment); // Set state untuk "entry_active"
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  


  const getEntry = async () => {
    try {
      const response = await getEntryPermits(); // Panggil API
      const data: any = response;
      setEntry(data.entry_active); // Set state untuk "entry_active"
      setOverdue(data.overdue); // Set state untuk "overdue"
    } catch (error) {
      console.error("Error fetching entry permits:", error);
    }
  };


  const getUsers = async () => {
    await getUserAPI().then((response:any) => {
      setUsers(response.users);
      // setFilteredUsers(response.users);
    });
  };

  const getCostumers = async () => {
    await getCustomerApi().then((response:any) => {
      setCostumers(response.processImks);
    });
  }




  useEffect(() => {
    getUsers();
    getCostumers();
    getEntry();
    getImk();
  }, []); // Fetch data on component mount


  return (
    <React.Fragment>
      <div className="order-1 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-blue-500 dark:bg-blue-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-green-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-blue-300/50 dark:text-blue-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 bg-blue-700 rounded-md text-15 text-blue-50">
            <i className="fi fi-sr-user text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp
              end={users.length || 0} // Dynamically display the number of users
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Users</p>
        </div>
      </div>
      <div className="order-4 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-blue-500 dark:bg-blue-700/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-purple-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-blue-300/50 dark:text-blue-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 bg-blue-700 rounded-md text-15 text-blue-50">
            <i className="fi fi-sr-users text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp
              end={costumers.length || 0} // Display filtered customer count
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Customer</p>
        </div>
      </div>
      <div className="order-2 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-orange-500 dark:bg-orange-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-orange-500/20 relative overflow-hidden">
      <div className="card-body">
        <ListFilter className="absolute top-0 size-32 stroke-1 text-orange-300/50 dark:text-orange-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
        <div className="flex items-center justify-center size-14 bg-orange-700 rounded-md text-15 text-orange-50">
          <i className="fi fi-ss-document text-[32px] mt-2"></i>
        </div>
        <h5 className="mt-5 mb-2">
          <CountUp end={entry || 0} className="counter-value text-[24px] text-white" />
        </h5>
        <p className="text-white dark:text-slate-200 text-[18px]">
          Entry Permits <br /> (Active)
        </p>
      </div>
    </div>

      {/* Overdue Widget */}
      <div className="order-2 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-red-500 dark:bg-red-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-orange-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-red-300/100 dark:text-red-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 bg-red-700 rounded-md text-15 text-red-50">
            <i className="fi fi-sr-calendar-xmark text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp end={overdue || 0} className="counter-value text-[24px] text-white" />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Overdue <br /> (This Month)</p>
        </div>
      </div>
      <div className="order-3 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-green-500 dark:bg-purple-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-sky-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-green-300/50 dark:text-purple-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 rounded-md bg-green-700 text-15 text-purple-50">
            <i className="fi fi-sr-hand-holding-usd text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp
              end={paid || 0} // Static count for Paid users
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Payment Paid</p>
        </div>
      </div>
      <div className="order-4 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-yellow-500 dark:bg-purple-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-purple-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-yellow-300/50 dark:text-purple-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 bg-yellow-700 rounded-md text-15 text-purple-50">
            <i className="fi fi-sr-add-document text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp
              end={pending || 0} // Static count for New Submissions
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">New Submission <br/> (Pending)</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Widgets;
