import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css"; // Import the styles

const Event = ({ displayContent, openPopUp }) => {
  const [formData, setFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Event",
    name: "",
    url: "",
    eventStatus: "",
    startDate: null,
    endDate: null,
    description: "",
    location: {
      "@type": "Place",
      name: "",
      address: "", // Add the address field
    },
  });

  useEffect(() => {
    const filteredFormData = Object.entries(formData)
      .filter(
        ([key, value]) => key !== "name" || (key === "name" && value !== "")
      )
      .filter(
        ([key, value]) => key !== "url" || (key === "url" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "eventStatus" || (key === "eventStatus" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "startDate" || (key === "startDate" && value !== null)
      )
      .filter(
        ([key, value]) =>
          key !== "endDate" || (key === "endDate" && value !== null)
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "location" || (key === "location" && value.name !== "")
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    displayContent(JSON.stringify(filteredFormData));
  }, [formData, displayContent]);

  const handleFormInput = (name, value) => {
    if (name === "location") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          name: value,
        },
      }));
    } else if (name === "address") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          address: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const PopUp = () => {
    openPopUp(formData);
  };

  return (
    formData && (
      <form className="create-app-form">
        {Object.keys(formData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = formData[fieldName];

          if (fieldName !== "@context" && fieldName !== "@type") {
            return (
              <div key={fieldName}>
                <label>{label}</label>
                {fieldName === "eventStatus" ? (
                  <select
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  >
                    <option value="">Event Status</option>
                    <option value="https://schema.org/EventCancelled">
                      Cancelled
                    </option>
                    <option value="https://schema.org/EventPostponed">
                      Postponed
                    </option>
                    <option value="https://schema.org/EventScheduled">
                      Scheduled
                    </option>
                  </select>
                ) : fieldName === "startDate" || fieldName === "endDate" ? (
                  <DatePicker
                    selected={fieldValue}
                    onChange={(date) => handleFormInput(fieldName, date)}
                    dateFormat="yyyy-MM-dd"
                  />
                ) : fieldName === "description" ? (
                  <textarea
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : fieldName === "location" ? (
                    <>
                      <input
                        type="text"
                        name={fieldName}
                        value={fieldValue.name}
                        onChange={(e) => handleFormInput(fieldName, e.target.value)}
                        placeholder="Enter Name"
                      />
                      {fieldValue.name && ( // Show the address input only if location name has a value
                        <>
                          <br />
                          <br />
                          <input
                            type="text"
                            name="address"
                            value={fieldValue.address}
                            onChange={(e) => handleFormInput("address", e.target.value)}
                            placeholder="Enter address"
                          />
                        </>
                      )}
                    </>
                  ) : (
                  <input
                    type="text"
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                )}
              </div>
            );
          }

          return null; // Render nothing if the field is blank
        })}
        <button className="upload-button" onClick={PopUp}>
          Publish
        </button>
      </form>
    )
  );
};

export default Event;
