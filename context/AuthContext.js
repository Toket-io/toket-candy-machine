import Spinner from "react-bootstrap/Spinner";

import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  firebaseOnAuthStateChanged,
  firebaseSignInAnonymously,
} from "../api/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signInAnonymously() {
    return firebaseSignInAnonymously(auth);
  }

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInAnonymously,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Spinner />}
    </AuthContext.Provider>
  );
}
