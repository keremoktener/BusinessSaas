//SUBJECT TO CHANGE
import FooterCopyright from "./components_footer/FooterContainerBottom";
import FooterContact from "./components_footer/FooterContainerMiddle";
import FooterTopComponent from "./components_footer/FooterContainerTop";

const Footer = () => {
    //#region UI
    return (
        <footer style={{color: "#E0E0E0"}}>
            <FooterTopComponent />
            <FooterContact />
            <FooterCopyright />
        </footer>
    );
    //#endregion UI
};

export default Footer;
