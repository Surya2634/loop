import React from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import NotificationsActiveRoundedIcon from "@material-ui/icons/NotificationsActiveRounded";
import WarningGif from "../../../images/dribbble_1.webp";
import CustomButton from "../CustomButton/CustomButton";
const DialogBox = ({ localData, ...props }) => {
  const unSubmittedQuestions = () => {
    const data = localData();
    const questions = [
      ...data.unSubmittedChallenges,
      ...data.unSubmittedQuizzes,
    ];
    return questions;
  };
  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="d-flex align-items-center justify-content-center">
            <img src={WarningGif} height={"50%"} width={"100%"} />
          </div>
        </DialogContent>
        <DialogContent className="d-flex align-items-center justify-content-center">
          <DialogContentText
            id="alert-dialog-description"
            className="text-dark"
          >
            {localData ? (
              <>
                <Typography
                  component={"span"}
                  variant={"body2"}
                  className="font-weight-bold"
                >
                  Some sections are not sumbitted!!!.
                </Typography>
                {unSubmittedQuestions().map((ques, index) => {
                  return (
                    <span
                      key={ques + index}
                      className="badge badge-success font-weight-normal px-2 py-2 m-1"
                    >
                      {ques}
                    </span>
                  );
                })}
              </>
            ) : (
              <Typography
                component={"span"}
                variant={"body2"}
                className="font-weight-bold"
              >
                {props.bodyMsg}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="mb-2">
          {props.warning ? (
            <CustomButton
              className="btn-hover color-11 mt-1 d-flex align-items-center py-2 px-3"
              onClickHandler={props.handleClose}
            >
              <NotificationsActiveRoundedIcon />
              Ok
            </CustomButton>
          ) : (
            <>
              <CustomButton
                className="btn-hover color-11 mt-1 d-flex align-items-center py-2 px-3"
                onClickHandler={props.handleOpen}
              >
                <CheckCircleRoundedIcon /> YES
              </CustomButton>

              <CustomButton
                className="btn-grad mt-1 mx-2 d-flex align-items-center py-2 px-3"
                onClickHandler={props.handleClose}
              >
                <HighlightOffRoundedIcon /> NO
              </CustomButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogBox;
