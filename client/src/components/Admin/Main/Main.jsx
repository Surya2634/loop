import React, { useContext, useEffect, useState } from "react";
import LoopLogo from "../../../images/Loop1.webp";
import { NavLink, Route, Redirect, Switch } from "react-router-dom";
import "../../Student/Main/Main.css";
import "./Main.css";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import Contests from "./Contests/Contests";
import Users from "./Users/Users";
import CreateContest from "./Contests/CreateContest/CreateContest";
import ContestDetails from "./Contests/ContestDetails/ContestDetails";
import AddQuiz from "./Quizzes/CreateQuiz/AddQuiz/AddQuiz";
import { AuthContext } from "../../../contexts/AuthContext";
import ChallengeDashboard from "./Challenges/ChallengeDashboard/ChallengeDashboard";
import ErrorLogs from "./ErrorLogs/ErrorLogs";
import CreateChallenge from "./Challenges/ChallengeDashboard/CreateChallenge/CreateChallenge";
import PageNotFound from "../../Reducer/PageNotFound/404";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import WarningIcon from "@material-ui/icons/Warning";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const Main = (props) => {
  const [authState, authDispatch] = useContext(AuthContext);
  const [sideToggle] = useState(false);
  useEffect(() => {
    props.fetchUser();
  }, []);
  return (
    <div className="container-fluid h-100 p-0">
      <div className="d-flex">
        <div
          className={`${
            sideToggle
              ? `hide-bar`
              : `side-bar d-flex flex-column align-items-center justify-content-between side-nav p-2`
          }`}
        >
          <div className="logo-sec">
            <img
              src={LoopLogo}
              alt="sidebar-logo"
              height="60"
              width="110"
              className="img-fluid position-relative sidebar-logo"
            />
          </div>
          <ul className="nav flex-column w-100 p-2 side-ul">
            <li className="nav-item dash-item mb-2 color-11" key="dashboard">
              <NavLink
                exact
                className="d-flex nav-link dash-li"
                to="/admin-dashboard"
                activeClassName="home-active color-11"
              >
                <div className="px-3 dash-icon shake">
                  <HomeIcon />
                </div>
                <span className="hide-span">Dashboard</span>
                <span className="tooltip">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="users">
              <NavLink
                activeClassName="active-class"
                to="/users"
                className="d-flex nav-link dash-li color-11"
              >
                <div className="px-3 dash-icon shake">
                  <GroupIcon />
                </div>
                <span className="hide-span">Users</span>
                <span className="tooltip">Users</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="contests">
              <NavLink
                activeClassName="active-class color-11"
                to="/contests"
                className="d-flex nav-link dash-li"
              >
                <div className="px-3 dash-icon shake">
                  <AssignmentIcon />
                </div>
                <span className="hide-span">Contests</span>
                <span className="tooltip">Contests</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="errorlogs">
              <NavLink
                activeClassName="active-class color-11"
                to={`/error-logs/${authState?.user?._id}`}
                className="d-flex nav-link dash-li"
              >
                <div className="px-3 dash-icon shake">
                  <WarningIcon />
                </div>
                <span className="hide-span">Error Logs</span>
                <span className="tooltip">Error Logs</span>
              </NavLink>
            </li>
          </ul>
          <div className="sidebar-footer d-flex align-items-center justify-content-center position-relative">
            <ul className="nav flex-column w-100 side-ul">
              <li className="nav-item dash-item mb-2 color-11" key="logout">
                <NavLink
                  to="/login"
                  onClick={() => {
                    authDispatch({ type: "REMOVE_USER", payload: null });
                    localStorage.clear();
                  }}
                  className="nav-link dash-li"
                >
                  <ExitToAppIcon
                    className=" dash-icon shake"
                    style={{ position: "relative", left: "-40px" }}
                  />
                  <span
                    className="hide-span"
                    style={{ position: "relative", left: "-20px", top: "-5px" }}
                  >
                    Logout
                  </span>
                  <span className="tooltip">Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-div w-100">
          <Switch>
            <Route path="/admin-dashboard" exact>
              <AdminDashboard snackBar={props.snackBar} />
            </Route>
            <Route path="/users">
              <Users snackBar={props.snackBar} />
            </Route>
            <Route path="/contests">
              <Switch>
                <Route path="/contests/create-contest" exact>
                  <CreateContest
                    title="Create Contest"
                    snackBar={props.snackBar}
                  />
                </Route>
                <Route path="/contests/:id">
                  <ContestDetails snackBar={props.snackBar} />
                </Route>
                <Route path="/contests" exact>
                  <Contests snackBar={props.snackBar} />
                </Route>
                <Route path="*">
                  <PageNotFound />
                </Route>
              </Switch>
            </Route>
            <Route path="/quizzes">
              <Route path={`/quizzes/:id/add-question`}>
                <AddQuiz snackBar={props.snackBar} />
              </Route>
            </Route>
            <Route path="/challenges">
              <Route path="/challenges/:id">
                <ChallengeDashboard snackBar={props.snackBar} />
              </Route>
              <Route path="/challenges/:id/challenge/create">
                <CreateChallenge snackBar={props.snackBar} />
              </Route>
            </Route>
            <Route path="/error-logs/:id" exact>
              <ErrorLogs snackBar={props.snackBar} />
            </Route>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/admin-dashboard" />}
            />
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Main;
