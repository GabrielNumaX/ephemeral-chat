import React, { useState, useContext, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { SocketContext } from "../../context/SocketContext";
import { toggleHeader, setLogInOut, setUser } from "../../redux/app/actions";
import { VERIFY_USER, USER_CONNECTED } from "../../socketEvents/socketEvents";

import Header from "../../Components/Header/Header";
import Toast from "../../Components/Toast/Toast";

const Main = (props) => {
  const socket = useContext(SocketContext);
  const { t } = useTranslation();
  let navigate = useNavigate();

  const [user, setUser] = useState("");

  const [userError, setUserError] = useState({
    error: false,
    message: "",
  });

  useEffect(() => {
    if (user === "") {
      setUserError({
        error: false,
        message: "",
      });
    }
  }, [user]);

  const validate = () => {

    if (user.length < 3 || !user.trim().length) {
      setUserError({
        error: true,
        message: t("main.errors.userError"),
      });

      return false;
    } else {
      setUserError({
        error: false,
        message: "",
      });
      return true;
    }
  };

  const verifyUser = () => {

    socket.emit(VERIFY_USER, user, isVerified);
  };

  const isVerified = (isUser) => {

    if (isUser) {
      return setUserError({
        error: true,
        message: t("main.errors.userInUse"),
      });
    } else {
      setUserError({
        error: false,
        message: "",
      });

      // handle CONNECTED HERE,
      socket.emit(USER_CONNECTED, { user, isRegistered: isUser });

      localStorage.setItem("ephemeral-username", JSON.stringify(user));

      const userData = {
        username: user,
        userImage: null,
        contactsNumber: null,
      };

      props.setUser(userData);
      props.toggleHeader(true);
      navigate("/room", { replace: true });
    }
  };

  const handleGoToRoom = (e) => {
    e.preventDefault();

    // here I should process user NOT registered to access ROOM
    if (!validate()) {
      return;
    }

    // check if username its on BACKEND usersConnected ARRAY
    verifyUser();
  };

  return (
    <div className="container">
      <Header />
      <div className="main">
        <h2>
          {t("main.enterUserAccessEphemeral")}
          <p>
            {t("main.chatsWont01")}
            <span>{t("main.chatsWont02")}</span>
            {t("main.chatsWont03")}
          </p>
        </h2>

        <form onSubmit={handleGoToRoom}>
          <input
            type="text"
            placeholder={t("main.username")}
            onChange={(e) => setUser(e.target.value)}
            value={user}
          ></input>
          {userError.error && (
            <div className="errorDiv">
              <p>{userError.message}</p>
            </div>
          )}
          <div className="submitDiv">
            <input type="submit" value={t("main.gotoRoom")}></input>
          </div>
        </form>
      </div>

      <Toast />
    </div>
  );
};

export default connect(null, { toggleHeader, setLogInOut, setUser })(Main);
