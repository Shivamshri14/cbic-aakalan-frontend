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
import apiClient from "../../Service/ApiClient";
// import "./Subpara.scss";

import Spinner from "../Spinner";

const ComparativeReport = ({
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
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);

  const [datacustoms1, setDatacustoms1] = useState([]);
  const [datacustoms2, setDatacustoms2] = useState([]);
  const [datacustoms3, setDatacustoms3] = useState([]);
  const [datacustoms4, setDatacustoms4] = useState([]);
  const [datacustoms5, setDatacustoms5] = useState([]);
  const [datacustoms6, setDatacustoms6] = useState([]);


  const [datacustoms, setDatacustoms] = useState([]);


  const [response, setResponse] = useState(null);

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  const date1 = dayjs(newdate).format("MMMM YYYY");

  const previousmonth1 = dayjs(selectedDate).subtract(1, "month").format("YYYY-MM-DD");
  const date2 = dayjs(previousmonth1).format("MMMM YYYY");

  const previousmonth2 = dayjs(selectedDate).subtract(2, "month").format("YYYY-MM-DD");
  const date3 = dayjs(previousmonth2).format("MMMM YYYY");

  const previousmonth3 = dayjs(selectedDate).subtract(3, "month").format("YYYY-MM-DD");
  const date4 = dayjs(previousmonth3).format("MMMM YYYY");

  const previousmonth4 = dayjs(selectedDate).subtract(4, "month").format("YYYY-MM-DD");
  const date5 = dayjs(previousmonth4).format("MMMM YYYY");

  const previousmonth5 = dayjs(selectedDate).subtract(5, "month").format("YYYY-MM-DD");
  const date6 = dayjs(previousmonth5).format("MMMM YYYY");


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
      const endpointsGrouped = {
        //registration: ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"],
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
      };

      const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

      // Adjusted fetchEndpoints function to accept only a single month
      const fetchEndpoints = async (group, scale = null, month) => {
        return Promise.all(
          endpointsGrouped[group].map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: month, type: "zone" },
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

      const getMonthData = async (month) => {
        const [
          //responses_registration,
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
          //fetchEndpoints("registration", null, month),
          fetchEndpoints("audit", scaleMap.audit, month),
          fetchEndpoints("scrutiny_assessment", null, month),
          fetchEndpoints("investigation", null, month),
          fetchEndpoints("recovery_of_arrears", scaleMap.recovery_of_arrears, month),
          fetchEndpoints("arrest_prosecution", scaleMap.arrest_prosecution, month),
          fetchEndpoints("adjudication", null, month),
          fetchEndpoints("adjudication_legacy", null, month),
          fetchEndpoints("refunds", scaleMap.refunds, month),
          fetchEndpoints("appeals", scaleMap.appeals, month),
          fetchEndpoints("return_filing", scaleMap.return_filing, month),
        ]);

        const allResponses = [
          //...responses_registration,
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

        //Sorting by weighted average in descending order
        // const sorted = reducedAllData.sort(
        //   (a, b) =>
        //     b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        // );


        let currentIndex = 1;
        let prevScore = null;
        for (let i = 0; i < reducedAllData.length; i++) {
          const score = reducedAllData[i].sub_parameter_weighted_average;
          if (score !== prevScore) {
            currentIndex = i + 1;
          }
          reducedAllData[i].zonal_rank = currentIndex;
          prevScore = score;
        }

        // Correcting rank calculation to handle ties better
        // let currentRank = 1;
        // let prevScore = null;
        // for (let i = 0; i < reducedAllData.length; i++) {
        //   const score = reducedAllData[i].sub_parameter_weighted_average;
        //   if (score !== prevScore) {
        //     currentRank = i + 1; // Update rank only when score changes
        //   }
        //   reducedAllData[i].zonal_rank = currentRank;
        //   prevScore = score;
        // }

        //console.log("Sorted with Ranks:", reducedAllData);

        const filteredData = reducedAllData.filter((item) => item.zonal_rank <= 21);
        //console.log("After filtering:", filteredData);

        return filteredData.map((item, index) => ({ ...item, s_no: index + 1 }));
      };

      // Fetching data for all months
      const allMonthData = await Promise.all(months.map((month) => getMonthData(month)));

      // Set data for each month
      setData1(allMonthData[0]);
      setData2(allMonthData[1]);
      setData3(allMonthData[2]);
      setData4(allMonthData[3]);
      setData5(allMonthData[4]);
      setData6(allMonthData[5]);

      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  const fetchDatacustoms = async () => {
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
        cus_unclaimed_cargo: 6,
        cus_DisposalOfConfiscatedGoldAndNDPS: 4,
        cus_recovery_of_arrears: 6,
        cus_management_of_warehousing_bonds: 6,
        cus_CommissionerAppeals: 8,
        cus_audit: 12,
      };

      const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5]; // Adjust your months as required

      // Adjusted fetchEndpoints function to accept a single month
      const fetchEndpoints = async (group, scale = null, month) => {
        return Promise.all(
          endpointsGrouped[group].map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: month, type: "zone" },
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

      // Function to fetch data for a specific month
      const getMonthData = async (month) => {
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
          fetchEndpoints("disposal_pendency", scaleMap.disposal_pendency, month),
          fetchEndpoints("epcg", scaleMap.epcg, month),
          fetchEndpoints("aa", scaleMap.aa, month),
          fetchEndpoints("adjudication", scaleMap.adjudication, month),
          fetchEndpoints("cus_investigation", scaleMap.cus_investigation, month),
          fetchEndpoints("cus_arrest_prosecution", scaleMap.cus_arrest_prosecution, month),
          fetchEndpoints("cus_timelyrefunds", scaleMap.cus_timelyrefunds, month),
          fetchEndpoints("cus_unclaimed_cargo", scaleMap.cus_unclaimed_cargo, month),
          fetchEndpoints("cus_DisposalOfConfiscatedGoldAndNDPS", scaleMap.cus_DisposalOfConfiscatedGoldAndNDPS, month),
          fetchEndpoints("cus_recovery_of_arrears", scaleMap.cus_recovery_of_arrears, month),
          fetchEndpoints("cus_management_of_warehousing_bonds", scaleMap.cus_management_of_warehousing_bonds, month),
          fetchEndpoints("cus_CommissionerAppeals", scaleMap.cus_CommissionerAppeals, month),
          fetchEndpoints("cus_audit", scaleMap.cus_audit, month),
        ]);

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

        const allData = allResponses.flatMap((response) => response.data);

        // Step 1: Exclude the unwanted zones first
        const excludedZones = [
          "DG NORTH", "DG WEST", "DG EAST", "DG SOUTH", "DG (HQ)", "JAIPUR CE & GST",
          "RANCHI CE & GST", "VADODARA CE & GST", "MUMBAI CE & GST", "DRI DG"
        ];

        const filteredData = allData.filter(item => !excludedZones.includes(item.zone_name));

        // Step 2: Sum by zone and calculate ranks after exclusion
        const summedByZone = filteredData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0;

          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0, total_weighted_average: 0 };
          }

          acc[zoneCode].sub_parameter_weighted_average = parseFloat(
            (acc[zoneCode].sub_parameter_weighted_average + value).toFixed(2)
          );

          acc[zoneCode].total_weighted_average = parseFloat(
            (acc[zoneCode].total_weighted_average + value).toFixed(2)
          );

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone);

        // Ranking Logic
        let currentRank = 1;
        let prevScore = null;
        //reducedAllData.sort((a, b) => b.total_weighted_average - a.total_weighted_average);  // Sorting first

        // Add the `s_no` (Serial Number) after sorting
        for (let i = 0; i < reducedAllData.length; i++) {
          const score = reducedAllData[i].total_weighted_average;
          if (score !== prevScore) {
            currentRank = i + 1;
          }
          reducedAllData[i].zonal_rank = currentRank;
          reducedAllData[i].s_no = i + 1;  // Add serial number here
          prevScore = score;
        }

        return reducedAllData;
      };

      // Fetching data for all months
      const allMonthData = await Promise.all(months.map((month) => getMonthData(month)));

      // Set data for each month
      setDatacustoms1(allMonthData[0]);
      setDatacustoms2(allMonthData[1]);
      setDatacustoms3(allMonthData[2]);
      setDatacustoms4(allMonthData[3]);
      setDatacustoms5(allMonthData[4]);
      setDatacustoms6(allMonthData[5]);

      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };


  useEffect(() => {
    fetchData();
    fetchDatacustoms();
  }, [newdate]); // Empty dependency array indicates that this effect runs only once

  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const columns = [
    {
      key: "s_no",
      label: "S no.",
    },
    {
      key: "zone_name",
      label: "Zone",
    },
    {
      key: "sub_parameter_weighted_average_6",
      label: `${date6}`,
    },
    {
      key: "sub_parameter_weighted_average_5",
      label: `${date5}`,
    },
    {
      key: "sub_parameter_weighted_average_4",
      label: `${date4}`,
    },
    {
      key: "sub_parameter_weighted_average_3",
      label: `${date3}`,
    },
    {
      key: "sub_parameter_weighted_average_2",
      label: `${date2}`,
    },
    {
      key: "sub_parameter_weighted_average_1",
      label: `${date1}`,
    },
  ];

  const userData = [];
  const maxLength = Math.max(data1.length, data2.length, data3.length, data4.length, data5.length, data6.length);
  // Loop through all indices up to the maximum length
  for (let i = 0; i < maxLength; i++) {
    userData.push({
      s_no: data1[i]?.s_no || null,  // Access s_no from data1
      zone_name: data1[i]?.zone_name || null,  // Access zone_name from data1
      sub_parameter_weighted_average_1: data1[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data1
      sub_parameter_weighted_average_2: data2[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data2
      sub_parameter_weighted_average_3: data3[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data3
      sub_parameter_weighted_average_4: data4[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data4
      sub_parameter_weighted_average_5: data5[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data5
      sub_parameter_weighted_average_6: data6[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data6
    });
  }
  console.log("usersdata", userData);

  const columnscustoms = [
    {
      key: "s_no",
      label: "S no.",
    },
    {
      key: "zone_name",
      label: "Zone",
    },
    {
      key: "sub_parameter_weighted_average_6",
      label: `${date6}`,
    },
    {
      key: "sub_parameter_weighted_average_5",
      label: `${date5}`,
    },
    {
      key: "sub_parameter_weighted_average_4",
      label: `${date4}`,
    },
    {
      key: "sub_parameter_weighted_average_3",
      label: `${date3}`,
    },
    {
      key: "sub_parameter_weighted_average_2",
      label: `${date2}`,
    },
    {
      key: "sub_parameter_weighted_average_1",
      label: `${date1}`,
    },
  ];

  const userDatacustoms = [];
  const maxLengthcustoms = Math.max(datacustoms1.length, datacustoms2.length, datacustoms3.length, datacustoms4.length, datacustoms5.length, datacustoms6.length);
  // Loop through all indices up to the maximum length
  for (let i = 0; i < maxLengthcustoms; i++) {
    userDatacustoms.push({
      s_no: datacustoms1[i]?.s_no || null,  // Access s_no from data1
      zone_name: datacustoms1[i]?.zone_name || null,  // Access zone_name from data1
      sub_parameter_weighted_average_1: datacustoms1[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data1
      sub_parameter_weighted_average_2: datacustoms2[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data2
      sub_parameter_weighted_average_3: datacustoms3[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data3
      sub_parameter_weighted_average_4: datacustoms4[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data4
      sub_parameter_weighted_average_5: datacustoms5[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data5
      sub_parameter_weighted_average_6: datacustoms6[i]?.sub_parameter_weighted_average || null,  // Handle missing data for data6
    });
  }
  console.log("usersdata", userDatacustoms);


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
  //   // Prepare data for export based on selectedOption and potentially other filters
  //   const exportData = userData.map((user) => ({
  //     // Customize object properties to match desired format
  //     "S no.": user.s_no,
  //     "Zone Name": user.zone_name,
  //     "Febraury (2024)": user.Febraury,
  //     "March (2024)": user.March,
  //     "April (2024)": user.April,
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
    const exportData = selectedOption === "CGST" ? userData : userDatacustoms;

    // Dynamically generate months in reverse order from the selected date (November 2023, December 2023, ...)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = dayjs(selectedDate).subtract(i, 'month');
      months.push(monthDate.format("MMMM YYYY"));  // e.g., 'November 2023', 'December 2023'
    }

    // Prepare data for export based on the months
    const dataToExport = exportData.map((user) => {
      const monthData = {};

      // Loop over the months array to dynamically add each month's value
      months.forEach((month, index) => {
        // Dynamically match data for each month
        const dataField = `sub_parameter_weighted_average_${6 - index}`;  // Subtract index to align months correctly
        monthData[month] = user[dataField] || "N/A";  // Assign "N/A" if the data is missing
      });

      return {
        "S no.": user.s_no,
        "Zone Name": user.zone_name,
        ...monthData,  // Spread the dynamically created month data
      };
    });

    return dataToExport;
  };

  const exportToXLS = () => {
    const data = handleExport();  // Get the prepared export data
    const ws = XLSX.utils.json_to_sheet(data);  // Convert to worksheet
    const wb = XLSX.utils.book_new();  // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Scores");  // Append to workbook
    const fileName = selectedOption === "CGST" ? "cgst_comparative_report.xlsx" : "customs_comparative_report.xlsx";  // Dynamic filename
    XLSX.writeFile(wb, fileName);  // Download the file
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
                <h3>Comparative Report (Score)</h3>
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
                  {/* <input
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
                  /> */}
                  {/* <label htmlFor="switchZones">Zones</label> */}
                  {/* <label htmlFor="switchCommissionerate">Commissionerate</label> */}
                  {/* <div className="switch-wrapper2"> */}
                  {/* <div className="switch2">
                      <div>Zones</div>
                      <div>Commissionerate</div> */}
                  {/* </div>
                  </div> */}
                </div>
              </div>
            </div>
            {selectedOption === "CGST" ? (
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
                    items={userData}
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
            ) : (
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
                    columns={columnscustoms}
                    columnSorter
                    items={userDatacustoms}
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
            )}
            <div className="row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparativeReport;
