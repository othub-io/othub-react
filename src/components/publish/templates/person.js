import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css"; // Import the styles
import "../../../css/forms/person.css";

const isUrlValid = (url) => {
  // Simple URL validation, you can use a more sophisticated library if needed
  const urlPattern = /^https?:\/\/\S+$/;
  return urlPattern.test(url);
};

const Person = ({ displayContent, openPopUp }) => {
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [sameAsError, setSameAsError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const [formData, setFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "",
    image: "",
    description: "",
    location: {
      "@type": "Place",
      name: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: "",
      },
    },
    jobTitle: "",
    worksFor: {
      "@type": "Organization",
      name: "",
    },
    relatedTo: {
      "@type": "Person",
      name: [],
    },
    
    isPartOf: [],
  });

  useEffect(() => {
    const filteredFormData = Object.entries(formData)
      .filter(
        ([key, value]) => key !== "image" || (key === "image" && value !== "")
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
          key !== "relatedTo" || (key === "relatedTo" && value.name.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "jobTitle" || (key === "jobTitle" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "worksFor" ||
          (key === "worksFor" && value && value.name !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "location" ||
          (key === "location" && value && value.name !== "")
      )
      .reduce((acc, [key, value]) => {
        // If 'location.name' is blank, remove the 'address' object
        if (key === "location" && value && value.name !== "") {
          // Check if any of the 'address' fields are not blank
          let isAddressNotBlank = Object.values(value.address).some(
            (field) =>
              field !== "PostalAddress" &&
              field !== "Place" &&
              field !== "Organization" &&
              field !== ""
          );

          if (isAddressNotBlank) {
            acc[key] = value;
          } else {
            const { address, ...restOfLocation } = value;
            acc[key] = restOfLocation;
          }
        } else {
          acc[key] = value;
        }

        if (key === "name" && value === "") {
            setNameError(`Name Required.`);
          } else if (key === "name" && value) {
            setNameError();
          }

          if (
            key === "image" &&
            !(isUrlValid(value) && value.startsWith("https://")) &&
            value !== ""
          ) {
            setImageError(`Invalid URL for ${key} field. Must use https.`);
          }

          if (!acc.hasOwnProperty('image') || (key === "image" && isUrlValid(value) && value.startsWith("https://")) || (value === "" || !value)) {
            setImageError();
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

        return acc;
      }, {});

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
    } else if (name === "worksFor") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        worksFor: {
          ...prevFormData.worksFor,
          name: value,
        },
      }));
    } else if (name === "address") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          address: {
            ...prevFormData.location.address,
            streetAddress: value.streetAddress || "",
            addressLocality: value.addressLocality || "",
            postalCode: value.postalCode || "",
            addressCountry: value.addressCountry || "",
          },
        },
      }));
    } else if (name === "sameAs") {
      const updatedSameAs = value.map((selectedValue) => {
        return selectedValue;
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        sameAs: updatedSameAs,
      }));
    } else if (name === "relatedTo") {
      if (value.length >= 0) {
        const updatedRelatedTo = value.map((selectedValue) => {
          return selectedValue;
        });

        setFormData((prevFormData) => ({
          ...prevFormData,
          relatedTo: {
            ...prevFormData.relatedTo,
            name: updatedRelatedTo,
          },
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

  const addProfile = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      sameAs: [...prevFormData.sameAs, ""],
    }));
  };

  const addUAL = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  const addPerson = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      relatedTo: {
        ...prevFormData.relatedTo,
        name: [...prevFormData.relatedTo.name, ""],
      },
    }));
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
              <div key={fieldName} className={`${fieldName}-div`}>
                <label>
                  {label === "name"
                    ? "Full Name:"
                    : label === "image"
                    ? "Image URL:"
                    : label === "description"
                    ? "Description:"
                    : label === "location"
                    ? "Location:"
                    : label === "worksFor"
                    ? "Employer:"
                    : label === "relatedTo"
                    ? "Related To:"
                    : label === "sameAs"
                    ? "Social Profiles:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label === "jobTitle"
                    ? "Occupation:"
                    : label}
                </label>
                {fieldName === "sameAs" || fieldName === "isPartOf" ? (
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
                ) : fieldName === "relatedTo" ? (
                  <div>
                    <div>
                      {fieldValue.name.length < 10 && (
                        <div className="plus-button">
                          <button
                            className="epoch-button"
                            onClick={addPerson}
                            name="add"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="array-inputs">
                      {fieldValue.name.map((value, index) => (
                        <div key={index}>
                          <button
                            name="remove"
                            className="epoch-button"
                            value={value}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedRelatedTo = [...fieldValue.name];
                              updatedRelatedTo.splice(index, 1);
                              handleFormInput(
                                fieldName,
                                updatedRelatedTo,
                                index
                              );
                            }}
                          >
                            x
                          </button>
                          <input
                            type="text"
                            placeholder={`Name`}
                            onChange={(e) => {
                              e.preventDefault();
                              const updatedSameAs = [...fieldValue.name];
                              updatedSameAs[index] = e.target.value;
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
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
                      onChange={(e) =>
                        handleFormInput(fieldName, e.target.value)
                      }
                    />
                    {fieldValue.name && ( // Show the address input only if location name has a value
                      <div className="address-fields">
                        <label>Address:</label>
                        <input
                          type="text"
                          name="address.streetAddress"
                          value={fieldValue.address.streetAddress}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              streetAddress: e.target.value,
                            })
                          }
                          placeholder="Enter Street Address"
                        />
                        <input
                          type="text"
                          name="address.addressLocality"
                          value={fieldValue.address.addressLocality}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              addressLocality: e.target.value,
                            })
                          }
                          placeholder="Enter Locality"
                        />
                        <input
                          type="text"
                          name="address.postalCode"
                          value={fieldValue.address.postalCode}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              postalCode: e.target.value,
                            })
                          }
                          placeholder="Enter Postal Code"
                        />
                        <input
                          type="text"
                          name="address.addressCountry"
                          value={fieldValue.address.addressCountry}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              addressCountry: e.target.value,
                            })
                          }
                          placeholder="Enter Country"
                        />
                      </div>
                    )}
                  </>
                ) : fieldName === "worksFor" ? (
                  <>
                    <input
                      type="text"
                      name={fieldName}
                      value={fieldValue.name}
                      onChange={(e) =>
                        handleFormInput(fieldName, e.target.value)
                      }
                    />
                  </>
                ) : (
                    <input
                      type="text"
                      name={fieldName}
                      value={fieldValue}
                      onChange={(e) =>
                        handleFormInput(fieldName, e.target.value)
                      }
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
        {!nameError && !imageError && !sameAsError && !ualError && (
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

export default Person;
