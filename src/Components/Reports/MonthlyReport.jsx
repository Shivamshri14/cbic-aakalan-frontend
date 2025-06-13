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
  const [datacustoms, setDatacustoms] = useState([]);
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
      const endpointsGrouped = {
        registration: ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"],
        audit: ["gst10a", "gst10b", "gst10c"],
        scrutiny_assessment: ["gst3a", "gst3b"],
        investigation: ["gst4a", "gst4b", "gst4c", "gst4d"],
        recovery_of_arrears: ["gst8a", "gst8b"],
        arrest_prosecution: ["gst9a", "gst9b"],
        adjudication: ["gst5a", "gst5b"],
        adjudication_legacy: ["gst6a", "gst6b", "gst6c", "gst6d"],
        refunds: ["gst7"],
        appeals: ["gst11a", "gst11b", "gst11c", "gst11d"],
        return_filing: ["gst2"],
      };

      const scaleMap = {
        audit: 12,
        recovery_of_arrears: 8,
        arrest_prosecution: 6,
        refunds: 5,
        return_filing: 5,
        appeals: 12,
        registration: 12,
      };

      const fetchEndpoints = async (group, scale = null) => {
        return Promise.all(
          endpointsGrouped[group].map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data.map(item => ({
                  ...item,
                  sub_parameter_weighted_average: parseFloat(
                    scale
                      ? ((item.sub_parameter_weighted_average * scale) / 10).toFixed(2)
                      : parseFloat(item.sub_parameter_weighted_average).toFixed(2)
                  ),
                })),
                gst: endpoint.toUpperCase(),
              }))
          )
        );
      };

      // Fetch all groups
      const [
        responses_registration,
        responses_audit,
        responses_scrutiny,
        responses_investigation,
        responses_recovery,
        responses_arrest,
        responses_adjudication,
        responses_adjudication_legacy,
        responses_refunds,
        responses_appeals,
        responses_return_filing,
      ] = await Promise.all([
        fetchEndpoints("registration", scaleMap.registration),
        fetchEndpoints("audit", scaleMap.audit),
        fetchEndpoints("scrutiny_assessment"),
        fetchEndpoints("investigation"),
        fetchEndpoints("recovery_of_arrears", scaleMap.recovery_of_arrears),
        fetchEndpoints("arrest_prosecution", scaleMap.arrest_prosecution),
        fetchEndpoints("adjudication"),
        fetchEndpoints("adjudication_legacy"),
        fetchEndpoints("refunds", scaleMap.refunds),
        fetchEndpoints("appeals", scaleMap.appeals),
        fetchEndpoints("return_filing", scaleMap.return_filing),
      ]);

      const allResponses = [
        ...responses_registration,
        ...responses_audit,
        ...responses_scrutiny,
        ...responses_investigation,
        ...responses_recovery,
        ...responses_arrest,
        ...responses_adjudication,
        ...responses_adjudication_legacy,
        ...responses_refunds,
        ...responses_appeals,
        ...responses_return_filing,
      ];

      //setloading(false);

      const allData = allResponses.flatMap((response) => response.data);

      const summedByZone = allData.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = item.sub_parameter_weighted_average || 0;

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

      //const scoreIndexMap = new Map();
      //let currentIndex = 1;

      // for (let i = 0; i < sorted.length; i++) {
      //   // const score = sorted[i].sub_parameter_weighted_average;
      //   if (!scoreIndexMap.has(score)) {
      //     scoreIndexMap.set(score, currentIndex);
      //     currentIndex++;
      //   }
      //   sorted[i].zonal_rank = scoreIndexMap.get(score);
      // }

      let currentIndex = 1;
      let prevScore = null;
      for (let i = 0; i < sorted.length; i++) {
        const score = sorted[i].sub_parameter_weighted_average;
        if (score !== prevScore) {
          currentIndex = i + 1;
        }
        sorted[i].zonal_rank = currentIndex;
        prevScore = score;
      }

      // Apply color-coding and enhance the data
      const enhancedData = sorted.map((item, index) => {
        const total = item.sub_parameter_weighted_average;
      
        let props = {};
        if (total <= 100 && total >= 75) {
          props = { scope: "row", color: "success" }; // Top entries
        } else if (total < 75 && total >= 50) {
          props = { scope: "row", color: "warning" };
        } else if (total >= 0 && total <= 25) {
          props = { scope: "row", color: "danger" }; // Bottom entries
        } else {
          props = { scope: "row", color: "primary" }; // Remaining entries
        }
      
        return {
          ...item,
          _props: props, // Add dynamic background color properties
          s_no: index + 1,
        };
      });      

      // Filter top 21 entries
      const filteredData = enhancedData.filter(item => item.zonal_rank <= 21);

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };


  const fetchDataCom = async () => {
    try {
      const endpointsGrouped = {
        disposal_pendency: ["cus4a", "cus4b", "cus4c", "cus4d"],
        epcg: ["cus2a", "cus2b", "cus2c"],
        aa: ["cus3a", "cus3b", "cus3c"],
        adjudication: ["cus5a", "cus5b", "cus5c"],
        cus_investigation: ["cus6a", "cus6b", "cus6c", "cus6d", "cus6e", "cus6f"],
        cus_arrest_prosecution: ["cus7a", "cus7b"],
        cus_timelyrefunds: ["cus1"],
        cus_unclaimed_cargo: ["cus8a", "cus8b"],
        cus_DisposalOfConfiscatedGoldAndNDPS: ["cus9a", "cus9b"],
        cus_recovery_of_arrears: ["cus10a", "cus10b"],
        cus_management_of_warehousing_bonds: ["cus11a", "cus11b"],
        cus_CommissionerAppeals: ["cus12a", "cus12b"],
        cus_audit: ["cus13a", "cus13b", "cus13c", "cus13d", "cus13e"],
      };

      const scaleMap = {
        disposal_pendency: 11,
        epcg: 7,
        aa: 7,
        adjudication: 10,
        cus_investigation: 12,
        cus_arrest_prosecution: 6,
        //cus_timelyrefunds: 1,
        cus_unclaimed_cargo: 6,
        cus_DisposalOfConfiscatedGoldAndNDPS: 4,
        cus_recovery_of_arrears: 6,
        cus_management_of_warehousing_bonds: 6,
        cus_CommissionerAppeals: 8,
        cus_audit: 12,
      };

      const fetchEndpoints = async (group, scale = null) => {
        return Promise.all(
          endpointsGrouped[group].map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data.map((item) => ({
                  ...item,
                  sub_parameter_weighted_average: parseFloat(
                    scale
                      ? ((item.sub_parameter_weighted_average * scale) / 10).toFixed(2)
                      : parseFloat(item.sub_parameter_weighted_average).toFixed(2)
                  ),
                })),
                gst: endpoint.toUpperCase(),
              }))
          )
        );
      };

      // Fetch all groups
      const [
        responses_disposal_pendency,
        responses_epcg,
        responses_aa,
        responses_adjudication,
        responses_cus_investigation,
        responses_cus_arrest_prosecution,
        responses_cus_timelyrefunds,
        responses_cus_unclaimed_cargo,
        responses_cus_DisposalOfConfiscatedGoldAndNDPS,
        responses_cus_recovery_of_arrears,
        responses_cus_management_of_warehousing_bonds,
        responses_cus_CommissionerAppeals,
        responses_cus_audit,
      ] = await Promise.all([
        fetchEndpoints("disposal_pendency", scaleMap.disposal_pendency),
        fetchEndpoints("epcg", scaleMap.epcg),
        fetchEndpoints("aa", scaleMap.aa),
        fetchEndpoints("adjudication", scaleMap.adjudication),
        fetchEndpoints("cus_investigation", scaleMap.cus_investigation),
        fetchEndpoints("cus_arrest_prosecution", scaleMap.cus_arrest_prosecution),
        fetchEndpoints("cus_timelyrefunds", scaleMap.cus_timelyrefunds),
        fetchEndpoints("cus_unclaimed_cargo", scaleMap.cus_unclaimed_cargo),
        fetchEndpoints("cus_DisposalOfConfiscatedGoldAndNDPS", scaleMap.cus_DisposalOfConfiscatedGoldAndNDPS),
        fetchEndpoints("cus_recovery_of_arrears", scaleMap.cus_recovery_of_arrears),
        fetchEndpoints("cus_management_of_warehousing_bonds", scaleMap.cus_management_of_warehousing_bonds),
        fetchEndpoints("cus_CommissionerAppeals", scaleMap.cus_CommissionerAppeals),
        fetchEndpoints("cus_audit", scaleMap.cus_audit),
      ]);

      // 🔍 Log helper
      const logZoneWiseScores = (label, responses) => {
        const flatData = responses.flatMap((res) => res.data);
        const zoneMap = {};

        flatData.forEach((item) => {
          const zone = item.zone_code;
          const score = item.sub_parameter_weighted_average || 0;
          if (!zoneMap[zone]) {
            zoneMap[zone] = [];
          }
          zoneMap[zone].push(score);
        });

        console.log(`\n--- ${label} ---`);
        Object.entries(zoneMap).forEach(([zone, scores]) => {
          const sum = scores.reduce((acc, score) => acc + score, 0); // Calculate sum of scores
          console.log(`Zone ${zone}: ${scores.join(", ")} (Sum: ${sum})`);
        });
      };


      // 🔍 Call log function
      logZoneWiseScores("Disposal Pendency", responses_disposal_pendency);
      logZoneWiseScores("EPCG", responses_epcg);
      logZoneWiseScores("AA", responses_aa);
      logZoneWiseScores("Adjudication", responses_adjudication);
      logZoneWiseScores("Investigation", responses_cus_investigation);
      logZoneWiseScores("Arrest Prosecution", responses_cus_arrest_prosecution);
      logZoneWiseScores("Timely Refunds", responses_cus_timelyrefunds);
      logZoneWiseScores("Unclaimed Cargo", responses_cus_unclaimed_cargo);
      logZoneWiseScores("Disposal of Confiscated Gold and NDPS", responses_cus_DisposalOfConfiscatedGoldAndNDPS);
      logZoneWiseScores("Recovery of Arrears", responses_cus_recovery_of_arrears);
      logZoneWiseScores("Warehousing Bonds", responses_cus_management_of_warehousing_bonds);
      logZoneWiseScores("Commissioner Appeals", responses_cus_CommissionerAppeals);
      logZoneWiseScores("Audit", responses_cus_audit);

      const allResponses = [
        ...responses_disposal_pendency,
        ...responses_epcg,
        ...responses_aa,
        ...responses_adjudication,
        ...responses_cus_investigation,
        ...responses_cus_arrest_prosecution,
        ...responses_cus_timelyrefunds,
        ...responses_cus_unclaimed_cargo,
        ...responses_cus_DisposalOfConfiscatedGoldAndNDPS,
        ...responses_cus_recovery_of_arrears,
        ...responses_cus_management_of_warehousing_bonds,
        ...responses_cus_CommissionerAppeals,
        ...responses_cus_audit,
      ];

      setloading(false);

      const allData = allResponses.flatMap((response) => response.data);

      // Calculate the total weighted average for each zone and fix to 2 decimal places
      const summedByZone = allData.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = item.sub_parameter_weighted_average || 0;

        if (!acc[zoneCode]) {
          acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0, total_weighted_average: 0 };
        }

        // Add the individual sub_parameter_weighted_average to the zone
        acc[zoneCode].sub_parameter_weighted_average = parseFloat(
          (acc[zoneCode].sub_parameter_weighted_average + value).toFixed(2)
        );

        // Update the total weighted average by adding the weighted averages from all datasets
        acc[zoneCode].total_weighted_average = parseFloat(
          (acc[zoneCode].total_weighted_average + value).toFixed(2)
        );

        return acc;
      }, {});

      const reducedAllData = Object.values(summedByZone);

      const sorted = reducedAllData.sort(
        (a, b) =>
          b.total_weighted_average - a.total_weighted_average
      );

      // const scoreIndexMap = new Map();
      // let currentIndex = 1;

      // for (let i = 0; i < sorted.length; i++) {
      //   const score = sorted[i].total_weighted_average;
      //   if (!scoreIndexMap.has(score)) {
      //     scoreIndexMap.set(score, currentIndex);
      //     currentIndex++;
      //   }
      //   sorted[i].zonal_rank = scoreIndexMap.get(score);
      // }

      let currentIndex = 1;
      let prevScore = null;
      for (let i = 0; i < sorted.length; i++) {
        const score = sorted[i].total_weighted_average;
        if (score !== prevScore) {
          currentIndex = i + 1;
        }
        sorted[i].zonal_rank = currentIndex;
        prevScore = score;
      }

      const enhancedData = sorted.map((item, index) => {
        const total = item.total_weighted_average;

        let props = {};
        if (total <= 100 && total >= 75) {
          props = { scope: "row", color: "success" }; // Top entries
        } else if (total < 75 && total >= 50) {
          props = { scope: "row", color: "warning" };
        } else if (total >= 0 && total <= 25) {
          props = { scope: "row", color: "danger" }; // Bottom entries
        } else {
          props = { scope: "row", color: "primary" }; // Remaining entries
        }

        return {
          ...item,
          _props: props, // Add _props field dynamically
          s_no: index + 1,
        };
      });

      const filteredData = enhancedData.filter(item => item.zonal_rank <= 20);

      //const filteredData = sorted.filter(item => item.zonal_rank <= 20 );
      setDatacustoms(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };



  useEffect(() => {
    fetchData();
    fetchDataCom();
  }, [newdate]);

  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const columns = [
    {
      key: "zonal_rank",
      label: "Ranking",
    },
    {
      key: "zone_name",
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
        return Math.trunc(Number(item.sub_parameter_weighted_average)).toString();
      },
    },
    {
      key: "show_details",
      label: "Show Parameterwise by Bifurcation",
      filter: false,
      sorter: false,
      //_props: { className: "current-month-score" },
      // formatter: (item) => {
      //   return (
      //     <Link to="/allzones" state={{ data: item }}> 
      //       <CButton variant="outline" shape="square" size="sm" color="primary">
      //         Show
      //       </CButton>
      //     </Link>
      //   );
      // },
    },
  ];
  

  const columnsCustom = [
    {
      key: "zonal_rank",
      label: "Ranking",
    },
    {
      key: "zone_name",
      label: "Zone",
    },
    {
      key: "total_weighted_average",
      label: "Current Month Score",
      _style: { minWidth: "150px" },
      filter: false,
      sorter: false,
      _props: { className: "current-month-score" },
      formatter: (item) => {
        if (!item || item.total_weighted_average == null) return "0";
        return Math.trunc(Number(item.total_weighted_average)).toString();
      },
    },
    {
      key: "show_details",
      label: "Show Parameterwise by Bifurcation",
      filter: false,
      sorter: false,
      //_props: { scope: "col" },
      formatter: (item) => {
        return (
          <Link to="/allzones" state={{ data: item }}> 
            <CButton variant="outline" shape="square" size="sm" color="primary">
              Show
            </CButton>
          </Link>
        );
      },
    },
  ];

    const scopedColumns = {
      show_details: (item) => {
        return (
          <td className="py-2">
            <Link
              to={`/allzones`}
            >
              <CButton color="primary" variant="outline" shape="square" size="sm">
                Show
              </CButton>
            </Link>
          </td>
        );
      },

    };

  const scopedColumnscustoms = {
    show_details: (item) => {
      return (
        <td className="py-2">
          <Link
            to={`/allzones`}
          > 
            <CButton color="primary" variant="outline" shape="square" size="sm">
              Show
            </CButton>
          </Link>
        </td>
      );
    },
  };


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

  // const handleExport = () => {
  //   const exportData = data.map((user) => ({
  //     Ranking: user.rank,
  //     Zone: user.zone_name,
  //     // "Figures(N/D)": user.absolutevale,
  //     // Percentage: user.percentage,
  //     "Current Month Score": user.total_weighted_average,
  //   }));
  //   return exportData;
  // };

  // const exportToXLS = () => {
  //   const data = handleExport();
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //   XLSX.writeFile(wb, "my_data.xlsx");
  // };

  const handleExport = () => {
    const exportData = data.map((user) => ({
        Ranking: user.zonal_rank,  // Corrected the field name
        Zone: user.zone_name,  // Corrected the field name
        "Current Month Score": user.sub_parameter_weighted_average,  // Corrected the field name
    }));
    return exportData;
};

const exportToXLS = () => {
  // Use the appropriate data based on the selected option
  const dataToExport = selectedOption === "CGST" ? data : datacustoms;

  const exportData = dataToExport.map((user) => ({
    Ranking: user.zonal_rank,  // Corrected the field name
    Zone: user.zone_name,  // Corrected the field name
    "Current Month Score": user.sub_parameter_weighted_average,  // Corrected the field name
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const fileName = selectedOption === "CGST" ? "monthly_report_cgst.xlsx" : "monthly_report_customs.xlsx";
  XLSX.writeFile(wb, fileName);  // Export with a dynamic filename based on selected option
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
                    className="ml-4 cust-btn"
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
                    <DemoContainer components={["DatePicker", "DatePicker", "DatePicker"]}>
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
            {selectedOption === "CGST" ? (
              <div className="box-main bg-blue col1">
                <div className="row custom-tb mb col">
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
                    scopedColumns={scopedColumns}
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
            ) : (
              <div className="box-main bg-blue col1">
                <div className="row custom-tb mb col">
                  <div className="export-btn">
                    <button onClick={exportToXLS} className="btn btn-primary m-3">
                      Export XLS
                    </button>
                  </div>
                  {<CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows={false}
                    columns={columnsCustom}
                    columnSorter
                    items={datacustoms}
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
                    scopedColumns={scopedColumnscustoms}
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
                  />}
                </div>
              </div>
            )}

            <div className="row">
            </div>
          </div>
        </div>
      )}
    </>

  );
};
export default MonthlyReport;