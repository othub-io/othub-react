import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/googlecode.css";
import "../../css/publish.css";
import AssetPublish from "./assetPublish";
import EventForm from "./templates/event";
import OrganizationForm from "./templates/organization";
import ProductForm from "./templates/product";
import PersonForm from "./templates/person";
import FileUpload from "./templates/fileUpload";

let ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const types = ["File Upload", "Organization", "Product", "Person"];

//REACT_APP_SUPPORTED_NETWORKS
const Publish = () => {
  const [type, setType] = useState("File Upload");
  const [popUp, setPopUp] = useState(false);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [displayContent, setDisplayContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setDisplayContent(content);
      };
      reader.readAsText(selectedFile);
      hljs.highlightAll();
    }
  }, [selectedFile]);

  const openPopUp = () => {
    setPopUp(true);
  };

  const closePopUp = () => {
    setDisplayContent();
    setType(types[0]);
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

  if (window.matchMedia("(max-width: 1300px)").matches) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please switch to desktop to publish assets.
        </header>
      </div>
    );
  }

  if (
    connected_blockchain !== "Origintrail Parachain Testnet" &&
    connected_blockchain !== "Origintrail Parachain Mainnet"&&
    connected_blockchain !== "Chiado Testnet"&&
    connected_blockchain !== "Gnosis Mainnet"
  ) {
    return (
      <div className="keys">
        <header className="keys-header">
          Connected with an unsupported blockchain. Supported blockchains are:<br/>
          OriginTrail Parachain Testnet<br/>
          OriginTrail Parachain Mainnet<br/>
          Chiado Testnet<br/>
          Gnosis Mainnet<br/>
        </header>
      </div>
    );
  }

  if (popUp) {
    return (
      <div className="popup-overlay">
        <div className="publish-popup-content">
          <button className="app-settings-close-button" onClick={closePopUp}>
            X
          </button>
          <AssetPublish data={selectedFile ? selectedFile : displayContent} />
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
            <select onChange={(e) => setType(e.target.value)}>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="publish-json-display-div">
          {displayContent && (
            <pre>
              <code className="json">
                {JSON.stringify(JSON.parse(displayContent), null, 2)}
              </code>
            </pre>
          )}
        </div>
        <div className="publish-form-div">
          {/* {type === "Event" && 
            <EventForm 
              displayContent={setDisplayContent}
              openPopUp={openPopUp}
            />} */}
          {type === "Organization" && (
            <OrganizationForm
              displayContent={setDisplayContent}
              openPopUp={openPopUp}
            />
          )}
          {type === "Product" && (
            <ProductForm
              displayContent={setDisplayContent}
              openPopUp={openPopUp}
            />
          )}
          {type === "Person" && (
            <PersonForm
              displayContent={setDisplayContent}
              openPopUp={openPopUp}
            />
          )}
          {type === "File Upload" && (
            <FileUpload selectedFile={setSelectedFile} openPopUp={openPopUp} />
          )}
        </div>
      </div>
    )
  );
};

export default Publish;
