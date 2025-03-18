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
import axios from "axios";

function App() {
  const [sidebarData, setSidebarData] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const publicPages = ["/", "/forgetpassword"];

  const storedUserString = localStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  // ✅ Set session timeout for 3 minutes
  const resetSessionTimeout = () => {
    const expirationTime = new Date().getTime() + 10 * 60 * 1000;
    localStorage.setItem("expirationTime", expirationTime);
  };


  const [allow, setAllow] = useState(false)
  useEffect(() => {
    async function anatarangCheck() {
      try {
        const referrer = document.referrer;
        console.log("referrer value ...",referrer);

        const x = await axios.get("https://DDVUAKAP01.cbic.gov.in:8080/cbicApi/api/check-anatarang-login", {
          headers: {
            "Content-Type": "application/json",
            //"custom_url": "https://antarang.icegate.gov.in",
            "custom_url": referrer,           
          },
         
          timeout: 5000,  // Timeout in milliseconds
        });
        
        setAllow(x.data);
  
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
    anatarangCheck()
  }, [])

  // ✅ Check for session expiration (ignore public pages)
  const checkSessionTimeout = () => {
    if (publicPages.includes(pathname)) return; // Skip timeout check on login & forget password

    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime > parseInt(expirationTime, 10)) {
      setSessionExpired(true);
      sessionStorage.clear();  // Clears session token properly
      localStorage.clear();

      alert("Your session has expired. Please log in again.");

      navigate("/");
      window.location.reload(); // Refreshes the page after navigation
    }
  };

  // ✅ Track user activity and reset session timeout
  useEffect(() => {
    if (storedUserString && token) {
      resetSessionTimeout();
    }

    const intervalId = setInterval(checkSessionTimeout, 600000); // Check every 10 minutes

    const activityHandler = () => resetSessionTimeout();

    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
    };
  }, [storedUserString, token, pathname]);

  // ✅ Handle tab close (expire session only on tab close, NOT refresh)
  useEffect(() => {
    const handleTabClose = () => {
      if (!sessionStorage.getItem("pageReloaded")) {
        console.log("Tab Closed: Clearing Session...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    const handleRefresh = () => {
      sessionStorage.setItem("pageReloaded", "true");
    };

    window.addEventListener("beforeunload", handleRefresh);
    window.addEventListener("unload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
      window.removeEventListener("unload", handleTabClose);
    };
  }, []);

  // ✅ Redirect on app start (Show login page first)
  useEffect(() => {
    const allowedPaths = ["/", "/forgetpassword"];
    const isLoggedIn = sessionStorage.getItem("token") && localStorage.getItem("user");

    if (isLoggedIn) {
      if (pathname === "/" || pathname === "/forgetpassword") {
        navigate("/dashboard", { replace: true });
      }
    } else if (!allowedPaths.includes(pathname)) {
      navigate("/", { replace: true });
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
      {allow ?
        <>
          {sessionExpired ? (
            <>
              <Login />
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
        : <h1>Unauthorized access! Please login through Anatarang portal.</h1>}
    </>
  );
}

export default App;
