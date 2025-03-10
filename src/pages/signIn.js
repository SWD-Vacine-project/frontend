import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useForceUpdate from "../hooks/useForceUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingAnimation from "../animation/loading-animation";
import "./signIn.css";
import ReCAPTCHA from "react-google-recaptcha";
import SignInGoogle from "./Google";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function SignIn() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [error, setError] = useState(null);
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(null);
  const [signInMethod, setSignInMethod] = useState(null);
  const navigate = useNavigate();
  const forceUpdate = useForceUpdate();
  const [retry, setRetry] = useState(0);
  const [isInactive, setIsInactive] = useState(false);
  const inactivityTimeoutRef = useRef(null);
  const [avatar, setAvatar] = useState(
    "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false); // Track Google Sign-In state

  // const onChange = (value) => {
  //   setIsCaptchaVerified(!!value);
  //   setCaptchaError(null);
  // };
  // const onErrored = () => {
  //   setCaptchaError("Failed to load reCAPTCHA. Please try again.");
  // };

  // const onExpired = () => {
  //   setIsCaptchaVerified(false);
  //   setCaptchaError("reCAPTCHA expired. Please verify again.");
  // };

  const handleGoogleLogin = async () => {
    setIsGoogleSignIn(true); // Set Google Sign-In state to true
    // Redirect the user to Google's OAuth consent screen
    const clientId =
      "1006543489483-mrg7qa1pas18ulb0hvnadiagh8jajghs.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(
      "https://localhost:7090/signin-google"
    );
    const scope = encodeURIComponent("openid profile email");
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  // const isValidEmail = (email) => {
  //   return username.trim().length > 0;
  // };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
    return passwordRegex.test(password);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // if (!isValidEmail(email)) {
    //   toast.error("Invalid email format. Please enter a valid email.", { autoClose: 2000 });
    //   return;
    // }
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least one digit, one special symbol, and one uppercase letter.",
        { autoClose: 2000 }
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password not match, please try again!", { autoClose: 2000 });
      return;
    }

    const userData = { email, password, confirmPassword };

    if (!isRegistering) {
      setIsRegistering(true);
      setLoading(true);
      try {
        // Registration logic here
      } catch (error) {
        toast.error("Something went wrong. Please try again!", {
          autoClose: 2000,
        });
        setLoading(false);
      } finally {
        setLoading(false);
        setIsRegistering(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "confirmPassword") {
      setconfirmPassword(value);
    }
  };

  const onOtpSuccess = async () => {
    try {
      console.log("Email: ", email);
      console.log("Password: ", password);

      setLoading(true); // Show spinner

      const userEmail = email;
      setUserEmail(userEmail);
      localStorage.setItem("email", userEmail);

      toast.success("Login successfully. Wish you enjoy our best experience!", {
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error during login after OTP verification:", error);
      toast.error("Failed to login after OTP verification. Please try again.", {
        autoClose: 2000,
      });
      setLoading(false); // Hide spinner
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setError(null);

    // if (!isValidEmail(email)) {
    //   toast.error("Invalid email format. Please enter a valid email.", { autoClose: 2000 });
    //   return;
    // }
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least one digit, one special symbol, and one uppercase letter.",
        { autoClose: 2000 }
      );
      return;
    }

    // if (!isCaptchaVerified) {
    //   toast.error("Please complete the captcha before submitting the form.");
    //   return;
    // }

    try {
      setLoading(true); // Hiển thị spinner

      const response = await fetch(
        "https://vaccinesystem.azurewebsites.net/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ userName: username, password }),
          mode: "cors",
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("API Response:", data);
        toast.success("Login successful!", { autoClose: 2000 });

        const userData = {
          customerId: data.customerId,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role,
          address: data.address,
          children: [],
        };

        if (data.role === "Customer") {
          console.log("Fetching children list...");

          const childResponse = await fetch(
            `https://vaccinesystem.azurewebsites.net/Child/get-child/${data.customerId}`,
            {
              method: "GET",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                "Accept-Encoding": "application/json",
              },
            }
          );

          if (childResponse.ok) {
            const childrenData = await childResponse.json();
            userData.children = childrenData; // ✅ Assign children
          }
        }

        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Saved to localStorage:", localStorage.getItem("user"));
        // Điều hướng đến trang dashboard hoặc trang chính
        navigate("/userDashboard");
      } else {
        toast.error(data.message || "Login failed. Please try again.", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to server. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false); // Ẩn spinner
    }
  };

  const handleClickButtonReg = async () => {
    const container = document.getElementById("container");
    container.classList.add("active");
  };
  const handleClickButtonLog = async () => {
    const container = document.getElementById("container");
    container.classList.remove("active");
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsInactive(true);
      // setCaptchaError(
      //   "You have been inactive for a while. Please verify reCAPTCHA again."
      // );
    }, 5 * 60 * 1000); // 5 minutes inactivity timeout
  };

  const handleRetry = () => {
    setRetry(retry + 1);
    // setCaptchaError(null);
    setIsInactive(false);
    resetInactivityTimer();
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const togglePasswordConfirmVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleBackToMain = () => {
    navigate("/"); // Adjust the route if your main page has a different path
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => clearTimeout(inactivityTimeoutRef.current);
  }, []);

  return (
    <div>
      {!userEmail && (
        <div
          className="signIn"
          style={{
            height: "100vh",
            width: "100vh",
            backgroundColor: "linear-gradient(135deg, #D8BFD8, #C3AED6)",
          }}
        >
          {loading && <LoadingAnimation />}
          <div className="container form" id="container">
            <div className="form-container sign-up">
              <form onSubmit={onSubmit}>
                <h1>Create Account</h1>
                <div className="social-icons">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="google-login-btn"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                    Login with Google
                  </button>
                </div>
                <span>or use your email for registeration</span>
                <input
                  id="username"
                  type="text"
                  autoComplete="off"
                  required
                  value={username}
                  placeholder="Input your email"
                  onChange={(e) => {
                    setUsername(e.target.value || "");
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                />
                <div className="input-wrapper">
                  <input
                    id="password"
                    disabled={isRegistering}
                    placeholder="Input your password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value || "");
                    }}
                  />
                  <div
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      id="toggleIcon"
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm text-gray-600 font-bold"
                    style={{ color: "#666", fontSize: "14px" }}
                  >
                    Confirm Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      disabled={isRegistering}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      autoComplete="off"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setconfirmPassword(e.target.value || "");
                      }}
                    />
                    <div
                      className="toggle-password"
                      onClick={togglePasswordConfirmVisibility}
                    >
                      <FontAwesomeIcon
                        id="toggleIcon"
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className={`px-4 py-2 text-white font-medium rounded-lg ${
                    isRegistering
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
                  }`}
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
            <div className="form-container sign-in">
              <form onSubmit={handleEmailLogin}>
                <h1>Sign In</h1>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Input your email"
                  value={username}
                  onChange={handleChange}
                  required
                />
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Input your password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                  <div
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </div>
                </div>
                <button type="submit" className="login-button">
                  Sign In
                </button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Welcome Back!</h1>
                  <p>Enter your personal details to use all of site features</p>
                  <button
                    className="hidden"
                    id="login"
                    onClick={handleClickButtonLog}
                  >
                    Sign In
                  </button>
                  <button className="homeButton" onClick={handleBackToMain}>
                    Back to Home Page
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hello, Friend!</h1>
                  <p>
                    Register with your personal details to use all of site
                    features
                  </p>
                  <button
                    className="hidden"
                    id="register"
                    onClick={handleClickButtonReg}
                  >
                    Sign Up
                  </button>
                  <button className="homeButton" onClick={handleBackToMain}>
                    Back to Home Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isGoogleSignIn && <SignInGoogle />}{" "}
      {/* Render SignInGoogle when Google Sign-In is initiated */}
      <ToastContainer />
    </div>
  );
}

export default SignIn;
