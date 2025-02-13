import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import RouteData from "./routes";
import Footer from "./Components/Footer/Footer";
import { Header } from "./Components/Header/Header";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Login from "./Components/Pages/Login";
import ChangePassword from "./Components/Pages/ChangePassword";
import Registration from "./Components/Pages/Registration";
import Spinner from "./Components/Spinner";
import ForgetPassword from "./Components/Pages/ForgetPassword";

function App() {
  const [sidebarData, setSidebarData] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const storedUserString = localStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  // Reset session timeout to 10 minutes
  const resetSessionTimeout = () => {
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // Set expiration time to 10 minutes from current time
    localStorage.setItem("expirationTime", expirationTime);
  };

  // Check for session timeout and log the user out if necessary
  const checkSessionTimeout = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime(); // Get current time

    const currentPath = window.location.pathname;
    const loginPagePath = "/";

    // Skip session timeout check if the user is on the login page
    if (currentPath === loginPagePath) {
      return;
    }

    // If expirationTime exists and current time is greater than expirationTime, log the user out
    if (expirationTime && currentTime > parseInt(expirationTime, 10)) {
      const storedUserString = localStorage.getItem("user"); // Ensure user is logged in

      if (storedUserString) {
        setSessionExpired(true); // Set session expired state
        localStorage.clear(); // Clear local storage to log the user out
        alert("Your session has expired. Please log in again.");
        navigate("/"); // Navigate to the login page
      }
    }
  };

  // Add event listeners to track user activity and reset session timeout
  useEffect(() => {
    
    checkSessionTimeout();

    const intervalId = setInterval(checkSessionTimeout, 600000);  // 10 minutes interval

    // Set up event listeners to reset session timeout on user activity (mouse move or key press)
    window.addEventListener("mousemove", resetSessionTimeout);
    window.addEventListener("keydown", resetSessionTimeout);

    return () => {
      clearInterval(intervalId); // Clear the interval
      window.removeEventListener("mousemove", resetSessionTimeout); // Remove mousemove listener
      window.removeEventListener("keydown", resetSessionTimeout); // Remove keydown listener
    };
  }, []); // Empty dependency array ensures the effect runs once on mount

  // Redirect the user to the dashboard if they are logged in, else to login page
  useEffect(() => {
    if (storedUserString) {
      if (pathname === "/") {
        navigate("/dashboard"); // Redirect to Dashboard if already logged in
      }
    } else {
      const allowedPaths = ["/", "/changepassword", "/registration", "/forgetpassword"];
      if (!allowedPaths.includes(pathname)) {
        navigate("/"); // Redirect to Login only if not on allowed pages
      }
    }
  }, [pathname, storedUserString, navigate]);
  

  const handleSidebarDataChange = (newData) => {
    setSidebarData(newData);
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
      {sessionExpired ? (
        <Login />
      ) : (
        <>
          {storedUserString ? (
            <>
              <Sidebar data={sidebarData} />
              <div className="wrapper d-flex flex-column min-vh-100">
                <Header onDataChange={handleSidebarDataChange} />
                <RouteData />
                <Footer />
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
            </Routes>
          )}

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
}

export default App;
