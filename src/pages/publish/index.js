import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/googlecode.css";
import "../../css/publish.css";
import AssetPublish from "./assetPublish";
import EventForm from "./templates/event";
import ArticleForm from "./templates/article";
import PersonForm from "./templates/person";
import FileUpload from "./templates/fileUpload";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const types = ["File Upload", "Event", "Article", "Person"];


//REACT_APP_SUPPORTED_NETWORKS
const Publish = () => {
  const [type, setType] = useState("File Upload");
  const [popUp, setPopUp] = useState(false);
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [displayContent, setDisplayContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    hljs.highlightAll();
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setDisplayContent(content);
      };
      reader.readAsText(selectedFile)
    }
  }, [selectedFile]);

  const openPopUp = () => {
    setPopUp(true);
  };

  const closePopUp = () => {
    setDisplayContent()
    setPopUp(false);
  };

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your mapped wallet to start publishing assets!
        </header>
      </div>
    );
  }

  if (window.matchMedia("(max-width: 1000px)").matches) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please switch to desktop to publish assets.
        </header>
      </div>
    );
  }

  if (
    chain_id !== "Origintrail Parachain Testnet" &&
    chain_id !== "Origintrail Parachain Mainnet"
  ) {
    return (
      <div className="keys">
        <header className="keys-header">
          Connected with an unsupported chain. Please switch to Origintrail
          Parachain Testnet or Mainnet.
        </header>
      </div>
    );
  }

  if (popUp) {
    return (
      <div className="popup-overlay">
        <div className="publish-popup-content">
          <button
            className="app-settings-close-button"
            onClick={closePopUp}
          >
            X
          </button>
          <AssetPublish data={selectedFile ? (selectedFile) : (displayContent)}/> 
        </div>
      </div>
    );
  }

  return (
    account && (
      <div className="publish">
        <div className="publish-header"></div>
        <div className="publish-event-selection-div">
          <div className="type-drop-down">
            <span style={{ marginLeft: "20px" }}>Select Type:</span>
            <select>
              {types.map((type) => (
                <option key={type} onClick={() => setType(type)}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="publish-json-display-div">
          {displayContent ? (
            <pre>
              <code className="json">
                {JSON.stringify(JSON.parse(displayContent), null, 2)}
              </code>
            </pre>
          ) : (
            ""
          )}
        </div>
        <div className="publish-form-div">
          {type === "Event" ? 
            <EventForm 
              displayContent={setDisplayContent}
              openPopUp={openPopUp}
            /> : ""}
          {type === "Article" ? <ArticleForm /> : ""}
          {type === "Person" ? <PersonForm /> : ""}
          {type === "File Upload" ? (
            <FileUpload
              selectedFile={setSelectedFile}
              openPopUp={openPopUp}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    )
  );
};

export default Publish;
