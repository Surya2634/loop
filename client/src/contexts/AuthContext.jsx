import React, { createContext, useReducer, useState } from "react";
import Loader from "../components/Reducer/Loader/Loader";

const initialState = {
  user: null,
  contest: null,
  challenge: null,
  end_date: null,
};
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    case "REMOVE_USER":
      return { ...state, user: null };
    case "SET_CONTEST":
      return { ...state, contest: action.payload };
    case "SET_CHALLENGE":
      return { ...state, challenge: action.payload };
    case "REMOVE_CHALLENGE":
      return { ...state, challenge: null };
    case "REMOVE_CONTEST":
      return { ...state, contest: null };
    case "SET_END_DATE":
      return { ...state, end_date: action.payload };
    case "REMOVE_END_DATE":
      return { ...state, end_date: null };
    default:
      return state;
  }
};

const useLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <Loader /> : null,
    () => {
      setLoading(true);
    },
    () => {
      setLoading(false);
    },
  ];
};
const AuthContext = createContext(initialState);
const AuthProvider = (props) => {
  const [authState, authDispatch] = useReducer(
    props.AuthReducer,
    props.initialState
  );
  return (
    <AuthContext.Provider value={[authState, authDispatch]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext, initialState, AuthReducer, useLoader };
