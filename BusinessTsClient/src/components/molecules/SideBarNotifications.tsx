import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState, useAppSelector } from "../../store";
import {
  fetchGetAllNotifications,
  fetchGetAllUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../store/feature/notificationSlice";
import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SelectChangeEvent } from "@mui/material/Select";
import { Client } from "@stomp/stompjs";

// Notification interface
interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const SideBarNotifications: React.FC = () => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const [selectedNotificationIds, setSelectedNotificationIds] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState("dateDesc");
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const notificationList = useAppSelector((state: RootState) => state.notifications.notifications);
  const status = useAppSelector((state: RootState) => state.notifications.status);

  useEffect(() => {
    if (status === "idle") {
      if (showUnreadOnly) {
        dispatch(fetchGetAllUnreadNotifications());
      } else {
        dispatch(fetchGetAllNotifications());
      }
    }
  }, [dispatch, showUnreadOnly]);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:9095/ws",
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        stompClient.subscribe("/topic/create-notifications", (message) => {
          const notification: Notification = JSON.parse(message.body);
          dispatch(fetchGetAllNotifications());
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error("STOMP Error", frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Error", error);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [dispatch]);

  const handleToggleSelect = (id: number) => {
    if (selectionMode) {
      const newSet = new Set(selectedNotificationIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setSelectedNotificationIds(newSet);
    }
  };

  const handleSelectionModeToggle = () => {
    setSelectionMode(!selectionMode);
    if (!selectionMode) {
      setSelectedNotificationIds(new Set());
    }
  };


  const handleShowUnreadToggle = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };


  const handleDeleteClick = () => {
    if (selectedNotificationIds.size > 0) {
      dispatch(deleteNotification(Array.from(selectedNotificationIds))).then(() => {
        setSelectedNotificationIds(new Set());
        setSelectionMode(false);
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (selectionMode) return;

    setSelectedNotification(notification);
    setOpen(true);
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id)).then(() => {
        const updatedNotification = { ...notification, isRead: true };
        setSelectedNotification(updatedNotification);
      });
    }
  };

  const handleDeleteNotification = () => {
    if (selectedNotification) {
      dispatch(deleteNotification([selectedNotification.id])).then(() => {
        setOpen(false);
        setSelectedNotification(null);
      }).catch((error) => {
        console.error('Failed to delete notification:', error);
      });
    }
  };
  const handleDeleteAllClick = () => {
    const allNotificationIds = notificationList.map((notif) => notif.id);
    if (allNotificationIds.length > 0) {
      dispatch(deleteNotification(allNotificationIds)).then(() => {
        setSelectedNotificationIds(new Set());
        setSelectionMode(false);
      });
    }
  };

  const sortedNotifications = [...notificationList].sort((a, b) => {
    switch (sortOrder) {
      case "dateAsc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "dateDesc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const filteredNotifications = sortedNotifications.filter(
      (notif) =>
          (notif.title && notif.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (notif.message && notif.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedNotifications = showUnreadOnly
      ? filteredNotifications.filter(notif => !notif.isRead)
      : filteredNotifications;



  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };


  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };
  return (
      <Box sx={{ padding: 4, maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <Paper elevation={3} sx={{ width: "100%", padding: 4, display: "flex", flexDirection: "column", height: "calc(100vh - 200px)" }}>
          <Typography variant="h5" gutterBottom>
            {t("notifications.title")}
          </Typography>

          <Box sx={{ mb: 2, display: "flex", gap: 2, flexDirection: "column" }}>
            <TextField
                fullWidth
                label={t("notifications.search")}
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel>{t("notifications.sortBy")}</InputLabel>
              <Select value={sortOrder} onChange={handleSortChange} label={t("notifications.sortBy")}>
                <MenuItem value="dateDesc">{t("notifications.dateNewestFirst")}</MenuItem>
                <MenuItem value="dateAsc">{t("notifications.dateOldestFirst")}</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Checkbox
                  checked={selectionMode}
                  onChange={handleSelectionModeToggle}
                  disabled={filteredNotifications.length === 0}
              />
              <Typography>{t("notifications.selectMode")}</Typography>
              <Button variant="contained" color="primary" onClick={handleShowUnreadToggle}>
                {showUnreadOnly ? t("notifications.showAll") : t("notifications.showUnread")}
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteClick} disabled={selectedNotificationIds.size === 0}>
                {t("notifications.deleteSelected")}
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteAllClick} disabled={notificationList.length === 0}>
                {t("notifications.deleteAll")}
              </Button>
            </Box>
          </Box>

          <List sx={{ overflow: "auto", maxHeight: "100%" }}>
            {displayedNotifications.length > 0 ? (
                displayedNotifications.map((notif) => (
                    <React.Fragment key={notif.id}>
                      <ListItemButton
                          onClick={() => handleNotificationClick(notif)}
                          sx={{
                            backgroundColor: notif.isRead ? "background.paper" : "action.hover",
                            borderRadius: 1,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                            "&:hover": {
                              backgroundColor: "action.selected",
                            },
                          }}
                      >
                        <Checkbox
                            checked={selectedNotificationIds.has(notif.id)}
                            onChange={() => handleToggleSelect(notif.id)}
                            disabled={!selectionMode}
                        />
                        <ListItemText
                            primary={notif.title || t("notifications.noTitle")}
                            secondary={new Date(notif.createdAt).toLocaleDateString()}
                            sx={{ color: notif.isRead ? "text.primary" : "text.secondary" }}
                        />
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                ))
            ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  {t("notifications.noNotifications")}
                </Typography>
            )}
          </List>
        </Paper>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {selectedNotification?.title}
            <IconButton edge="end" color="inherit" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">{selectedNotification?.message}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {selectedNotification && new Date(selectedNotification.createdAt).toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("notifications.close")}
            </Button>
            <Button onClick={handleDeleteNotification} color="error">
              {t("notifications.delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};
export default SideBarNotifications;
