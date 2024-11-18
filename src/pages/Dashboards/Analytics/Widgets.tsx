import React from "react";
import { DollarSign, FileInput, ListFilter, Users, X } from "lucide-react";
import CountUp from "react-countup";
import { Dropdown } from "Common/Components/Dropdown";
import { PerspectiveChart } from "./Charts";
import { Link } from "react-router-dom";

const Widgets = () => {
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
              end={19}
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
              end={25}
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
            <CountUp
              end={13}
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">
            Entry Permits <br/> (Active)
          </p>
        </div>
      </div>
      <div className="order-2 md:col-span-6 lg:col-span-3 col-span-12 2xl:order-1 bg-red-500 dark:bg-red-600/20 card 2xl:col-span-2 group-data-[skin=bordered]:border-orange-500/20 relative overflow-hidden">
        <div className="card-body">
          <ListFilter className="absolute top-0 size-32 stroke-1 text-red-300/100 dark:text-red-700/20 ltr:-right-10 rtl:-left-10"></ListFilter>
          <div className="flex items-center justify-center size-14 bg-red-700 rounded-md text-15 text-red-50">
          <i className="fi fi-sr-calendar-xmark text-[32px] mt-2"></i>
          </div>
          <h5 className="mt-5 mb-2">
            <CountUp end={5} className="counter-value text-[24px] text-white" />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Overdue <br/> (This Month)</p>
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
              end={21}
              className="counter-value text-[24px] text-white"
            />
          </h5>
          <p className="text-white dark:text-slate-200 text-[18px]">Paid</p>
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
              end={16}
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
