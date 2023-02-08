import { useAuth } from "./AuthContext";

// check if you are on the client (browser) or server
const isBrowser = () => typeof window !== "undefined";

const appRoutes = {
  INDEX_PAGE: "/",
  LOGIN_PAGE: "/start",
};

const ProtectedRoute = ({ router, children }) => {
  // Identify authenticated user
  const { currentUser } = useAuth();

  const isAuthenticated = currentUser != null;

  const unprotectedRoutes = [appRoutes.LOGIN_PAGE];

  /**
   * @var pathIsProtected Checks if path exists in the unprotectedRoutes routes array
   */
  const pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

  if (isBrowser() && !isAuthenticated && pathIsProtected) {
    router.push(appRoutes.LOGIN_PAGE);
    return null;
  }

  if (
    isBrowser() &&
    isAuthenticated &&
    !pathIsProtected &&
    router.pathname != appRoutes.VERIFY_EMAIL
  ) {
    router.push(appRoutes.INDEX_PAGE);
    return null;
  }

  return children;
};

export default ProtectedRoute;
