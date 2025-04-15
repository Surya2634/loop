import React, { useContext, useEffect, useState } from "react";
import helperService from "../../../../services/helperService";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import ErrorLogDialogBox from "../../../Reducer/ErrorLogDialogBox/ErrorLogDialogBox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityIcon from "@material-ui/icons/Visibility";
// import { IconButton } from "@material-ui/core";
const ErrorLogs = (props) => {
  const { id } = useParams();
  const [authState] = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorLog, setErrorLog] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorLog({});
  };

  const fetchErrorLogs = async () => {
    try {
      const {
        data: { message, errorLogs },
        status,
      } = await helperService.getErrorLogs(
        { created_by: id },
        { headers: { Authorization: authState?.user?.token } }
      );
      if (status === 200) {
        props.snackBar(message, "success");
        setErrorLogs(errorLogs);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  useEffect(() => {
    fetchErrorLogs();
  }, []);
  return (
    <div className="container">
      <p className="text-left dash-title-category pb-2 mt-5">Error Logs</p>
      <span className="create-con-text mt-1">
        Shows all the errors while creating the students as a bulk upload
      </span>
      <div className="mt-4 d-flex flex-column">
        <div className="d-flex upcoming-header border-top border-bottom mt-2 p-2 mb-1">
          <div className="col-md-2 text-center content-nav-title">S.NO</div>
          <div className="col-md-2 text-center content-nav-title">
            NO. OF LOGS
          </div>
          <div className="col-md-2 text-center content-nav-title">
            <CheckCircleIcon />
          </div>
          <div className="col-md-2 text-center content-nav-title">
            <ErrorIcon />
          </div>
          <div className="col-md-2 text-center content-nav-title">SHOW</div>
        </div>
        <div className="d-flex flex-column">
          {errorLogs.map((log, index) => (
            <div
              className="d-flex border-top border-bottom mt-1 p-2 mb-1"
              key={log._id}
            >
              <div className="col-md-2 text-center content-nav-title">
                {index + 1})
              </div>
              <div className="col-md-2 text-center content-nav-title">
                {log.totalLogs}
              </div>
              <div className="col-md-2 text-center content-nav-title">
                {+log.totalLogs - log.errorLogs.length}
              </div>
              <div className="col-md-2 text-center content-nav-title">
                {log.errorLogs.length}
              </div>
              <div className="col-md-2 text-center content-nav-title">
                {/* <IconButton
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setErrorLog(log);
                    handleClickOpen();
                  }}
                > */}
                <VisibilityIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setErrorLog(log);
                    handleClickOpen();
                  }}
                />
                {/* </IconButton> */}
              </div>
            </div>
          ))}
          <ErrorLogDialogBox
            open={open}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
            log={errorLog}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorLogs;
