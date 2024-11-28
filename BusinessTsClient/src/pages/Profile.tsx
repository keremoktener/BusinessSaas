import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { uploadFile, fetchFile } from '../store/feature/fileSlice';

function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const files = useSelector((state: RootState) => state.fileSlice.files);
  const uuid = useSelector((state: RootState) => state.fileSlice.uuid);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadFile(selectedFile)).then(() => {
        dispatch(fetchFile(uuid))
        .unwrap()
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error fetching file:", error);
        });
      })
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>
        Upload
      </button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image</h3>
          <img src={imageUrl} alt="Uploaded file" style={{ maxWidth: '200px', maxHeight: '200px' }} />
        </div>
      )}
    </div>
  );
}

export default Profile;
