import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./misreport.scss";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

const MISReport = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
  selectedOption,onSelectedOption
}) => {
  const [toggle, setToggle] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const handleClick = (event) => {
    setToggle(!toggle);
    onSelectedOption(event.target.value);
    console.log(event.target.value);
  };

  const handleChange = (e) => {
    onSelectedOption1(e.target.value);
    console.log(e.target.value);
  };

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const options = [
    { id: 1, label: "Registration", value: "registration", color:"red" },
    { id: 2, label: "Return Filing", value: "returnFiling" },
    { id: 3, label: "Scrutiny/Assessment", value: "scrutiny", color:"red" },
    { id: 4, label: "Investigation", value: "investigation", color:"red" },
    { id: 5, label: "Adjudication", value: "adjudication" },
    { id: 6, label: "Adjudication(Legacy Cases)", value: "adjudicationLegacy" },
    { id: 7, label: "Refunds", value: "refunds" },
    { id: 8, label: "Recovery of Arrears", value: "recoveryOfArrears", color:"red" },
    { id: 9, label: "Arrest and Prosecution", value: "arrestAndProsecution", color:"red" },
    { id: 10, label: "Audit", value: "audit", color:"red" },
    { id: 11, label: "Appeals", value: "appeals" },
  ];

  const optionscustom = [
    { idc: 12, labelc: "Timely payment of Refunds", value:"TimelyPaymentOfRefunds" },
    { idc: 13, labelc: "Management of Export Obligation(EPCG)", /* value:"epcg", */ color:"red" },
    { idc: 14, labelc: "Management of Export Obligation(AA)",value:"aa", color:"red" },
    { idc: 15, labelc: "Disposal/Pendency Of Provisional Assessments", color:"red" },
    { idc: 16, labelc: "Adjudication", value:"Adjudication" },
    { idc: 17, labelc: "Investigation", value:"Investigation", color:"red" },
    { idc: 18, labelc: "Arrests and Prosecution", color:"red" },
    { idc: 19, labelc: "Monitoring Of Un-cleared and Unclaimed cargo", color:"red" },
    { idc: 20, labelc: "Disposal Of Confiscated Gold and NDPS", value:"DisposalOfConfiscatedGoldAndNDPS" },
    { idc: 21, labelc: "Recovery of Arrears", color:"red" },
    { idc: 22, labelc: "Management Of Warehousing bonds", color:"red" },
    { idc: 23, labelc: "Commissioner (Appeals)", value:"CommissionerAppeals" },
    { idc: 24, labelc: "Audit", color:"red" },
  ];

  const handleCheckboxChange = (id, label) => {
    setSelectedId(id); // Set the selected checkbox ID
    setSelectedCheckbox(label); // Set the selected checkbox label
  };

  return (
    <>
      <div className="body flex-grow-1 inner-box bg-white">
        <div className="row">
          <div className="msg-box">
            <div className="lft-box">
              <h2>MIS Report</h2>
            </div>
            <div className="rgt-box">
              <div className="view-btn">
                <Link to="/">
                  <Button
                    variant="contained"
                    className="ml-4  cust-btn"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="date-sec">
          <div className="lft-sec">
            <div className="date-main">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker", "DatePicker", "DatePicker"]}
                >
                  <DatePicker
                    label={"Month and Year"}
                    views={["month", "year"]}
                    maxDate={dayjs().subtract(1, "month").startOf("month")}
                    value={selectedDate}
                    onChange={handleChangeDate}
                    renderInput={(params) => <TextField {...params} disabled />}
                    shouldDisableYear={shouldDisableYear}
                    slotProps={{
                      field:{
                        readOnly:true
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className="rgt-sec">
            <div className="switches-container2">
              <input
                type="radio"
                id="switchMonthly"
                name="switchPlan2"
                value="Zones"
                checked={selectedOption1==="Zones"}
                onChange={handleChange}
              />
              <input
                type="radio"
                id="switchYearly"
                name="switchPlan2"
                value="Commissionerate"
                checked={selectedOption1==="Commissionerate"}
                onChange={handleChange}
              />
              <label htmlFor="switchMonthly">Zones</label>
              <label htmlFor="switchYearly">Commissionerate</label>
              <div className="switch-wrapper2">
                <div className="switch2">
                  <div>Zones</div>
                  <div>Commissionerate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue report-sec mb p-3">
          <div className="radio-box mt-4">
            <div id="wrapper-radio">
              <label className="radio-button-container" disabled>
                {" "}
                CGST
                <input
                  type="radio"
                  name="radio"
                  value="CGST"
                  checked={selectedOption === "CGST"}
                  onChange={handleClick}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                {" "}
                Customs
                <input
                  type="radio"
                  name="radio"
                  value="Customs"
                  checked={selectedOption === "Customs"}
                  onChange={handleClick}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          <div className="row mt-5 ">
            {selectedOption==="CGST" ? (
              <>
                <h3>CGST</h3>
                <div className="container">
                  <div className="row">
                    {options.map((option) => (
                      <div className="col-md-4 mb-3" key={option.id}>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`checkbox-${option.id}`}
                            checked={selectedId === option.id}
                            onChange={() =>
                              handleCheckboxChange(option.id, option.value)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`checkbox-${option.id}`}
                            style={{ color: option.color || "black" }}
                          >
                            {option.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3>Customs</h3>
                <div className="container">
                  <div className="row">
                    {optionscustom.map((options) => (
                      <div className="col-md-5 ml-5 mb-4" key={options.idc}>
                        <div className="form-check-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`checkbox-${options.idc}`}
                            checked={selectedId === options.idc}
                            onChange={() =>
                              handleCheckboxChange(options.idc, options.value)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`checkbox-${options.idc}`}
                            style={{ color: options.color || "black" }}
                          >
                            {options.labelc}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-20">
          <div className="view-btn ">
            <Link to={`/MISTable?name=${selectedCheckbox}`}>
              <Button variant="contained" className="cust-btn ">
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MISReport;
