import React, {useEffect, useState} from "react";
import {BugReport, ChevronLeft, ChevronRight, Feed,Feedback, Help} from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import Rating from '@mui/material/Rating';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from "@mui/material/IconButton";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LanguageIcon from "@mui/icons-material/Language";
import PersonIcon from "@mui/icons-material/Person";
import {
  Menu,
  Avatar,
  Divider,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  TextField, DialogActions, Button, Dialog
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {AppDispatch, RootState, useAppSelector} from "../../../store";
import {
  toggleLanguage,
} from "../../../store/feature/languageSlice";
import {useSSR, useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import DropdownNotification from "../../atoms/DropdownNotifications";
import {
  fetchGetAllNotifications,
  fetchGetAllUnreadNotifications,
  fetchUnreadNotificationCount
} from "../../../store/feature/notificationSlice.tsx";
import { Client } from "@stomp/stompjs";
import { clearToken } from "../../../store/feature/authSlice.tsx";
import { clearRoles } from "../../../store/feature/userSlice.tsx";
import { use } from "i18next";
import { clearProfileImage, fetchProfileImage } from "../../../store/feature/fileSlice.tsx";
import {fetchFindAllDepartment, fetchSaveEmployee} from "../../../store/feature/organizationManagementSlice.tsx";
import Swal from "sweetalert2";
import {fetchDeleteFeedback, fetchSaveBugReport, fetchSaveFeedback, fetchUpdateFeedback, fetchUserFeedback} from "../../../store/feature/utilitySlice.tsx";
import { IFeedback } from "../../../model/UtilityService/IFeedback.tsx";
const drawerWidth = 240;

// Interface defining the props for the AppBar component
interface AppBarProps extends MuiAppBarProps {
  drawerState: boolean;
}


// Styled AppBar component that adjusts based on the drawer state
const EasyStyleAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerState",
})<AppBarProps>(({ theme, drawerState }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerState && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
  ...(!drawerState && {
    marginLeft: 0,
    width: "100%",
  }),
}));

// Styled component for the search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// Wrapper for the search icon
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Styled input base for the search field
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// Menu styling for dropdowns
const easyStyleMenu = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    minWidth: "150px",
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

// Demo user information


// Props interface for the Appbar component
interface AppbarProps {
  drawerState: boolean;
  setDrawerState: (state: boolean) => void; // Function to set the drawer state
  fetchUnreadCount: () => Promise<void>; // fetchUnreadCount prop
  unreadCount: number;
}

/**
 * Appbar component that renders the top navigation bar of the application.
 *
 * This component includes a search bar, user profile menu, and navigation icons.
 * It handles drawer state changes and provides responsive design for mobile and desktop views.
 *
 * @param {Object} param0 - The component props.
 * @param {boolean} param0.drawerState - Indicates if the drawer is open or closed.
 * @param {function} param0.setDrawerState - Function to set the drawer state.
 * @returns {React.ReactNode} - The rendered Appbar component.
 */


function Appbar({
                  drawerState,
                  setDrawerState,
                }: AppbarProps) {


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);

  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [client, setClient] = useState<Client | null>(null);

  // Önceki okunmamış bildirim sayısını tutmak için
  const [prevCount, setPrevCount] = useState<number>(0);

  // Okunmamış bildirim sayısını fetch eden fonksiyon

  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);


  const userName = useSelector((state: RootState) => state.userSlice.user.firstName);
  const profileImage = useSelector((state: RootState) => state.fileSlice.profileImage);

  //MODAL
  const [openAddCustomerModal, setOpenBugReport] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(0);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);



  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    
     const [rating, setRating] = useState<number | null>(0);
     const [editIndex, setEditIndex] = useState(-1); 
     const [feedback, setFeedback] = useState<IFeedback | null>(null); 
    const [description2, setDescription2] = useState('');

  const handleSendBugReport = async () => {
    setIsSaving(true)
    dispatch(fetchSaveBugReport({
      subject,
      description
    }))
        .then((data) => {
          if (data.payload.message === "Success") {
            setSubject('')
            setDescription('')
            setOpenBugReport(false);
            Swal.fire({
              title: t("swal.success"),
              text: t("stockService.successfullyadded"),
              icon: "success",
            });
            setIsSaving(false)
          } else {
            setSubject('')
            setDescription('')
            setSelectedDepartmentId(0)
            setOpenBugReport(false);
            Swal.fire({
              title: t("swal.error"),
              text: data.payload.message,
              icon: "error",
              confirmButtonText: t("swal.ok"),
            });
            setIsSaving(false)
          }
        })
  };

  const handleOpenBugReportModal = () => {
    setOpenBugReport(true);
  };


   
    

  useEffect(() => {
    const fetchFeedback = async () => {
      const response = await dispatch(fetchUserFeedback());
      if (response.payload) {
          setFeedback(response.payload);
          setDescription2(response.payload.description);
          setRating(response.payload.rating);
      } else {
          setFeedback(null);
      }
  };

    fetchFeedback();
}, [dispatch]);

const handleSendFeedback = async () => {
  setIsSaving(true);
  const feedbackData = { description: description2, rating: rating ?? 0 };

  try {
      if (feedback) {
          
          const updatedFeedbackData = { id: feedback.id, ...feedbackData };
          await dispatch(fetchUpdateFeedback(updatedFeedbackData));
          setOpenFeedbackModal(false);
          Swal.fire({
              title: t("swal.success"),
              text: t("utility.feedback.updated"),
              icon: "success",
              customClass: {
                popup: 'swal-popup'
              }
          });
      } else {
          
          await dispatch(fetchSaveFeedback(feedbackData));
          setOpenFeedbackModal(false);
          Swal.fire({
              title: t("swal.success"),
              text: t("utility.feedback.created"),
              icon: "success",
              customClass: {
                popup: 'swal-popup'
              }
          });
          
      }

      
      const response = await dispatch(fetchUserFeedback());
      if (response.payload) {
          setFeedback(response.payload);
          setDescription2(response.payload.description);
          setRating(response.payload.rating);
      } else {
          setFeedback(null);
      }

     

  } catch (error) {
      console.error('Feedback submission failed:', error);
      await Swal.fire({
          icon: 'error',
          title: t("swal.error"),
          text: t("utility.feedback.failed"),
          confirmButtonText: t("utility.feedback.ok"),
          customClass: {
            popup: 'swal-popup'
          }
      });
  } finally {
      setIsSaving(false);
  }
};

const handleDeleteFeedback = async () => {
  try {
      await dispatch(fetchDeleteFeedback());
      setFeedback(null);
      setOpenFeedbackModal(false);
      
    
      const result = await Swal.fire({
          title: t("utility.feedback.deleted"),
          customClass: {
            popup: 'swal-popup'
          }
  
      });

      if (result.isConfirmed) {
          setOpenFeedbackModal(true);
      }

      setDescription2('');
      setRating(0);
      setOpenFeedbackModal(false);


  } catch (error) {
      console.error('Feedback deletion failed:', error);
      await Swal.fire({
          icon: 'error',
          title: t("swal.error"),
          text: t("utility.feedback.notdeleted"),
          confirmButtonText: t("utility.feedback.ok"),
      })
  }
};

const handleOpenFeedbackModal = () => {
  setOpenFeedbackModal(true);
};
  const fetchUnreadCount = async () => {
    try {
      const notifications = await dispatch(fetchGetAllUnreadNotifications()).unwrap();
      setUnreadCount(notifications.length);
      setIsFetchSuccessful(true); // Eğer fetch başarılıysa true olarak ayarla
    } catch (error) {
      console.error('Okunmamış bildirim sayısını alırken hata oluştu:', error);
      setIsFetchSuccessful(false); // Hata durumunda false olarak ayarla
    }
  };

  useEffect(() => {
    fetchUnreadCount(); // İlk yüklemede okunmamış bildirim sayısını al

    // Sadece fetch başarılıysa WebSocket'i aktive et
    if (!isFetchSuccessful) {
      return; // Fetch başarısızsa WebSocket bağlantısını başlatma
    }

    const stompClient = new Client({
      brokerURL: "ws://localhost:9095/ws",
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("WebSocket'e bağlandı");

        // Okunmamış sayıyı almak için ilk abone olma
        stompClient.subscribe("/topic/unreadcountNotifications", (message) => {
          const newCount = JSON.parse(message.body);
          setUnreadCount(newCount); // Sunucudan alınan yeni okunmamış sayıyı güncelle
        });

        // Yeni bildirim geldiğinde çağırılacak
        stompClient.subscribe("/topic/create-notifications", () => {
          setUnreadCount((prevCount) => prevCount + 1); // Okunmamış sayıyı artır
        });

        // Bir bildirim okunduğunda
        stompClient.subscribe("/topic/markasread-notifications", () => {
          setUnreadCount((prevCount) => Math.max(prevCount - 1, 0)); // Okunmuş sayıyı azalt, 0'ın altına düşmesini engelle
        });

        // Bir bildirim silindiğinde
        stompClient.subscribe("/topic/delete-notifications", () => {
          setUnreadCount((prevCount) => Math.max(prevCount - 1, 0)); // Okunmuş sayıyı azalt, 0'ın altına düşmesini engelle
        });
      },
      onDisconnect: () => {
        console.log("WebSocket'ten bağlantı kesildi");
      },
      onStompError: (frame) => {
        console.error("STOMP Hatası", frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Hatası", error);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    // Bileşen unmounted olduğunda WebSocket'i temizle
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [dispatch, isFetchSuccessful]);

  // Opens the profile menu
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the mobile menu
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // Closes the main menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // Opens the mobile menu
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // Navigates to the specified page element
  const handlePageElementChangeRenderMenu = (element: string) => {
    handleMenuClose();
    navigate(`/${element}`);
  };

  // Toggles the language setting
  const handleLanguageChange = () => {
    dispatch(toggleLanguage());
  };

  // Navigates to the specified page element in mobile menu
  const handlePageElementChangeRenderMobileMenu = (element: string) => {
    handleMobileMenuClose();
    navigate(`/${element}`);
  };

  // General navigation to a page element
  const handlePageElementChange = (element: string) => {
    navigate(`/${element}`);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(clearRoles());
    dispatch(clearToken());
    dispatch(clearProfileImage())
    navigate('/login');
  }

  const renderNotificationMenu = (
      <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isNotificationOpen}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: "visible",
              mt: 1.5,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
      >
        <DropdownNotification />
      </Menu>
  );

  const menuId = "primary-search-account-menu";

  // Render the profile menu
  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          id={menuId}
          keepMounted
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={easyStyleMenu}
      >
        <MenuItem onClick={() => handlePageElementChangeRenderMenu("profile-management")}>
          {t("navigation.profile")}
        </MenuItem>
        <MenuItem onClick={() => handlePageElementChangeRenderMenu("account")}>
          {t("navigation.account")}
        </MenuItem>
        <MenuItem onClick={() => (handleOpenBugReportModal())}>
          {t("navigation.bugreport")}
          <BugReport style={{ marginLeft: 8 }} />
        </MenuItem>


        <MenuItem onClick={() => (handleOpenFeedbackModal())}>
          {t("navigation.feedback")}
          <Feedback style={{ marginLeft: 8 }} />
          
        </MenuItem>

        <MenuItem onClick={() => (navigate('/faq-postAuth'))}>
          {t("navigation.faq")}
          <Help style={{ marginLeft: 8 }} />
        </MenuItem>
        
        <Divider />
        <MenuItem
            sx={{ color: "primary.main" }}
            onClick={handleLanguageChange}
        >
          {t("localization.locale")}
        </MenuItem>
        <MenuItem
            sx={{ color: "primary.main" }}
            onClick={handleLogout}
        >
          {t("navigation.logout")}
        </MenuItem>
      </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  // Render the mobile menu
  const renderMobileMenu = (
      <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          id={mobileMenuId}
          keepMounted
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          PaperProps={easyStyleMenu}
      >
        <MenuItem onClick={() => handlePageElementChangeRenderMobileMenu("messages")}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>{t("navigation.messages")}</p>
        </MenuItem>
        <MenuItem onClick={() => handlePageElementChangeRenderMobileMenu("notifications")}>
          <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>{t("navigation.notifications")}</p>
        </MenuItem>
        <MenuItem onClick={() => handlePageElementChangeRenderMobileMenu("profile-management")}>
          <IconButton size="large" color="inherit">
            <PersonIcon />
          </IconButton>
          {t("navigation.profile-management")}
        </MenuItem>
        <MenuItem onClick={() => handlePageElementChangeRenderMobileMenu("account")}>
          <IconButton size="large" color="inherit">
            <ManageAccountsIcon />
          </IconButton>
          {t("navigation.account")}
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: "primary.main" }} onClick={handleLanguageChange}>
          <IconButton size="large" color="inherit">
            <LanguageIcon />
          </IconButton>
          {t("localization.locale")}
        </MenuItem>
      </Menu>
  );

  // Toggles the drawer open/close state
  const handleDrawerState = () => {
    setDrawerState(!drawerState);
  };

  //#region UI
  return (
      <>

        <EasyStyleAppBar position="fixed" drawerState={drawerState}>
          <Toolbar>
            <IconButton
                onClick={handleDrawerState}
                color="inherit"
                aria-label="toggle drawer"
                edge="start"
            >
              {drawerState ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  ml: 2,
                  mr: 2,
                  display: { xs: "none", sm: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
            >
              BUSINESS

            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={() => handlePageElementChange("messages")}
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon fontSize="large" />
                </Badge>
              </IconButton>
              <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
              >

                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon fontSize="large" />
                </Badge>
              </IconButton>
              <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
              >
                <Badge color="secondary">
                  <Avatar
                      src={profileImage}
                      alt={userName}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                  />
                </Badge>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </EasyStyleAppBar>


        {renderMobileMenu}
        {renderMenu}
        {renderNotificationMenu}

        <Dialog open={openAddCustomerModal} onClose={() => setOpenBugReport(false)} fullWidth
                maxWidth='sm'>
          <DialogTitle>{t("navigation.bugreport")}</DialogTitle>
          <DialogContent>
            <TextField
                sx={{marginTop: '15px'}}
                label={t('stockService.subject')}
                name="name"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                fullWidth
            />
            <TextField
                sx={{ marginTop: '15px' }}
                label={t('stockService.description')}
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                fullWidth
                multiline
                rows={10}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {setOpenBugReport(false)}} color="error" variant="contained">{t('stockService.cancel')}</Button>
            <Button onClick={() => handleSendBugReport()} color="success" variant="contained"
                    disabled={subject === '' || description === ''}>{t('stockService.send')}</Button>

          </DialogActions>
        </Dialog>
            <Dialog open={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {feedback ? t('utility.feedback.update') : t('utility.feedback.new')}
                </DialogTitle>
                <DialogContent>
                    <Rating
                        name="feedback-rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                    <TextField
                        sx={{ marginTop: '15px' }}
                        label={t('utility.feedback.enter')}
                        name="description"
                        value={description2}
                        onChange={e => setDescription2(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    {feedback && (
                        <>
                            <Button onClick={handleDeleteFeedback} color="error">
                                {t('utility.feedback.delete')}
                            </Button>
                        </>
                    )}
                    <Button onClick={() => setOpenFeedbackModal(false)} color="error">
                        {t('utility.feedback.cancel')}
                    </Button>
                    <Button
                        onClick={handleSendFeedback}
                        color="success"
                        variant="contained"
                        disabled={description2.trim() === '' || rating === 0}
                    >
                        {t('utility.feedback.send')}
                    </Button>
                </DialogActions>
            </Dialog>

        
      </>
  );
  //#endregion UI
}

export default Appbar;