import React, { useContext, useState } from "react";
import "./Login.css";
import Developer from "../../images/developer.svg";
import Hello from "../../images/Hello.svg";
import LoginImg from "../../images/Loop1.webp";
import CustomButton from "../Reducer/CustomButton/CustomButton";
import { AuthContext } from "../../contexts/AuthContext";
import helperService from "../../services/helperService";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import { IconButton } from "@material-ui/core";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

const Login = (props) => {
  //** Context Consumer */
  const [ , authDispatch ] = useContext(AuthContext);
  const [ change, setChange ] = useState(false);
  const [ register, setRegister ] = useState("");
  const [ password, setPassword ] = useState("");
  const changeSignup = () => setChange(true);
  const changeSignin = () => setChange(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (register === "") {
      props.snackBar("Register number field is empty.", "error");
      return;
    }
    if (!change) {
      if (!/^\d{7}/.test(register)) {
        props.snackBar(
          "Register number should contain only 7 digits.",
          "error"
        );
        return;
      }
    } else if (change) {
      if (!/^\w{6}/.test(register)) {
        props.snackBar(
          "Register number should contain only 6 characters.",
          "error"
        );
        return;
      }
    }
    if (password === "") {
      props.snackBar("Password field is empty.", "error");
      return;
    } else if (password.length < 5) {
      props.snackBar("Password length should be more than 5.", "error");
      return;
    } else if (password.length > 15) {
      props.snackBar("Password length should be less than 15.", "error");
      return;
    }
    try {
      const { status, data } = await helperService.login({
        regno: register,
        password,
      });
      if (status === 200) {
        const user = { role: data.role, token: data.token };
        localStorage.setItem("user", JSON.stringify(user));
        authDispatch({ type: "SET_USER", payload: user });
        // props.snackBar(message, "success");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div>
      <div className={ change ? "clip-content sign-up-mode" : "clip-content" }>
        <div className="forms-cont">
          <div className="signin-signup ">
            <form className="sign-in-form" onSubmit={ handleSubmit }>
              <div className="mb-4 d-flex align-items-center justify-content-center flex-column">
                <img
                  src={ LoginImg }
                  className="img-fluid mb-1"
                  height={ 150 }
                  width={ 150 }
                />
                <p className="highlight">Learn , Code , Repeat</p>
              </div>
              <h2 className="title form-title">Student Sign in</h2>

              <div className="input-field mb-2">
                <IconButton disabled={ true }>
                  <LocalLibraryRoundedIcon />
                </IconButton>
                <input
                  type="text"
                  placeholder="Register number"
                  onChange={ (e) => setRegister(e.target.value) }
                />
              </div>
              <div className="input-field mb-4">
                <IconButton disabled={ true }>
                  <LockRoundedIcon />
                </IconButton>

                <input
                  type="password"
                  placeholder="Password"
                  // {...password ? <VisibilityOff /> : <Visibility />}
                  onChange={ (e) => setPassword(e.target.value) }
                />
              </div>
              <CustomButton
                className="btn-hover color-11 d-flex align-items-center py-2 px-3"
                onKeyPress={ handleKeypress }
                type="submit"
              >
                <span className="mr-2">SIGN IN</span>
                <ExitToAppRoundedIcon />
              </CustomButton>
            </form>
            <form action="#" className="sign-up-form" onSubmit={ handleSubmit }>
              <div className="mb-4 d-flex align-items-center justify-content-center flex-column">
                <img
                  src={ LoginImg }
                  className="img-fluid mb-1"
                  height={ 150 }
                  width={ 150 }
                />
                <p className="highlight">Learn , Code , Repeat</p>
              </div>
              <h2 className="title">Admin Sign in</h2>

              <div className="input-field">
                <IconButton disabled={ true }>
                  <LocalLibraryRoundedIcon />
                </IconButton>
                <input
                  type="text"
                  placeholder="Register no"
                  onChange={ (e) => setRegister(e.target.value) }
                />
              </div>
              <div className="input-field">
                <IconButton disabled={ true }>
                  <LockRoundedIcon />
                </IconButton>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={ (e) => setPassword(e.target.value) }
                />
              </div>
              <CustomButton
                className="btn-hover color-11 mt-2 d-flex align-items-center py-2 px-3"
                onKeyPress={ handleKeypress }
                type="submit"
              >
                <span className="mr-2">SIGN IN</span>
                <ExitToAppRoundedIcon />
              </CustomButton>
            </form>
          </div>
        </div>

        <div className="panels-cont">
          <div className="panel left-panel">
            <div className="content d-flex align-items-center justify-content-center flex-column">
              <h3>Are you admin ?</h3>
              <p>
                Click here to login with you adminstration ID to create contest
                for the students.
              </p>
              <button
                className="btn signin-button"
                id="sign-up-btn"
                onClick={ changeSignup }
              >
                Sign in
              </button>
            </div>
            <img src={ Hello } className="image img-fluid" alt="admin-signin" />
          </div>
          <div className="panel right-panel">
            <div className="content d-flex align-items-center justify-content-center flex-column">
              <h3>Are you Student ?</h3>
              <p>
                Click here to login as a student with the help of register
                number to attend contest .
              </p>
              <button
                className="btn mt-2 signin-to-student"
                id="sign-in-btn"
                onClick={ changeSignin }
              >
                Sign in
              </button>
            </div>
            <img
              src={ Developer }
              className="image img-fluid"
              alt="student-signin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
