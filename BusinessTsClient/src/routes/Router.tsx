import {lazy, Suspense} from "react";
import PrivateRoute from "./PrivateRoute";
import PostAuthTemplate from "../components/core/PostAuthTemplate";
import {Navigate, Outlet, useRoutes} from "react-router-dom";
import {delay} from "../util/delay";
import Loader from "../components/atoms/loader/Loader";
import SideBarNotifications from "../components/molecules/SideBarNotifications";
import PreAuthTemplate from "../components/core/PreAuthTemplate";
import Profile from "../pages/Profile";
import SupplierOrderPage from "../pages/StockService/Supplier/SupplierOrderPage.tsx";
import CustomerPageStock from "../pages/StockService/Customer/CustomerPageStock.tsx";
import OpportunityPage from "../pages/CRMService/OpportunityPage.tsx";
import ActivityPage from "../pages/CRMService/ActivityPage.tsx";
import TicketPage from "../pages/CRMService/TicketPage.tsx";
import ProfileManagement from "../pages/ProfileManagement.tsx";
import BudgetPage from "../pages/FinanceService/BudgetPage.tsx";
import IncomePage from "../pages/FinanceService/IncomePage.tsx";
import ManageUsers from "../pages/AdminPages/ManageUsers.tsx";
import ManageRoles from "../pages/AdminPages/ManageRoles.tsx";
import TaxAndDeclarationPage from "../pages/FinanceService/TaxAndDeclarationPage.tsx";
import ExpensePage from "../pages/FinanceService/ExpensePage.tsx";
import FinancialReportPage from "../pages/FinanceService/FinancialReportPage.tsx";
import InvoicePage from "../pages/FinanceService/InvoicePage.tsx";
import BugReportPage from "../pages/UtilityService/BugReportPage.tsx";
import FeedbackPage from "../pages/UtilityService/FeedbackPage.tsx";


/**
 * By wrapping our component imports with `lazy`, we ensure that these components are only loaded
 * when they are needed (e.g., when the user navigates to a specific route). This reduces the
 * initial bundle size, leading to faster load times and improved performance for the application.
 */
export const VerifyAccount = lazy(() => import('../pages/VerifyAccount'));
export const ProductPage = lazy(() => import('../pages/StockService/Customer/ProductPage.tsx'));
export const AnalyticsDash = lazy(() => import('../pages/AnalyticsDash'));
export const CustomerPage = lazy(() => import('../pages/CRMService/CustomerPage.tsx'));
export const MarketingCampaignPage = lazy(() => import('../pages/CRMService/MarketingCampaignPage.tsx'));
export const CustomerSaveFromLink = lazy(() => import('../pages/CRMService/CustomerSaveFromLinkPage.tsx'));
export const CustomerSendEmail = lazy(() => import('../pages/CRMService/CustomerSendEmailPage.tsx'));
export const ThankYouPage = lazy(() => import('../pages/CRMService/ThankYouPage.tsx'));
export const ProductByMinStockLevelPage = lazy(() => import('../pages/StockService/Customer/ProductByMinStockLevelPage.tsx'));
export const EmployeePage = lazy(() => import('../pages/HRMService/EmployeePage.tsx'));
export const AttendancePage = lazy(() => import('../pages/HRMService/AttendancePage.tsx'));
export const BenefitPage = lazy(() => import('../pages/HRMService/BenefitPage.tsx'));
export const PayrollPage = lazy(() => import('../pages/HRMService/PayrollPage.tsx'));
export const GraphicsPage = lazy(() => import('../pages/HRMService/GraphicsPage.tsx'));
export const PerformancePage = lazy(() => import('../pages/HRMService/PerformancePage.tsx'));
export const BuyOrderPage = lazy(() => import('../pages/StockService/Customer/BuyOrderPage.tsx'));
export const SellOrderPage = lazy(() => import('../pages/StockService/Customer/SellOrderPage.tsx'));
export const SupplierPage = lazy(() => import('../pages/StockService/Customer/SupplierPage.tsx'));
export const WareHousePage = lazy(() => import('../pages/StockService/Customer/WareHousePage.tsx'));
export const ProductCategoryPage = lazy(() => import('../pages/StockService/Customer/ProductCategoryPage.tsx'));
export const StockMovementPage = lazy(() => import('../pages/StockService/Customer/StockMovementPage.tsx'));
export const OMSEmployeePage = lazy(() => import('../pages/OrganizationManagementService/EmployeePage.tsx'));
export const OMSDepartmentPage = lazy(() => import('../pages/OrganizationManagementService/DepartmentPage.tsx'));
export const OMSTreeView = lazy(() => import('../pages/OrganizationManagementService/TreeView.tsx'));
export const DashBoard = lazy(() => import('../pages/DashBoard'));
export const Login = lazy(() => import('../pages/Login'));
export const ErrorPage = lazy(() => import('../pages/page404/ErrorPage'));
export const HomePage = lazy(() => import('../pages/HomePage'));
export const Register = lazy(() => import('../pages/Register'));
export const ResetPassword = lazy(() => import('../pages/ResetPassword'));
export const Subscription = lazy(() => import('../pages/SubscriptionService/Subscription'));
export const SubscriptionHistory = lazy(() => import('../pages/SubscriptionService/SubscriptionHistory'));
export const AddEditPlan = lazy(() => import('../pages/SubscriptionService/AddEditPlan'));
export const CreateProjectPage = lazy(() => import('../pages/ProjectService/CreateProject'));
export const Calendar = lazy(() => import('../pages/Calendar'));
export const SupporterDashboard = lazy(() => import('../pages/LiveSupport/SupporterDashboard'));
export const CreateFAQ = lazy(() => import('../pages/LiveSupport/CreateFAQ'));
export const FAQ = lazy(() => import('../pages/LiveSupport/FAQ'));
export const StockDashboard = lazy(() => import('../pages/AnalyticsService/StockService/StockDashboard.tsx'));

// For testing purposes (with delay) 
const TestPage = lazy(() => delay(1000).then(() => import('../pages/TestPage')));

/**
 * Router component that defines the application's route structure.
 *
 * This component uses React Router to manage different routes within the application.
 * It includes lazy loading for pages and wraps routes in a Suspense component for
 * loading states. Protected routes are handled with the PrivateRoute component.
 *
 * @returns {React.ReactNode} - The rendered routes for the application.
 */
export default function Router() {
    const routes = useRoutes([
        // Routes that are not part of the PostAuthTemplate layout
        {
            path: '/',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <HomePage/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '/analyticdash',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <AnalyticsDash/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: 'login',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <Login/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: 'notifications',
            element: (
                <PostAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <SideBarNotifications/>
                    </Suspense></PostAuthTemplate>
            ),
        },
        {
            path: 'register',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <Register/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '404',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <ErrorPage/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '*',
            element:
                <Suspense fallback={<Loader/>}>
                    <Navigate to="/404" replace/>
                </Suspense>
            ,
        },
        {
            path: 'dev/v1/auth/verify-account',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <VerifyAccount/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },

        {
            path: 'dev/v1/auth/reset-password',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <ResetPassword/>
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: 'customer-save-from-link',
            element:(
                <Suspense>
                    <Suspense fallback={<Loader/>}>
                        <CustomerSaveFromLink/>
                    </Suspense>
                </Suspense>

            ),
        },
        {
            path: 'thank-you',
            element: (
                <Suspense>
                    <Suspense fallback={<Loader/>}>
                        <ThankYouPage/>
                    </Suspense>
                </Suspense>
            )
        },
        {
            path: 'faq',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <FAQ/>
                    </Suspense>
                </PreAuthTemplate>
            )
        },
        // Routes that use the PostAuthTemplate layout
        {
            element: (
                <PostAuthTemplate>
                    <Suspense fallback={<Loader/>}>
                        <Outlet/>
                    </Suspense>
                </PostAuthTemplate>
            ),
            children: [
                {
                    path: 'admin-dashboard',
                    element: <PrivateRoute element={<DashBoard/>} roles={['ADMIN', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'member-dashboard',
                    element: <PrivateRoute element={<DashBoard/>} roles={['ADMIN', 'SUPER_ADMIN', 'MEMBER']}/>,
                },
                {
                    path: 'subscription',
                    element: <PrivateRoute element={<Subscription/>} roles={['MEMBER']}/>,
                },
                {
                    path: 'products',
                    element: <PrivateRoute element={<ProductPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'products-by-min-stock-level',
                    element: <PrivateRoute element={<ProductByMinStockLevelPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'buy-orders',
                    element: <PrivateRoute element={<BuyOrderPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'sell-orders',
                    element: <PrivateRoute element={<SellOrderPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'suppliers',
                    element: <PrivateRoute element={<SupplierPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'ware-houses',
                    element: <PrivateRoute element={<WareHousePage/>} roles={['IMM']}/>,
                },
                {
                    path: 'product-categories',
                    element: <PrivateRoute element={<ProductCategoryPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'stock-movements',
                    element: <PrivateRoute element={<StockMovementPage/>} roles={['IMM']}/>,
                },
                {
                    path: 'stock-customer',
                    element: <PrivateRoute element={<CustomerPageStock/>} roles={['IMM']}/>,
                },
                {
                    path: 'supplier-orders',
                    element: <PrivateRoute element={<SupplierOrderPage/>} roles={['SUPPLIER']}/>,
                },
                {
                    path: 'employee-page',
                    element: <PrivateRoute element={<EmployeePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'attandance-page',
                    element: <PrivateRoute element={<AttendancePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'benefit-page',
                    element: <PrivateRoute element={<BenefitPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'payroll-page',
                    element: <PrivateRoute element={<PayrollPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'graphics-page',
                    element: <PrivateRoute element={<GraphicsPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'performance-page',
                    element: <PrivateRoute element={<PerformancePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'HRMM']}/>,
                },
                {
                    path: 'customer',
                    element: <PrivateRoute element={<CustomerPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },
                {
                    path: 'marketing-campaign',
                    element: <PrivateRoute element={<MarketingCampaignPage/>}
                                           roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },
                {
                    path: 'opportunity',
                    element: <PrivateRoute element={<OpportunityPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },
                {
                    path: 'activities',
                    element: <PrivateRoute element={<ActivityPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },
                {
                    path: 'tickets',
                    element: <PrivateRoute element={<TicketPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },     
                {
                    path: 'send-email',
                    element: <PrivateRoute element={<CustomerSendEmail/>} roles={['ADMIN', 'SUPER_ADMIN', 'CRMM']}/>,
                },
                {
                    path: 'test',
                    element: <PrivateRoute element={<TestPage/>} roles={['ADMIN', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'profile',
                    element: <PrivateRoute element={<Profile/>} roles={['ADMIN', 'MEMBER', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'supplier-orders',
                    element: <PrivateRoute element={<SupplierOrderPage/>}
                                           roles={['ADMIN', 'ADMIN', 'SUPER_ADMIN', 'SUPPLIER']}/>,
                },
                {
                    path: 'budgets',
                    element: <PrivateRoute element={<BudgetPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                },
                {
                  path:'create-project',
                  element:<CreateProjectPage />,
                },
                {
                    path: 'incomes',
                    element: <PrivateRoute element={<IncomePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                },
                {
                    path: 'subscription-history',
                    element: <PrivateRoute element={<SubscriptionHistory/>} roles={['MEMBER']}/>,
                },
                {
                    path: 'add-edit-plan',
                    element: <PrivateRoute element={<AddEditPlan/>} roles={['ADMIN', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'profile-management',
                    element: <PrivateRoute element={<ProfileManagement/>} roles={['ADMIN', 'MEMBER', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'ManageUsers',
                    element: <PrivateRoute element={<ManageUsers/>} roles={['ADMIN', 'SUPER_ADMIN']}/>,
                }, {
                    path: 'ManageRoles',
                    element: <PrivateRoute element={<ManageRoles/>} roles={['ADMIN', 'SUPER_ADMIN']}/>,
                },
                {
                    path: 'taxes',
                    element: <PrivateRoute element={<TaxAndDeclarationPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                },
                {
                    path: 'expenses',
                    element: <PrivateRoute element={<ExpensePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                },
                {
                    path: 'financial-reports',
                    element: <PrivateRoute element={<FinancialReportPage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                }
                ,
                {
                    path: 'invoices',
                    element: <PrivateRoute element={<InvoicePage/>} roles={['ADMIN', 'SUPER_ADMIN', 'FAM']}/>,
                },
                
                {
                    path: 'oms-employee',
                    element: <PrivateRoute element={<OMSEmployeePage/>} roles={['MEMBER']}/>,
                },
                {
                    path: 'oms-department',
                    element: <PrivateRoute element={<OMSDepartmentPage/>} roles={['MEMBER']}/>,
                }
                ,
                {
                    path: 'oms-treeview',
                    element: <PrivateRoute element={<OMSTreeView/>} roles={['MEMBER']}/>,
                },
                {
                    path: 'calendar',
                    element: <PrivateRoute element={<Calendar/>} roles={['MEMBER']}/>,
                },
                {
                    path: 'bug-report',
                    element: <PrivateRoute element={<BugReportPage/>} roles={['ADMIN']}/>,
                },
                {
                    path: 'supporter-dashboard',
                    element: <PrivateRoute element={<SupporterDashboard/>} roles={['SUPPORTER']}/>,

                },
                {
                    path: 'feedback',
                    element: <PrivateRoute element={<FeedbackPage/>} roles={['ADMIN']}/>,
                }, 
                {
                    path: 'create-faq',
                    element: <PrivateRoute element={<CreateFAQ/>} roles={['SUPPORTER']}/>,

                },
                {
                    path: 'faq-postAuth',
                    element: <PrivateRoute element={<FAQ/>} roles={['MEMBER','SUPPORTER','ADMIN']}/>,

                },
                {
                    path: 'stock-analysis-dash',
                    element: <PrivateRoute element={<StockDashboard/>} roles={['MEMBER']}/>,
                },
            ]
        }
    ]);

    return routes;
}