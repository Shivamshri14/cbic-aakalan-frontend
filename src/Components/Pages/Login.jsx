import {
  Box,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Spinner from "../Spinner";
// import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  //const [capcha, setCapcha] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [onClose, setOnClose] = useState(null);

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captchaText);
  };

  useEffect(() => {
    generateCaptcha(); // Generate captcha when component loads
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!captchaInput || captchaInput !== captcha) {
      setDialogText("Captcha is incorrect. Please try again.");
      handleOpenDialog();
      generateCaptcha(); // Refresh captcha on incorrect input
      return;
    }

    if (!user.email) {
      setIsValidUsername(false);
      return;
    } else {
      setIsValidUsername(true);
    }

    if (!user.password) {
      setIsValidPassword(false);
      return;
    } else {
      setIsValidPassword(true);
    }

    // if (!capcha) {
    //   alert("Please Tick Checkbox in Capture");
    //   return;
    // }

    var key = CryptoJS.enc.Utf8.parse("8080808080808080");
    var iv = CryptoJS.enc.Utf8.parse("8080808080808080");
    var encryptedemail = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(user.email),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    var encryptedpassword = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(user.password),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const jsondata = {
      email: user.email,
      password: user.password,
      //capcha: capcha,
    };

    try {
      const response = await apiClient.post(`/api/login`, jsondata);
      console.log("Response", response);

      if (response && response.data) {
        if (response.status === 200) {
          let dt = response.data;
          let token = dt.token;
          console.log("dt", dt);

          localStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userSession", JSON.stringify(user));

          // localStorage.setItem("token", token);
          // localStorage.setItem("userSession", JSON.stringify(user));
          localStorage.setItem("user", JSON.stringify(user));  // Store user in localStorage
          localStorage.setItem("token", token);  // Store token in localStorage

          // Set secure cookie attributes
          Cookies.set("token", token, { secure: true, sameSite: 'Strict', httpOnly: true });
          Cookies.set("userSession", JSON.stringify(user), { secure: true, sameSite: 'Strict', httpOnly: true });

          const storedUserString = localStorage.getItem("user");
          const u = JSON.parse(storedUserString);

          const isFirstLogin = !Cookies.get("hasLoggedInBefore");

          if (!isFirstLogin) {
            setDialogText(response.data.message);
            //handleOpenDialog();


            setTimeout(() => {
              handleCloseDialog();
              navigate("/dashboard");
              setLoading(true);
            }, 1000);

          } else {
            Cookies.set("hasLoggedInBefore", "true", { secure: true, sameSite: 'Strict', httpOnly: true });
            setDialogText(
              "For security reasons, we request you to please change your password"
            );
            handleOpenDialog();

            setTimeout(() => {
              handleCloseDialog();
              navigate("/changepassword");
            }, 3000);

          }
        }
      } else {
        setDialogText("Username or Password is incorrect!");
        handleOpenDialog();
        setOnClose(null);
      }
    } catch (error) {
      console.error("Error in posting data", error);
      setDialogText("Username or Password is incorrect!");
      handleOpenDialog();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleTabClose = () => {
      sessionStorage.clear(); // Clears all session data
      Cookies.remove("token");
      Cookies.remove("userSession");
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  useEffect(() => {
    const handleTabClose = () => {
      sessionStorage.removeItem("token"); // Clear session on tab close
      sessionStorage.removeItem("userSession");
      Cookies.remove("token");
      Cookies.remove("userSession");
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

  };

  // Custom CSS styling for the dialog
  const dialogStyles = {
    minWidth: "300px",
    maxWidth: "400px",
    borderRadius: "10px",
  };

  const titleStyles = {
    backgroundColor: "#3f51b5",
    color: "#fff",
  };

  const contentTextStyles = {
    padding: "20px",
  };

  const dialogActionsStyles = {
    borderTop: "1px solid #e0e0e0",
    padding: "10px",
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <header className="header header-sticky header-bg p-0">
            <div className="container-fluid border-bottom px-4">
              <div className="toggle-main">
                <div className="toggle-rgt">
                  <div className="banner-wel">
                    <h6>Welcome to AAKALAN</h6>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <Container component="main" maxWidth="sm">
            <Box
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 6,
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                LOGIN
              </Typography>
              <form onSubmit={handleSubmit}>

                <TextField
                  margin="normal"
                  fullWidth
                  label="Username"
                  name="email"
                  id="email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  onChange={handleChange}
                  error={!isValidUsername}
                  helperText={!isValidUsername ? "Invalid username" : ""}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  error={!isValidPassword}
                  helperText={
                    !isValidPassword ? "Please enter your password" : ""
                  }
                />

                {/* <ReCAPTCHA
                  sitekey="6LdGJv0UAAAAAIvZIBzc9LZ0kY1FovqsgO2Ewjb8"
                  onChange={CapchaChange}
                /> */}

                {/* captcha code start */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      backgroundColor: "#f0f0f0",
                      padding: "8px 16px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                  >
                    {captcha}
                  </Typography>
                  <Button variant="contained" onClick={generateCaptcha}>
                    Refresh Captcha
                  </Button>
                </Box>

                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter Captcha"
                  name="captchaInput"
                  onChange={(e) => setCaptchaInput(e.target.value)}
                />

                {/* captcha code ends */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>

                <Link to="/forgetpassword" className="text-decoration-none">Forgot Password?</Link>
              </form>
            </Box>
          </Container>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: dialogStyles }}
            disableRestoreFocus
          >
            <DialogTitle id="alert-dialog-title" style={titleStyles}>
              {"Message"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                style={contentTextStyles}
              >
                {dialogText}
              </DialogContentText>
            </DialogContent>
            <DialogActions style={dialogActionsStyles}>
              <Button
                onClick={handleCloseDialog}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Login;