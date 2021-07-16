import { useEffect, useCallback } from 'react';
import { SocketContext, socket } from './context/SocketContext';

import { Switch, Route, Redirect } from 'react-router-dom';

import { withRouter } from "react-router-dom";

import './sass/app.scss';

import Main from './Containers/Main/Main';
import Signup from './Containers/Signup/Signup';
import Login from './Containers/Login/Login';
import Room from './Containers/Room/Room';
import Profile from './Containers/Profile/Profile';
import Contacts from './Containers/Contacts/Contacts';
import Requests from './Containers/Requests/Requests';

import Error from './Components/Error/Error';

import { useTranslation } from 'react-i18next';

import { connect } from 'react-redux';

import { toggleHeader, setUser, setLogInOut, setToast } from './redux/app/actions';

import { backendUrl } from './config/config';
import axios from 'axios';

import { SERVICES } from './services/services';

import { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED } from './socketEvents/socketEvents';

import {
  populateRequests,
} from './redux/app/actions';

axios.interceptors.request.use(async (config) => {

  config.url = backendUrl + config.url

  // console.log('config.url', config.url);

  if (localStorage.token) {
    config.headers = {
      ...config.headers,
      "Authorization": localStorage.getItem("token")
    }
  }
  return config
});



function App(props) {

  const { t } = useTranslation();

  const toggleHeader = props.toggleHeader
  const setUser = props.setUser;
  const setLogInOut = props.setLogInOut
  const populateRequests = props.populateRequests

  const toggleHeaderCallback = useCallback(() => {
    toggleHeader();
  }, [toggleHeader])

  const setUserCallback = useCallback((obj) => {
    setUser(obj);
  }, [setUser])

  const setLogInOutCallback = useCallback((bool) => {
    setLogInOut(bool)
  }, [setLogInOut])

  const populateRequestCallback = useCallback((requests) => {
    populateRequests(requests)
  }, [populateRequests])

  useEffect(() => {

    // socket CLEANUP to avoid componentWillUnmount WARNING
    return () => {
      socket.close()
    };
  }, []);

  const setToast = props.setToast;
  const history = props.history;

  useEffect(() => {

    // this handles REGISTERED USERS
    if (localStorage.getItem('username') && localStorage.getItem('token')) {

      const getUserData = async () => {

        SERVICES.getUserData()
          .then(({ data }) => {

            // console.log('App.js GET USER DATA', { data });
            const contactsNumber = data.contactsNumber === 0 ? null : data.contactsNumber;


            const userObj = {
              username: data.username,
              contactsNumber,
              image: data.image
            }
            // this handles RECONNECTION on browser REFRESH/OPEN page
            socket.emit(USER_CONNECTED, { user: data.username, isRegistered: true });
            // props.setUser(userObj);
            setUserCallback(userObj);
            setLogInOutCallback(true)
            toggleHeaderCallback();

            populateRequestCallback(data.requests);
          })
          .catch(() => {

            const userObj = {
              username: null,
              image: null,
              contactsNumber: null
            }
            setUserCallback(userObj);
            setLogInOutCallback(false)
            // this was SETTING Header as USER REG
            // toggleHeaderCallback();

            setToast({ showToast: true, message: t('API.errors.onGetUserData'), type: 'error' })
          })
      }
      getUserData()

      // this MUST be Handled On getUserData SUCCESS;
      // props.setLogInOut(true);
      // props.toggleHeader();

    }
    // this WONT execute since I'm clearing localStorage on REFRESH/browserCLOSE
    // actually ON mobile TAB/CLOSE
    else if (localStorage.getItem('ephemeral-username')) {
      // this HANDLES UNREGISTERED users

      // console.log('useFX-> IF ephemeral-username');

      const user = JSON.parse(localStorage.getItem('ephemeral-username'))

      socket.emit(USER_DISCONNECTED, user);

      const verifyUser = () => {

        // console.log('verifyUser')

        socket.emit(VERIFY_USER, user, isVerified)
      }

      const isVerified = (isUser) => {

        if (isUser) {
          // console.log('isUser TRUE')

          setToast({ showToast: true, message: t('API.errors.onUnregUserReconnect'), type: 'error' })

          localStorage.removeItem('ephemeral-username');

          const userData = {
            username: null,
            userImage: null,
            contactsNumber: null,
          }
          setUserCallback(userData);

          return;
        }

        // handle CONNECTED HERE, 
        socket.emit(USER_CONNECTED, { user });
        localStorage.setItem('ephemeral-username', JSON.stringify(user));

        const userData = {
          username: user,
          userImage: null,
          contactsNumber: null,
        }
        setUserCallback(userData);
        toggleHeaderCallback();
        history.push('/room');
      }

      verifyUser();
    }
  }, [
    toggleHeaderCallback,
    setUserCallback,
    setLogInOutCallback,
    populateRequestCallback,
    t,
    setToast,
    history,
  ])

  // this removes UNREGISTERED user on browser close OR REFRESH <-> SIDE EFFECT
  // to avoid having to check if that username is taken next time UNREG user
  // opens EPHEMERAL-CHAT
  // THIS DOES NOT WORKS ON MOBILE WHEN CLOSE TAB
  window.onbeforeunload = function () {
    localStorage.removeItem('ephemeral-username')
  }

  return (
    <SocketContext.Provider value={socket}>
      <Switch>

        <Route path="/" exact>
          {
            props.username ? <Redirect to="/room" /> : <Main />
          }
        </Route>

        <Route path="/room" exact>

          {
            props.username || (props.username && props.isLoggedIn) ? <Room /> : <Redirect to="/" />
          }
        </Route>

        <Route path="/contacts" exact>
          {props.isLoggedIn ? <Contacts /> : <Redirect to="/" />}
        </Route>

        <Route path="/profile/:username">
          {props.isLoggedIn ? <Profile /> : <Redirect to="/" />}
        </Route>

        <Route path="/requests" exact>
          {props.isLoggedIn ? <Requests /> : <Redirect to="/" />}
        </Route>


        <Route path="/sign-up" exact>
          <Signup />
        </Route>

        <Route path="/login" exact>
          <Login />
        </Route>

        <Route path="/*">
          <Error />
        </Route>

      </Switch>
    </SocketContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    showHeader: state.app.showHeader,
    username: state.app.username,
    isLoggedIn: state.app.isLoggedIn,
  }
}

// export default App;
export default withRouter(connect(mapStateToProps,
  {
    toggleHeader,
    setUser,
    setLogInOut,
    populateRequests,
    setToast,
  })(App));
