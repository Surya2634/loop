import React, { useEffect, useState } from "react";
import FileDownload from "js-file-download";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import InputReducer from "../../../../Reducer/InputReducer";
import SelectReducer from "../../../../Reducer/SelectReducer/SelectReducer";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Pagination from "@material-ui/lab/Pagination";
import "./ListUser.css";
import helperService from "../../../../../services/helperService";
import { useContext } from "react";
import { AuthContext, useLoader } from "../../../../../contexts/AuthContext";
import FilterListIcon from "@material-ui/icons/FilterList";
import GetAppIcon from "@material-ui/icons/GetApp";
import EditIcon from "@material-ui/icons/Edit";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import CustomButton from "../../../../Reducer/CustomButton/CustomButton";
import PasswordField from "../../../../Reducer/PasswordField/PasswordField";

import Chip from "@material-ui/core/Chip";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const limit = 10;
const ListUser = (props) => {
  const nameList = [
    "1813015",
    "1813016",
    "1813017",
    "1813018",
    "1813019",
    "1813020",
    "1813021",
    "1813022",
    "1813023",
    "1813024",
  ];
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const handlePagination = (e, value) => {
    if (page !== value) {
      setPage(value);
      fetchUsers(value);
    }
  };
  const classes = useStyles();
  const [loader, showLoader, hideLoader] = useLoader();
  const userTemplate = {
    regno: "",
    name: "",
    email: "",
    phone_no: "",
    stream_id: "",
    course_id: "",
    college_id: "",
    batch_id: "",
    gender_id: "",
  };
  const [user, setUser] = useState(userTemplate);
  const [updateDetails, setUpdateDetails] = useState({});
  const [open, setOpen] = useState(false);

  const [authState] = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [, setRegno] = useState("");
  const [filters, setFilters] = useState({});
  const [chips, setChips] = useState([]);
  const fetchUsers = async (page = 1) => {
    try {
      showLoader();
      const { status, data } = await helperService.getUsers(
        { page, limit, filters },
        {
          headers: { Authorization: authState.user.token },
        }
      );
      if (status === 200) {
        props.snackBar("List of Users", "success");
        setUsers(data.users);
        setRegno(data.users.reg_no);
        setTotal(data?.modelCount || 0);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    } finally {
      hideLoader();
    }
  };
  const downloadStudentsDetails = async () => {
    try {
      const { data, status } = await helperService.downloadStudentsDetails(
        // TODO : user quries
        { ...filters },
        {
          headers: { Authorization: authState?.user?.token },
          responseType: "arraybuffer",
        }
      );
      if (status === 200) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileDownload(blob, `${"UserDetails"}.xlsx`);
        props.snackBar("Sample file downloaded", "success");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const fetchFilteredUsers = (queries) => {
    let key = Object.keys(queries)[0];
    let value = queries[key];
    let newFilters = filters;
    if (newFilters[key]) {
      if (newFilters[key].find((val) => val === value)) return;
      else newFilters[key] = [...newFilters[key], value];
    } else newFilters[key] = [value];
    setChips([...chips, value]);
    setFilters(newFilters);
  };
  const handleDelete = (chipValue) => {
    let tempArr = filters;
    let tempArr2 = chips;
    for (const key in tempArr) {
      let len = tempArr[key].length;
      tempArr[key] = tempArr[key].filter((val) => val !== chipValue);
      if (len !== tempArr[key].length) {
        if (tempArr[key].length === 0) delete tempArr[key];
        break;
      }
    }
    tempArr2 = tempArr2.filter((val) => val !== chipValue);
    setFilters(tempArr);
    setChips(tempArr2);
  };
  useEffect(() => {
    fetchUsers();
  }, [chips]);

  const editUserDetail = (data) => {
    setUser(data);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUpdateDetails({});
  };
  const updateUser = async () => {
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
    if (!user.stream_id ?? !updateDetails.stream_id) {
      props.snackBar("Stream is not Selected", "error");
      return;
    }
    if (!user.course_id ?? !updateDetails.course_id) {
      props.snackBar("Course is not Selected", "error");
      return;
    }
    if (!user.college_id ?? !updateDetails.college_id) {
      props.snackBar("College is not Selected", "error");
      return;
    }
    if (!user.batch_id ?? !updateDetails.batch_id) {
      props.snackBar("Batch is not Selected", "error");
      return;
    }
    if (updateDetails.new_password !== updateDetails.confirm_password) {
      props.snackBar("Password Mismatch", "error");
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
    let details = {};
    if (updateDetails.name && user.name !== updateDetails.name)
      details.name = updateDetails.name;
    if (updateDetails.email && user.email !== updateDetails.email)
      details.email = updateDetails.email;
    if (updateDetails.phone_no && user.phone_no !== +updateDetails.phone_no)
      details.phone_no = updateDetails.phone_no;
    if (updateDetails.gender_id && user.gender_id !== updateDetails.gender_id)
      details.gender_id = updateDetails.gender_id;
    if (updateDetails.stream_id && user.stream_id !== updateDetails.stream_id)
      details.stream_id = updateDetails.stream_id;
    if (updateDetails.course_id && user.course_id !== updateDetails.course_id)
      details.course_id = updateDetails.course_id;
    if (
      updateDetails.college_id &&
      user.college_id !== updateDetails.college_id
    )
      details.college_id = updateDetails.college_id;
    if (updateDetails.batch_id && user.batch_id !== updateDetails.batch_id)
      details.batch_id = updateDetails.batch_id;
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
        handleClose();
        setUsers(
          users.map((exist_user) => {
            if (exist_user.regno === user.regno) {
              return { ...user, ...details };
            }
            return exist_user;
          })
        );
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    } finally {
      setUpdateDetails({});
    }
  };

  return (
    <>
      <div className="container-fluid">
        {loader}
        <div className="d-flex">
          <FilterListIcon />
          <h6 className="ml-2 font-weight-bolder mt-1 highlight-text">
            Filter By :{" "}
          </h6>
        </div>
        <div className="d-flex flex-wrap">
          <div className="col-md-6 col-lg-3 my-1 px-1">
            <SelectReducer
              className={classes.fieldColor}
              array={[
                "Computer Science & Engineering",
                "Electrical & Electronics Engineering",
                "Electronics & Communication Engineering",
                "Information Technology",
                "Mechanical Engineering",
                "Automobile Engineering",
                "Civil Engineering",
                "Safety & Fire Engineering",
              ]}
              id="course3"
              name="Course Name"
              label="Course Name"
              value=""
              handleSelect={(e) =>
                fetchFilteredUsers({
                  course_id: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-6 col-lg-3 my-1 px-1">
            <SelectReducer
              className={classes.fieldColor}
              array={[
                "KSR College of Engineering",
                "KSR College of Technology",
                "KSR Institute for Engineering & Technology",
              ]}
              id="college3"
              name="College Name"
              label="college name"
              value=""
              handleSelect={(e) =>
                fetchFilteredUsers({
                  college_id: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-6 col-lg-3 my-1 px-1">
            <SelectReducer
              className={classes.fieldColor}
              array={[
                "2018-2022",
                "2019-2023",
                "2020-2024",
                "2021-2025",
                "2022-2026",
              ]}
              id="batch2"
              name="Batch year"
              label="Batch year"
              value={""}
              handleSelect={(e) =>
                fetchFilteredUsers({
                  batch_id: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-6 col-lg-3 my-1 px-1">
            <SelectReducer
              className={classes.fieldColor}
              array={["male", "female", "others"]}
              id="Gender3"
              name="Gender"
              label="Gender"
              value={""}
              handleSelect={(e) =>
                fetchFilteredUsers({
                  gender_id: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6 col-lg-4 mt-2 p-0">
            <Autocomplete
              className={classes.fieldColor}
              id="combo-box-demo"
              options={nameList}
              getOptionLabel={(option) => option}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Users"
                  variant="outlined"
                />
              )}
            />
          </div>
          <div className="col-md-4 mt-2">
            <CustomButton
              className="btn-hover color-11 d-flex align-items-center py-2 px-3"
              onClickHandler={downloadStudentsDetails}
            >
              <GetAppIcon />
              <span className="ml-2 font-weight-bolder">Download Details</span>
            </CustomButton>
          </div>
        </div>
        <div className="d-flex align-items-center flex-wrap justify-content-center">
          {Object.keys(filters).length > 0 ? (
            <span className="mx-2">selected filters : </span>
          ) : null}

          {chips.map((chip) => {
            return (
              <Chip
                key={chip}
                label={chip}
                onDelete={() => handleDelete(chip)}
                style={{ backgroundColor: "#21A366", color: "white" }}
                className="my-2 mx-1"
              />
            );
          })}
        </div>

        <div className="d-flex upcoming-header border-top border-bottom mt-4 p-2 mb-1">
          <div className="col-md-2 text-center content-nav-title">REG.NO</div>
          <div className="col-md-2 text-center content-nav-title">STREAM</div>
          <div className="col-md-2 text-center content-nav-title">COURSE</div>
          <div className="col-md-2 text-center content-nav-title">COLLEGE</div>
          <div className="col-md-2 text-center content-nav-title">BATCH</div>
        </div>

        <div className="d-flex flex-column mb-5">
          {users?.map((user) => {
            return (
              <div
                className="d-flex border-top border-bottom mt-1 p-2 mb-1 align-items-center justify-content-center"
                key={user._id}
              >
                <div className="col-md-2 text-center content-nav-title">
                  {user.regno}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {user.stream_id}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {user.course_id}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {user.college_id}
                </div>
                <div className="col-md-2 text-center content-nav-title">
                  {user.batch_id}
                </div>
                <div className="col-md-2 d-flex text-center content-nav-title">
                  <div className="px-3">
                    <EditIcon
                      onClick={() => editUserDetail(user)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className="px-3">
                    <RestoreFromTrashIcon
                      disabled
                      style={{ cursor: "inherit" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {total > limit && (
          <Pagination
            count={Math.floor(total / limit) + (total % limit !== 0 ? 1 : 0)}
            color="primary"
            variant="text"
            className="my-5 d-flex justify-content-center"
            onChange={(e, value) => handlePagination(e, value)}
          />
        )}
        <div className="d-flex">
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="md"
            fullWidth
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Edit User"}
            </DialogTitle>

            <DialogContent>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <InputReducer
                    className={classes.fieldColor}
                    variant="outlined"
                    id="Register number2"
                    placeholder="Register Number"
                    name="Register no"
                    label="Register Number"
                    value={user.regno}
                    disabled={true}
                  />
                </div>
                <div className="col-md-6">
                  <InputReducer
                    className={classes.fieldColor}
                    placeholder="Enter Name"
                    name="Name"
                    id="Name2"
                    type="text"
                    label="Name"
                    variant="outlined"
                    value={updateDetails.name ?? user.name ?? ""}
                    onClickHandler={(value) =>
                      setUpdateDetails({ ...updateDetails, name: value })
                    }
                  />
                </div>
              </div>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <InputReducer
                    className={classes.fieldColor}
                    placeholder="Enter Email"
                    name="Email"
                    id="Email2"
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={updateDetails.email ?? user.email ?? ""}
                    onClickHandler={(value) =>
                      setUpdateDetails({ ...updateDetails, email: value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <InputReducer
                    className={classes.fieldColor}
                    placeholder="Phone number"
                    label="Phone number"
                    name="Phone number"
                    id="Phone number2"
                    type="text"
                    value={updateDetails.phone_no ?? user.phone_no ?? ""}
                    onClickHandler={(value) =>
                      setUpdateDetails({ ...updateDetails, phone_no: value })
                    }
                  />
                </div>
              </div>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <SelectReducer
                    className={classes.fieldColor}
                    array={["B.E", "B.Tech"]}
                    id="Stream2"
                    name="Stream"
                    label="Stream"
                    value={updateDetails.stream_id ?? user.stream_id ?? ""}
                    handleSelect={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        stream_id: e.target.value,
                      })
                    }
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
                            "Electronics & Communication Engineering",
                            "Mechanical Engineering",
                            "Automobile Engineering",
                            "Civil Engineering",
                            "Safety & Fire Engineering",
                          ]
                    }
                    id="course2"
                    name="Course Name"
                    label="Course Name"
                    value={updateDetails.course_id ?? user.course_id ?? ""}
                    handleSelect={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        course_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <SelectReducer
                    className={classes.fieldColor}
                    array={[
                      "KSR College of Engineering",
                      "KSR College of Technology",
                      "KSR Institute for Engineering & Technology",
                    ]}
                    id="college2"
                    name="College Name"
                    label="college name"
                    value={updateDetails.college_id ?? user.college_id ?? ""}
                    handleSelect={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        college_id: e.target.value,
                      })
                    }
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
                    ]}
                    id="batch2"
                    name="Batch year"
                    label="Batch year"
                    value={updateDetails.batch_id ?? user.batch_id ?? "" ?? ""}
                    handleSelect={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        batch_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <SelectReducer
                    className={classes.fieldColor}
                    label="Gender"
                    array={["male", "female", "others"]}
                    name="Gender"
                    id="gender2"
                    value={updateDetails.gender_id ?? user.gender_id ?? ""}
                    handleSelect={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        gender_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-12 mx-2">
                <p
                  className="text-dark"
                  style={{ fontSize: "20px", fontWeight: "bolder" }}
                >
                  Edit Password
                </p>
              </div>
              <div className="d-flex mx-2 my-3">
                <div className="col-md-6">
                  <PasswordField
                    type="New Password"
                    name="new password"
                    id="new password"
                    variant="outlined"
                    value={updateDetails.new_password ?? ""}
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
                    variant="outlined"
                    value={updateDetails.confirm_password ?? ""}
                    onClickHandler={(e) =>
                      setUpdateDetails({
                        ...updateDetails,
                        confirm_password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </DialogContent>

            <DialogActions>
              <button className="btn btn-success" onClick={updateUser}>
                Update User
              </button>

              <Button onClick={handleClose} color="primary">
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ListUser;
