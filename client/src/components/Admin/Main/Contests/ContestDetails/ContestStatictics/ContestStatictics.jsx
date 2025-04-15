import React, { useEffect } from "react";
import FileDownload from "js-file-download";
import "./ContestStatictics.css";
import SubmissionGif from "../../../../../../images/submission.webp";
import Trophy from "../../../../../../images/trophy.webp";
import Pagination from "@material-ui/lab/Pagination";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useContext } from "react";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import helperService from "../../../../../../services/helperService";
import { useState } from "react";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
const limit = 10,
  leaderBoardCount = 5;
const ContestStatictics = (props) => {
  const { id } = useParams();
  const [authState] = useContext(AuthContext);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const fethContestSubmissions = async (page_count = 1) => {
    try {
      const { data, status } = await helperService.getContestSubmissions(
        { page: page_count, limit, contest_id: id },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        setSubmissions(data?.submissions?.submissions || []);

        if (!total) setTotal(data?.submissions?.totalCount || 0);
        setLeaderBoard(
          data?.submissions?.leaderBoard?.slice(0, leaderBoardCount) || []
        );
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  useEffect(() => {
    fethContestSubmissions();
  }, []);
  const handlePagination = (e, value) => {
    if (page !== value) {
      setPage(value);
      fethContestSubmissions(value);
    }
  };
  const downloadStatistics = async () => {
    try {
      const { data, status } = await helperService.downloadStatistics(
        { contest_id: id },
        {
          headers: { Authorization: authState?.user?.token },
          responseType: "arraybuffer",
        }
      );
      if (status === 200) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileDownload(blob, `${authState?.contest?.name}_Submissions.xlsx`);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  return (
    <div className="container-fluid w-100">
      <div className="d-flex stats-main">
        <div className="col-md-9 mb-5 stats-left d-flex flex-column border">
          <div className="statistics-nav d-flex justify-content-center mt-3 mb-2 w-100">
            <div className="col-md-2 inner-stat-nav">S.NO</div>
            <div className="col-md-2 inner-stat-nav">REG.NO</div>
            <div className="col-md-3 inner-stat-nav">NAME</div>
            <div className="col-md-2 inner-stat-nav">TIME</div>
            <div className="col-md-3 inner-stat-nav">POINTS</div>
          </div>

          {submissions.map((e, id) => {
            return (
              <div className="stats d-flex w-100" key={e._id}>
                <div className="col-md-2 stats-detail">
                  {page * limit + id - 9}
                </div>
                <div className="col-md-2 stats-detail">{e.user_id.regno}</div>
                <div className="col-md-3 stats-detail">{e.user_id.name}</div>
                <div className="col-md-2 stats-detail">
                  {new Date(e.created_at).toLocaleString()}
                </div>
                <div className="col-md-3 stats-detail">{e.score}</div>
              </div>
            );
          })}
          <div>
            {total > limit && (
              <Pagination
                count={
                  Math.floor(total / limit) + (total % limit !== 0 ? 1 : 0)
                }
                color="primary"
                variant="text"
                className="mt-5 d-flex justify-content-center"
                onChange={(e, value) => handlePagination(e, value)}
              />
            )}
          </div>
        </div>

        <div className="col-md-3 stats-right d-flex flex-column m-1">
          <div className="top-part mx-2 my-2 p-2">
            <div className="d-flex align-items-center justify-content-center mt-2 mb-2">
              <img alt="someImage" src={Trophy} className="pr-3 img-fluid" />
              <span className="top-participants">
                Top {leaderBoardCount} Participants
              </span>
            </div>
            <div className="d-flex flex-column mt-4">
              {leaderBoard.map((submission, idx) => (
                <div className="d-flex mt-2 mb-2" key={submission._id}>
                  <div className="col-md-2">
                    <button className="correct">{idx + 1}</button>
                  </div>
                  <div className="col-md-6 top-scorer">
                    {submission.user_id.regno}
                    <br />
                    {submission.user_id.name
                      ? `(${submission.user_id?.name?.toLowerCase()})`
                      : ""}
                  </div>
                  <div className="col-md-4 d-flex justify-content-between align-items-center">
                    <img
                      alt="someImage"
                      src="https://img.icons8.com/emoji/30/000000/coin-emoji.png"
                    />
                    <span className="score-point">{submission.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="top-part mx-2 my-2 p-3">
            <div className="submissions d-flex flex-column align-items-center justify-content-center">
              <img src={SubmissionGif} height="98" width="96" />
              <span className="mt-4">
                Total no. of submissions :{" "}
                <h1 className="submission-count d-flex justify-content-center">
                  {total}
                </h1>
              </span>
            </div>
          </div>
          <div className="w-100 clearfix">
            <CustomButton
              className="btn-hover color-11 d-flex align-items-center py-1 px-3 float-right"
              onClickHandler={downloadStatistics}
            >
              <GetAppIcon />
              <span className="ml-2">Download</span>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestStatictics;
