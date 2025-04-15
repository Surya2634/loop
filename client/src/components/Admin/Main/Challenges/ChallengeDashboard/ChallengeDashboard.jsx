import React, { useEffect, useContext } from "react";
import { NavLink, Route, Switch, Redirect, useParams } from "react-router-dom";
import { AuthContext } from "../../../../../contexts/AuthContext";
import helperService from "../../../../../services/helperService";
import PageNotFound from "../../../../Reducer/PageNotFound/404";
import CreateChallenge from "./CreateChallenge/CreateChallenge";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import TestCase from "./TestCase/TestCase";
import LibraryAddCheckRoundedIcon from "@material-ui/icons/LibraryAddCheckRounded";
const ChallengeDashboard = (props) => {
  const [authState, authDispatch] = useContext(AuthContext);
  const { id } = useParams();
  const fetchChallenge = async () => {
    try {
      const {
        data: { question },
        status,
      } = await helperService.getQuestion(
        { id, type: "problem" },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        authDispatch({ type: "SET_CHALLENGE", payload: { ...question } });
      }
    } catch ({ message }) {
      props.snakBar(message, "error");
    }
  };
  useEffect(() => {
    if (!authState?.challenge) fetchChallenge();
  }, []);

  return (
    <>
      <div
        className="challenge-container"
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <ul className="list-group d-flex align-items-center justify-content-center flex-row p-2 mt-3 mb-3">
          <li className="list-group-item user-group-pill">
            <NavLink
              exact
              className="user-navlink pr-3 pl-3 m-2 btn nav-button d-flex justify-content-center align-items-center"
              to={`/challenges/${id}/update`}
              activeClassName="active-user-pill"
            >
              <AddCircleRoundedIcon />
              <span>Challenge</span>
            </NavLink>
          </li>
          <li className="list-group-item user-group-pill">
            <NavLink
              exact
              className="user-navlink pr-3 pl-3 m-2 btn nav-button d-flex justify-content-center align-items-center"
              to={`/challenges/${id}/create-testcase`}
              activeClassName="active-user-pill"
            >
              <LibraryAddCheckRoundedIcon />
              <span>TestCase</span>
            </NavLink>
          </li>
        </ul>
        <div>
          <Switch>
            <Route path={`/challenges/:id/update`} exact>
              <CreateChallenge
                title="Update Challenge"
                fetchChallenge={fetchChallenge}
                snackBar={props.snackBar}
              />
            </Route>
            <Route path={`/challenges/:id/create-testcase`} exact>
              <TestCase snackBar={props.snackBar} />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
            <Route
              exact
              path="/challenges/:id"
              render={() => <Redirect to={`/challenges/${id}/update`} />}
            />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default ChallengeDashboard;
