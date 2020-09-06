import { addToast } from "context/ToastContext";
import React, { createContext, useReducer } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User from "types/User";

export const login = async (
  dispatch: React.Dispatch<any>,
  email: string,
  password: string
) => {
  try {
    const { accessToken, user } = await UserService.login(email, password);
    if (accessToken) {
      dispatch({
        type: "loggedIn",
        payload: {
          accessToken,
          user,
        },
      });

      return true;
    }
  } catch (e) {
    dispatch({
      type: "loginError",
    });
    throw e;
  }

  return false;
};

export const register = async (
  dispatch: React.Dispatch<any>,
  user: Partial<User>
) => {
  return await UserService.register(user);
};

export const logout = async (
  dispatch: React.Dispatch<any>,
  toastDispatch: React.Dispatch<any>
) => {
  dispatch({
    type: "logout",
  });

  addToast(
    toastDispatch,
    new Toast({ message: "Logout successful", type: "success" })
  );
};

export type AccountContextState = {
  user: User;
  accessToken: string;
  loginState: "LOGGED_OUT" | "LOGGED_IN" | "LOGIN_ERROR";
};

const initialState: AccountContextState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loginState: localStorage.getItem("user") ? "LOGGED_IN" : "LOGGED_OUT",
  accessToken: localStorage.getItem("accessToken"),
};

const AccountContext = createContext<
  [AccountContextState, React.Dispatch<any>]
>(null);

let reducer = (state: AccountContextState, action): AccountContextState => {
  let newState;

  switch (action.type) {
    case "loggedIn":
      newState = {
        ...state,
        loginState: "LOGGED_IN",
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };
      break;
    case "loginError":
      newState = { ...state, loginState: "LOGIN_ERROR" };
      break;
    case "logout":
      newState = {
        ...state,
        loginState: "LOGGED_OUT",
        user: undefined,
        accessToken: undefined,
      };
      break;
    default: {
      newState = state;
      break;
    }
  }

  // save to local storage
  newState.user
    ? localStorage.setItem("user", JSON.stringify(newState.user))
    : localStorage.removeItem("user");
  newState.accessToken
    ? localStorage.setItem("accessToken", newState.accessToken)
    : localStorage.removeItem("accessToken");

  return newState;
};

function AccountContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AccountContext.Provider value={[state, dispatch]}>
      {props.children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountContextProvider };
