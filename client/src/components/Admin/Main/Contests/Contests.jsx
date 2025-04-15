import React, { useContext, useEffect, useState } from "react";
import "./Contests.css";
import { Link } from "react-router-dom";
import helperService from "../../../../services/helperService";
import { AuthContext, useLoader } from "../../../../contexts/AuthContext";
import Pagination from "@material-ui/lab/Pagination";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CustomButton from "../../../Reducer/CustomButton/CustomButton";
import LinkIcon from "@material-ui/icons/Link";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import PeopleIcon from "@material-ui/icons/People";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import ContestList from "./ContestList/ContestList";
const Contests = (props) => {
  const [loader, showLoader, hideLoader] = useLoader();
  const limit = 10;
  const [authState, authDispatch] = useContext(AuthContext);
  const [contests, setContests] = useState({
    upcoming: [],
    ongoing: [],
    past: [],
    pastContestsCount: 0,
  });
  const [page, setPage] = useState(1);
  const handlePagination = (e, value) => {
    if (page !== value) {
      setPage(value);
      fetchContests(value, true);
    }
  };

  const fetchContests = async (page = 1, past = false) => {
    try {
      if (!past) showLoader();
      const {
        status,
        data: { data, message },
      } = await helperService.getAllContests(
        { page, past, limit },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        const {
          pastContests,
          ongoingContests,
          upcomingContests,
          pastContestsCount,
        } = data;
        props.snackBar(message, "success");
        setContests({
          pastContestsCount,
          past: pastContests,
          ongoing:
            ongoingContests.length > 0
              ? [...ongoingContests]
              : contests.ongoing,
          upcoming:
            upcomingContests.length > 0
              ? [...upcomingContests]
              : contests.upcoming,
        });
        if (!past) hideLoader();
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
      hideLoader();
    }
  };
  useEffect(() => {
    fetchContests();
  }, []);
  const setContest = (contest) => {
    authDispatch({ type: "SET_CONTEST", payload: { ...contest } });
  };
  return (
    <div
      className="container-fluid"
      style={{ height: "100vh", overflowY: "scroll", marginTop: "40px" }}
    >
      {loader}
      <div className="d-flex">
        <div className="contest-header mr-auto">
          <p className="text-left dash-title-category pb-2">Contests</p>
        </div>
        <Link to="/contests/create-contest">
          <CustomButton className="btn-hover color-11 d-flex align-items-center py-2 px-3">
            <AddCircleIcon />
            <span className="ml-2">CREATE CONTEST</span>
          </CustomButton>
        </Link>
      </div>
      <ContestList
        contests={contests?.ongoing}
        contestName={"Current"}
        setContest={setContest}
        snackBar={props.snackBar}
      />
      <ContestList
        contests={contests?.upcoming}
        contestName={"Upcoming"}
        setContest={setContest}
        snackBar={props.snackBar}
      />
      <div className="my-3">
        <div className="upcoming-events">
          <div className="upcoming-header">
            <span>Past Contests</span>
          </div>
        </div>
        <div className="d-flex border-top border-bottom mt-2 p-2 mb-2">
          <div className="col-md-3 text-center content-nav-title">Title</div>
          <div className="col-md-3 text-center content-nav-title">
            Started at
          </div>
          <div className="col-md-2 text-center content-nav-title">
            <PeopleIcon />
          </div>
          <div className="col-md-2 text-center content-nav-title">
            <AccessAlarmIcon />
          </div>
          <div className="col-md-2 text-center content-nav-title">Status</div>
        </div>

        <div className="d-flex flex-column">
          {contests?.past?.map((event) => {
            return (
              <div className="d-flex mt-2 mb-2" key={event._id}>
                <LinkIcon className="contest-link position-relative" />
                <div className="col-md-3 text-center upcoming-task">
                  <Link
                    to={`/contests/${event._id}/statistics`}
                    onClick={() => setContest(event)}
                  >
                    <span>{event.name}</span>
                  </Link>
                </div>
                <div className="col-md-3 text-center">{`${new Date(
                  event.start_date
                ).toLocaleString()} `}</div>
                <div className="col-md-2 text-center">
                  {event.submissionsCount}
                </div>
                <div className="col-md-2 text-center">
                  <span>{event.duration}</span>
                </div>
                <div className="col-md-2 text-center">
                  <CloseRoundedIcon style={{ color: "red" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {contests?.pastContestsCount > limit && (
          <Pagination
            count={
              Math.floor(contests?.pastContestsCount / limit) +
              (contests?.pastContestsCount % limit !== 0 ? 1 : 0)
            }
            color="primary"
            variant="text"
            className="mt-5 d-flex justify-content-center"
            onChange={(e, value) => handlePagination(e, value)}
          />
        )}
      </div>
    </div>
  );
};

export default Contests;
