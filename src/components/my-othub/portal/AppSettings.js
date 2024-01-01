import React, { useContext, useState, useEffect } from "react";
import "../../../css/AppSettings.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../../AccountContext";
import Loading from "../../effects/Loading";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const AppSettings = () => {
  const { setIsAppSettingsOpen, data, setData } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [isLoading, setIsLoading] = useState(false);
  const [appsEnabled, setAppsEnabled] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [clickedIndex, setClickedIndex] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (
          account &&
          (connected_blockchain === "Origintrail Parachain Testnet" ||
          connected_blockchain === "Origintrail Parachain Mainnet")
        ) {
          const request_data = {
            blockchain: connected_blockchain,
            progress: "PENDING",
          };
          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
            request_data,
            config
          );
          await setData(response.data);
          for (let i = 0; i < response.data.apps_enabled.length; i++) {
            setAppsEnabled((prevFormData) => ({
              ...prevFormData,
              [response.data.apps_enabled[i].app_name]:
                response.data.apps_enabled[i].checked,
            }));
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [account]);

  const applyAppSettings = async () => {
    // Perform the POST request using the entered value
    try {
      setIsLoading(true);
      const request_data = {
        blockchain: connected_blockchain,
        enable_apps: JSON.stringify(appsEnabled),
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
        request_data,
        config
      );
      await setData(response.data);
      setIsLoading(false);
      setIsAppSettingsOpen(false);
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

  if (isLoading) {
    return <Loading />;
  }

  const applySearch = async () => {
    try {
      setIsLoading(true);
      const request_data = {
        app_search: inputValue,
        blockchain: connected_blockchain,
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/app-settings`,
        request_data,
        config
      );

      await setSearchResult(response.data);
      for (let i = 0; i < response.data.apps_enabled.length; i++) {
        setAppsEnabled((prevFormData) => ({
          ...prevFormData,
          [response.data.apps_enabled[i].app_name]:
            response.data.apps_enabled[i].checked,
        }));
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  const handleInputChange = (event) => {
    const { name, checked } = event.target;
    setAppsEnabled((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAppClick = (index) => {
    setClickedIndex(index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <div className="apps-filter"></div>
      {data ? (
        <div>
          <div className="app-search">
            <form onSubmit={applySearch}>
              <button type="submit" className="app-search-button">
                Search
              </button>
              <input
                type="text"
                placeholder="Search an app..."
                onChange={(event) => handleSearchChange(event)}
                value={inputValue}
              />
            </form>
          </div>
          <form onSubmit={applyAppSettings}>
            <div className="apps-list">
              {searchResult.search_result ? (
                <div>
                  {searchResult.search_result.map((result, index) => (
                    <div>
                      <div
                        key={result.app_name}
                        onClick={() => handleAppClick(index)}
                        className="app-list-item"
                        onMouseEnter={() => handleMouseEnter()}
                        onMouseLeave={() => handleMouseLeave()}
                      >
                        <input
                          type="checkbox"
                          name={result.app_name}
                          defaultChecked={
                            searchResult.apps_enabled[index].checked
                          }
                          onChange={(event) => handleInputChange(event)}
                          onLoad={(event) => handleInputChange(event)}
                        />
                        <label>{result.app_name}</label>
                        {isHovered && (
                          <div className="tooltip" key={result.app_name}>
                            <span>{result.app_description}</span>
                            <span>{result.website}</span>
                            <span>{result.github}</span>
                            <span>{result.built_by}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {data.apps_enabled.map((app) => (
                    <div key={app.app_name} className="app-list-item">
                      <input
                        type="checkbox"
                        name={app.app_name}
                        defaultChecked={app.checked}
                        onChange={(event) => handleInputChange(event)}
                        onLoad={(event) => handleInputChange(event)}
                      />
                      <label>{app.app_name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="app-settings-button">Save</button>
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AppSettings;
