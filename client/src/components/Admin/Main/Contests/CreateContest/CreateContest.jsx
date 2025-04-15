import { useContext, useState } from "react";
import helperService from "../../../../../services/helperService";
import InputReducer from "../../../../Reducer/InputReducer";
import { AuthContext, useLoader } from "../../../../../contexts/AuthContext";
import "./CreateContest.css";
import { useHistory, useParams } from "react-router-dom";
import CustomButton from "../../../../Reducer/CustomButton/CustomButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import InfoIcon from "@material-ui/icons/Info";
const CreateContest = (props) => {
  const [loader, showLoader, hideLoader] = useLoader();
  const history = useHistory();
  const { id } = useParams();
  const convertDate = (date) => {
    if (date) return date.split("T")[0];
    return "";
  };
  //**state declartion start */
  const [authState] = useContext(AuthContext);
  const [name, setName] = useState(authState?.contest?.name || "");
  const [date, setDate] = useState({
    start_date: convertDate(authState?.contest?.start_date),
    end_date: convertDate(authState?.contest?.end_date),
  });
  const [time, setTime] = useState({
    start_time: authState?.contest?.start_time,
    end_time: authState?.contest?.end_time,
  });
  const validateContestDetails = () => {
    if (name?.length < 4) {
      props.snackBar("Contest Name should have more than 3 letters.", "error");
      return false;
    }
    if (name?.length > 25) {
      props.snackBar("Contest Name should have less than 25 letters.", "error");
      return false;
    }
    if (!date.start_date) {
      props.snackBar("Contest start date in empty", "error");
      return false;
    }
    if (!time.start_time) {
      props.snackBar("Contest start time in empty", "error");
      return false;
    }
    if (!date.end_date) {
      props.snackBar("Contest end date in empty", "error");
      return false;
    }
    if (!time.end_time) {
      props.snackBar("Contest end time in empty", "error");
      return false;
    }
    if (+new Date() > +new Date(`${date.start_date} ${time.start_time}`)) {
      props.snackBar("Check contest start date or start time", "error");
      return false;
    }
    if (+new Date() > +new Date(`${date.end_date} ${time.end_time}`)) {
      props.snackBar("Check contest end date or end time", "error");
      return false;
    }
    if ((+new Date(`${date.start_date} ${time.start_time}`)) > (+new Date(`${date.end_date} ${time.end_time}`))) {
      props.snackBar("Starting date & time must be before the ending date & time", "error");
      return false;
    }
    return true;
  };
  const createContest = async () => {
    const flag = validateContestDetails();
    if (!flag) return;
    try {
      showLoader();
      const { status, message } = await helperService.createContest(
        {
          name,
          start_date: date.start_date,
          end_date: date.end_date,
          start_time: time.start_time,
          end_time: time.end_time,
          created_by: authState?.user?._id,
        },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 201) {
        props.snackBar(message, "success");
        history.push(`/contests`);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    } finally {
      hideLoader();
    }
  };
  const updateContest = async () => {
    const flag = validateContestDetails();
    if (!flag) return;
    try {
      showLoader();
      const { status, message } = await helperService.updateContest(
        {
          id,
          name,
          start_date: date.start_date,
          end_date: date.end_date,
          start_time: time.start_time,
          end_time: time.end_time,
        },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        props.snackBar(message, "success");
        hideLoader();
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
      hideLoader();
    }
  };

  return (
    <div className="container mt-5">
      {loader}
      <div className="d-flex flex-column">
        <p className="text-left dash-title-category pb-2">{props?.title}</p>
        <span className="create-con-text mt-1">
          Host your own coding contest on LOOP. You can provide and complete
        </span>
        <span className="create-con-text">
          with your friends from your organization
        </span>
        <span className="create-con-text mt-1">
          get started by providing the initail details of the contest{" "}
        </span>
      </div>

      <div className="d-flex flex-column mt-4">
        <div className="d-flex mt-1 mb-3">
          <span className="contest-line-height col-md-2">
            Contest name <span className="contest-star">*</span>
          </span>
          <div className="col-md-4">
            <InputReducer
              className="bg-input-change"
              placeholder="Contest name"
              name="Contest name"
              type="text"
              value={name}
              onClickHandler={(e) => setName(e)}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-3">
          <span className="contest-line-height col-md-2">
            Start Time <span className="contest-star">*</span>
          </span>
          <div className="col-md-4">
            <InputReducer
              placeholder="Starts at"
              name="Starts at"
              type="date"
              value={date.start_date}
              onClickHandler={(e) => setDate({ ...date, start_date: e })}
            />
          </div>

          <span className="contest-line-height mr-2">at</span>
          <div className="col-md-4">
            <InputReducer
              placeholder="Starts at"
              name="Starts at"
              type="time"
              value={time.start_time}
              onClickHandler={(e) => setTime({ ...time, start_time: e })}
            />
          </div>
          <span className="info-circle mr-2 mt-3">
            <InfoIcon />
          </span>
        </div>
        <div className="d-flex">
          <span className="contest-line-height col-md-2">
            End Time <span className="contest-star">*</span>
          </span>
          <div className="col-md-4">
            <InputReducer
              placeholder="Ends at"
              name="Ends at"
              type="date"
              value={date.end_date}
              onClickHandler={(e) => setDate({ ...date, end_date: e })}
            />
          </div>
          <span className="contest-line-height mr-2">at</span>
          <div className="col-md-4">
            <InputReducer
              placeholder="Ends at"
              name="Ends at"
              type="time"
              value={time.end_time}
              onClickHandler={(e) => setTime({ ...time, end_time: e })}
            />
          </div>
          <span className="info-circle mr-2 mt-3">
            <InfoIcon />
          </span>
        </div>
      </div>
      <CustomButton
        className="btn-hover color-11 mt-4 float-right d-flex align-items-center py-2 px-3"
        disabled={
          props?.title !== "Create Contest" &&
          new Date(authState?.contest?.end_date) < new Date()
        }
        onClickHandler={
          props?.title !== "Create Contest" ? updateContest : createContest
        }
      >
        <AddCircleIcon />
        <span className="ml-2">{props?.title?.toUpperCase()}</span>
      </CustomButton>
    </div>
  );
};

export default CreateContest;
