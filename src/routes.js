import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AllParamDashboard from "./Components/Home/AllParamDashboard";
import { Dashboard } from "./Components/Home/Dashboard";
import Login from "./Components/Pages/Login.jsx";
import ChangePassword from "./Components/Pages/ChangePassword.jsx";
import Zonescoredetails from "./Components/CGST/Registration/Zonescoredetails";
import MISReport from "./Components/Reports/MISReport";
import Kolkata from "./Components/CGST/Kolkata";
import MISReporttable from "./Components/Reports/MISReporttable";
import Subpara from "./Components/CGST/Subparameter-zone/Subpara.jsx";
import Allzones from "./Components/Home/AllZones.jsx";
import Subcom from "./Components/CGST/Subparameter-commissionerate/Subcom.jsx";
import Customtopfive from "./Components/Home/Charts/Customtopfive.jsx";
import Cgsttopfive3d from "./Components/Home/Charts/Cgsttopfive3d.jsx";
import Zoneparameters from "./Components/CGST/Registration/Zoneparameters";
import Zonewisecomm from "./Components/CGST/Registration/Zonewisecomm.jsx";
import Commscoredetails from "./Components/CGST/Registration/Commscoredetails.jsx";
import AllParameters from "./Components/CGST/Registration/AllParameters";
import dayjs from "dayjs";
import MonthlyReport from "./Components/Reports/MonthlyReport.jsx";
import ComparativeReport from "./Components/Reports/ComparativeReport.jsx";
import CustomSubpara from "./Components/CUSTOM/CustomSubpara/CustomSubpara.jsx";
import AllSubParameters from "./Components/CGST/Registration/AllSubparameters";
import CustomSubcom from "./Components/CUSTOM/CustomSubpara/CustomSubcom";
import AllCustomSubpara from "./Components/CUSTOM/CustomSubpara/AllCustomSubpara";
import CustomPara from "./Components/CUSTOM/CustomParameters/CustomPara";
import CustomAllPara from "./Components/CUSTOM/CustomParameters/CustomAllPara";
import CustomZonewisecomm from "./Components/CUSTOM/CustomParameters/CustomZonewisecomm";
import CustomZonescoredetails from "./Components/CUSTOM/CustomParameters/CustomZonescoredetails";
import CustomCommscoredetails from "./Components/CUSTOM/CustomParameters/CustomCommscoredetails";
import ForgetPassword from "./Components/Pages/ForgetPassword.jsx";



const RouteData = () => {
const [selectedDate, setSelectedDate] = useState(dayjs().subtract(2, 'month'));

const handleChangeDate = (newdate) => {
  if (newdate) {
    setSelectedDate(newdate);
  } else {
    setSelectedDate(dayjs().subtract(2, 'month'));
  }
};
  // zone || commissionarate toggle option

  const [selectedOption, setSelectedOption] = useState("CGST");
  const handleChange = (value) => {
    setSelectedOption(value);
  }

  const [selectedOption1, setSelectedOption1] = useState("Zones");
  const handleChange1 = (value) => {
    setSelectedOption1(value);
  };

  return (
    <>
      <Routes>
        {/*================== Dashboard =======================*/}
        {/* <Route
          path="/"
          element={
            <Dashboard
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
            />
          }
        /> */}

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Change Password Page */}
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        <Route
          path="/dashboard"
          element={
            <AllParamDashboard
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />
          }
        />
        <Route path="customtopfive" element={<Customtopfive />} />
        <Route path="cgsttopfive3d" element={<Cgsttopfive3d />} />
        {/* ===========================CGST-dashboard ===================== */}
        {/* <Route
          path="cgst"
          element={
            <CGSTDashboard
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }*/}

        <Route
          path="cgst"
          element={
            <Dashboard
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />}
        />
        {/*==== CGST/parameter-zone=====*/}
        <Route
          path="zoneparameters"
          element={
            <Zoneparameters
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />

        <Route
          path="zonewisecomm"
          element={
            <Zonewisecomm
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />
        <Route
          path="zonescoredetails"
          element={
            <Zonescoredetails
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />

        <Route
          path="commscoredetails"
          element={
            <Commscoredetails
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />

        <Route path="allsubparameters" element={<AllSubParameters
          selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />

        <Route
          path="allparameters"
          element={
            <AllParameters
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />

        <Route
          path="customsubpara"
          element={
            <CustomSubpara
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />

        <Route path="custompara" element={<CustomPara selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />

        <Route path="customallpara" element={<CustomAllPara selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />

        <Route path="customzonewisecomm" element={<CustomZonewisecomm selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />


        <Route path="customzonescoredetails" element={<CustomZonescoredetails selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />

        <Route path="customcommscoredetails" element={<CustomCommscoredetails selectedDate={selectedDate}
          onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1}
          onSelectedOption1={handleChange1} />} />

        <Route path="customsubcom" element={<CustomSubcom selectedDate={selectedDate}
          onChangeDate={handleChangeDate} selectedOption1={selectedOption1} onSelectedOption1={handleChange1} />} />

        <Route path="allcustomsubparameters" element={<AllCustomSubpara selectedDate={selectedDate} onChangeDate={handleChangeDate}
          selectedOption1={selectedOption1} onSelectedOption1={handleChange1} />} />

        <Route
          path="kolkata"
          element={
            <Kolkata
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
            />
          }
        />
        <Route
          path="allzones"
          element={
            <Allzones
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />
          }
        />



        {/*===== CGST/parameter-zone/Subparameter-Zone==== */}
        Gst1a
        <Route
          path="Subpara"
          element={
            <Subpara
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />
        {/*=== CGST-Parameter-commissionerate =====*/}
        <Route
          path="Subcom"
          element={
            <Subcom
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
            />
          }
        />


        {/*=========================== pages =====================================*/}
        <Route
          path="mis-report"
          element={
            <MISReport
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />
          }
        />
        <Route
          path="MISTable"
          element={
            <MISReporttable
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
            />
          }
        />
        <Route
          path="monthlyreport"
          element={
            <MonthlyReport
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />
          }
        />
        <Route
          path="comparativereport"
          element={
            <ComparativeReport
              selectedDate={selectedDate}
              onChangeDate={handleChangeDate}
              selectedOption1={selectedOption1}
              onSelectedOption1={handleChange1}
              selectedOption={selectedOption}
              onSelectedOption={handleChange}
            />
          }
        />
      </Routes>
    </>
  );
};

export default RouteData;
