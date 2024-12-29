import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

const NonAuth = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  if (user !== null) {
    // return <Navigate to="/" replace={true} />;

    // console.log(location.search); //: It return the search object
    const returnTo =
      new URLSearchParams(location.search).get("returnTo") || "/";

    return <Navigate to={returnTo} replace={true} />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;
