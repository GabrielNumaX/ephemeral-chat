import { useEffect, useCallback } from "react";
import { SocketContext, socket } from "./context/SocketContext";
import axios from "axios";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

// import { Switch, Route, Redirect } from 'react-router-dom';
import {
  // BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// import { withRouter } from "react-router-dom";

import Main from "./Containers/Main/Main";
import Signup from "./Containers/Signup/Signup";
import Login from "./Containers/Login/Login";
import Room from "./Containers/Room/Room";
import Profile from "./Containers/Profile/Profile";
import Contacts from "./Containers/Contacts/Contacts";
import Requests from "./Containers/Requests/Requests";
import Error from "./Components/Error/Error";

import {
  toggleHeader,
  setUser,
  setLogInOut,
  setToast,
} from "./redux/app/actions";
import { backendUrl } from "./config/config";
import { SERVICES } from "./services/services";
import {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from "./socketEvents/socketEvents";
import { populateRequests } from "./redux/app/actions";

import "./sass/app.scss";

axios.interceptors.request.use(async (config) => {
  config.url = backendUrl + config.url;

  // console.log('config.url', config.url);

  if (localStorage.token) {
    config.headers = {
      ...config.headers,
      Authorization: localStorage.getItem("token"),
    };
  }
  return config;
});

function App(props) {
  const { t } = useTranslation();

  let navigate = useNavigate();

  const toggleHeader = props.toggleHeader;
  const setUser = props.setUser;
  const setLogInOut = props.setLogInOut;
  const populateRequests = props.populateRequests;

  const toggleHeaderCallback = useCallback(
    (bool) => {
      toggleHeader(bool);
    },
    [toggleHeader]
  );

  const setUserCallback = useCallback(
    (obj) => {
      setUser(obj);
    },
    [setUser]
  );

  const setLogInOutCallback = useCallback(
    (bool) => {
      setLogInOut(bool);
    },
    [setLogInOut]
  );

  const populateRequestCallback = useCallback(
    (requests) => {
      populateRequests(requests);
    },
    [populateRequests]
  );

  useEffect(() => {

    console.log('useFX socket.connected', socket.connected);
    // socket CLEANUP to avoid componentWillUnmount WARNING
    if(!socket.connected) {
      console.log('useFX socket.connect()');
      socket.connect();
    }
    return () => {
      console.log('App -> socket.close()');
      socket.close();
    };
  }, []);

  const setToast = props.setToast;
  // const history = props.history;

  useEffect(() => {
    // this handles REGISTERED USERS
    if (localStorage.getItem("username") && localStorage.getItem("token")) {
      const getUserData = async () => {
        SERVICES.getUserData()
          .then(({ data }) => {
            // console.log('App.js GET USER DATA', { data });
            const contactsNumber =
              data.contactsNumber === 0 ? null : data.contactsNumber;

            const userObj = {
              username: data.username,
              contactsNumber,
              image: data.image,
            };
            // this handles RECONNECTION on browser REFRESH/OPEN page
            socket.emit(USER_CONNECTED, {
              user: data.username,
              isRegistered: true,
            });
            // props.setUser(userObj);
            setUserCallback(userObj);
            setLogInOutCallback(true);
            toggleHeaderCallback(true);

            populateRequestCallback(data.requests);
          })
          .catch(() => {
            const userObj = {
              username: null,
              image: null,
              contactsNumber: null,
            };
            setUserCallback(userObj);
            setLogInOutCallback(false);
            // this was SETTING Header as USER REG
            toggleHeaderCallback(false);

            setToast({
              showToast: true,
              message: t("API.errors.onGetUserData"),
              type: "error",
            });
          });
      };
      getUserData();

      // this MUST be Handled On getUserData SUCCESS;
      // props.setLogInOut(true);
      // props.toggleHeader();
    }
    // this WONT execute since I'm clearing localStorage on REFRESH/browserCLOSE
    // actually ON mobile TAB/CLOSE
    else if (localStorage.getItem("ephemeral-username")) {
      // this HANDLES UNREGISTERED users

      // console.log('useFX-> IF ephemeral-username');

      const user = JSON.parse(localStorage.getItem("ephemeral-username"));

      socket.emit(USER_DISCONNECTED, user);

      const verifyUser = () => {
        // console.log('verifyUser')

        socket.emit(VERIFY_USER, user, isVerified);
      };

      const isVerified = (isUser) => {
        if (isUser) {
          // console.log('isUser TRUE')

          setToast({
            showToast: true,
            message: t("API.errors.onUnregUserReconnect"),
            type: "error",
          });

          localStorage.removeItem("ephemeral-username");

          const userData = {
            username: null,
            userImage: null,
            contactsNumber: null,
          };
          setUserCallback(userData);

          return;
        }

        // handle CONNECTED HERE,
        socket.emit(USER_CONNECTED, { user });
        localStorage.setItem("ephemeral-username", JSON.stringify(user));

        const userData = {
          username: user,
          userImage: null,
          contactsNumber: null,
        };
        setUserCallback(userData);
        toggleHeaderCallback(true);
        // history.push('/room');
        navigate("/room", { replace: true });
      };

      verifyUser();
    }
  }, [
    toggleHeaderCallback,
    setUserCallback,
    setLogInOutCallback,
    populateRequestCallback,
    t,
    setToast,
    // history,
    navigate,
  ]);

  // this removes UNREGISTERED user on browser close OR REFRESH <-> SIDE EFFECT
  // to avoid having to check if that username is taken next time UNREG user
  // opens EPHEMERAL-CHAT
  // THIS DOES NOT WORKS ON MOBILE WHEN CLOSE TAB
  window.onbeforeunload = function () {
    localStorage.removeItem("ephemeral-username");
  };

  const { username, isLoggedIn } = props;

  console.log('App RENDER');
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        {/* <Route path="/">
            {props.username ? <Navigate to="/room" replace={true} /> : <Main />}
          </Route> */}

        <Route
          path="/"
          element={username ? <Navigate to="/room" replace={true} /> : <Main />}
        />

        <Route
          path="/room"
          element={
            username || (username && isLoggedIn) ? (
              <Room />
            ) : (
              <Navigate to="/" replace={true} />
            )
          }
        />

        {/* <Route path="/room">
            {props.username || (props.username && props.isLoggedIn) ? (
              <Room />
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </Route> */}

        <Route
          path="/contacts"
          element={
            isLoggedIn ? <Contacts /> : <Navigate to="/" replace={true} />
          }
        />

        {/* <Route path="/contacts">
            {props.isLoggedIn ? (
              <Contacts />
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </Route> */}

        <Route
          path="/profile/:username"
          element={
            isLoggedIn ? <Profile /> : <Navigate to="/" replace={true} />
          }
        />

        {/* <Route path="/profile/:username">
            {props.isLoggedIn ? (
              <Profile />
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </Route> */}

        <Route
          path="/requests"
          element={
            isLoggedIn ? <Requests /> : <Navigate to="/" replace={true} />
          }
        />

        {/* <Route path="/requests">
            {props.isLoggedIn ? (
              <Requests />
            ) : (
              <Navigate to="/" replace={true} />
            )}
          </Route> */}

        <Route path="/sign-up" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<Error />} />
      </Routes>
    </SocketContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    showHeader: state.app.showHeader,
    username: state.app.username,
    isLoggedIn: state.app.isLoggedIn,
  };
};

// export default App;
export default connect(mapStateToProps, {
  toggleHeader,
  setUser,
  setLogInOut,
  populateRequests,
  setToast,
})(App);
// export default withRouter(connect(mapStateToProps,
//   {
//     toggleHeader,
//     setUser,
//     setLogInOut,
//     populateRequests,
//     setToast,
//   })(App));
