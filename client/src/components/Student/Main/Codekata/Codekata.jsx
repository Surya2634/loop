import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import CodeIcon from "@material-ui/icons/Code";
import { AuthContext } from "../../../../contexts/AuthContext";
import helperService from "../../../../services/helperService";
import CustomButton from "../../../Reducer/CustomButton/CustomButton";
import { useLoader } from "../../../../contexts/AuthContext";
import codekata from "../../../../images/codekata.svg";
import "./Codekata.css";

const Codekata = ({ setSideToggle, ...props }) => {
  const [authState, authDispatch] = useContext(AuthContext);
  const history = useHistory();
  const [code, setCode] = useState("");
  const [loader, showLoader, hideLoader] = useLoader();
  useEffect(() => {
    setSideToggle(false);
    authDispatch({ type: "REMOVE_CONTEST" });
    authDispatch({ type: "REMOVE_DURATION" });
    return () => window.removeEventListener("keydown", submitCode);
  }, []);
  const submitCode = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      props.snackBar("Your code is wrong!! Ckeck your code", "error");
      return;
    }
    try {
      showLoader();
      const {
        status,
        data: { contest, message },
      } = await helperService.getContestWithCode(
        { code },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        authDispatch({
          type: "SET_CONTEST",
          payload: { ...contest },
        });
        authDispatch({
          type: "SET_DURATION",
          payload: contest?.session?.ends_at,
        });
        history.push(`/codekata/${code}`);
      }
      props.snackBar(message, "success");
    } catch ({ message }) {
      props.snackBar(message, "error");
    } finally {
      hideLoader();
    }
  };
  return (
    <div className="container h-100" style={{ marginTop: "150px" }}>
      {loader}
      <div className="d-flex align-items-center justify-content-center">
        <div className="col-md-6 d-flex flex-column">
          <p className="header-title mt-1">
            <span className="dash-greet">Welcome</span> {authState?.user?.name}{" "}
            ..!
          </p>
          <span>Your code goes here.. 👇🏻</span>
          <div id="divOuter" className="mt-3 mb-3">
            <div id="divInner">
              <input
                id="partitioned"
                type="text"
                maxLength="6"
                value={code}
                onKeyDown={(e) => (e.key === "Enter" ? submitCode(e) : null)}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <span>
              <b>* By entering the code you can attend the test.</b>
            </span>
            <CustomButton
              className="btn-hover color-11 mt-3 d-flex align-items-center py-2 px-3"
              onClickHandler={submitCode}
            >
              <CodeIcon />
              <span className="ml-2">ENTER CODE</span>
            </CustomButton>
          </div>
        </div>
        <div className="col-md-6">
          <img src={codekata} alt="codekata-img" />
        </div>
      </div>
    </div>
  );
};

export default Codekata;
