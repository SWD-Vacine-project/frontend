import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

const SignInGoogle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      console.log("Authorization Code:", code);
      exchangeCodeForIdToken(code);
    } else {
      setLoading(false);
      setError("No authorization code found in the URL.");
    }
  }, [location]);

  const exchangeCodeForIdToken = async (code: string) => {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code,
          client_id: "1006543489483-mrg7qa1pas18ulb0hvnadiagh8jajghs.apps.googleusercontent.com",
          client_secret: "<YOUR_CLIENT_SECRET>", // Use backend to protect the secret
          redirect_uri: "https://localhost:7090/signin-google",
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();

      if (response.ok && data.id_token) {
        console.log("ID Token:", data.id_token);

        // Optionally, send the ID token to your backend for verification
        const user = await verifyIdToken(data.id_token);

        // If the verification is successful, navigate the user to the logged-in page
        if (user) {
          navigate("/dashboard");
        } else {
          setError("Failed to verify the ID token");
        }
      } else {
        setError(`Failed to get ID token: ${data.error}`);
      }
    } catch (err) {
      console.error("Error during token exchange:", err);
      setError("An error occurred while exchanging the code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyIdToken = async (idToken: string) => {
    try {
      const response = await fetch("/api/verify-id-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await response.json();
      if (data.success) {
        return data.user; // or whatever data you expect from the backend
      } else {
        console.error("Token verification failed.");
        return null;
      }
    } catch (err) {
      console.error("Error during token verification:", err);
      setError("Token verification failed.");
      return null;
    }
  };

  if (loading) {
    return <div>Đang xác thực, vui lòng đợi...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return null;
};

export default SignInGoogle;
