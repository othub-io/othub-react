import React, { useState, useEffect } from "react";

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const FileUpload = ({ selectedFile, openPopUp}) => {
  const [assetContent, setAssetContent] = useState(null);
  const [selectFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const parsedContent = JSON.parse(content);
      if (!parsedContent["@context"]) {
        setError("File has no Schema context.");
      } else {
        setAssetContent(content);
      }
    } catch (jsonError) {
      setError("Invalid JSON format. Please upload a valid JSON file.");
    }
  };
  
  const handleFileChange = (event) => {
    try {
      selectedFile(null);
      setAssetContent(null);
      setSelectedFile(null);
      setError(null);
      
      const file = event.target.files[0];
  
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const parsedContent = JSON.parse(content);
  
          if (!parsedContent["@context"]) {
            setError("File has no Schema context.");
          } else {
            setAssetContent(content);
            selectedFile(file);
          }
        } catch (jsonError) {
          setError("Invalid JSON format. Please upload a valid JSON file.");
        }
      };
  
      setSelectedFile(file);
      
      // Read the file as text
      file !== null ? reader.readAsText(file) : setAssetContent(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const PopUp = () => {
    openPopUp(selectFile);
  };

  return (
    <div className="publish-file-upload">
      <div className="browse-button">
        <input type="file" accept=".json" onChange={handleFileChange} />
      </div>
      {selectFile && (
        <div className="selected-file">
          <p>
            Selected file: {selectFile.name} ({formatBytes(selectFile.size)}
            )
          </p>
        </div>
      )}
      {error && (
        <div className="file-error">
          <p>Invalid Json: {error}</p>
        </div>
      )}
      {assetContent && (
        <button className="upload-button" onClick={PopUp}>
          Publish
        </button>
      )}
    </div>
  );
};

export default FileUpload;
