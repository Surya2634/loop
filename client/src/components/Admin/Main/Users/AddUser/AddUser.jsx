import React, { useState } from "react";
import InputReducer from "../../../../Reducer/InputReducer";
import DropFileInput from "./DropFileInput/DropFileInput";
import SelectReducer from "../../../../Reducer/SelectReducer/SelectReducer";
import "../../../../Student/Main/Dashboard/Dashboard.css";
import { makeStyles } from "@material-ui/core/styles";
import helperService from "../../../../../services/helperService";
import { useContext } from "react";
import { AuthContext, useLoader } from "../../../../../contexts/AuthContext";
import CustomButton from "../../../../Reducer/CustomButton/CustomButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #1E2D64",
  },
  fieldColor: {
    width: "100%",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00511B",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00511B",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#00511B",
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const AddUser = (props) => {
  const [loader, showLoader, hideLoader] = useLoader();
  const [reqflag, setReqflag] = useState(false);
  const [logs, setLogs] = useState({});
  const [authState] = useContext(AuthContext);
  const [user, setUser] = useState({});
  const classes = useStyles();
  const removeFileHandler = (setFileList) => {
    setFileList([]);
  };
  const onFileChange = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.get("file");
    //**This is modified when compare to other api calls*/
    showLoader();
    try {
      const { data, status } = await helperService.createBulkUsers(
        { file: formData },
        {
          Authorization: authState?.user?.token,
          "Content-Type": "multipart/form-data",
        }
      );
      if (status === 200) {
        if (data?.errorLogs?.errorLogs.length >= 0) setLogs(data.errorLogs);
        return true;
      }
    } catch ({ message, ...err }) {
      props.snackBar(message, "error");
    } finally {
      hideLoader();
    }
    return false;
  };
  const createUser = async () => {
    /* eslint-disable no-useless-escape */
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /* eslint-disable no-useless-escape */
    let username = /^[a-zA-Z\_]{3,25}$/;

    if (user.name && !username.test(user.name)) {
      props.snackBar("Username is Invalid", "error");
      return;
    }
    if (user.regno.length !== 7) {
      props.snackBar("Please check the register Number", "error");
      return;
    }
    if (!user.stream_id) {
      props.snackBar("Stream is not selected", "error");
      return;
    }
    if (!user.course_id) {
      props.snackBar(" Course is not selected", "error");
      return;
    }
    if (!user.college_id) {
      props.snackBar("College is not selected", "error");
      return;
    }
    if (user.email && !emailRegex.test(user.email)) {
      props.snackBar("Email is Incorrect", "error");
      return;
    }
    if (user.phone_no && user.phone_no.length !== 10) {
      props.snackBar("Phone Number is Incorrect", "error");
      return;
    }
    if (user.gender_id && user.gender_id === "") {
      props.snackBar("Gender is not Selected", "error");
      return;
    }
    if (!user.batch_id) {
      props.snackBar("Batch is not Selected", "error");
      return;
    }

    try {
      showLoader();

      const { status, message } = await helperService.createUser(
        {
          ...user,
          college_id: user.college_id,
          batch_id: `${user.batch_id.substring(0, 4)}-${user.batch_id.substring(
            user.batch_id.length - 4,
            user.batch_id.length
          )}`,
        },
        { headers: { Authorization: authState?.user?.token } }
      );
      if (status === 201) {
        hideLoader();
        props.snackBar(message, "success");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
      hideLoader();
    }
  };
  return (
    <div className="container mb-5">
      {loader}
      <p className="text-left dash-title-category pb-2">Add Details *</p>
      <div className="col p-0" style={{ marginTop: "-20px" }}>
        <div className="hr">
          <hr className="col p-0" />
        </div>
        <div className="d-flex justify-content-between question-outoff p-0 mb-3 w-100">
          <span className="text-muted">
            Create user as a individual data \ or through the bulk upload
          </span>
          <span className="text-info font-weight-bolder">
            Bulk upload Excel file
          </span>
        </div>
      </div>
      <div className="d-flex">
        <div className="col-md-8 p-2 border m-1">
          <div className="d-flex mt-2 mb-2">
            <div className="col-md-6 p-1">
              <InputReducer
                className={classes.fieldColor}
                label="Name"
                placeholder="Name"
                name="Name"
                type="text"
                value={user.name}
                onClickHandler={(value) =>
                  setUser({ ...user, name: value.trim() })
                }
              />
            </div>
            <div className="col-md-6 p-1">
              <InputReducer
                className={classes.fieldColor}
                placeholder="Register Number"
                label="Register Number"
                name="Register Number"
                type="text"
                value={user.regno}
                onClickHandler={(value) =>
                  setUser({ ...user, regno: value.trim() })
                }
              />
            </div>
          </div>
          <div className="d-flex mt-2 mb-2">
            <div className="col-md-6 p-1">
              <SelectReducer
                className={classes.fieldColor}
                array={["B.E", "B.Tech"]}
                name="Stream"
                value={user.stream_id}
                handleSelect={(e) =>
                  setUser({ ...user, stream_id: e.target.value, course_id: "" })
                }
              />
            </div>
            <div className="col-md-6 p-1">
              <SelectReducer
                className={classes.fieldColor}
                array={
                  user.stream_id === "B.Tech"
                    ? ["Information Technology"]
                    : [
                        "Computer Science & Engineering",
                        "Electrical & Electronics Engineering",
                        "Electronics and Communication Engineering",
                        "Mechanical Engineering",
                        "Automobile Engineering",
                        "Civil Engineering",
                        "Safety & Fire Engineering",
                      ]
                }
                name="Course Name"
                handleSelect={(e) =>
                  setUser({ ...user, course_id: e.target.value })
                }
                value={user.course_id}
              />
            </div>
          </div>
          <div className="d-flex mt-2 mb-2">
            <div className="col-md-6 p-1">
              <SelectReducer
                value={user.college_id}
                className={classes.fieldColor}
                array={[
                  "KSR College of Engineering",
                  "KSR College of Technology",
                  "KSR Institute for Engineering & Technology",
                ]}
                name="College Name"
                handleSelect={(e) =>
                  setUser({ ...user, college_id: e.target.value })
                }
              />
            </div>
            <div className="col-md-6 p-1">
              <InputReducer
                className={classes.fieldColor}
                placeholder="Email"
                label="Email"
                name="Email"
                type="email"
                value={user.email}
                onClickHandler={(value) =>
                  setUser({ ...user, email: value.trim() })
                }
              />
            </div>
          </div>

          <div className="d-flex mt-2 mb-2">
            <div className="col-md-6 p-1">
              <InputReducer
                className={classes.fieldColor}
                placeholder="Phone number"
                label="Phone number"
                name="Phone number"
                type="text"
                value={user.phone_no}
                onClickHandler={(value) =>
                  setUser({ ...user, phone_no: value })
                }
              />
            </div>
            <div className="col-md-6 p-1">
              <SelectReducer
                className={classes.fieldColor}
                array={["male", "female", "other"]}
                name="Gender"
                handleSelect={(e) =>
                  setUser({ ...user, gender_id: e.target.value })
                }
                value={user.gender_id}
              />
            </div>
          </div>
          <div className="d-flex mt-3 mb-2">
            <div className="col-md-6 p-1">
              <SelectReducer
                className={classes.fieldColor}
                array={[
                  "2018-2022",
                  "2019-2023",
                  "2020-2024",
                  "2021-2025",
                  "2022-2026",
                  "2023-2027",
                  "2024-2028",
                  "2025-2029",
                  "2026-2030",
                ]}
                name="Batch year"
                label="Batch year"
                handleSelect={(e) =>
                  setUser({ ...user, batch_id: e.target.value })
                }
                value={user.batch_id}
              />
            </div>
          </div>
          <CustomButton
            className="btn-hover color-11 mt-4 d-flex align-items-center py-2 px-3"
            onClickHandler={createUser}
          >
            <AddCircleIcon />
            <span className="ml-2">CREATE USER</span>
          </CustomButton>
        </div>
        <div className="col-md-4 p-2 border m-1">
          <DropFileInput
            logs={logs}
            setLogs={setLogs}
            onFileChange={onFileChange}
            snackBar={props.snackBar}
            removeFileHandler={removeFileHandler}
            reqflag={reqflag}
            setReqflag={setReqflag}
          />
        </div>
      </div>
    </div>
  );
};

export default AddUser;
