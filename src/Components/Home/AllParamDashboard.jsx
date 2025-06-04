import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./allparamdashboard.scss";
//import './Registration/Zoneregistration.scss'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import apiClient from "../../Service/ApiClient";
import { useNavigate } from "react-router-dom";
import box1 from "../../Assets/images/graph1.png";
import box2 from "../../Assets/images/graph2.png";
import box3 from "../../Assets/images/box7.png";
import box4 from "../../Assets/images/graph3.png";
import box5 from "../../Assets/images/box10.png";
import box6 from "../../Assets/images/box11.png";
import box7 from "../../Assets/images/graph4.png";
import box8 from "../../Assets/images/graph5.png";
import box9 from "../../Assets/images/graph6.png";
import box10 from "../../Assets/images/graph8.png";
import box11 from "../../Assets/images/graph7.png";
import graph1 from "../../Assets/images/graph1.png";
import graph2 from "../../Assets/images/graph2.png";
import graph9 from '../../Assets/images/graph9.png'
import graph10 from '../../Assets/images/graph10.png'
import box12 from "../../Assets/images/custom-graph.png";
import graph5 from '../../Assets/images/graph5.png'


import queryString from "query-string";

const AllParamDashboard = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
  selectedOption,
  onSelectedOption,
}) => {
  // const [value2, setValue] = useState(dayjs().subtract(1, "month").subtract(1, "year").startOf("month"));

  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const [loading, setloading] = useState(true);
  // const [value2, setValue] = React.useState(dayjs());
  // const formattedDate = value2 ? value2.format('MM YYYY') : '';
  // console.log("val123",formattedDate);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const handleDateChange = (value) => {
    onChangeDate(value);
  };

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  // const [selectedOption1, setSelectedOption1] = useState("Zones");

  const handleChange1 = (e) => {
    onSelectedOption1(e.target.value);
    console.log(e.target.value);
  };

  const handleChange = (e) => {
    onSelectedOption(e.target.value);
    console.log(e.target.value);
  };

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  return (
    <div>
      <div className="body flex-grow-1 cgst-sec">
        <div className="row">
          <div className="msg-box">
            <div className="lft-box">
              {selectedOption === "CGST" ? <h2>CGST</h2> : <h2>Customs</h2>}
            </div>
            {/* <div className="rgt-box">
              <div className="view-btn">
                <Button
                  variant="contained"
                  className="ml-4  cust-btn"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="row main-sec">
          <div className="col-md-4">
            <div className="date-main">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker", "DatePicker", "DatePicker"]}
                >
                  <DatePicker
                    label={"Month and Year"}
                    views={["month", "year"]}
                    // minDate={dayjs("2024-04-01")}
                    maxDate={dayjs().subtract(1, "month").startOf("month")}
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    shouldDisableYear={shouldDisableYear}
                    slotProps={{
                      field: {
                        readOnly: true
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className="col-md-4">
            <div className="switches-container">
              <input
                type="radio"
                id="switchMonthly"
                name="switchPlan"
                value="CGST"
                checked={selectedOption === "CGST"}
                onChange={handleChange}
              />
              <input
                type="radio"
                id="switchYearly"
                name="switchPlan"
                value="Customs"
                checked={selectedOption === "Customs"}
                onChange={handleChange}
              />
              <label htmlFor="switchMonthly">CGST</label>
              <label htmlFor="switchYearly">Customs</label>
              <div className="switch-wrapper">
                <div className="switch">
                  <div>CGST</div>
                  <div>Customs</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="switches-container2">
              <input
                type="radio"
                id="switchZones"
                name="switchPlan2"
                value="Zones"
                checked={selectedOption1 === "Zones"}
                onChange={handleChange1}
              />
              <input
                type="radio"
                id="switchCommissionerate"
                name="switchPlan2"
                value="Commissionerate"
                checked={selectedOption1 === "Commissionerate"}
                onChange={handleChange1}
              />
              <label htmlFor="switchZones">Zones</label>
              <label htmlFor="switchCommissionerate">Commissionerate</label>
              <div className="switch-wrapper2">
                <div className="switch2">
                  <div>Zones</div>
                  <div>Commissionerate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Row1 */}

        {selectedOption === "CGST" ? (
          <>
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-primary">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start g1">
                    <div className="g1-box">
                      <div className="fs-4 fw-semibold text-danger">
                        {/* <Link
                          to="/zoneparameters?name=registration"
                          className="text-white sub-h"
                        > */}
                          Registration
                          {/* </Link>{" "} */}
                      </div>
                      <ol className="par-list">
                        <li className="text-red">
                          <Tooltip
                            title="Number of applications cleared within 07 days vis-à-vis total applications filed with Aadhar verification during the month"
                            placement="right"
                            arrow
                          >
                            {/* <Link to="/Subpara?name=gst1a" className="text-white sub-h"> */}
                            Application cleared within 7 days
                            {/* </Link> */}
                          </Tooltip>
                        </li>
                        <li className="text-red">
                          <Tooltip
                            title="Number of cases where PV not completed within 30 days vis-à-vis total applications marked for PV for the month"
                            placement="right"
                            arrow
                          >
                            {/* <Link to="/Subpara?name=gst1b" className="text-white sub-h"> */}
                              Pendency of
                              PV
                            {/* </Link> */}
                          </Tooltip>
                        </li>
                        <li className="text-red">
                          <Tooltip
                            title="Number of Deemed registrations vis-à-vis total number of applications received for registration in the month"
                            placement="right"
                            arrow
                          >
                            {/* <Link
                              to="/Subpara?name=gst1c"
                              className="text-white sub-h"
                            > */}
                              Deemed Registration{" "}
                            {/* </Link> */}
                          </Tooltip>
                        </li>
                        <li className="text-red">
                          <Tooltip
                            title="*Percentage of registration applications pending at the end of the month vis-à-vis total applications for registration received."
                            placement="right"
                            arrow
                          >
                            {/* <Link
                              to="/Subpara?name=gst1d"
                              className="text-white sub-h"
                            > */}
                              {" "}
                              Registration application pending
                            {/* </Link> */}
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="*Percentage of registrations pending for cancellation at the end of the month vis-à-vis total applications initiated for cancellation."
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst1e"
                              className="text-white sub-h"
                            >
                              {" "}
                              Pending for cancellation
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="*Percentage of registration pending for revocation at the end of the month vis-à-vis total applications received for revocation of cancellation."
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst1f"
                              className="text-white sub-h"
                            >
                              {" "}
                              Pending for revocation
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box1} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-info">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold">
                        {" "}
                        <Link
                          to="/zoneparameters?name=returnFiling"
                          className="text-white sub-h"
                        >
                          Return Filing
                        </Link>{" "}
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="*Percentage of returns which were due but not filed vis-à-vis total returns due (GSTR 3B) "
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst2" className="text-white sub-h">
                              {/* <Link
                              to="/zoneparameters?name=returnFiling"
                              className="text-white sub-h"
                            > */}
                              Return due but not filed (Monthly)
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box2} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-warning">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-white">
                        {" "}
                        <Link
                          to="/zoneparameters?name=scrutiny/assessment"
                          className="text-white sub-h"
                        >
                          Scrutiny & Assessment
                        </Link>{" "}
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title="Number of Returns whose scrutiny completed for the month vis-à-vis total Returns pending for the month (Pro-rata basis)"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst3a"
                              className="text-white sub-h"
                            >
                              Scrutiny Completed/Return pending
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Recoveries made upto the month vis-a-vis detections upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst3b"
                              className="text-white sub-h"
                            >
                              Recoveries/Detection
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box3} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-danger">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-white">
                        {" "}
                        <Link
                          to="/zoneparameters?name=investigation"
                          className="text-white sub-h"
                        >
                          Investigation
                        </Link>{" "}
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="No. of cases disposed (investigation completed)during the month vis a vis total investigations pending at beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst4a"
                              className="text-white sub-h"
                            >
                              Investigation completed
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of investigations pending beyond 01 years vis-a-vis total number of investigation cases pending"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst4b" className="text-white sub-h">
                              Pending &gt;
                              1year
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Detections made upto the month vis-à-vis total revenue collected upto the month for the formation (Zone/Commissionerate)"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst4c"
                              className="text-white sub-h"
                            >
                              Detections/Revenue collected
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Recoveries made upto the month vis-a-vis detections upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst4d"
                              className="text-white sub-h"
                            >
                              {" "}
                              Recoveries/detection
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box4} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Row2 */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-violet">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start ">
                    <div>
                      <div className="fs-4 fw-semibold text-white">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=adjudication"
                          className="text-white sub-h"
                        >
                          Adjudication
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="Number of cases disposed of during the month vis-à-vis total pending cases at the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst5a"
                              className="text-white sub-h"
                            >
                              Disposal of cases
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of cases where time left for adjudication is less than 6 months vis-à-vis total adjudication cases pending at the end of the month"
                            placement="right"
                            arrow
                          ><>
                            </>
                            <Link
                              to="/Subpara?name=gst5b"
                              className="text-white sub-h"
                            >
                              Time left for adjudication &lt; 6 months
                            </Link>

                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box5} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-primary">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start bg-box">
                    <div>
                      <div className="fs-4 fw-semibold">
                        <Link
                          to="/zoneparameters?name=adjudication(legacy cases)"
                          className="text-white sub-h"
                        >
                          Adjudication(legacy cases)
                        </Link>
                      </div>
                      <ol className="par-list b-4">
                        <li>
                          <Tooltip
                            title="No. of cases disposed of during the month in Service Tax vis-à-vis  total cases in the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst6a"
                              className="text-white sub-h"
                            >
                              Disposal of cases (ST)
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of adjudication cases pending for more than one year in Service Tax vis-à-vis total adjudication pending at the end of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst6b"
                              className="text-white sub-h"
                            >
                              Pending &gt; 1 year(ST){" "}
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="No. of cases disposed of during the month in Central Excise vis-à-vis total cases in the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst6c"
                              className="text-white sub-h"
                            >
                              Disposal of cases (C.Ex)
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of adjudication cases pending for more than one year in Central Excise vis-à-vis total adjudication pending at the end of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst6d"
                              className="text-white sub-h"
                            >
                              {" "}
                              Pending &gt; 1 year (C.Ex)
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box7} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-red">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=refunds"
                          className="text-white sub-h"
                        >
                          Refunds
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="Number of refunds applications pending beyond 60 days of receipt vis-à-vis total number of refunds applications pending at the end of the month"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst7" className="text-white sub-h">Pending &gt; 60 days</Link>
                            {/* <Link
                              to="/zoneparameters?name=refunds"
                              className="text-white sub-h"
                            >
                              Pending &gt; 60 days
                            </Link> */}
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box8} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-light-blue">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-danger">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=recovery_of_arrears"
                          className="text-white sub-h"
                        >
                          Recovery of Arrears
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title="Amount of Recoverable arrears recovered during the month vis-à-vis pro rata target given upto the month for the formation (Zone/Commissionerate)"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst8a" className="text-white sub-h">
                              Recovery of
                              recoverable arrears
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Recoverable arrears pending for more than one year vis-à-vis total recoverable arrears pending."
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst8b"
                              className="text-white sub-h"
                            >
                              Arrears pending &gt; 1 year
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box9} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Row3 */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-medium-blue">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-danger">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=gst_arrest_and_prosecution"
                          className="text-white sub-h"
                        >
                          Arrest and Prosecution
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="Number of cases where prosecution was not launched within 2 months of prosecution sanction date vis-à-vis total number of prosecution sanctioned cases "
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst9a"
                              className="text-white sub-h">
                              Prosecution
                              not launched within 2 months
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of Prosecution launched upto the month vis-à-vis  number of arrests made upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst9b"
                              className="text-white sub-h"
                            >
                              Prosecution launched/Arrests made
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box6} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white  bg-green1">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-danger">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=audit"
                          className="text-white sub-h"
                        >
                          Audit
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="Number of Taxpayers (TPs) audited during the month vis-à-vis total number of Taxpayers (TPs)  allotted for audit upto the month (Pro- Rata)"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst10a" className="text-white sub-h">
                              Taxpayers audited/Allotted
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of Audit Paras pending for more than 6 month vis-à-vis number of Audit Paras pending"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst10b" className="text-white sub-h">
                              Paras
                              pending &gt; 6 months
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Amount of recoveries made upto the month vis-à-vis Amount of detections upto the month"
                            placement="right"
                            arrow
                          >
                            <Link to="/Subpara?name=gst10c" className="text-white sub-h">
                              Recoveries/Detections
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box11} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-purple">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold">
                        {""}{" "}
                        <Link
                          to="/zoneparameters?name=appeals"
                          className="text-white sub-h"
                        >
                          Appeals
                        </Link>
                        {""}
                      </div>
                      <ol className="par-list b-4">
                        <li>
                          <Tooltip
                            title="Number of appeal cases disposed of during the month vis-à-vis  pending appeal cases  at the beginning for the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst11a"
                              className="text-white sub-h"
                            >
                              Disposal of commissioner appeals
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of appeal cases  pending for more than one year vis-à-vis  total cases of appeal pending"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst11b"
                              className="text-white sub-h"
                            >
                              Commissioner appeals cases pending &gt; 1 year
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of Cases disposed during the month vis-à-vis  pending cases at the beginning for the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst11c"
                              className="text-white sub-h"
                            >
                              Disposal of ADC/JC appeals
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of appeal cases pending for more than One year vis-à-vis  total cases of appeal pending"
                            placement="right"
                            arrow
                          >
                            <Link
                              to="/Subpara?name=gst11d"
                              className="text-white sub-h"
                            >
                              {" "}
                              ADC/JC appeals
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                    <div className="box-img b3">
                      {" "}
                      <img src={box10} alt="graph1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-navy-blue">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div className="g1-box">
                      <div className="fs-4 fw-semibold text-danger">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=timelyrefunds"
                        >
                          Timely payment of Refunds
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="Number of Refunds pending beyond 90 days at the end of the month vis-à-vis total number of Refunds at the end of the month"
                            placement="right"
                            arrow
                          >
                            <Link className="text-white sub-h" to="/customsubpara?name=cus1">
                              {/* <Link
                              className="text-white sub-h"
                              to="/custompara?name=timelyrefunds"
                            > */}
                              Pending &gt; 90 days
                            </Link>
                            {/* </Link> */}
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={graph1} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-lightblue">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-danger">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=epcg"
                        >
                          Management of Export Obligation(EPCG)
                        </Link>
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="Number of Notices issued pertaining to EPCG licenses pending for closure beyond stipulated period vis-a -vis total No. of cases where time to produce Export Obligation fulfilment is over"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus2a"
                            >
                              {" "}
                              Action initiated on expired licenses
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of EPCG licenses where revenue protective measure not yet initiated vis-à-vis Number of EPCG licenses where time to produce evidence of Export obligation fulfillment is over"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus2b"
                            >
                              {" "}
                              Revenue protective measure not initiated
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Duty recovered during the month by way of duty deposit or enforcement of Bank Guarantee vis-a-vis total duty involved on expired licenses of EPCG upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus2c"
                            >
                              {" "}
                              Duty recovered
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={graph2} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-sand">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-danger">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=export_obligation(AA)"
                        >
                          Management of Export Obligation(AA)
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title="Number of Notices issued pertaining to AA licenses pending for closure beyond stipulated period vis-a -vis total No. of cases where time to produce Export Obligation fulfilment is over"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus3a"
                            >
                              {" "}
                              Action initiated on expired licenses
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of AA licenses where revenue protective measure not yet initiated vis-à-vis Number of AA licenses where time to produce evidence of Export obligation fulfillment is over"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus3b"
                            >
                              {" "}
                              Revenue Protective measure not initiated
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Duty  recovered during the month by way of duty deposit or enforcement of Bank Guarantee  vis-a-vis total duty involved on expired licenses of AA up to the month"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus3c"
                            >
                              {" "}
                              Duty recovered
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box3} alt="box7" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-lightred">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col2">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-dark">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=disposal/pendency"
                        >
                          Disposal/Pendency Of Provisional Assessments
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title="Number of provisional assessment cases (Non-SVB) not finalised within six months from the date of provisional assessment vis-à-vis total number of provisional assessment cases(non-SVB)"
                            placement="right"
                            arrow
                          >
                            <Link className="text-white sub-h"
                              to="/customsubpara?name=cus4a"
                            >
                              {" "}
                              Prov. Assessment not finalized within 6 months
                              (Non SVB){" "}
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="No of PD Bonds(Non SVB) pending for more than 6 months vis-a-vis total PD Bonds pending at the end of the month(non-SVB)"
                            arrow
                          >
                            <Link className="text-white sub-h"
                              to="/customsubpara?name=cus4b"
                            >
                              {" "}
                              PD Bonds pending &gt; 6 months (Non SVB)
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of SVB cases finalized  during the month  vis-à-vis total SVB cases  at the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link li className="text-white"
                              to="/customsubpara?name=cus4c"
                            >
                              {" "}
                              Prov. Assessments Finalized (SVB)
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of SVB cases pending for more than one year vis-à-vis total number of SVB cases pending"
                            placement="right"
                            arrow
                          >
                            <Link li className="text-white"
                              to="/customsubpara?name=cus4d"
                            >
                              {" "}
                              PD Bonds pending &gt; 1 year (SVB)
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box4} alt="graph3" />
                  </div>
                </div>
              </div>
            </div>
            {/* Row2 */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-info">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col3">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=adjudication"
                        >
                          Adjudication
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="Total Number of cases of adjudication disposed of during the month vis-à-vis  total pending cases at the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus5a"
                            >
                              {" "}
                              Disposal of cases
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Total Number of cases of adjudication pending for more than 1 year vis-à-vis total adjudication cases pending"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus5b"
                            >
                              {" "}
                              Cases pending &gt; 1 year
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Total Number of cases involving duty more than Rs. 1 cr pending for more than one year at the end of the month vis-à-vis total cases pending for adjudication involving duty more than Rs. 1 Cr at the end of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus5c"
                            >
                              Cases pending &gt;{" "}
                            </Link>
                            1 year (duty involved &gt; 1 crore)
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box5} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-successdarkpurple">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col4">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-white">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=investigation"
                        >
                          Investigation
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title="Number of cases where investigation completed during the month vis-à-vis total investigation cases pending at the beginning of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6a"
                            >
                              {" "}
                              Investigation completed
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of investigation cases pending beyond 2 years vis-a-vis total number of investigation cases pending"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6b"
                            >
                              {" "}
                              Pending &gt; 2 years
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title=") Amount involved in detections made up to the month vis-à-vis total revenue collected upto the month in the Commissionerate(Zone)"

                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6c"
                            >
                              {" "}
                              Detections/Revenue collected
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Amount of recovery made upto the month vis-à-vis amount involved in detections made upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6d"
                            >
                              {" "}
                              Recovery/Detection
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of investigation cases of outright smuggling closed during the month vis-à-vis total number of investigation cases of outright smuggling pending at the beginning of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6e"
                            >
                              {" "}
                              Disposal of cases (outright smuggling)
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title=")Number of investigation cases of commercial fraud closed during the month vis-a- vis total number of investigation cases of commercial fraud pending at the beginning of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus6f"
                            >
                              {" "}
                              Disposal of cases (Commercial fraud){" "}
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box7} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-red">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-white">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=arrest_and_prosecution"
                        >
                          Arrests and Prosecution
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title=" Number of cases where prosecution was not launched within 2 months of prosecution sanction date vis-à-vis total number of prosecution cases sanctioned upto the month "
                            placement="right"
                            arrow
                          >
                            <Link li className="text-white"
                              to="/customsubpara?name=cus7a"
                            >
                              {" "}
                              Prosecution not launched within 2 months
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of Prosecution launched upto the month viz-a-viz number of arrests made upto the month"
                            placement="right"
                            arrow
                          >
                            <Link li className="text-white"
                              to="/customsubpara?name=cus7b"
                            >
                              {" "}
                              Prosecution launched/Arrests made
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={graph5} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-peach">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col7">
                    <div>
                      <div className="fs-4 fw-semibold text-danger">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=unclaimed_cargo"
                        >
                          Monitoring Of Un-cleared and Unclaimed cargo
                        </Link>
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="Number of packages of un-cleared/unclaimed cargo disposed during the month vis-a-vis total number of packages of un-cleared/unclaimed cargo pending at the beginning of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus8a"
                            >
                              {" "}
                              Disposal of packages
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="No of packages of uncleared/unclaimed cargo pending more than six months vis-à-vis total number of packages of uncleared/unclaimed cargo pending"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus8b"
                            >
                              {" "}
                              Packages pending &gt; 6 months
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box9} alt="graph1" />
                  </div>
                </div>
              </div>
            </div>
            {/* Row3 */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-secondary">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col5">
                    <div>
                      <div className="fs-4 fw-semibold">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=DisposalOfConfiscatedGoldAndNDPS"
                        >
                          Disposal Of Confiscated Gold and Narcotics
                        </Link>
                      </div>
                      <ol className="par-list b-4">
                        <li>
                          <Tooltip
                            title="Quantity of Gold disposed during the month vis-à-vis total quantity of gold ripe for disposal at the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus9a"
                            >
                              {" "}
                              Gold disposed/Gold ripe for disposal
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Quantity of confiscated narcotics disposed  (during the months) vis- a vis total  quantity pending for disposal at the beginning of the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus9b"
                            >
                              {" "}
                              Narcotics disposed/Pending for disposal
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box11} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-pink">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-dark">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=recovery_of_arrears"
                        >
                          Recovery of Arrears
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title=" Recoverable arrears recovered vis-à-vis pro rata TAR target  upto the month "
                            placement="right"
                            arrow
                          >
                            <Link className="text-white sub-h"
                              to="/customsubpara?name=cus10a"
                            >
                              {" "}
                              Recovery of recoverable arrears
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Amount of Recoverable arrears pending for more than one year vis-à-vis total amount of recoverable arrears pending at the end of the month."
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus10b"
                            >
                              {" "}
                              Recoverable arrears pending &gt; 1 year
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={graph9} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-success">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col6">
                    <div>
                      <div className="fs-4 fw-semibold text-dark">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=management_of_warehousing_bonds"
                        >
                          Management Of Warehousing bonds
                        </Link>
                      </div>
                      <ol className="par-list b-4">
                        <li className="text-white">
                          <Tooltip
                            title="Number of cases where W/H bond has expired and no action taken during the month vis-à-vis total number of cases where W/H bond has expired upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus11a"
                            >
                              No action initiated on expired WH bonds
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Customs duty recovered from expired W/H bonds  during the month vis -a- vis total duty involved on  W/H bonds  upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus11b"
                            >
                              Duty Recovered/Duty involved
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box10} alt="graph1" />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-dark-green">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fs-4 fw-semibold text-white">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=CommissionerAppeals"
                        >
                          Commissioner (Appeals)
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li>
                          <Tooltip
                            title=") Number of appeal cases disposed of during the month vis-à-vis  pending cases at the beginning for the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus12a"
                            >
                              {" "}
                              Appeal cases disposed/cases pending
                            </Link>
                          </Tooltip>
                        </li>
                        <li>
                          <Tooltip
                            title="Number of appeal cases pending for more than one year vis-a-vis total cases of appeal pending "
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus12b"
                            >
                              {" "}
                              Cases pending &gt; 1 year
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={box12} alt="graph1" />
                  </div>
                </div>
              </div>
            </div>
            {/* Row4 */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card text-white bg-warningz">
                  <div className="card-body pb-0 d-flex justify-content-between align-items-start col8">
                    <div class="g1-box">
                      <div className="fs-4 fw-semibold text-danger">
                        <Link
                          className="text-white sub-h"
                          to="/custompara?name=cus_audit"
                        >
                          Audit
                        </Link>
                      </div>
                      <ol className="par-list">
                        <li className="text-white">
                          <Tooltip
                            title="Number of BEs audited upto the month vis-à-vis total number of BEs marked for audit upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus13a"
                            >
                              {" "}
                              BEs audited/marked
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title=" Number of SBs audited upto the month vis-à-vis total number of SBs marked for audit upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus13b"
                            >
                              {" "}
                              SBs audited/marked
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Amount  recovered in transactions audited upto the month vis-à-vis total amount detected in transactions marked for audit upto the month"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus13c"
                            >
                              {" "}
                              Recovered/detected
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of BEs pending audit more than 6 months vis-à-vis total number of BEs pending audit"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus13d"
                            >
                              {" "}
                              BEs pending &gt; 6 months
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="text-white">
                          <Tooltip
                            title="Number of SBs pending audit more than 6 months vis-à-vis total number of SBs pending audit"
                            placement="right"
                            arrow
                          >
                            <Link
                              className="text-white sub-h"
                              to="/customsubpara?name=cus13e"
                            >
                              {" "}
                              SBs Pending &gt; 6 months{" "}
                            </Link>
                          </Tooltip>
                        </li>
                      </ol>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-transparent text-white p-0"
                        type="button"
                        data-coreui-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <MoreVertIcon />
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="box-img">
                    {" "}
                    <img src={graph10} alt="graph1" />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row">
              <div className="view-btn">
                <Link className="text-white sub-h" to="/">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default AllParamDashboard;
