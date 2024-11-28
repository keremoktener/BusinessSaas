import React, { useState } from 'react';
import { Button, Input, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

interface IFileUpload {
  onFileUpload: (files: File[]) => void;  
  onFileDelete: (bucketName: string, uuid: string) => void; 
  accept?: string;                        
  buttonText?: string;     
  disabled?: boolean;                
}

function FileUploadProps(props: IFileUpload) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bucketName, setBucketName] = useState('');
  const [uuid, setUuid] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      props.onFileUpload(selectedFiles);
      const file = selectedFiles[0]; 
      if (file.type === 'application/pdf') {
        const blobUrl = URL.createObjectURL(file);
        setDownloadUrl(blobUrl); 
      }
      setSelectedFiles([]);
    }
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setBucketName('');
    setUuid('');
  };

  const handleDeleteClick = () => {
    props.onFileDelete(bucketName, uuid);
    closeDeleteDialog();
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Dosya Yükleme
      </Typography>
      <Input
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: props.accept }} 
        disabled={props.disabled}
      />
      
  
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: '10px', fontSize: '12px' }} 
          onClick={handleUploadClick}
          disabled={selectedFiles.length === 0 || props.disabled}  
        >
          {props.buttonText}
        </Button>

        <Button
          variant="contained"
          color="primary"
          style={{ fontSize: '12px', padding: '5px 10px' }} 
          onClick={openDeleteDialog}
        >
          Dosya Sil
        </Button>
      </div>

      {/* PDF indirme butonu */}
      {downloadUrl && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">PDF İndirme:</Typography>
          <Button variant="contained" color="primary" href={downloadUrl} download>
            PDF İndir
          </Button>
        </div>
      )}

      {/* Popup */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Dosya Sil</DialogTitle>
        <DialogContent>
          <TextField
            label="Bucket Name"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="UUID"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            İptal
          </Button>
          <Button onClick={handleDeleteClick} color="primary">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FileUploadProps;

