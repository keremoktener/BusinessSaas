import { CssBaseline } from '@mui/material';
import Drawer from './LeftDrawer';
import Appbar from './Appbar';

// Interface defining the props for the Header component
interface HeaderProps {
    drawerState: boolean; // Indicates whether the drawer is open or closed
    setDrawerState: (state: boolean) => void; // Function to set the drawer state
    fetchUnreadCount: () => Promise<void>;
    unreadCount: number;
}

/**
 * Header component that renders the top app bar and side drawer.
 *
 * This component manages the state of the drawer and provides functions
 * to open and close it. It also includes the Appbar and Drawer components.
 *
 * @param {Object} param0 - The component props.
 * @param {boolean} param0.drawerState - Indicates if the drawer is open or closed.
 * @param {function} param0.setDrawerState - Function to update the drawer's open state.
 * @returns {React.ReactNode} - The rendered Header component.
 */
export default function Header({ drawerState, setDrawerState, fetchUnreadCount, unreadCount }: HeaderProps) {
    //#region UI
    return (
        <>
            <CssBaseline /> {/* Provides a consistent baseline for styles */}
            <Appbar
                drawerState={drawerState}
                setDrawerState={setDrawerState}
                fetchUnreadCount={fetchUnreadCount}
                unreadCount={unreadCount}
            />
            <Drawer open={drawerState} setDrawerState={setDrawerState} />
        </>
    );
    //#endregion UI
}