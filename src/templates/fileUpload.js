import React, { useState } from "react";

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const JsonFileUploadPopup = ({ selectedFile, openPopUp}) => {
  const [assetContent, setAssetContent] = useState(null);
  const [selectFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    try {
      selectedFile(null);
      setAssetContent();
      setSelectedFile();
      setError();
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        if (!JSON.parse(content)["@context"]) {
          setError(`File has no Schema context.`);
        } else {
          setAssetContent(content);
        }
      };

      reader.onerror = () => {
        setError("Invalid JSON file. Please check the file format.");
      };

      selectedFile(file);
      setSelectedFile(file);
      file !== null ? reader.readAsText(file) : setAssetContent(null);
    } catch (e) {
      setError(e);
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
      {assetContent ? (
        <button className="upload-button" onClick={PopUp}>
          Publish
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default JsonFileUploadPopup;
