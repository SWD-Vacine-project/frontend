import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SignInGoogle = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      console.log("Authorization Code:", code);
      exchangeCodeForIdToken(code);
    }
  }, [location]);

  const exchangeCodeForIdToken = async (code : string) => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: "1006543489483-mrg7qa1pas18ulb0hvnadiagh8jajghs.apps.googleusercontent.com",
        client_secret: "<YOUR_CLIENT_SECRET>",
        redirect_uri: "https://localhost:7090/signin-google",
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();
    console.log("id_token:", data.id_token);
  };

  return <div>Đang xác thực, vui lòng đợi...</div>;
};

export default SignInGoogle;
