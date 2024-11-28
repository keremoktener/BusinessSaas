import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import Navbar from "./components_unauthorised_pages/Navbar";
import { Root } from "./Root";
import Footer from "./Footer";
import { Body } from "./Body";

interface PreAuthTemplateProps {
    children: ReactNode; // Define children as ReactNode
}

/**
 * PreAuthTemplate component that serves as a layout for pre-authentication pages.
 * It includes a navigation bar, body section for content, and a footer.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the body.
 * @returns {JSX.Element} The rendered PreAuthTemplate component.
 */
function PreAuthTemplate({ children }: PreAuthTemplateProps) {
    //#region UI
    return (
        <Root>
            <CssBaseline />
            <Navbar />
            <Body>
                {children} {/* Render child components here */}
            </Body>
            <Footer />
        </Root>
    );
    //#endregion UI
}

export default PreAuthTemplate;
