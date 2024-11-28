import {subscriptionSlice} from "../store/feature";

// To hold the API endpoints for different services
const endpoints = {
  auth: "/auth", // Example: Endpoint for the authentication service
  //Stock Endpoints
  product_category: "/stock/product-category",
  order: "/stock/order",
  product: "/stock/product",
  stock_movement: "/stock/stock-movement",
  supplier: "/stock/supplier",
  ware_house: "/stock/ware-house",
  customerStock: "/stock/customer",
  //Organization Management Endpoints
  department: "/organization-management/department",
  OMemployee: "/organization-management/employee",
  OMmanager: "/organization-management/manager",
  //Utility Endpoints
  bug_report: "/utility/bug-report",
  feedback: "/utility/feed-back",

  // CRM Endpoints
  customer: "/crm/customer",
  marketing_campaign: "/crm/marketing-campaign",
  opportunity: "/crm/opportunity",
  activities: "/crm/activities",
  ticket: "/crm/ticket",
  user: "/usermanagement/user",
  role:"/usermanagement/role",
  notifications: "/utility/notifications",
  // HRM Endpoints
  employee: "/employee",
  payroll: "/payroll",
  benefit: "/benefit",
  performance: "/performance",
  attendance: "/attendance",
  // FAM Endpoints
  budget: "/finance/budget",
  declaration: "/finance/declaration",
  expense: "/finance/expense",
  financial_report: "/finance/financial-report",
  income: "/finance/income",
  invoice: "/finance/invoice",
  tax: "/finance/tax",
  department_finance: "/finance/department",
  // SUB Endpoints
  subscription: "/subscription",
  plan: "/plan",
  // FILE Endpoints
  file: "/file",
  project_management: "/project",
  // CalendarAndPlanning Endpoints
  event: "/event",
  // LiveSupport Endpoints
  live_support: "/live-support",
  message: "/message",
  faq: "/faq",
  
};

export default endpoints;