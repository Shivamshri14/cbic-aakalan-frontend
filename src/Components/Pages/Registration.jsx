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
import apiClient from "../../Service/ApiClient";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [user, setUser] = useState({
    userEmail: "",
    password: "",
  });

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  //const phoneRegex= /^(?:\+?(\d{1,3}))?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?(\d{1,4}[-.\s]?)?(\d{1,4}[-.\s]?)?(\d{1,9})$/;

  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailRegex.test(user.userEmail)) {
      setIsValidEmail(false);
      return;
    } else {
      setIsValidEmail(true);
    }

    if (!user.password) {
      setIsValidPassword(false);
      return;
    } else {
      setIsValidPassword(true);
    }

    const jsondata = {
      userEmail: user.userEmail,
      password: user.password,
    };

    try {
      const response = await apiClient.post(`api/users/register`, jsondata);

      console.log("Response", response);

      if (response && response.data) {
        if (response.status === 200) {
          let dt = response.data;
          console.log("dt", dt);
          let token = dt.token;
          localStorage.setItem("user", JSON.stringify(user));
          const storedUserString = localStorage.getItem("user");
          const u = JSON.parse(storedUserString);

          if (dt) {
            localStorage.setItem("token", token);
            setDialogText("You have successfully logged in.");
            handleOpenDialog();

            setTimeout(() => {
              handleCloseDialog();
              navigate("/changepassword");
            }, 1000);
          } else {
            setDialogText("You have entered incorrect credentials.");
            handleOpenDialog();
          }
        }
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
      <header className="header header-sticky header-bg p-0">
        <div className="container-fluid border-bottom px-4">
          <div className="toggle-main">
            <div className="toggle-lft"></div>
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
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <img src={logo} alt="Logo" /> */}
          <Typography component="h1" variant="h5">
            REGISTRATION
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Id"
              id="userEmail"
              name="userEmail"
              autoComplete="email"
              autoFocus
              type="email"
              error={!isValidEmail}
              helperText={!isValidEmail ? "Invalid email address" : ""}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              id="password"
              name="password"
              autoComplete="mobile"
              autoFocus
              error={!isValidPassword}
              helperText={
                !isValidPassword ? "Phone Number should be of 10 digits" : ""
              }
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
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
  );
};

export default Registration;
