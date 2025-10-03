import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GoogleLoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      //console.log("Your JWT Token:", token);
      //debugger;

      localStorage.setItem("token", token);
      navigate("/homepage");
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}

export default GoogleLoginSuccess;
