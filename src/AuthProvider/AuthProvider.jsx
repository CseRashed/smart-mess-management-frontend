import { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import auth from "../../firebase/config.init";

// Create Context
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  // Create account
 const handleRegister = async(email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      setUser(result.user);
      return result;
    });
};


  // Login account
  const handleLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogOut=()=>{
   return signOut(auth)
  }
  // Track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // Shared auth info
  const authInfo = {
    user,
    loading,
    handleRegister,
    handleLogin,
    setUser,
    handleLogOut
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider; 