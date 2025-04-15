// import { Snackbar } from "@material-ui/core";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../../../../../contexts/AuthContext";
import helperService from "../../../../../../services/helperService";
import CustomButton from "../../../../../Reducer/CustomButton/CustomButton";
import GoBack from "../../../../../Reducer/GoBack/GoBack";
import InputReducer from "../../../../../Reducer/InputReducer";
import SelectReducer from "../../../../../Reducer/SelectReducer/SelectReducer";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./CreateChallenge.css";
const CreateChallenge = (props) => {
  const [authState] = useContext(AuthContext);
  const history = useHistory();
  const { id } = useParams();
  const [updateDetails, setUpdateDetails] = useState({});
  const [challenge, setChallenge] = useState({});
  const [difficultyId, setDifficultyId] = useState("");
  const createChallenge = async () => {
    if (challenge?.name?.length === 0) {
      props.snackBar("Challenge Name is Empty", "error");
      return;
    }
    if (challenge?.description?.length === 0) {
      props.snackBar("Challenge Description is Empty", "error");
      return;
    }
    if (challenge?.statement?.length === 0) {
      props.snackBar("Challenge Statement is Empty", "error");
      return;
    }
    if (challenge?.input_format?.length === 0) {
      props.snackBar("Input is Empty", "error");
      return;
    }
    if (challenge?.output_format?.length === 0) {
      props.snackBar("Output is Empty", "error");
      return;
    }
    if (challenge?.constraints?.length === 0) {
      props.snackBar("contraints is Empty", "error");
      return;
    }
    if (!challenge?.difficulty_id?.length === 0) {
      props.snackBar("Difficulty is not Selected", "error");
      return;
    }
    if (!challenge?.max_score || challenge.max_score < 0) {
      props.snackBar("Maximum Score is Empty", "error");
      return;
    }
    try {
      const {
        status,
        data: { message },
      } = await helperService.createChallenge(
        { ...challenge, contest_id: id },
        { headers: { Authorization: authState.user.token } }
      );
      if (status === 201) {
        props.snackBar(message, "success");
        history.push(`/contests/${id}/challenges`);
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  const updateChallenge = async () => {
    let checkStatus = false;
    for (let i in challenge) {
      if (Object.keys(updateDetails).length !== 0) {
        for (let j in updateDetails) {
          if (challenge[i] === updateDetails[j]) {
            checkStatus = true;
          }
        }
      }
    }

    if (challenge.name.length <= 0) {
      props.snackBar("Challenge Name is Empty", "error");
      return;
    }
    if (challenge.description.length <= 0) {
      props.snackBar("Challenge Description is Empty", "error");
      return;
    }
    if (challenge.statement.length <= 0) {
      props.snackBar("Challenge Statement is Empty", "error");
      return;
    }
    if (challenge.input_format.length <= 0) {
      props.snackBar("Input is Empty", "error");
      return;
    }
    if (challenge.output_format.length <= 0) {
      props.snackBar("Output is Empty", "error");
      return;
    }
    if (challenge.constraints.length <= 0) {
      props.snackBar("contraints is Empty", "error");
      return;
    }
    if (challenge.difficulty_id.length <= 0) {
      props.snackBar("Difficulty is not Selected", "error");
      return;
    }
    if (challenge.max_score.length <= 0) {
      props.snackBar("Maximum Score is Empty", "error");
      return;
    }
    if (checkStatus === true) {
      props.snackBar("Already Up-to-Date", "info");
      return;
    }
    try {
      const {
        data: { message },
        status,
      } = await helperService.updateQuestion(
        {
          ...challenge,
          id: authState?.challenge?._id,
          contest_id: authState?.challenge?.contest_id,
        },
        {
          headers: { Authorization: authState.user.token },
        }
      );
      if (status === 200) {
        props.snackBar(message, "success");
      }
    } catch (message) {
      props.snackBar(message, "error");
    }
  };
  useEffect(() => {
    setChallenge({
      name: authState?.challenge?.name ?? "",
      type_id: "problem",
      contest_id: authState?.challenge?._id ?? "",
      statement: authState?.challenge?.statement ?? "",
      description: authState?.challenge?.description ?? "",
      input_format: authState?.challenge?.input_format ?? "",
      output_format: authState?.challenge?.output_format ?? "",
      constraints: authState?.challenge?.constraints ?? "",
      difficulty_id: authState?.challenge?.difficulty_id?.level ?? "easy",
      max_score: authState?.challenge?.max_score,
    });
    setDifficultyId(authState?.challenge?.difficulty_id?.level ?? "easy");
  }, [authState]);
  return (
    <div className="container">
      <div className="d-flex">
        <GoBack
          onClickHandler={() => {
            props?.title
              ? history.push(
                  `/contests/${authState?.challenge?.contest_id}/challenges`
                )
              : history.goBack();
          }}
        />
        <p className="text-left dash-title-category mx-4 mt-2">
          {props?.title ? props?.title : "Create Challenge"}
        </p>
      </div>

      <div className="d-flex flex-column">
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Challenge name <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              label="Challenge name"
              name="Challenge name"
              type="text"
              value={challenge?.name}
              InputLabelProps={{
                shrink: true,
              }}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, name: value });
                setChallenge({ ...challenge, name: value });
              }}
            />
          </div>
        </div>

        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Problem Statement <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Problem Statement"
              multiline
              rows={10}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={challenge.statement}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, statement: value });
                setChallenge({ ...challenge, statement: value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Input format <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Input format"
              multiline
              rows={7}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={challenge.input_format}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, input_format: value });
                setChallenge({ ...challenge, input_format: value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Output format <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Output format"
              multiline
              rows={7}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={challenge.output_format}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, output_format: value });
                setChallenge({ ...challenge, output_format: value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Description <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Enter Description"
              multiline
              rows={10}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={challenge.description}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, description: value });
                setChallenge({ ...challenge, description: value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Constraints <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              id="outlined-multiline-static"
              label="Constraints"
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              value={challenge.constraints}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, constraints: value });
                setChallenge({ ...challenge, constraints: value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Difficulty <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <SelectReducer
              value={difficultyId}
              defaultValue={difficultyId}
              className="w-100"
              array={["easy", "medium", "hard"]}
              name="Difficulty Level"
              handleSelect={(e) => {
                setDifficultyId(e.target.value);
                setChallenge({ ...challenge, difficulty_id: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="d-flex mt-2 mb-2">
          <span className="contest-line-height mr-2 col-md-4">
            Max Score <span className="contest-star">*</span>
          </span>
          <div className="col-md-8">
            <InputReducer
              fullWidth
              type="number"
              label="Max Score"
              InputLabelProps={{
                shrink: true,
              }}
              value={challenge.max_score}
              onClickHandler={(value) => {
                setUpdateDetails({ ...updateDetails, max_score: value });
                setChallenge({ ...challenge, max_score: value });
              }}
            />
          </div>
        </div>
        <div className="m-0">
          <CustomButton
            className="btn-hover color-11 mt-2 mb-5 float-right d-flex align-items-center px-3 py-2"
            onClickHandler={props?.title ? updateChallenge : createChallenge}
          >
            <AddCircleIcon />{" "}
            <span className="ml-2">
              {props?.title ? props?.title.toUpperCase() : "CREATE CHALLENGE"}
            </span>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
