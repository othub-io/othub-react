import React, { useContext, useState, useEffect } from "react";
import "../../css/portal/AppSettings.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../AccountContext";
import Loading from "../../Loading";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const AppSettings = () => {
  const [data, setData] = useState("");
  const { chain_id, account } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false);
  const [appsEnabled, setAppsEnabled] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        if (account && (chain_id ==='Origintrail Parachain Testnet' || chain_id ==='Origintrail Parachain Mainnet')) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}`
          );
          await setData(response.data);
          console.log('poop '+JSON.stringify(data.apps_enabled))
          for(let i = 0; i < response.data.apps_enabled.length; i++){
            setAppsEnabled((prevFormData) => ({
              ...prevFormData,
              [response.data.apps_enabled[i].app_name]: response.data.apps_enabled[i].checked,
            }));
          }

        }
        setIsLoading(false)
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
      setIsLoading(true)
      const response = await axios.get(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}&enable_apps=${JSON.stringify(appsEnabled)}`
      );
      await setData(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleInputChange = (event) => {
    const { name, checked } = event.target;
    setAppsEnabled((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  return (
    <div>
      <div className='apps-filter'></div>
      {data ? (<div>
        <form onSubmit={applyAppSettings}>
          <div className='apps-list'>
          {data.apps_enabled.map((app) => (
            <div key={app.app_name} className='app-list-item'>
              <label>{app.app_name}</label>
              <input
                  type="checkbox"
                  name={app.app_name}
                  defaultChecked={app.checked}
                  onChange={(event) => handleInputChange(event)}
                  onLoad={(event) => handleInputChange(event)}
                />
            </div>
          ))}
          </div>
          <button className="app-settings-button">Apply</button>
        </form>
      </div>) :
      (<div></div>)}
    </div>
  );
};

export default AppSettings;
