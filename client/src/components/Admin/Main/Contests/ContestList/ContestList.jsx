import React from "react";
import { Link } from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { IconButton, Tooltip } from "@material-ui/core";
const ContestList = ({ contests, contestName, setContest, snackBar }) => {
  const copyToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text ?? "");
    } else {
      document.execCommand("copy", true, text ?? "");
    }
    snackBar("Code Copied", "success");
  };
  return (
    <div className="my-3">
      <div className="upcoming-events">
        <div className="upcoming-header">
          <span>{`${contestName} Contests`}</span>
        </div>
      </div>
      <div className="d-flex border-top border-bottom mt-2 py-2">
        <div className="col-md-3 text-center content-nav-title">Title</div>
        <div className="col-md-1 text-center content-nav-title">CODE</div>
        <div className="col-md-3 text-center content-nav-title">Starts at</div>
        <div className="col-md-3 text-center content-nav-title">Ends at</div>
        <div className="col-md-2 text-center content-nav-title">
          <AccessAlarmIcon />
        </div>
      </div>
      <div className="d-flex flex-column">
        {contests.map((event) => {
          return (
            <div
              className="d-flex align-items-center my-2"
              key={event._id}
              style={{ fontSize: "15px" }}
            >
              <div className="col-md-3 d-flex align-items-center justify-content-center upcoming-task">
                <LinkIcon className="contest-link mr-2" />
                <Link
                  to={`/contests/${event._id}/edit`}
                  onClick={() => setContest(event)}
                >
                  <span>{event.name}</span>
                </Link>
              </div>
              <div className="col-md-1 d-flex align-items-center">
                <span className="mr-1">{event.code}</span>
                <Tooltip title="Contest code">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(event.code)}
                  >
                    <FileCopyIcon style={{ transform: "scale(0.8)" }} />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="col-md-3 text-center">{`${new Date(
                event.start_date
              ).toLocaleString()} `}</div>
              <div className="col-md-3 text-center">{`${new Date(
                event.end_date
              ).toLocaleString()} `}</div>
              <div className="col-md-2 text-center">
                <span>{event.duration}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestList;
