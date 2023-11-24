import React, { useState, useEffect } from "react";
import Loading from "../../Loading";
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

const NodeSettings = () => {
  const [data, setData] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [inputValue, setInputValue] = useState({
    telegram_id: "",
    bot_token: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          const request_data = {
            network: chain_id,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeSettings`,
              request_data,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response.data;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

            console.log(response)
            if(response){
              setInputValue({
                telegram_id: response.operatorRecord[0].telegramID,
                bot_token: response.operatorRecord[0].botToken
              })
            }
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [account,chain_id]);

  let telegramID;
  let botToken;

  if (data) {
    if (data.operatorRecord.toString().trim() === "") {
    } else {
      telegramID = data.operatorRecord[0].telegramID;

      botToken = "Not Set";
      if (data.operatorRecord[0].botToken) {
        botToken = data.operatorRecord[0].botToken.substring(0, 20) + "...";
      }
    }
  }

  const handleNodeSettingsInput = (e) => {
    console.log(e.target)
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
          const request_data = {
            network: chain_id,
            sendScript: "yes",
            telegramID: inputValue.telegram_id,
            botToken: inputValue.bot_token,
          };

          console.log(request_data)
          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeSettings`,
            request_data,
            config
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
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
      {data ? (
        <div>
           <form onSubmit={handleNodeSettingsSubmit}>
              <div>
                <br></br>
                Telegram ID<br></br>
                <input
                  type="text"
                  name="telegram_id"
                  value={inputValue.telegram_id}
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
                  value={inputValue.bot_token}
                  onChange={handleNodeSettingsInput}
                  maxLength="100"
                />
              </div>
              <br></br>
              <button type="submit">Save</button>
              <br></br>
            </form>
        </div>
      ) : (
        <div style={{paddingTop: "80px"}}><Loading /></div>
      )}
    </div>
  );
};

export default NodeSettings;
