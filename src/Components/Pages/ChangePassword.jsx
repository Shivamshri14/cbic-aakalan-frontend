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
import { Container, margin } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import Spinner from "../Spinner";

const ChangePassword = () => {
  const [user, setUser] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.email) {
      setIsValidEmail(false);
      return;
    } else {
      setIsValidEmail(true);
    }

    if (!user.oldPassword) {
      setIsValidPassword(false);
      return;
    } else {
      setIsValidPassword(true);
    }

    if (!user.newPassword) {
      setIsValidPassword(false);
      return;
    } else {
      setIsValidPassword(true);
    }

    const jsondata = {
      email: user.email,
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };

    try {
      const response = await apiClient.post(`/api/update-password`, jsondata);

      if (response && response.data) {
        if (response.status === 200) {
          let dt = response.data;
          let token = dt.token;

          if (dt) {
            localStorage.setItem("token", token);
            setDialogText("Password changed successfully!!");
            handleOpenDialog();

            setTimeout(() => {
              handleCloseDialog();
              navigate("/dashboard");
            }, 3000);
          } else {
             setDialogText("Password change failed.Please try again!!");
           // setDialogText(response.data.message);
            handleOpenDialog();
          }
        }
      } else {
        //setDialogText("Password change failed.Please try again!!");
        setDialogText(response.data.message);
        handleOpenDialog();
      }
    } catch (error) {
      console.error("Error in posting data", error);
      setDialogText("There was an error processing your request.");
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLoading(true);
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
          {/* <header className="header header-sticky header-bg p-0">
            <div className="container-fluid border-bottom px-4">
              <div className="toggle-main">
                <div className="toggle-rgt">
                  <div className="banner-wel">
                    <h6>Welcome to AAKALAN</h6>
                  </div>
                </div>
              </div>
            </div>
          </header> */}
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
                CHANGE PASSWORD
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Username"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  error={!isValidEmail}
                  helperText={!isValidEmail ? "Invalid Username" : ""}
                  onChange={handleChange}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="Old Password"
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  error={!isValidPassword}
                  helperText={
                    !isValidPassword ? "Please enter your old password" : ""
                  }
                  onChange={handleChange}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="New Password"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  error={!isValidPassword}
                  helperText={
                    !isValidPassword ? "Please enter a new password" : ""
                  }
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
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

export default ChangePassword;
