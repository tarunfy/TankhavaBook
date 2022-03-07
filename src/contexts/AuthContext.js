import React, { createContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signinError, setSigninError] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setIsFetchingUser(false);
    });
  }, []);

  const signin = async (email, password) => {
    setIsLoading(true);
    let result = true;
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log(res.user);
    } catch (err) {
      console.log(err);
      setSigninError(err.message);
      result = false;
    }
    setIsLoading(false);

    return result;
  };

  const signup = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      console.log(res.user);
    } catch (err) {
      setSignupError(err.message);
    }
    setIsLoading(false);
  };

  const logout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        setCurrentUser,
        signinError,
        setSigninError,
        signupError,
        setSignupError,
        currentUser,
        logout,
        isLoading,
        setIsLoading,
        signin,
        signup,
      }}
    >
      {!isFetchingUser && children}
    </AuthContext.Provider>
  );
};
