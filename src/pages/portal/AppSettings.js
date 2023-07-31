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

const AppSettings = (app_data) => {
  const { chain_id, account } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let enabled_apps = {}
        for (let i =0;i < app_data.data.all_apps.length; i++) {
          let app_name = app_data.data.all_apps[i].app_name
          enabled_apps[app_name] = false;
        }

        for (let i =0;i < app_data.data.enabled_apps.length; i++) {
          let app_name = app_data.data.enabled_apps[i].app_name
          enabled_apps[app_name] = true;
        }

        setFormData(enabled_apps)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const applyAppSettings = async () => {
    // Perform the POST request using the entered value
    try {
      const applyFormData = async () => {
        setIsLoading(true)
          await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}&enable_apps=${JSON.stringify(formData)}`
          );
      };

      applyFormData();
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
    console.log(event.target)
    const { name, checked } = event.target;
    console.log(name)
    console.log(checked)
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
    console.log('HEYEYEY'+JSON.stringify(formData))
  };

  return (
    <div>
      <div className='apps-filter'></div>
      <div className='apps-list'>
        <form onSubmit={applyAppSettings}>
          {app_data.data.all_apps.map((app) => (
            <div key={app.app_name}>
              <label>{app.app_name}</label>
              <input
                  type="checkbox"
                  name={app.app_name}
                  className={`${app.app_name}-list-item`}
                  onChange={handleInputChange}
                />
            </div>
          ))}
          <br></br>
          <button type='sumbit'>Apply</button>
        </form>
      </div>
    </div>
  );
};

export default AppSettings;
