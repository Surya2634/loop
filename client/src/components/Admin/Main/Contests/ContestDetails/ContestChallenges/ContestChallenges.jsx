import React, { useContext, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Button } from "@material-ui/core";
import InputReducer from "../../../../../Reducer/InputReducer";
import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import helperService from "../../../../../../services/helperService";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
import ContestTable from "../ContestTable/ContestTable";
import AddCircleIcon from "@material-ui/icons/AddCircle";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ContestChallenges = (props) => {
  const [authState, authDispatch] = useContext(AuthContext);
  const { id } = useParams();
  const [challenges, setChallenges] = useState([]);
  const fetchChallenges = async () => {
    try {
      const {
        data: { message, challenges },
        status,
      } = await helperService.getChallenges(
        { id },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 200) {
        setChallenges(challenges);
        props.snackBar(message, "success");
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const deleteQuestion = async (challenge) => {
    try {
      const {
        data: { message },
        status,
      } = await helperService.deleteQuestion(
        { ...challenge, type_id: "problem" },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 202) {
        props.snackBar(message, "success");
        setChallenges(challenges.filter((ques) => ques._id !== challenge._id));
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const addQuiz = () => {};
  useEffect(() => {
    fetchChallenges();
    authDispatch({ type: "REMOVE_CHALLENGE" });
  }, []);
  return (
    <div className="container">
      <div className="d-flex flex-column" style={{ marginTop: "40px" }}>
        <h6 className="text-left dash-title-category pb-2">
          Coding Challenges
        </h6>
        <span className="create-con-text mt-1">
          Add quiz to the challenge to the contest by selecting quiz challenge
          from our library or create
        </span>
        <span className="create-con-text">
          of your own challenges here. To record your challenges, simply select
          the challenge and drag and
        </span>
        <span className="create-con-text">drop to the desired location </span>
      </div>
      <NavLink to={`/contests/${id}/challenges/create`}>
        <CustomButton className="btn-hover color-11 mt-4 d-flex align-items-center py-2 px-3">
          <AddCircleIcon />
          <span className="ml-2">ADD CHALLENGES</span>
        </CustomButton>
      </NavLink>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Create contest quiz"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="d-flex">
              <label>Create Challenge</label>
              <InputReducer />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={addQuiz} color="primary" variant="contained">
            ADD
          </Button>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
      <ContestTable data={challenges} deleteQuestion={deleteQuestion} />
    </div>
  );
};

export default ContestChallenges;
