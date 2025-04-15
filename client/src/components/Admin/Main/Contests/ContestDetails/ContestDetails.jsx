import { NavLink, Switch, Route, useParams } from "react-router-dom";
import "./ContestDetails.css";
import ContestChallenges from "./ContestChallenges/ContestChallenges";
import ContestQuizzes from "./ContestQuizzes/ContestQuizzes";
import ContestStatictics from "./ContestStatictics/ContestStatictics";
import CreateContest from "../CreateContest/CreateContest";
import CreateChallenge from "../../Challenges/ChallengeDashboard/CreateChallenge/CreateChallenge";
import { useContext, useEffect } from "react";
import { AuthContext, useLoader } from "../../../../../contexts/AuthContext";
import helperService from "../../../../../services/helperService";
import PageNotFound from "../../../../Reducer/PageNotFound/404";
import DetailsIcon from "@material-ui/icons/Details";
import SubtitlesIcon from "@material-ui/icons/Subtitles";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AssessmentIcon from "@material-ui/icons/Assessment";
const ContestDetails = (props) => {
  const [, showLoader, hideLoader] = useLoader();
  const [authState, authDispatch] = useContext(AuthContext);
  const { id } = useParams();
  const fetchContest = async () => {
    try {
      showLoader();
      const { data, status } = await helperService.getContest(
        { id },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        props.snackBar(data.message, "success");
        authDispatch({ type: "SET_CONTEST", payload: data?.contest });
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    } finally {
      hideLoader();
    }
  };
  useEffect(() => {
    if (!authState?.contest) fetchContest();
    return () => {
      authDispatch({ type: "REMOVE_CONTEST" });
    };
  }, []);
  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>
      <ul className="container-fluid list-group d-flex flex-row py-2 px-3 my-3">
        {authState?.contest &&
        !(new Date(authState?.contest?.end_date) < new Date()) ? (
          <>
            <NavLink
              exact
              className="edit-contest-li px-3 mt-2 mb-2"
              to={`/contests/${id}/edit`}
              activeClassName="box arrow-bottom"
            >
              <li className="list-group-item user-group-pill d-flex position-relative">
                <DetailsIcon /> <span className="mx-2">Details</span>
              </li>
            </NavLink>
            <NavLink
              exact
              className="edit-contest-li px-3 mt-2 mb-2"
              to={`/contests/${id}/quizzes`}
              activeClassName="box arrow-bottom"
            >
              <li className="list-group-item d-flex user-group-pill position-relative">
                <SubtitlesIcon /> <span className="mx-2">Quizzes List</span>
              </li>
            </NavLink>
            <NavLink
              exact
              className="edit-contest-li px-3 mt-2 mb-2"
              to={`/contests/${id}/challenges`}
              activeClassName="box arrow-bottom"
            >
              <li className="list-group-item d-flex user-group-pill position-relative">
                <PostAddIcon />
                <span className="mx-2">Challenges List</span>
              </li>
            </NavLink>
          </>
        ) : null}

        <NavLink
          exact
          className="edit-contest-li px-3 mt-2 mb-2"
          to={`/contests/${id}/statistics`}
          activeClassName="box arrow-bottom"
        >
          <li className="list-group-item d-flex user-group-pill position-relative">
            <AssessmentIcon />
            <span className="mx-2">Statictics</span>
          </li>
        </NavLink>
      </ul>
      <div>
        <Switch>
          {authState?.contest &&
          !(new Date(authState?.contest?.end_date) < new Date()) ? (
            <>
              <Route path={`/contests/:id/edit`} exact>
                <CreateContest
                  title="Update Contest"
                  snackBar={props.snackBar}
                />
              </Route>
              <Route path={`/contests/:id/quizzes`} exact>
                <ContestQuizzes snackBar={props.snackBar} />
              </Route>
              <Route path={`/contests/:id/challenges`}>
                <Route path="/contests/:id/challenges" exact>
                  <ContestChallenges snackBar={props.snackBar} />
                </Route>
                <Route path="/contests/:id/challenges/create" exact>
                  <CreateChallenge snackBar={props.snackBar} />
                </Route>
              </Route>
              <Route path={`/contests/:id/statistics`} exact>
                <ContestStatictics snackBar={props.snackBar} />
              </Route>
            </>
          ) : (
            <Route path={`/contests/:id/statistics`} exact>
              <ContestStatictics snackBar={props.snackBar} />
            </Route>
          )}
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default ContestDetails;
