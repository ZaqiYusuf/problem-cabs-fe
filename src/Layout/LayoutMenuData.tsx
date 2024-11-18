// import { link } from "fs";
// import { icon } from "leaflet";
import { icon } from "leaflet";
import { label } from "yet-another-react-lightbox/*";
// import { label } from "yet-another-react-lightbox/*";

const menuData: any = [
  {
    id: "dashboard",
    label: "Dashboard",
    link: "/dashboards-analytics",
    icon: <i className="fi fi-ss-display-chart-up"></i>,
  },
  {
    id: "datamaster",
    label: "Data Master",
    link: "/#",
    icon: <i className="fi fi-sr-box-open"></i>,
    subItems: [
      {
        id: "tenantdashboard",
        label: "Tenants",
        link: "/dashboards-tenant",
        parentId: "datamaster",
      },
      {
        id: "locationdashboard",
        label: "Locations",
        link: "/dashboards-location",
        parentId: "datamaster",
      },
      {
        id: "packagedashboard",
        label: "Packages",
        link: "/dashboards-package",
        parentId: "datamaster",
      },
    ]
  },
  {
    label: "Area Entry Permits",
    isTitle: true,
  },
  {
    id: "processimk",
    label: "Process Management",
    link: "/process-management",
    icon: <i className="fi fi-sr-land-layer-location"></i>,
    subItems: [
      {
        id: "processpage",
        label: "Entry Permissions",
        link: "/process-management",
        parentId: "processimk",
      },
      {
        id: "customer",
        label: "Customers",
        link: "/customers-management",
        icon: <i className="fi fi-ss-users"></i>,
      },
    ],
  },
  {
    label: "Payments",
    isTitle: true,
  },
  {
    id: "payments",
    label: "Payment Histories",
    link: "/payments-management",
    icon: <i className="fi fi-ss-money-bill-wave"></i>,
  },
  {
    label: "User Management",
    isTitle: true,
  },
  {
    id: "users",
    label: "Users",
    link: "/users-management",
    icon: <i className="fi fi-ss-user-gear"></i>,
  },
  {
    label: "Settings",
    isTitle: true,
  },
  {
    id: "setting",
    label: "Setting",
    link: "/#",
    icon: <i className="fi fi-sr-settings"></i>,
    subItems: [
      {
        id: "onepage",
        label: "Payment Gateaway",
        link: "/setting-payment",
        parentId: "landing",
      },
    ],
  },
];

export { menuData };
