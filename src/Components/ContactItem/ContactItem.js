import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";

import { imageUrl } from "../../config/config";

const ContactItem = ({
  name,
  isOnline,
  hasPhoto,
  isLoggedIn,
  isContact = false,
  isRegistered,
  handleAdd,
  openChat,
  hover = true,
}) => {
  return (
    //HANDLE THIS FOR CONTACTS
    <div
      className={hover ? "contactItem displayHover" : "contactItem"}
      onClick={openChat ? openChat : null}
      title={name}
    >
      {isRegistered && !isContact && isLoggedIn && (
        // handle CONDITIONAL RENDERING FOR ALREADY ADDED CONTACTS
        // key isContact ADDED on MODEL
        <div
          className="addContactIconContainer"
          title="Add Contact"
          onClick={handleAdd}
        >
          <FontAwesomeIcon icon={faPlus} className="addContactIcon" />
        </div>
      )}
      {/* conditional rendering for ICON or PHOTO*/}
      <div className="iconContainer">
        {hasPhoto ? (
          <img src={`${imageUrl}${hasPhoto}`} alt="username"></img>
        ) : (
          <FontAwesomeIcon icon={faUser} className="icon"></FontAwesomeIcon>
        )}
      </div>

      <div className="contactName">
        <p>{name} </p>
        {isOnline && <div title="Online"></div>}
      </div>
    </div>
  );
};

export default ContactItem;
