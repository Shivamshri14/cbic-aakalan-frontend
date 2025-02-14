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
  const [sessionExpired, setSessionExpired] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const storedUserString = localStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  // ✅ Set session timeout for 3 minutes
  const resetSessionTimeout = () => {
    const expirationTime = new Date().getTime() + 3 * 60 * 1000;
    localStorage.setItem("expirationTime", expirationTime);
  };

  // ✅ Check for session expiration
  const checkSessionTimeout = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime > parseInt(expirationTime, 1000)) {
      if (storedUserString) {
        setSessionExpired(true);
        localStorage.clear();
        alert("Your session has expired. Please log in again.");
        navigate("/");
      }
    }
  };

  // ✅ Handle tab close (expire session only on tab close, NOT refresh)

  useEffect(() => {
    const handleTabClose = (event) => {
      if (!sessionStorage.getItem("pageReloaded")) {
        // ✅ Only clear session when the tab is truly closed (NOT on refresh)
        console.log("Tab Closed: Clearing Session...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    const handleRefresh = () => {
      // ✅ Mark that the page was refreshed (so session stays intact)
      sessionStorage.setItem("pageReloaded", "true");
    };

    window.addEventListener("beforeunload", handleRefresh);
    window.addEventListener("unload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
      window.removeEventListener("unload", handleTabClose);
    };
  }, []);




  // ✅ Track user activity and reset session timeout
  useEffect(() => {
    checkSessionTimeout();

    const intervalId = setInterval(checkSessionTimeout, 18000); // 3 minutes
    window.addEventListener("mousemove", resetSessionTimeout);
    window.addEventListener("keydown", resetSessionTimeout);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("mousemove", resetSessionTimeout);
      window.removeEventListener("keydown", resetSessionTimeout);
    };
  }, []);

  // ✅ Redirect on app start (Show login page first)
  useEffect(() => {
    const allowedPaths = ["/", "/forgetpassword"];
    const isLoggedIn = localStorage.getItem("user") && sessionStorage.getItem("token");

    if (isLoggedIn) {
      if (pathname === "/" || pathname === "/forgetpassword") {
        navigate("/dashboard", { replace: true }); // Prevents history stack issues
      }
    } else if (!allowedPaths.includes(pathname)) {
      navigate("/", { replace: true }); // Redirect to login only if needed
    }
  }, [pathname, navigate]);



  // ✅ Handle Sidebar Data Change
  const handleSidebarDataChange = (newData) => {
    setSidebarData(newData);
  };

  // ✅ Handle Dialog Close
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
      {sessionExpired ? (
        <>
          <Login />
          <ForgetPassword />
        </>
      ) : (
        <>
          {storedUserString ? (
            <>
              {/* Show Sidebar & Header only if NOT on the Login Page */}
              {pathname !== "/" && <Sidebar data={sidebarData} />}
              <div className="wrapper d-flex flex-column min-vh-100">
                {pathname !== "/" && <Header onDataChange={handleSidebarDataChange} />}
                <RouteData />
                {pathname !== "/" && <Footer />}
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
