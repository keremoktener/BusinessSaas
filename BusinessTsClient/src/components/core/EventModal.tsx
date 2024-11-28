import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  DialogActions,
  Button,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchExtractAuthId, fetchSaveEvent } from "../../store/feature/eventSlice.tsx";
import Swal from 'sweetalert2';
import { fetchGetAllUsersPageable } from "../../store/feature/userSlice.tsx";
import { IPageableUserList } from "../../model/IPageableUserList.tsx";
import { IUser } from "../../model/IUser.tsx";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (eventData: { title: string; startTime: Date; endTime: Date; description: string; location: string; invitedUserIds: number[]; }) => void;
}

const EventModal: React.FC<EventModalProps> = ({ open, onClose }) => {

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>(''); // location alanı eklendi
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedInvitees, setSelectedInvitees] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [userListPageable, setUserListPageable] = useState<IUser[]>([]);
  const [authId, setAuthId] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const authResponse = await dispatch(fetchExtractAuthId());
      const data = await dispatch(fetchGetAllUsersPageable({ searchText: searchTerm, page: currentPage, size: pageSize }));
      setLoading(false);

      if (authResponse.payload && authResponse.payload.code === 200) {
        setAuthId(authResponse.payload.data);
      }

      if (data.payload.code === 200) {
        const userData: IPageableUserList = data.payload.data;
        setUserListPageable(userData.userList);
      } else {
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, [dispatch, currentPage, pageSize, searchTerm]);

  const filteredUserList = userListPageable.filter(user => user.id !== authId);

  const handleInviteeChange = (user: IUser) => {
    const alreadySelected = selectedInvitees.some(invitee => invitee.id === user.id);
    setSelectedInvitees(alreadySelected
        ? selectedInvitees.filter(invitee => invitee.id !== user.id)
        : [...selectedInvitees, user]
    );
  };

  const handleSubmit = async () => {
    if (!title || !description || !startTime || !endTime || !location) {  // location kontrolü eklendi
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time should be after start time.');
      return;
    }

    setError(null);

    const inviteeIds = selectedInvitees.map(invitee => invitee.id);

    try {
      const resultAction = await dispatch(fetchSaveEvent({
        title,
        description,
        location,  // location alanı burada gönderiliyor
        startDateTime: new Date(startTime),
        endDateTime: new Date(endTime),
        invitedUserIds: inviteeIds,
      }));

      if (fetchSaveEvent.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: 'success',
          title: 'Event Created!',
          text: 'The event was created successfully.',
          confirmButtonText: 'OK'
        });
        resetForm();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was an error creating the event.',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error creating the event.',
        confirmButtonText: 'OK'
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');  // location alanı sıfırlanıyor
    setStartTime('');
    setEndTime('');
    setSelectedInvitees([]);
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create Event
          <IconButton
              aria-label="close"
              onClick={onClose}
              style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
              label="Title"
              autoFocus
              margin="dense"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
              label="Description"
              margin="dense"
              type="text"
              fullWidth
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
              label="Location"
              margin="dense"
              type="text"
              fullWidth
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
          />

          <label style={{ fontSize: '14px', color: '#091057', marginTop: '16px', display: 'block' }}>
            Invite
          </label>

          {loading ? (
              <CircularProgress />
          ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px' }}>
                {filteredUserList.map((user) => (
                    <div key={user.id} style={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                          checked={selectedInvitees.some((invitee) => invitee.id === user.id)}
                          onChange={() => handleInviteeChange(user)}
                      />
                      <span>{`${user.firstName} ${user.lastName}`}</span>
                    </div>
                ))}
              </div>
          )}

          <label style={{ fontSize: '14px', color: '#091057', marginTop: '16px', display: 'block' }}>
            Start Date
          </label>
          <TextField
              margin="dense"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
          />

          <label style={{ fontSize: '14px', color: '#091057', marginTop: '16px', display: 'block' }}>
            End Date
          </label>
          <TextField
              margin="dense"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
          />

          {selectedInvitees.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <strong>Selected Invitees:</strong>
                <ul>
                  {selectedInvitees.map(invitee => (
                      <li key={invitee.id}>{`${invitee.firstName} ${invitee.lastName}`}</li>
                  ))}
                </ul>
              </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default EventModal;
