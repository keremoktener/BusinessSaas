import { AppBar, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../../../store";
import { useDispatch } from "react-redux";
import { toggleLanguage } from "../../../store/feature/languageSlice";

/**
 * Props for the Topbar component.
 */
interface TopbarProps {
  /**
   * Whether the Topbar should be displayed for mobile devices.
   */
  displayForMobile: boolean;
}

/**
 * TopBar component that renders a navigation bar with language switching functionality.
 *
 * @param {TopbarProps} props - The component props.
 * @param {boolean} props.displayForMobile - Flag indicating if the TopBar should be displayed on mobile devices.
 *
 * @returns {JSX.Element} The rendered TopBar component.
 */
function TopBar({ displayForMobile }: TopbarProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Styles for the TopBar
  const TopBarStyle = {
    backgroundColor: "#45474B",
    color: "#E0E0E0",
    paddingLeft: "15vw",
    paddingRight: "15vw",
    marginBottom: "0px",
    height: "37px",
    display: {
      xs: displayForMobile ? "flex" : "none",
      md: "flex",
    },
  };

  // Handles language change by dispatching the toggleLanguage action
  const handleLanguageChange = () => {
    dispatch(toggleLanguage());
  };

  //#region UI
  return (
    <AppBar sx={TopBarStyle} position="static" id="top-bar">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Button onClick={handleLanguageChange} sx={{ color: "inherit" }}>
          {t("localization.locale")} {/* Button text for language toggle */}
        </Button>
      </Box>
    </AppBar>
  );
  //#endregion UI
}

export default TopBar;