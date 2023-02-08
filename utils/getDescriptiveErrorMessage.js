const getDescriptiveErrorMessage = (error, isLogin = true) => {
  const genericErrorMessage = "Something went wrong, try again later";

  if (!error.message || error?.message.length === 0) {
    return genericErrorMessage;
  }

  if (error.code == "auth/wrong-password") {
    return isLogin ? "User or password is incorrect" : "Password is incorrect ";
  }
  if (error.code == "auth/user-not-found") {
    return "User or password is incorrect";
  }
  if (error.code == "auth/too-many-requests") {
    return "Too many attempts, try again later";
  }

  if (error.code == "functions/already-exists") {
    return "There is already an account with that email";
  }

  return genericErrorMessage;
};

export default getDescriptiveErrorMessage;
