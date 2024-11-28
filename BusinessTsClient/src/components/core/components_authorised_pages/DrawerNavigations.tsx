import React from 'react';
import DrawerButton, {DrawerButtonProps} from '../../atoms/DrawerButton';
import {
    AccountBalance,
    AirplaneTicket,
    Apartment,
    ArrowDownward,
    ArrowUpward,
    Assessment,
    Assignment,
    AttachMoney,
    Campaign,
    Category,
    Dashboard,
    Edit,
    FaceRetouchingNatural,
    FormatListNumbered,
    Inventory,
    Loyalty,
    ManageAccounts,
    People,
    Person,
    ProductionQuantityLimits,
    RequestQuote,
    Sell,
    Settings,
    Shop,
    ShowChart,
    SupportAgent, TableChart,
    TipsAndUpdates,
    Warehouse,
    Mail,
    DataThresholding, BugReport,Feedback,
    Add
} from '@mui/icons-material';

import DrawerCollapseButton, {DrawerCollapseButtonProps} from '../../atoms/DrawerCollapseButton';
import Calendar from '../../../pages/Calendar';
import { CalendarIcon } from '@mui/x-date-pickers';

// Define types for button configurations
export type Button =
    | { type: 'button', component: typeof DrawerButton, props: DrawerButtonProps }
    | { type: 'collapse', component: typeof DrawerCollapseButton, props: DrawerCollapseButtonProps };

// Define shared-admin button configurations
const sharedAdminButtons: Button[] = [
    {
        type: 'button',
        component: DrawerButton,
        props: { name: 'dashboard', icon: <Dashboard />, navigation: 'admin-dashboard' } as DrawerButtonProps,
    },
    {
        type: 'collapse',
        component: DrawerCollapseButton,
        props: {
            name: 'subscription',
            TopLevelIcon: <Loyalty/>,
            menuItems: [
                'plans'
            ],
            menuIcons: [
                <ProductionQuantityLimits/>
            ],
            menuNavigations: [
                'add-edit-plan',
            ],
        } as DrawerCollapseButtonProps,
    },
    {
        type: 'collapse',
        component: DrawerCollapseButton,
        props: {
            name: 'adminMenu',
            TopLevelIcon: <Settings/>,
            menuItems: [
                'ManageUsers','ManageRoles','bug-report','feedback'
            ],
            menuIcons: [
                <ManageAccounts/>,<Edit/>,<BugReport/>,<Feedback/>
            ],
            menuNavigations: [
                'ManageUsers','ManageRoles','bug-report','feedback'
            ],
        } as DrawerCollapseButtonProps,
    }
];

// Define role-based button configurations
export const drawerNavigations: Record<string, Button[]> = {
    ADMIN: [...sharedAdminButtons],
    SUPPORTER: [
        {
            type: 'button',
            component: DrawerButton,
            props: { name: 'dashboard', icon: <Dashboard />, navigation: 'supporter-dashboard' } as DrawerButtonProps,
        },
        {
            type: 'button',
            component: DrawerButton,
            props: { name: 'createFAQ', icon: <Add />, navigation: 'create-faq' } as DrawerButtonProps,
        },
    ],
    MEMBER: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'organizationManagementModule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'oms-department', 'oms-employee',"oms-treeview"
                ],
                menuIcons: [
                    <Apartment/>, <Person/>, <TableChart/>
                ],
                menuNavigations: [
                    'oms-department', 'oms-employee',"oms-treeview"
                ],
            } as DrawerCollapseButtonProps,
        },
                {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'analysisModule',
                TopLevelIcon: <FormatListNumbered />,
                menuItems: [
                    'stockAnalysis',
                ],
                menuIcons: [
                    <Assessment />,
                ],
                menuNavigations: [
                    'stock-analysis-dash',
                ],
            } as DrawerCollapseButtonProps,
        },
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'subscription',
                TopLevelIcon: <Loyalty/>,
                menuItems: [
                    'slctSubs','historySubs'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>, <ProductionQuantityLimits/>
                ],
                menuNavigations: [
                    'subscription', 'subscription-history'
                ],
            } as DrawerCollapseButtonProps,
        },
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'profile', icon: <Person/>, navigation: 'profile-management'} as DrawerButtonProps,
        },
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'calendar', icon: <CalendarIcon/>, navigation: 'calendar'} as DrawerButtonProps,
        }
    ],

    BASIC: [
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'dashboard', icon: <Dashboard/>, navigation: 'member-dashboard'} as DrawerButtonProps,
        }
    ],

    CRMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'customermodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'crm-customers', 'crm-marketing-campaign', 'crm-opportunity', 'crm-ticket', 'crm-activities','crm-send-email'

                ],
                menuIcons: [
                    <People/>, <Campaign/>, <TipsAndUpdates/>,<AirplaneTicket/>,<DataThresholding/>,<Mail/>
                ],
                menuNavigations: [
                    'customer', 'marketing-campaign', 'opportunity','tickets','activities', 'send-email'
                ],
            } as DrawerCollapseButtonProps,
        },
    ],
    HRMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'hrmmodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'hrm-employees', 'hrm-payrolls', 'hrm-performances', 'hrm-benefits', 'hrm-attendance', 'hrm-graphics'
                ],
                menuIcons: [
                    <People/>, <AttachMoney/>, <ShowChart/>, <RequestQuote/>, <Assignment/>, <Assessment/>
                ],
                menuNavigations: [
                    'employee-page', 'payroll-page', 'performance-page', 'benefit-page', 'attandance-page', 'graphics-page'
                ],
            } as DrawerCollapseButtonProps,
        },
    ],

    IMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'stockmodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'products', 'buyorders', 'sellorders', 'suppliers', 'warehouses', 'productcategories', 'productsbyminstocklevel', 'stockmovements', 'stock-customer'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>, <Shop/>, <Sell/>, <SupportAgent/>, <Warehouse/>, <Category/>,
                    <Inventory/>, <ShowChart/>, <FaceRetouchingNatural/>
                ],
                menuNavigations: [
                    'products', 'buy-orders', 'sell-orders', 'suppliers', 'ware-houses', 'product-categories', 'products-by-min-stock-level', 'stock-movements', 'stock-customer'
                ],
            } as DrawerCollapseButtonProps,
        }
    ],

    SUPPLIER: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'supplier',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'buyorders'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>
                ],
                menuNavigations: [
                    'supplier-orders'
                ],
            } as DrawerCollapseButtonProps,
        }
    ],

    FAM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'financemodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'financial-reports'
                ],
                menuIcons: [
                    <AttachMoney/>, <ArrowDownward/>, <ArrowUpward/>, <RequestQuote/>, <AccountBalance/>, <Assessment/>,
                ],
                menuNavigations: [
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'financial-reports'
                ],
            } as DrawerCollapseButtonProps,
        }
    ]
    // Add more roles and buttons as needed
};
