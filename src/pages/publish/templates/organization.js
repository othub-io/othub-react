import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css"; // Import the styles
import "../../../css/forms/person.css";
import Select from "react-select";
import "../../../css/forms/organization.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { format, isValidPhoneNumber } from "libphonenumber-js";

const orgOptions = [
  { value: "Organization", label: "Organization" },
  { value: "Airline", label: "Airline" },
  { value: "Consortium", label: "Consortium" },
  { value: "Corporation", label: "Corporation" },
  { value: "EducationalOrganization", label: "EducationalOrganization" },
  { value: "FundingScheme", label: "FundingScheme" },
  { value: "GovernmentOrganization", label: "GovernmentOrganization" },
  { value: "LibrarySystem", label: "LibrarySystem" },
  { value: "MedicalOrganization", label: "MedicalOrganization" },
  { value: "NGO", label: "NGO" },
  { value: "NewsMediaOrganization", label: "NewsMediaOrganization" },
  { value: "PerformingGroup", label: "PerformingGroup" },
  { value: "Project", label: "Project" },
  { value: "SportsOrganization", label: "SportsOrganization" },
  { value: "WorkersUnion", label: "WorkersUnion" },
];

const contactOptions = [
  { value: "Customer Service", label: "Customer Service" },
  { value: "Technical Support", label: "Technical Support" },
  { value: "Billing Support", label: "Billing Support" },
  { value: "Bill Payment", label: "Bill Payment" },
  { value: "Sales", label: "Sales" },
  { value: "Reservations", label: "Reservations" },
  { value: "Credit Card Support", label: "Credit Card Support" },
  { value: "Emergency", label: "Emergency" },
  { value: "Baggage Tracking", label: "Baggage Tracking" },
  { value: "Roadside Assistance", label: "Roadside Assistance" },
  { value: "Package Tracking", label: "Package Tracking" },
];

const isUrlValid = (url) => {
  // Simple URL validation, you can use a more sophisticated library if needed
  const urlPattern = /^https?:\/\/\S+$/;
  return urlPattern.test(url);
};

const Organization = ({ displayContent, openPopUp }) => {
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [telephoneError, setTelephoneError] = useState(null);
  const [sameAsError, setSameAsError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const [formData, setFormData] = useState({
    "@context": "https://schema.org",
    "@type": "",
    name: "",
    alternativeName: "",
    url: "",
    logo: "",
    description: "",
    contactPoint: [],
    sameAs: [],
    isPartOf: [],
  });

  useEffect(() => {
    const filteredFormData = Object.entries(formData)
      .filter(
        ([key, value]) => key !== "logo" || (key === "logo" && value !== "")
      )
      .filter(
        ([key, value]) => key !== "url" || (key === "url" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "alternativeName" ||
          (key === "alternativeName" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "sameAs" || (key === "sameAs" && value.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "isPartOf" || (key === "isPartOf" && value.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "contactPoint" || (key === "contactPoint" && value.length > 0)
      )
      .reduce((acc, [key, value]) => {
        if (key === "contactPoint" && value.length > 0) {
          acc[key] = value
            .filter((contact) => contact !== "") // Remove empty reviews
            .map((contact) => {
              if (contact.telephone) {
                if (!isValidPhoneNumber(contact.telephone)) {
                  setTelephoneError(
                    `Invalid telephone number for a ${key} field.`
                  );
                } else {
                  setTelephoneError();
                }
              } else {
                setTelephoneError();
              }
            });
          acc[key] = value;
        } else {
          acc[key] = value;
        }

        if (key === "@type" && value === "") {
          setTypeError(`Type Required.`);
        } else if (key === "@type" && value) {
          setTypeError();
        }

        if (key === "name" && value === "") {
          setNameError(`Name Required.`);
        } else if (key === "name" && value) {
          setNameError();
        }

        if (
            key === "logo" &&
            !(isUrlValid(value) && value.startsWith("https://")) &&
            value !== ""
          ) {
            setLogoError(`Invalid URL for ${key} field. Must use https.`);
          }

          if (!acc.hasOwnProperty('logo') || (key === "logo" && isUrlValid(value) && value.startsWith("https://")) || (value === "" || !value)) {
            setLogoError();
          } 

          if (
            key === "url" &&
            !(isUrlValid(value) && value.startsWith("https://")) &&
            value !== ""
          ) {
            setImageError(`Invalid URL for ${key} field. Must use https.`);
          }

          if (!acc.hasOwnProperty('url') || (key === "url" && isUrlValid(value) && value.startsWith("https://")) || (value === "" || !value)) {
            setImageError();
          } 

        if (key === "isPartOf" && value.length > 0) {
          let validUal = Object.values(value).every((field) => {
            if (field !== "") {
              const segments = field.split(":");
              const argsString = JSON.stringify(
                segments.length === 3 ? segments[2] : segments[2] + segments[3]
              );
              const args = argsString.split("/");

              return args.length !== 3 ? false : true;
            } else {
              return false;
            }
          });

          if (!validUal) {
            setUalError(`Invalid UAL for a ${key} field.`);
          } else {
            setUalError();
          }
        } else {
          setUalError();
        }

        if (key === "sameAs" && value.length > 0) {
          let validUrl = Object.values(value).every(
            (field) => isUrlValid(field) && field.startsWith("https://")
          );

          if (!validUrl) {
            setSameAsError(`Invalid URL for a ${key} field. Must use https.`);
          } else {
            setSameAsError();
          }
        } else {
          setSameAsError();
        }

        return acc;
      }, {});

    displayContent(JSON.stringify(filteredFormData));
  }, [formData, displayContent]);

  const handleFormInput = (name, value) => {
    if (name === "contactPoint") {
      if (value.length >= 0) {
        const updatedContactPoint = value.map((selectedValue) => {
          return selectedValue;
        });

        setFormData((prevFormData) => ({
          ...prevFormData,
          contactPoint: updatedContactPoint,
        }));
      }
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

  const addContact = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => {
      const updatedContact = [
        ...prevFormData.contactPoint,
        {
          "@type": "ContactPoint",
          telephone: "",
          contactType: "",
        },
      ];

      return {
        ...prevFormData,
        contactPoint: updatedContact,
      };
    });
  };

  const addUAL = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  const addProfile = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      sameAs: [...prevFormData.sameAs, ""],
    }));
  };

  return (
    formData && (
      <form className="product-form">
        {Object.keys(formData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = formData[fieldName];

          if (fieldName !== "@context") {
            return (
              <div key={fieldName} className={`${fieldName}-div`}>
                <label>
                  {label === "name"
                    ? "Organization Name:"
                    : label === "alternativeName"
                    ? "Alternate Name:"
                    : label === "url"
                    ? "URL:"
                    : label === "logo"
                    ? "Logo:"
                    : label === "description"
                    ? "Description:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label === "sameAs"
                    ? "Social Profiles:"
                    : label === "contactPoint"
                    ? "Point of Contact:"
                    : label}
                </label>
                {fieldName === "@type" ? (
                  <div className="type-div">
                    <label>Specific Type:</label>
                    <Select
                      name={fieldName}
                      value={orgOptions.find(
                        (option) => option.value === fieldValue
                      )}
                      onChange={(selectedOption) => {
                        const selectedValue = selectedOption
                          ? selectedOption.value
                          : "none";
                        handleFormInput(fieldName, selectedValue);
                      }}
                      options={orgOptions}
                      className="offer-select"
                    />
                  </div>
                ) : fieldName === "contactPoint" ? (
                  <div>
                    {fieldValue.length < 10 && (
                      <div className="contact-plus-button">
                        <button
                          className="epoch-button"
                          onClick={addContact}
                          name="add"
                        >
                          +
                        </button>
                      </div>
                    )}
                    {fieldValue.map((contact, index) => (
                      <div key={index} className="contact-fields">
                        <button
                          name="remove"
                          className="epoch-button"
                          onClick={(e) => {
                            e.preventDefault();
                            const updatedContact = [...fieldValue];
                            updatedContact.splice(index, 1);
                            handleFormInput(fieldName, updatedContact, index);
                          }}
                        >
                          x
                        </button>
                        <div className="contact-type">
                          <label>Contact Type:</label>
                          <Select
                            name={fieldName}
                            value={contactOptions.find(
                              (option) => option.value === fieldValue
                            )}
                            onChange={(selectedOption) => {
                              const updatedContact = [...fieldValue];
                              updatedContact[index].contactType =
                                selectedOption.value;
                              handleFormInput(fieldName, updatedContact, index);
                            }}
                            options={contactOptions}
                            className="contact-select"
                          />
                        </div>
                        <div className="contact-phone">
                          <label>Telephone:</label>
                          <PhoneInput
                            placeholder="Enter phone number"
                            value={contact.telephone}
                            onChange={(value) => {
                              const updatedContact = [...fieldValue];
                              updatedContact[index].telephone = value;
                              handleFormInput(fieldName, updatedContact, index);
                            }}
                            className="contact-phone-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : fieldName === "description" ? (
                  <textarea
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : fieldName === "sameAs" || fieldName === "isPartOf" ? (
                  <div>
                    <div>
                      {fieldValue.length < 10 && (
                        <div className="plus-button">
                          <button
                            className="epoch-button"
                            onClick={
                              fieldName === "sameAs"
                                ? addProfile
                                : fieldName === "isPartOf"
                                ? addUAL
                                : ""
                            }
                            name="add"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="array-inputs">
                      {fieldValue.map((value, index) => (
                        <div key={index}>
                          <button
                            name="remove"
                            className="epoch-button"
                            value={value}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedSameAs = [...fieldValue];
                              updatedSameAs.splice(index, 1);
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          >
                            x
                          </button>
                          <input
                            type="text"
                            placeholder={
                              fieldName === "sameAs"
                                ? "url"
                                : fieldName === "isPartOf"
                                ? "ual"
                                : ""
                            }
                            onChange={(e) => {
                              e.preventDefault();
                              const updatedSameAs = [...fieldValue];
                              updatedSameAs[index] = e.target.value;
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
        {imageError && (
          <div className="file-error">
            <p>{imageError}</p>
          </div>
        )}
        {typeError && (
          <div className="file-error">
            <p>{typeError}</p>
          </div>
        )}
        {sameAsError && (
          <div className="file-error">
            <p>{sameAsError}</p>
          </div>
        )}
        {ualError && (
          <div className="file-error">
            <p>{ualError}</p>
          </div>
        )}
        {nameError && (
          <div className="file-error">
            <p>{nameError}</p>
          </div>
        )}
        {telephoneError && (
          <div className="file-error">
            <p>{telephoneError}</p>
          </div>
        )}
        {logoError && (
          <div className="file-error">
            <p>{logoError}</p>
          </div>
        )}
        {!nameError &&
          !imageError &&
          !typeError &&
          !sameAsError &&
          !telephoneError &&
          !logoError &&
          !ualError && (
            <div className="person-pub-button">
              <button className="upload-button" onClick={PopUp}>
                Publish
              </button>
            </div>
          )}
      </form>
    )
  );
};

export default Organization;
