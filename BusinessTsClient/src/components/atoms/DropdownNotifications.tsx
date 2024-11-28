import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  fetchGetAllNotifications,
  markNotificationAsRead,
  deleteNotification,
  fetchGetAllUnreadNotifications
} from "../../store/feature/notificationSlice";
import { RootState, AppDispatch } from "../../store";
import { useTranslation } from "react-i18next";

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  authId: string;
}

const DropdownNotification: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    dispatch(fetchGetAllUnreadNotifications());
  }, [dispatch]);


  const sortedNotifications = [...notifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

  const handleClickOpen = (notification: Notification) => {
    setSelectedNotification(notification);
    setOpen(true);
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id)).then(() => {
        const updatedNotification = { ...notification, isRead: true };
        setSelectedNotification(updatedNotification);
        dispatch(fetchGetAllUnreadNotifications());
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
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

  return (
      <div>
        {sortedNotifications.length === 0 ? (
            <MenuItem>
              <ListItemText primary={t("notifications.noNotifications")} />
            </MenuItem>
        ) : (
            sortedNotifications.map((notification) => (
                <MenuItem key={notification.id} onClick={() => handleClickOpen(notification)}>
                  <ListItemText
                      primary={notification.title}
                      secondary={new Date(notification.createdAt).toLocaleTimeString()}
                  />
                </MenuItem>
            ))
        )}
        <Divider />
        <MenuItem component={Link} to="/notifications">
          <Typography variant="body2" color="text.secondary">
            {t("notifications.viewAllNotifications")}
          </Typography>
        </MenuItem>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedNotification?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{selectedNotification?.message}</Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 2 }}
            >
              {selectedNotification && new Date(selectedNotification.createdAt).toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("notifications.close")}
            </Button>
            <Button
                onClick={handleDeleteNotification}
                color="error"
            >
              {t("notifications.delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
};

export default DropdownNotification;
