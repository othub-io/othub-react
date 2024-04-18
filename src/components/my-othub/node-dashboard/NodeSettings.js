import React, { useState, useEffect } from "react";
import Loading from "../../effects/Loading";
import axios from "axios";

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const NodeSettings = (settings) => {
  const [telegramData, setTelegramData] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState({
    telegram_id: "",
    bot_token: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          let data;
          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/notifications/telegram/info`,
            {},
            config
          );

          if(response.data.result[0]){
            setInputValue(response.data.result[0]);
            setTelegramData(response.data.result[0]);
          }

        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setTelegramData("");
    fetchData();
  }, [account, chain_id]);

  const handleNodeSettingsInput = (e) => {
    const { name, value } = e.target;
    setInputValue((inputValue) => ({
      ...inputValue,
      [name]: value,
    }));
  };

  const handleNodeSettingsSubmit = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchFilteredData = async () => {
        try {
          let data = {
            telegramID: inputValue.telegram_id,
            botToken: inputValue.bot_token,
            nodeId: [settings.data],
          };

          try{
            await axios.post(
              `${process.env.REACT_APP_API_HOST}/notifications/telegram/edit`,
              data,
              config
            );
            setError(false);

            await axios.post(
              `${process.env.REACT_APP_API_HOST}/notifications/telegram/notify`,
              data,
              config
            );

            let response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/notifications/telegram/info`,
              data,
              config
            );
  
            setInputValue(response.data.result[0]);
            setTelegramData(response.data.result[0]);
            setSaved(true)
          }catch(e){
            setSaved(false)
            setError(true);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(true);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

  return (
    <div className="settings">
      <div>
        <form onSubmit={handleNodeSettingsSubmit}>
          <div>
            <br></br>
            Telegram ID<br></br>
            <input
              type="text"
              name="telegram_id"
              value={inputValue ? inputValue.telegram_id : ""}
              onChange={handleNodeSettingsInput}
              maxLength="100"
            />
          </div>
          <br></br>
          <div>
            <br></br>
            Bot Token<br></br>
            <input
              type="text"
              name="bot_token"
              value={inputValue ? inputValue.bot_token : ""}
              onChange={handleNodeSettingsInput}
              maxLength="100"
            />
          </div>
          <br></br>
          {saved ? (
            <div className="saved-notif">Notification settings saved!</div>
          ) : error ? (
            <div className="saved-notif">Invalid Telegram credentials provided.</div>
          ) : (
            ""
          )}
          <button type="submit">Save</button>
          <br></br>
        </form>
      </div>
    </div>
  );
};

export default NodeSettings;
