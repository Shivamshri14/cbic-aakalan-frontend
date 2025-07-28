import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./misreport.scss";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";

const MISReport = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
  selectedOption,
  onSelectedOption
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const handleClick = (event) => {
    onSelectedOption(event.target.value);
  };

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const options = [
    { id: 1, label: "Registration", value: "registration" },
    { id: 2, label: "Return Filing", value: "returnFiling" },
    { id: 3, label: "Scrutiny/Assessment", value: "scrutiny" },
    { id: 4, label: "Investigation", value: "investigation" },
    { id: 5, label: "Adjudication", value: "adjudication" },
    { id: 6, label: "Adjudication (Legacy cases)", value: "adjudicationLegacy" },
    { id: 7, label: "Refunds", value: "refunds" },
    { id: 8, label: "Recovery of Arrears", value: "recoveryOfArrears" },
    { id: 9, label: "Arrest and Prosecution", value: "arrestAndProsecution" },
    { id: 10, label: "Audit", value: "audit" },
    { id: 11, label: "Appeals", value: "appeals" }
  ];

  const optionscustom = [
    { idc: 12, labelc: "Timely payment of Refunds", value: "TimelyPaymentOfRefunds" },
    { idc: 13, labelc: "Management of Export Obligation(EPCG)", value: "epcg" },
    { idc: 14, labelc: "Management of Export Obligation(AA)", value: "aa" },
    { idc: 15, labelc: "Disposal/Pendency Of Provisional Assessments", value: "disposalPendency" },
    { idc: 16, labelc: "Adjudication", value: "Adjudication" },
    { idc: 17, labelc: "Investigation", value: "cus_investigation" },
    { idc: 18, labelc: "Arrests and Prosecution", value: "cus_arrestAndProsecution" },
    { idc: 19, labelc: "Monitoring Of Un-cleared and Unclaimed cargo", value: "unclaimed_cargo" },
    { idc: 20, labelc: "Disposal Of Confiscated Gold and NDPS", value: "DisposalOfConfiscatedGoldAndNDPS" },
    { idc: 21, labelc: "Recovery of Arrears", value: "recovery_Of_Arrears" },
    { idc: 22, labelc: "Management Of Warehousing bonds", value: "mowb" },
    { idc: 23, labelc: "Commissioner (Appeals)", value: "CommissionerAppeals" },
    { idc: 24, labelc: "Audit", value: "cus_audit" }
  ];

  const handleLabelClick = (label) => {
    navigate(`/MISTable?name=${label}`);
  };

  return (
    <div className="body flex-grow-1 inner-box bg-white">
      <div className="row">
        <div className="msg-box">
          <div className="lft-box">
            <h2>MIS Report</h2>
          </div>
          <div className="rgt-box">
            <div className="view-btn">
              <Button variant="contained" className="ml-4 cust-btn" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="date-sec">
        <div className="lft-sec">
          <div className="date-main">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label={"Month and Year"}
                  views={["month", "year"]}
                  maxDate={dayjs().subtract(1, "month").startOf("month")}
                  value={selectedDate}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} disabled />}
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
              id="switchCGST"
              name="switchPlan"
              value="CGST"
              checked={selectedOption === "CGST"}
              onChange={handleClick}
            />
            <input
              type="radio"
              id="switchCustoms"
              name="switchPlan"
              value="Customs"
              checked={selectedOption === "Customs"}
              onChange={handleClick}
            />
            <label htmlFor="switchCGST">CGST</label>
            <label htmlFor="switchCustoms">Customs</label>
            <div className="switch-wrapper">
              <div className="switch">
                <div>CGST</div>
                <div>Customs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section" style={{
        backgroundColor: '#ffffff',
        padding: '28px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '32px',
        border: '1px solid #e5e7eb'
      }}>
        <div className="row">
          {selectedOption === "CGST" ? (
            <>
              <h3 style={{
                color: '#1d4ed8',
                fontSize: '1.375rem',
                fontWeight: '600',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f3f4f6',
                letterSpacing: '0.25px'
              }}>CGST</h3>
              <div className="container-fluid px-0">
                <div className="row g-3">
                  {options.map((option) => (
                    <div className="col-md-4" key={option.id}>
                      <div
                        className="report-item"
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '18px 16px',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          height: '100%',
                          '&:hover': {
                            borderColor: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleLabelClick(option.value)}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{
                            fontSize: '0.9375rem',
                            fontWeight: '500',
                            color: '#1f2937',
                            lineHeight: '1.5'
                          }}>{option.label}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            style={{
                              transition: 'transform 0.2s ease',
                              flexShrink: 0
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{
                color: '#1d4ed8',
                fontSize: '1.375rem',
                fontWeight: '600',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f3f4f6',
                letterSpacing: '0.25px'
              }}>Customs</h3>
              <div className="container-fluid px-0">
                <div className="row g-3">
                  {optionscustom.map((option) => (
                    <div className="col-md-4" key={option.idc}>
                      <div
                        className="report-item"
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '18px 16px',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'pointer',
                          height: '100%',
                          '&:hover': {
                            borderColor: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => handleLabelClick(option.value)}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{
                            fontSize: '0.9375rem',
                            fontWeight: '500',
                            color: '#1f2937',
                            lineHeight: '1.5'
                          }}>{option.labelc}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            style={{
                              transition: 'transform 0.2s ease',
                              flexShrink: 0
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MISReport;
