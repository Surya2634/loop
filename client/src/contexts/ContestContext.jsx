import React, { createContext, useReducer } from "react";

const initialState = {
  contest: null,
};
const ContestReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONTEST":
      return { ...state, contest: { ...state, ...action.payload } };
    case "SET_CONTEST_QUIZZES":
      return { ...state, contest: { ...state, ...action.payload } };
    case "REMOVE_CONTEST":
      return { ...state, contest: null };
    default:
      return state;
  }
};

const ContestContext = createContext(initialState);
const ContestProvider = (props) => {
  const [contestState, contestDispatch] = useReducer(
    ContestReducer,
    initialState
  );
  return (
    <ContestContext.Provider value={[contestState, contestDispatch]}>
      {props.children}
    </ContestContext.Provider>
  );
};

export { ContestProvider, ContestContext, initialState, ContestReducer };
