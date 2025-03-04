import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
// import "./Zonescoredetails.scss";
import { CAvatar, CBadge, CButton, CCardBody, CCollapse } from "@coreui/react";

import { CSmartTable } from "@coreui/react-pro";
import "@coreui/coreui/dist/css/coreui.min.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import apiClient from "./../../Service/ApiClient";
// import "./Subpara.scss";
import Spinner from "../Spinner";

// const urlParmeter= new URLSearchParams(window.location.search);
// var urlname= urlParmeter.get('name');
const MonthlyReport = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
  selectedOption,
  onSelectedOption
}) => {
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const [data, setData] = useState([]);
 
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  console.log("test", selectedDate);

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { type } = queryParams;
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    onSelectedOption(e.target.value);
    console.log(e.target.value);
  };

  const handleChange1 = (e) => {
    onSelectedOption1(e.target.value);
    console.log(e.target.value);
  };

  const fetchData = async () => {
    try {

      const endpoints_audit = ["gst10a", "gst10b"];

      const responses_audit  = await Promise.all(
        endpoints_audit .map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: { month_date: newdate, type: "zone" },
            })
            .then((response) => ({
              data: response.data,
              gst: endpoint.toUpperCase(),
            }))
        )
      );

      const endpoints = [
        "returnFiling",
        // "scrutiny/assessment",
        "adjudication",
        "adjudication(legacy cases)",
        "refunds",
        "appeals",
      ];
      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          apiClient
            .get(`/cbic/t_score/${endpoint}`, {
              params: { month_date: newdate, type: "parameter" },
            })
            .then((response) => ({
              data: response.data,
              parameter: endpoint.toUpperCase(),
            }))
        )
      );

      const combinedResponses = [...responses, ...responses_audit];
     
 


      if (combinedResponses) {
        setloading(false);
      }

      const allData = combinedResponses.flatMap((response) =>
        response.data.map((item) => ({ ...item }))
      );
      console.log("FINALRESPONSE", allData);

      const summedByZone = allData.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = (item.ra==="Adjudication")?item.totalScore:
        (item.ra==="Appeals")?item.parameter_wise_weighted_average:item.sub_parameter_weighted_average || 0; // Default to 0 if missing

        // If zone_code is encountered for the first time, initialize it
        if (!acc[zoneCode]) {
          acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
        }

        // Sum only the sub_parameter_weighted_average for each zone_code
        acc[zoneCode].sub_parameter_weighted_average += value;

        return acc;
      }, {});

      const reducedAllData = Object.values(summedByZone);

      console.log("Reduced All Data:", reducedAllData);

      const sorted = reducedAllData.sort(
        (a, b) =>
          b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
      );
      console.log("Sorted", sorted);

      const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

      setData(sorted);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newdate]); // Empty dependency array indicates that this effect runs only once

  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const columns = [
    {
      key: "zonal_rank",
      label: "Ranking",
    },
    {
      key: "zoneName",
      label: "Zone",
    },
    {
      key: "sub_parameter_weighted_average",
      label: "Current Month Score",
    },
  ];

  const headerStyles = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px",
    textAlign: "left",
    fontWeight: "bold",
  };

  const getBadge = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "warning";
      case "Banned":
        return "danger";
      default:
        return "primary";
    }
  };

  const handleClick = (event) => {
    console.log(event.target.value);
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const onRowClick = (clickedRow) => {
    setSelectedRow(clickedRow);
  };

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData = data.map((user) => ({
      // Customize object properties to match desired format
      Ranking: user.rank,
      Zone: user.zone_name,
      "Figures(N/D)": user.absolutevale,
      Percentage: user.percentage,
      "Current Month Score": user.total_score,
    }));
    return exportData;
  };

  const exportToXLS = () => {
    const data = handleExport();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "my_data.xlsx");
  };

  const checkSpecialChar = (e) => {
    if (!/[0-9a-zA-Z]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="body flex-grow-1 custom-sec">
            <div className="msg-box">
              {/* <h2>GST 1A (Zone) {name.toUpperCase()}</h2> */}
              <div className="lft-box col-md-11">
                <h3>Monthly Report</h3>
              </div>
              <div className="rgt-box">
                <div className="view-btn">
                  <Button
                    variant="contained"
                    className="ml-4  cust-btn"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
            <div className="date-sec">
              <div className="lft-sec">
                <div className="date-main">
                  {/* const mont = today. getMonth() + 1; 
              const year = today. getFullYear(); 
              const date = today. */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker", "DatePicker", "DatePicker"]}
                    >
                      <DatePicker
                        label={"Month and Year"}
                        views={["month", "year"]}
                        maxDate={dayjs().subtract(1, "month").startOf("month")}
                        value={selectedDate} // Set value to `value2` state
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                        shouldDisableYear={shouldDisableYear} // Disable years less than 2022
                        slotProps={{
                          field: {
                            readOnly: true,
                          },
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
                  {/* <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Customs"
                    checked={selectedOption === "Customs"}
                    onChange={handleChange}
                  /> */}
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
            <div className="box-main bg-blue col1">
              <div className="row custom-tb mb col ">
                <div className="export-btn">
                  <button onClick={exportToXLS} className="btn btn-primary m-3">
                    Export XLS
                  </button>
                </div>

                <CSmartTable
                  activePage={1}
                  cleaner
                  clickableRows={false}
                  columns={columns}
                  columnSorter
                  items={data}
                  itemsPerPageSelect
                  itemsPerPage={10}
                  pagination
                  onRowClick={onRowClick}
                  onFilteredItemsChange={(items) => {
                    console.log(items);
                  }}
                  onSelectedItemsChange={(items) => {
                    console.log(items);
                  }}
                  sorterValue={{ column: "status", state: "asc" }}
                  tableFilter
                  tableProps={{
                    className: "add-this-class",
                    responsive: true,
                    // striped: true,
                    hover: true,
                    // bordered:true,
                    align: "middle",
                    // borderColor:'info',
                    border: "primary",
                  }}
                  onKeyDown={(e) => checkSpecialChar(e)}
                  // tableBodyProps={{
                  //   className: "align-middle border-info",
                  //   color:'primary',
                  // }}
                  // tableHeadProps={{
                  //   className:"border-info alert-dark",
                  // }}
                />
              </div>
            </div>
            <div className="row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthlyReport;