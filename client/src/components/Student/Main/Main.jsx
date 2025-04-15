import React, { useState, useContext, useEffect } from "react";
import {
  NavLink,
  Route,
  Redirect,
  Switch,
  useLocation,
} from "react-router-dom";
import "./Main.css";
import LoopLogo from "../../../images/Loop1.webp";
import { Avatar } from "@material-ui/core";
import Dashboard from "./Dashboard/Dashboard";
import Codekata from "./Codekata/Codekata";
import Articles from "./Articles/Articles";
import Roadmap from "./Roadmap/Roadmap";
import Profile from "./Profile/Profile";
import Compiler from "./Compiler/Compiler";
import { AuthContext } from "../../../contexts/AuthContext";
import Programs from "./Codekata/ContestDetails/Programs/Programs";
import Quiz from "./Codekata/ContestDetails/Quiz/Quiz";
import ContestDetails from "./Codekata/ContestDetails/ContestDetails";
import HomeIcon from "@material-ui/icons/Home";
import PageNotFound from "../../Reducer/PageNotFound/404";
import CodeIcon from "@material-ui/icons/Code";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MapIcon from "@material-ui/icons/Map";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const Main = (props) => {
  const [authState, authDispatch] = useContext(AuthContext);
  const [sideToggle, setSideToggle] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem("user") && !authState.user.regno)
      props.fetchUser();
  }, []);
  return (
    <div className="conatiner-fluid w-100">
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
            <li
              className="nav-item dash-item mb-2 color-11"
              key="student-dashboard"
            >
              <NavLink
                exact
                className="nav-link dash-li d-flex"
                to="/dashboard"
                activeClassName="home-active color-11"
              >
                <div className="px-3 dash-icon shake">
                  <HomeIcon />
                </div>
                <span className="hide-span">Dashboard</span>
                <span className="tooltip">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="codekata">
              <NavLink
                activeClassName="active-class"
                to="/codekata"
                className="nav-link dash-li color-11 d-flex"
              >
                <div className="px-3 dash-icon shake">
                  <CodeIcon />
                </div>
                <span className="hide-span">Codekata</span>
                <span className="tooltip">Codekata</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="articles">
              <NavLink
                activeClassName="active-class color-11"
                to="/articles"
                className="nav-link dash-li d-flex"
              >
                <div className="px-3 dash-icon shake">
                  <MenuBookIcon />
                </div>
                <span className="hide-span">Articles</span>
                <span className="tooltip">Articles</span>
              </NavLink>
            </li>
            <li className="nav-item dash-item mb-2 color-11" key="roadmap">
              <NavLink
                activeClassName="active-class color-11"
                to="/roadmap"
                className="nav-link dash-li d-flex"
              >
                <div className="px-3 dash-icon shake">
                  <MapIcon />
                </div>
                <span className="hide-span">Roadmap</span>
                <span className="tooltip">Roadmap</span>
              </NavLink>
            </li>
            <li
              className="nav-item mb-2 dash-item mb-2 color-11"
              key="compiler"
            >
              <NavLink
                activeClassName="active-class color-11"
                to="/compiler"
                className="nav-link dash-li d-flex"
              >
                <div className="px-3 dash-icon shake">
                  <DeveloperModeIcon />
                </div>
                <span className="hide-span">Compiler</span>
                <span className="tooltip">Compiler</span>
              </NavLink>
            </li>
            <li
              className="nav-item dash-item mb-2 color-11"
              key="student-logout"
            >
              <NavLink
                to="/login"
                onClick={() => {
                  // props.setLogin(false);
                  authDispatch({ type: "REMOVE_USER", payload: null });
                  localStorage.clear();
                }}
                className="nav-link dash-li d-flex"
              >
                <div className="px-3 dash-icon shake">
                  <ExitToAppIcon />
                </div>
                <span className="hide-span">Logout</span>
                <span className="tooltip">Logout</span>
              </NavLink>
            </li>
          </ul>
          <div className="sidebar-footer d-flex align-items-center justify-content-center position-relative">
            <Avatar
              style={{ background: "#39B98F", color: "#fff" }}
              className="mr-2"
            >
              {authState.user?.name?.substring(0, 1)}
            </Avatar>
            <div className="d-flex flex-column footer-span">
              <span className="user-name">{authState.user?.name}</span>
              <span className="register-no">{authState.user?.regno}</span>
            </div>
          </div>
        </div>
        <div className="main-div w-100">
          <Switch>
            <Route path="/dashboard" exact>
              <Dashboard
                setSideToggle={setSideToggle}
                snackBar={props.snackBar}
              />
            </Route>
            <Route path="/articles" exact>
              <Articles setSideToggle={setSideToggle} />
            </Route>
            <Route path="/roadmap" exact>
              <Roadmap setSideToggle={setSideToggle} />
            </Route>
            <Route path="/compiler" exact>
              <Compiler
                setSideToggle={setSideToggle}
                snackBar={props.snackBar}
              />
            </Route>
            <Route path="/profile" exact>
              <Profile
                setSideToggle={setSideToggle}
                snackBar={props.snackBar}
              />
            </Route>

            <Route path="/codekata" exact>
              <Codekata
                snackBar={props.snackBar}
                setSideToggle={setSideToggle}
              />
            </Route>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />

            {authState?.contest ? (
              [
                <>
                  <Route path="/codekata/:id/quiz/:questionId" exact>
                    <Quiz
                      setSideToggle={setSideToggle}
                      snackBar={props.snackBar}
                    />
                  </Route>
                  <Route path="/codekata/:id/problem/:questionId" exact>
                    <Programs
                      setSideToggle={setSideToggle}
                      snackBar={props.snackBar}
                    />
                  </Route>
                  <Route path="/codekata/:id" exact>
                    <ContestDetails
                      setSideToggle={setSideToggle}
                      snackBar={props.snackBar}
                    />
                  </Route>
                </>,
              ]
            ) : (
              <>
                {location.pathname.includes("/codekata") ? (
                  <Redirect to="/codekata" />
                ) : (
                  <Route path="*">
                    <PageNotFound />
                  </Route>
                )}
              </>
            )}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Main;
