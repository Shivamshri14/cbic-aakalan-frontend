import React, { useState, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";

export const Sidebar = ({ data }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  // const[showhide,setshowhide]=useState(prevState => prevState === " " ? "show" : " ");

  const [showhide, setShowHide] = useState("show"); // Initialize state to 'show' by default

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 991;
      setShowHide(isMobile ? (showhide === "show" ? "" : data) : data); // Set state based on window width and data prop
    };

    handleResize(); // Call once to set initial state

    handleResize();
  }, [data]); // Add 'data' to dependency array, not 'showhide'

  const toggleSidebar = () => {
    setShowHide(showhide === "show" ? "" : showhide); // Toggle between 'show' and empty string
  };

  return (
    <>
      <div
        id="sidebar"
        className={`sidebar ${showhide} sidebar-dark sidebar-fixed border-end`}
      >
        <div className="sidebar-header border-bottom">
          <div className="sidebar-brand">
            <a className="sidebar-brand" to="/">
              <h2 className="logo-title">AAKALAN</h2>
            </a>
            <svg
              className="sidebar-brand-full"
              width="88"
              height="32"
              alt="CoreUI Logo"
            >
              {/* <use xlink:href="assets/brand/coreui.svg#signet"></use> */}
            </svg>
            <svg
              className="sidebar-brand-narrow"
              width="32"
              height="32"
              alt="CoreUI Logo"
            >
              {/* <use xlink:href="assets/brand/coreui.svg#signet"></use> */}
            </svg>
          </div>
          <button
            className="btn-close d-lg-none"
            type="button"
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
        </div>
        <ul className="sidebar-nav" data-coreui="navigation" data-simplebar>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <DashboardIcon />
              Dashboard
              <span className="badge badge-sm bg-info ms-auto">NEW</span>
            </Link>
          </li>

        

          <li className="nav-title"></li>
          <ul>
            <li className="nav-item">
              <Link to="/monthlyreport" className="nav-link">
                Monthly Report
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/comparativereport" className="nav-link">
                Comparative Report
              </Link>
            </li>
          </ul>
          <li className="nav-item">
            <Link to="/mis-report"
              className="nav-link">
              <DescriptionIcon /> MIS Reports
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/cgst" className="nav-link">
              <DashboardIcon />
              All Zones Graph
            </Link>
          </li>

          {/* <li className="nav-group">
            <a className="nav-link nav-group-toggle">
             <DescriptionIcon/>
             {" "}
              Zonal Report
            </a>
            <ul className="nav-group-items compact">
              <li className="nav-item">
                <a className="nav-link" href="/MonthlyReport">
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Monthly Report
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/comparativereport">
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Comparative Report
                </a>
              </li>
            </ul>
          </li> */}
          {/* <li className="nav-group">
            <a className="nav-link nav-group-toggle" href="#">
            <DescriptionIcon/>{" "}
              Commissionerate Report
            </a>
            <ul className="nav-group-items compact">
              <li className="nav-item">
                <a className="nav-link" href="base/accordion.html">
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Monthly Report
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="base/breadcrumb.html">
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Comparative Report
                </a>
              </li>
            </ul>
          </li> */}
          {/* <li className="nav-title">AUDIT REPORTS</li>
          <ul>
            <li className="nav-item">
              <a className="nav-link">
              Monthly Report
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
              Comparative Report
              </a>
            </li>
          </ul> */}
          {/* <li className="nav-group">
            <a className="nav-link nav-group-toggle" href="/">
              <DescriptionIcon /> Commissionerate Report
            </a>
            <ul className="nav-group-items compact">
              <li className="nav-item nav-link">
                <a className="nav-link" href="base/accordion.html"> 
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>{" "}
                Monthly Report
                </a> 
              </li>
              <li className="nav-item nav-link">
                {/* <a className="nav-link" href="base/breadcrumb.html"> 
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>{" "}
                Comparative Report
                 </a> 
              </li>
            </ul>
          </li> */}
          {/* 
          <li className="nav-divider"></li>
          <li className="nav-title">APPEALS REPORTS</li>
          <ul>
            <li className="nav-item">
              <a className="nav-link">
              Monthly Report
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">
              Comparative Report
              </a>
            </li>
          </ul> */}
          {/* <li className="nav-group">
            <a className="nav-link nav-group-toggle" href="/">
              <DescriptionIcon /> Commissionerate Report
            </a>
            <ul className="nav-group-items compact">
              <li className="nav-item nav-link">
                {/* <a className="nav-link" href="login.html" target="_top"> 
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Monthly Report
                {/* </a> 
              </li>
              <li className="nav-item nav-link">
                {/* <a className="nav-link" href="register.html" target="_top"> 
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>{" "}
                  Comparative Report
                {/</a> 
              </li>
            </ul>
          </li> */}
        </ul>

        <div className="sidebar-footer border-top d-none d-md-flex">
          <button
            className="sidebar-toggler"
            type="button"
            data-coreui-toggle="unfoldable"
          ></button>
        </div>
      </div>
    </>
  );
};
