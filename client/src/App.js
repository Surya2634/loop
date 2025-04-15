import React, { useContext, useEffect, useState } from "react";
import Login from "./components/Login/Login";
import AdminMain from "./components/Admin/Main/Main";
import Main from "./components/Student/Main/Main";
import "./App.css";
import {
  Redirect,
  Route,
  Switch,
  withRouter,
  useHistory,
} from "react-router-dom";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { AuthContext } from "./contexts/AuthContext";
import helperService from "./services/helperService";
import PageNotFound from "./components/Reducer/PageNotFound/404";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
const App = () => {
  const history = useHistory();
  //** Context Consumer */
  const [authState, authDispatch] = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };
  const snackBar = (snackMessage, messType) => {
    setSeverity(messType);
    setMessage(snackMessage);
    setOpen(true);
  };
  const unauthorized = (message) => {
    snackBar(message, "error");
    localStorage.clear();
    authDispatch({
      type: "REMOVE_USER",
    });
    history.push("/login");
  };
  const fetchUser = async () => {
    try {
      const { status, data } = await helperService.getUser(
        {},
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        authDispatch({
          type: "SET_USER",
          payload: data,
        });
      }
    } catch ({ status, message }) {
      if (status === 401) unauthorized(message);
      else snackBar(message, "error");
    }
  };
  const disabledEvent = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => disabledEvent(e));
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) disabledEvent(e);
      if (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I"))
        disabledEvent(e);
      if (e.ctrlKey && e.shiftKey && (e.key === "j" || e.key === "J"))
        disabledEvent(e);
      if (e.ctrlKey && e.shiftKey && (e.key === "c" || e.key === "C"))
        disabledEvent(e);
      if (e.key === "F12") disabledEvent(e);
    });
    return () => {
      document.removeEventListener("contextmenu", (e) => disabledEvent(e));
      document.removeEventListener("keydown", (e) => disabledEvent(e));
    };
  }, []);
  return (
    <>
      <div className="App m-0 p-0">
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
        <Switch>
          <Route path="/login">
            {!authState.user ? (
              <Login snackBar={snackBar} />
            ) : (
              <Redirect exact to="/" />
            )}
          </Route>
          <Route path="/">
            {authState.user ? (
              [
                authState.user.role === "student" ? (
                  <Main snackBar={snackBar} fetchUser={fetchUser} />
                ) : (
                  // <Loader />
                  <AdminMain snackBar={snackBar} fetchUser={fetchUser} />
                ),
              ]
            ) : (
              <Redirect exact to="/login" />
            )}
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </div>
      <div className="breakpoint" style={{ height: "100vh" }}>
        This page Enables on Tablet
      </div>
    </>
  );
};
export default withRouter(App);
