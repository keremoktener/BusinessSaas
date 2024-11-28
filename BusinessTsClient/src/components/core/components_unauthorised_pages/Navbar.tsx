import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {
  Typography,
  Toolbar,
  Box,
  AppBar,
  Button,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import { useTranslation } from "react-i18next";
import Topbar from "./Topbar";

const NavbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 999,
  paddingLeft: "15vw",
  paddingRight: "15vw",
  backgroundColor: "#F5F7F8",
  color: "#45474B",
};

const CollapsibleMenuStyle = {
  position: "sticky",
  top: "64px",
  zIndex: 998,
  backgroundColor: "#F5F7F8",
};

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);
  const { t } = useTranslation();
  const pages = [t("home"), t("about"), t("services"), t("contact")];
  const pagesMobile = [
    t("home"),
    t("about"),
    t("services"),
    t("contact"),
    t("login"),
    t("register"),
  ];

  const handleOpenNavMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCloseNavMenu = () => {
    setOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById("collapsible-menu");
    const button = document.getElementById("menu-button");
    const topBar = document.getElementById("top-bar");

    if (
      menu &&
      button &&
      !menu.contains(event.target as Node) &&
      !button.contains(event.target as Node) &&
      !topBar?.contains(event.target as Node)
    ) {
      setOpen(false);
      setIsHovered(false);
      setHoveredIndex(-1);
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <Topbar displayForMobile={open} />
      <AppBar sx={NavbarStyle}>
        <Toolbar disableGutters>
          <Typography variant="h6" sx={{ display: { xs: "flex", md: "flex" } }}>
            <Button
              style={{ marginRight: "20px" }}
              onClick={() => navigate("/") }
              color="inherit"
            >
              <img src={logo} alt="logo" style={{ height: "52px" }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  ml: 2,
                  display: { xs: "flex", md: "flex", lg: "flex", xl: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                BUSINESS
              </Typography>
            </Button>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              position: "relative",
            }}
          >
            <IconButton
              id="menu-button"
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page, index) => (
              <Box key={page}>
                <Button
                  onMouseEnter={() => index === 2 && setIsHovered(true)}
                  onMouseLeave={() => index === 2 && setIsHovered(false)}
                  onClick={() => {
                    if (index === 2) {
                      setIsHovered((prev) => !prev);
                    } else {
                      handleCloseNavMenu();
                      navigate(`/${page.toLowerCase()}`);
                    }
                  }}
                  sx={{
                    my: 2,
                    color: "#45474B",
                    display: "block",
                    marginLeft: "20px",
                  }}
                >
                  {t("navigation." + page)}
                </Button>
                {isHovered && index === 2 && (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: "white",
                      boxShadow: 3,
                      borderRadius: "4px",
                      padding: "10px",
                      marginTop: "5px",
                      marginLeft: "20px",
                      zIndex: 10,
                      border: "1px solid #ccc", // Kenarlık
                      // Yüksekliği ayarlamak için, gerekirse kullanılabilir
                    }}
                  >
                    {["İK Yönetimi", "Finans ve Muhasebe Yönetimi", "Proje Yönetimi", "Kullanıcı Yönetimi", "Abonelik ve Plan Yönetimi", "Kuruluş Yönetimi", "Takvim ve Planlama", "Kullanıcı Destek ve Yönetimi"].map((subItem, subIndex) => (
                      <Typography
                        key={subItem}
                        variant="subtitle1"
                        sx={{
                          color: hoveredIndex === subIndex ? "#1976d2" : "#45474B",
                          cursor: "pointer",
                          padding: "5px 0", // Üst ve alt boşluk
                        }}
                        onMouseEnter={() => setHoveredIndex(subIndex)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        onClick={() => {
                          handleCloseNavMenu();
                          navigate(`/${subItem.toLowerCase().replace(/ /g, '-')}`);
                        }}
                      >
                        {subItem}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Button
              onClick={() => navigate("/login")}
              sx={{ my: 2, color: "inherit", marginLeft: "10px" }}
            >
              {t("navigation.login")}
            </Button>
            <Button
              onClick={() => navigate("/register")}
              sx={{ my: 2, color: "inherit", marginLeft: "10px" }}
            >
              {t("navigation.register")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={CollapsibleMenuStyle}
        id="collapsible-menu"
      >
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            backgroundColor: "#F5F7F8",
            paddingLeft: "15vw",
            paddingRight: "15vw",
            zIndex: 998,
          }}
        >
          {pagesMobile.map((page) => (
            <Button
              key={page}
              onClick={() => {
                handleCloseNavMenu();
                navigate(`/${page.toLowerCase()}`);
              }}
              sx={{
                my: 1,
                color: "#45474B",
                display: "block",
                textAlign: "left",
                width: "100%",
              }}
            >
              {t("navigation." + page)}
            </Button>
          ))}
        </Box>
      </Collapse>
    </>
  );
}

export default Navbar;
