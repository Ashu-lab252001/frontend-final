// components/ActionBar.jsx
import React, { useEffect, useState } from 'react';
import './ActionBar.css';

const ActionBar = ({ folders, onCreateFolder, onDeleteFolder, onSelectFolder }) => {
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  useEffect(() => {
    if (folders.length > 0 && !selectedFolderId) {
      const initialFolderId = folders[0]._id;
      setSelectedFolderId(initialFolderId);
      onSelectFolder(initialFolderId);
    }
  }, [folders, selectedFolderId, onSelectFolder]);

  const selectFolder = (folderId) => {
    setSelectedFolderId(folderId);
    onSelectFolder(folderId);
  };

  const deleteFolder = (folderId, event) => {
    event.stopPropagation();
    console.log('Deleting folder with ID:', folderId);
    onDeleteFolder(folderId);
  };

  return (
    <div className="action-bar">
      <button className="create-folder-btn" onClick={onCreateFolder}>
        <span className="folder-icon">📁</span>
        Create a folder
      </button>
      {folders.map((folder) => (
        <button 
          key={folder._id} 
          className={`network-btn ${selectedFolderId === folder._id ? 'selected' : ''}`}
          onClick={() => selectFolder(folder._id)}
        >
          {folder.name}
          <span 
            className="delete-icon" 
            onClick={(event) => deleteFolder(folder._id, event)}
          >
            🗑
          </span>
        </button>
      ))}
    </div>
  );
};

export default ActionBar;
