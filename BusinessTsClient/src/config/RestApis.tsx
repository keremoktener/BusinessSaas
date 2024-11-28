import Ports from "../config/Ports";
import EndPoints from "../config/EndPoints";

const base_url = "http://"; // Base URL for the API
const host_local = "localhost:"; // Localhost for development
const host_live = ""; // Live server host (update with actual live server address)

const profile_development = "/dev"; // Profile for development environment
const profile_test = "/test"; // Profile for testing environment
const profile_production = "/prod"; // Profile for production environment

// Set the host depending on the environment
const host = host_local; // Change to host_live for live server or host_local for local development
const profile = profile_development; // Change to profile_test for testing or profile_production for production
const version = "/v1"; // API version (update as needed)

const apis = {
  //#region Auth
  auth_service: base_url + host + Ports.auth + profile + version + EndPoints.auth,
  //#endregion Auth

  //#region Stock
  stock_service_product_category: base_url + host + Ports.stock + profile + version + EndPoints.product_category,
  stock_service_order: base_url + host + Ports.stock + profile + version + EndPoints.order,
  stock_service_product: base_url + host + Ports.stock + profile + version + EndPoints.product,
  stock_service_stock_movement: base_url + host + Ports.stock + profile + version + EndPoints.stock_movement,
  stock_service_supplier: base_url + host + Ports.stock + profile + version + EndPoints.supplier,
  stock_service_ware_house: base_url + host + Ports.stock + profile + version + EndPoints.ware_house,
  stock_service_customer: base_url + host + Ports.stock + profile + version + EndPoints.customerStock,
  //#endregion

  //#region Organization Management
  organization_management_department: base_url + host + Ports.organization_management + profile + version + EndPoints.department,
  organization_management_employee: base_url + host + Ports.organization_management + profile + version + EndPoints.OMemployee,
  organization_management_manager: base_url + host + Ports.organization_management + profile + version + EndPoints.OMmanager,
  //#endregion

  //#region Utility
  utility_bug_report: base_url + host + Ports.utility + profile + version + EndPoints.bug_report,
  utility_feedback: base_url + host + Ports.utility + profile + version + EndPoints.feedback,

  //#endregion

    //#region CRM
    crm_service_customer: base_url + host + Ports.crm + profile + version + EndPoints.customer,
    crm_service_marketing_campaign: base_url + host + Ports.crm + profile + version + EndPoints.marketing_campaign,
    crm_service_opportunity: base_url + host + Ports.crm + profile + version + EndPoints.opportunity,
    crm_service_activities: base_url + host + Ports.crm + profile + version + EndPoints.activities,
    crm_service_ticket: base_url + host + Ports.crm + profile + version + EndPoints.ticket,

    //#endregion CRM

  //#region User Management
  user_management_service_user: base_url + host + Ports.user_management + profile + version + EndPoints.user,
  user_management_service_role: base_url + host + Ports.user_management + profile + version + EndPoints.role,
  //#endregion User Management

  //#region Project Management
  project_management_service:base_url + host + Ports.project + profile + version + EndPoints.project_management,
  //#endregion Project Management

  //#region HRM
  hrm_service_employee: base_url + host + Ports.hrm + profile + version + EndPoints.employee,
  hrm_service_payroll: base_url + host + Ports.hrm + profile + version + EndPoints.payroll,
  hrm_service_benefit: base_url + host + Ports.hrm + profile + version + EndPoints.benefit,
  hrm_service_performance: base_url + host + Ports.hrm + profile + version + EndPoints.performance,
  hrm_service_attendance: base_url + host + Ports.hrm + profile + version + EndPoints.attendance,
  //#endregion HRM

  //#region Notification
  notification_service: base_url + host + Ports.notification + profile + version + EndPoints.notifications,
  //#endregion Notification

  //#region Subscription
  subscription_service_plan: base_url + host + Ports.subscription + profile + version + EndPoints.subscription + EndPoints.plan,
  subscription_service_subscription: base_url + host + Ports.subscription + profile + version + EndPoints.subscription + EndPoints.subscription,
  //#endregion Subscription

  //#region Finance
  finance_service_budget: base_url + host + Ports.finance + profile + version + EndPoints.budget,
  finance_service_declaration: base_url + host + Ports.finance + profile + version + EndPoints.declaration,
  finance_service_expense: base_url + host + Ports.finance + profile + version + EndPoints.expense,
  finance_service_financial_report: base_url + host + Ports.finance + profile + version + EndPoints.financial_report,
  finance_service_income: base_url + host + Ports.finance + profile + version + EndPoints.income,
  finance_service_invoice: base_url + host + Ports.finance + profile + version + EndPoints.invoice,
  finance_service_tax: base_url + host + Ports.finance + profile + version + EndPoints.tax,
  finance_service_department: base_url + host + Ports.finance + profile + version + EndPoints.department_finance,
  //#endregion Finance

    //#region File
    file_service: base_url + host + Ports.file + profile + version + EndPoints.file,
     //#endregion File

  //#region Caledar_and_Planning
  calendar_and_planning_service_event: base_url + host + Ports.calendar_and_planning + profile + version + EndPoints.event,
  //#endregion Caledar_and_Planning 

  //#region LiveSupport
  live_support_service_message: base_url + host + Ports.live_support + profile + version + EndPoints.live_support + EndPoints.message,
  live_support_service_faq: base_url + host + Ports.live_support + profile + version + EndPoints.live_support + EndPoints.faq,
  //#endregion LiveSupport
};

export default apis;
