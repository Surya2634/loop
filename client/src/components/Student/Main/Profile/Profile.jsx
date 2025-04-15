import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import InputReducer from "../../../Reducer/InputReducer";
import SelectReducer from "../../../Reducer/SelectReducer/SelectReducer";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";
import CustomButton from "../../../Reducer/CustomButton/CustomButton";
import GoBack from "../../../Reducer/GoBack/GoBack";
import PasswordField from "../../../Reducer/PasswordField/PasswordField";
import { AuthContext } from "../../../../contexts/AuthContext";
import helperService from "../../../../services/helperService";
const useStyles = makeStyles(() => ({
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
}));
const Profile = ({ setSideToggle, ...props }) => {
  const history = useHistory();
  const classes = useStyles();
  const [authState, authDispatch] = useContext(AuthContext);
  const formSchema = {
    _id: authState?.user?._id,
    email: authState?.user?.email ?? "",
    regno: authState?.user?.regno ?? "",
    name: authState?.user?.name ?? "",
    phone_no: authState?.user?.phone_no ?? "",
    gender_id: authState?.user?.gender_id ?? "",
    stream_id: authState?.user?.stream_id ?? "",
    course_id: authState?.user?.course_id ?? "",
    college_id: authState?.user?.college_id ?? "",
    batch_id: authState?.user?.batch_id ?? "",
  };
  const [user, setUser] = useState(formSchema);
  const studentDetails = () => setUser(formSchema);
  const [updateDetails, setUpdateDetails] = useState({});
  useEffect(() => {
    setSideToggle(false);
    studentDetails();
  }, [authState]);
  const userEditedDetails = async () => {
    /* eslint-disable no-useless-escape */
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /* eslint-disable no-useless-escape */
    let username = /^[a-zA-Z\_]{3,25}$/;
    if (updateDetails.name && updateDetails.name !== "") {
      if (!username.test(updateDetails.name)) {
        props.snackBar("Username is Invalid", "error");
        return;
      }
    }
    if (updateDetails.email && updateDetails.email !== "") {
      if (!emailRegex.test(updateDetails.email)) {
        props.snackBar("Email is Incorrect", "error");
        return;
      }
    }
    if (updateDetails.phone_no && updateDetails.phone_no.length !== 10) {
      props.snackBar("Phone Number is Incorrect", "error");
      return;
    }
    if (updateDetails.new_password < 5) {
      props.snackBar(
        "Password is too short. Enter minimum 5 characters",
        "error"
      );
      return;
    }
    if (updateDetails.new_password > 15) {
      props.snackBar(
        "Password is too long. Enter maximum 15 characters",
        "error"
      );
      return;
    }
    if (updateDetails.new_password !== updateDetails.confirm_password) {
      props.snackBar("Password Mismatch", "error");
      return;
    }
    let details = {};
    if (updateDetails.name && user.name !== updateDetails.name)
      details.name = updateDetails.name;
    if (updateDetails.email && user.email !== updateDetails.email)
      details.email = updateDetails.email;
    if (updateDetails.phone_no && user.phone_no !== +updateDetails.phone_no)
      details.phone_no = updateDetails.phone_no;
    if (updateDetails.gender_id && user.gender_id !== updateDetails.gender_id)
      details.gender_id = updateDetails.gender_id;
    if (updateDetails.new_password)
      details.password = updateDetails.new_password;
    if (Object.keys(details).length === 0) {
      props.snackBar("No changes made.", "info");
      return;
    }
    try {
      const { status, message } = await helperService.updateUser(
        {
          id: user._id,
          updateDetails: details,
        },
        {
          headers: { Authorization: authState.user.token },
        }
      );
      if (status === 200) {
        props.snackBar(message, "success");
        authDispatch({
          type: "SET_USER",
          payload: { ...authState.user, ...updateDetails },
        });
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  return (
    <div
      className="position-relative px-2"
      style={{ height: "100vh", overflowY: "scroll" }}
    >
      <div className="position-relative go-back my-3">
        <GoBack onClickHandler={() => history.push("/dashboard")} />
      </div>
      <div className="container mt-4">
        <p className="containertext-left dash-title-category">Edit Details</p>
        <div className="col p-0" style={{ marginTop: "-20px" }}>
          <div className="hr">
            <hr className="col p-0" />
          </div>
          <div className="col question-outoff p-0 mb-3">
            <span>Manage your personal information , password and more</span>
          </div>
        </div>
        <div className="input-container w-100 d-flex flex-column">
          <div className="d-flex my-2">
            <div className="col-md-6">
              <InputReducer
                className={classes.fieldColor}
                value={user.regno}
                disabled={true}
                type="text"
                id="Register number1"
                placeholder="Register Number"
                name="Register no"
                label="Register Number"
              />
            </div>
            <div className="col-md-6">
              <InputReducer
                placeholder="Enter Name"
                name="Name"
                id="Name1"
                type="text"
                label="Name"
                value={updateDetails.name ?? user.name}
                className={classes.fieldColor}
                onClickHandler={(value) =>
                  setUpdateDetails({ ...updateDetails, name: value })
                }
              />
            </div>
          </div>
          <div className="d-flex my-2">
            <div className="col-md-6">
              <InputReducer
                placeholder="Enter Email"
                name="Email"
                id="Email1"
                type="email"
                label="Email"
                value={updateDetails.email ?? user.email}
                onClickHandler={(value) =>
                  setUpdateDetails({ ...updateDetails, email: value })
                }
                className={classes.fieldColor}
              />
            </div>
            <div className="col-md-6">
              <InputReducer
                placeholder="Enter Phone Number"
                name="Phone number"
                label="Phone number"
                id="Phone number1"
                type="Number"
                value={updateDetails.phone_no ?? user.phone_no}
                className={classes.fieldColor}
                onClickHandler={(value) =>
                  setUpdateDetails({ ...updateDetails, phone_no: value })
                }
              />
            </div>
          </div>
          <div className="d-flex my-2">
            <div className="col-md-6">
              <SelectReducer
                className={classes.fieldColor}
                array={["B.E", "B.Tech"]}
                name="Stream"
                id="Stream1"
                value={user.stream_id}
                disabled={true}
              />
            </div>
            <div className="col-md-6">
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
                id="Course Name1"
                disabled={true}
                value={user.course_id}
              />
            </div>
          </div>
          <div className="d-flex my-2">
            <div className="col-md-6">
              <SelectReducer
                value={user.college_id}
                className={classes.fieldColor}
                array={[
                  "KSR College of Engineering",
                  "KSR College of Technology",
                  "KSR Institute for Engineering & Technology",
                ]}
                name="College Name"
                id="College Name1"
                disabled={true}
              />
            </div>
            <div className="col-md-6">
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
                id="Batch year1"
                disabled={true}
                value={user.batch_id}
              />
            </div>
          </div>
          <div
            className="d-flex my-2"
            style={{ position: "relative", left: "-7px" }}
          >
            <div className="col-md-6 ml-2">
              <SelectReducer
                array={["male", "female", "other"]}
                name="Select gender"
                id="Gender"
                value={updateDetails.gender_id ?? user.gender_id}
                handleSelect={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    gender_id: e.target.value,
                  })
                }
                className={classes.fieldColor}
              />
            </div>
          </div>
          <div className="px-3 py-2">
            <p className="containertext-left dash-title-category">
              Edit Password
            </p>
            <div className="col p-0" style={{ marginTop: "-20px" }}>
              <div className="hr">
                <hr className="col p-0" />
              </div>
            </div>
          </div>

          <div className="d-flex my-2">
            <div className="col-md-6">
              <PasswordField
                type="New Password"
                name="new password"
                id="new password"
                labelWidth={108}
                value={user.new_password}
                onClickHandler={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    new_password: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6">
              <PasswordField
                type="Confirm Password"
                name="confirm password"
                id="confirm password"
                labelWidth={133}
                value={user.confirm_password}
                onClickHandler={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="col-md-12 my-3">
            <CustomButton
              className="btn-hover color-11 d-flex align-items-center float-right py-2 px-3"
              onClickHandler={userEditedDetails}
            >
              <SaveIcon /> <span className="ml-2">SAVE CHANGES</span>
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
