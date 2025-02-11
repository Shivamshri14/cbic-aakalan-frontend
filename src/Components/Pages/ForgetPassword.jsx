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
import { useNavigate } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import Spinner from "../Spinner";

const ForgetPassword = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setPassword] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [loading, setLoading]=useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    } else {
      setIsValidEmail(true);
    }

    const otpdata = {
      email: email,
    };

    try {
      const response = await apiClient.post(`/api/forget-password`, otpdata);
      setDialogText(response.data.message);
      handleOpenDialog();
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setDialogText(error.response.data);
      handleOpenDialog();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const jsondata = {
      email: email,
      otp: otp,
      newPassword: newPassword,
    };

    try {
      const response = await apiClient.post(`/api/forget-password`, jsondata);

      if (response && response.data) {
        if (response.status === 200) {
          let dt = response.data;

          setDialogText(response.data.message);
          handleOpenDialog();

          setTimeout(() => {
            handleCloseDialog();
            navigate("/");
          }, 3000);
        }
      } else {
        setDialogText(response.data.message);
        handleOpenDialog();
      }
    } catch (error) {
      console.error("Error in updating password", error);
      setDialogText(error.response.data);
      handleOpenDialog();
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

    if(otpSent){
    setLoading(false);
    }
    else{
      setLoading(true);
    }
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
    {loading?(
      <Spinner />
    ):(
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
          <Typography component="h1" variant="h5" className="mb-4">
            FORGOT PASSWORD
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Id"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              error={!isValidEmail}
              helperText={!isValidEmail ? "Invalid Email" : ""}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {otpSent && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  required
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="New Password"
                  id="newPassword"
                  name="newPassword "
                  type="password"
                  error={!isValidPassword}
                  helperText={
                    !isValidPassword ? "Please enter a new password" : ""
                  }
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}

            {!otpSent ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            )}
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
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      </>
  )}
    </>
  );
};

export default ForgetPassword;
