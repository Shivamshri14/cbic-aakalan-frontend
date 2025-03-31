import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
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
import Spinner from "../Spinner";

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
      const endpoints_audit = ["gst10a", "gst10b", "gst10c"];
      const responses_audit = await Promise.all(
        endpoints_audit.map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: { month_date: newdate, type: "zone" },
            })
            .then((response) => ({
              data: response.data.map(item => ({
                ...item,
                sub_parameter_weighted_average: parseFloat(
                  ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2)
                ),
              })),
              gst: endpoint.toUpperCase(),
            }))
        )
      );

      const endpoints_scrutiny_assessment = ["gst3a", "gst3b"];
      const responses_scrutiny_assessment = await Promise.all(
        endpoints_scrutiny_assessment.map((endpoint) =>
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

      const endpoints_investigation = ["gst4a", "gst4b", "gst4c", "gst4d"];
      const responses_investigation = await Promise.all(
        endpoints_investigation.map((endpoint) =>
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

      const endpoints_recovery_of_arrears = ["gst8a", "gst8b"];
      const responses_recovery_of_arrears = await Promise.all(
        endpoints_recovery_of_arrears.map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: { month_date: newdate, type: "zone" },
            })
            .then((response) => ({
              data: response.data.map(item => ({
                ...item,
                sub_parameter_weighted_average: parseFloat(
                  ((item.sub_parameter_weighted_average * 8) / 10).toFixed(2)
                ),
              })),
              gst: endpoint.toUpperCase(),
            }))
        )
      );

      const endpoints_gst_arrest_and_prosecution = ["gst9a", "gst9b"];
      const responses_gst_arrest_and_prosecution = await Promise.all(
        endpoints_gst_arrest_and_prosecution.map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: { month_date: newdate, type: "zone" },
            })
            .then((response) => ({
              data: response.data.map(item => ({
                ...item,
                sub_parameter_weighted_average: parseFloat(
                  ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2)
                ),
              })),
              gst: endpoint.toUpperCase(),
            }))
        )
      );

      const endpoints = [
        "returnFiling",
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

      const combinedResponses = [
        ...responses,
        ...responses_audit,
        ...responses_scrutiny_assessment,
        ...responses_investigation,
        ...responses_recovery_of_arrears,
        ...responses_gst_arrest_and_prosecution,
      ];

      if (combinedResponses) {
        setloading(false);
      }

      const allData = combinedResponses.flatMap((response) =>
        response.data.map((item) => ({
          ...item,
          sub_parameter_weighted_average: parseFloat(
            item.sub_parameter_weighted_average.toFixed(2)
          ),
        }))
      );
      const summedByZone = allData.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = (item.ra === "Adjudication") ? item.totalScore :
          (item.ra === "Appeals") ? item.parameter_wise_weighted_average : item.sub_parameter_weighted_average || 0;
        if (!acc[zoneCode]) {
          acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
        }
        acc[zoneCode].sub_parameter_weighted_average = parseFloat(
          (acc[zoneCode].sub_parameter_weighted_average + value).toFixed(2)
        );
        return acc;
      }, {});

      const reducedAllData = Object.values(summedByZone);

      const sorted = reducedAllData.sort(
        (a, b) =>
          b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
      );

      const scoreIndexMap = new Map();
      let currentIndex = 1;

      for (let i = 0; i < sorted.length; i++) {
        const score = sorted[i].sub_parameter_weighted_average;

        if (!scoreIndexMap.has(score)) {
          scoreIndexMap.set(score, currentIndex);
          currentIndex++;
        }

        sorted[i].zonal_rank = scoreIndexMap.get(score);
      }

      const filteredData = sorted.filter(item => item.zonal_rank <= 21);

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newdate]);

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
      _style: { minWidth: "150px" },
      filter: false,
      sorter: false,
      _props: { className: "current-month-score" },
      formatter: (item) => {
        if (!item || item.sub_parameter_weighted_average == null) return "0";
        
        // Ensure the value is rounded down and converted to a string
        return Math.trunc(Number(item.sub_parameter_weighted_average)).toString();
      },
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
    const exportData = data.map((user) => ({
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
                        renderInput={(params) => <TextField {...params} />}
                        shouldDisableYear={shouldDisableYear}
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
                  />
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
                    hover: true,
                    align: "middle",
                    border: "primary",
                  }}
                  onKeyDown={(e) => checkSpecialChar(e)}
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