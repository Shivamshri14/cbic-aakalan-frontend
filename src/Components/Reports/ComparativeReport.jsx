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

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const [response, setResponse] = useState(null);

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  const date1 = dayjs(newdate).format("MMMM YYYY");

  const previousmonth1 = dayjs(selectedDate)
  .subtract(1, "month")
  .format("YYYY-MM-DD");
  const date2 = dayjs(previousmonth1).format("MMMM YYYY");

const previousmonth2 = dayjs(selectedDate)
  .subtract(2, "month")
  .format("YYYY-MM-DD");
  const date3 = dayjs(previousmonth2).format("MMMM YYYY");

  console.log("newdate",newdate);
  console.log("date1",date1);
  console.log("previousmonth1",previousmonth1);
  console.log("previousmonth2",previousmonth2);

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
      const endpoints = [
        "returnFiling",
        // "scrutiny/assessment",
        "adjudication",
        "adjudication(legacy cases)",
        "refunds",
        "appeals",
      ];

      const responses1 = await Promise.all(
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

      const responses2 = await Promise.all(
        endpoints.map((endpoint) =>
          apiClient
            .get(`/cbic/t_score/${endpoint}`, {
              params: { month_date: previousmonth1, type: "parameter" },
            })
            .then((response) => ({
              data: response.data,
              parameter: endpoint.toUpperCase(),
            }))
        )
      );

      const responses3 = await Promise.all(
        endpoints.map((endpoint) =>
          apiClient
            .get(`/cbic/t_score/${endpoint}`, {
              params: { month_date: previousmonth2, type: "parameter" },
            })
            .then((response) => ({
              data: response.data,
              parameter: endpoint.toUpperCase(),
            }))
        )
      );
      
      if (responses1 && responses2 && responses3) {
        setloading(false);
      }

      console.log("Response1",responses1);
      const allData1 = responses1.flatMap((response) =>
        response.data.map((item) => ({ ...item }))
      );
      console.log("allData1",allData1);

      const summedByZone1 = allData1.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = (item.ra==="Adjudication")?item.totalScore:
        (item.ra==="Appeals")?item.parameter_wise_weighted_average:item.sub_parameter_weighted_average|| 0; // Default to 0 if missing

        // If zone_code is encountered for the first time, initialize it
        if (!acc[zoneCode]) {
          acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
        }

        // Sum only the sub_parameter_weighted_average for each zone_code
        acc[zoneCode].sub_parameter_weighted_average+= value;

        return acc;
      }, {});

      const reducedAllData1 = Object.values(summedByZone1);

      console.log("Reduced All Data:", reducedAllData1);
      const sorted1 = reducedAllData1.sort(
        (a, b) =>
          a.zone_code - b.zone_code
      );
      console.log("Sorted1", sorted1);


      
      const allData2 = responses2.flatMap((response) =>
        response.data.map((item) => ({ ...item }))
      );
      const summedByZone2 = allData2.reduce((acc, item) => {
        const zoneCode = item.zone_code;
        const value = (item.ra==="Adjudication")?item.totalScore:
        (item.ra==="Appeals")?item.parameter_wise_weighted_average: item.sub_parameter_weighted_average || 0; // Default to 0 if missing

        // If zone_code is encountered for the first time, initialize it
        if (!acc[zoneCode]) {
          acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
        }

        // Sum only the sub_parameter_weighted_average for each zone_code
        acc[zoneCode].sub_parameter_weighted_average += value;

        return acc;
      }, {});

      const reducedAllData2 = Object.values(summedByZone2);

      console.log("Reduced All Data:", reducedAllData2);
      const sorted2 = reducedAllData2.sort(
        (a, b) =>
          a.zone_code - b.zone_code
      );
      console.log("Sorted2", sorted2);


      const allData3 = responses3.flatMap((response) =>
        response.data.map((item) => ({ ...item }))
      );
      const summedByZone3 = allData3.reduce((acc, item) => {
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

      const reducedAllData3 = Object.values(summedByZone3);

      console.log("Reduced All Data:", reducedAllData3);
      const sorted3 = reducedAllData2.sort(
        (a, b) =>
          a.zone_code - b.zone_code
      );
      console.log("Sorted3", sorted3);

      setData1(sorted1.map((item,index)=>({...item, s_no:index+1})));
      setData2(sorted2.map((item,index)=>({...item, s_no:index+1})));
      setData3(sorted3.map((item,index)=>({...item, s_no:index+1})));

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
      key: "s_no",
      label: "S no.",
    },
    {
      key: "zone_name",
      label: "Zone",
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

  const userData=[
    {
    s_no: data1.map(item=>item.s_no)[0],
    zone_name: data1.map(item=>item.zoneName)[0],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[0],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[0],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[0],
  },
  {
    s_no: data1.map(item=>item.s_no)[1],
    zone_name: data1.map(item=>item.zoneName)[1],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[1],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[1],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[1],
  },
  {
    s_no: data1.map(item=>item.s_no)[2],
    zone_name: data1.map(item=>item.zoneName)[2],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[2],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[2],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[2],
  },
  {
    s_no: data1.map(item=>item.s_no)[3],
    zone_name: data1.map(item=>item.zoneName)[3],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[3],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[3],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[3],
  },
  {
    s_no: data1.map(item=>item.s_no)[4],
    zone_name: data1.map(item=>item.zoneName)[4],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[4],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[4],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[4],
  },
  {
    s_no: data1.map(item=>item.s_no)[5],
    zone_name: data1.map(item=>item.zoneName)[5],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[5],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[5],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[5],
  },
  {
    s_no: data1.map(item=>item.s_no)[6],
    zone_name: data1.map(item=>item.zoneName)[6],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[6],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[6],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[6],
  },
  {
    s_no: data1.map(item=>item.s_no)[7],
    zone_name: data1.map(item=>item.zoneName)[7],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[7],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[7],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[7],
  },
  {
    s_no: data1.map(item=>item.s_no)[8],
    zone_name: data1.map(item=>item.zoneName)[8],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[8],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[8],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[8],
  },
  {
    s_no: data1.map(item=>item.s_no)[9],
    zone_name: data1.map(item=>item.zoneName)[9],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[9],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[9],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[9],
  },
  {
    s_no: data1.map(item=>item.s_no)[10],
    zone_name: data1.map(item=>item.zoneName)[10],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[10],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[10],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[10],
  },
  {
    s_no: data1.map(item=>item.s_no)[11],
    zone_name: data1.map(item=>item.zoneName)[11],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[11],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[11],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[11],
  },
  {
    s_no: data1.map(item=>item.s_no)[12],
    zone_name: data1.map(item=>item.zoneName)[12],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[12],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[12],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[12],
  },
  {
    s_no: data1.map(item=>item.s_no)[13],
    zone_name: data1.map(item=>item.zoneName)[13],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[13],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[13],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[13],
  },
  {
    s_no: data1.map(item=>item.s_no)[14],
    zone_name: data1.map(item=>item.zoneName)[14],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[14],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[14],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[14],
  },
  {
    s_no: data1.map(item=>item.s_no)[15],
    zone_name: data1.map(item=>item.zoneName)[15],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[15],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[15],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[15],
  },
  {
    s_no: data1.map(item=>item.s_no)[16],
    zone_name: data1.map(item=>item.zoneName)[16],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[16],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[16],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[16],
  },
  {
    s_no: data1.map(item=>item.s_no)[17],
    zone_name: data1.map(item=>item.zoneName)[17],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[17],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[17],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[17],
  },
  {
    s_no: data1.map(item=>item.s_no)[18],
    zone_name: data1.map(item=>item.zoneName)[18],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[18],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[18],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[18],
  },
  {
    s_no: data1.map(item=>item.s_no)[19],
    zone_name: data1.map(item=>item.zoneName)[19],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[19],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[19],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[19],
  },
  {
    s_no: data1.map(item=>item.s_no)[20],
    zone_name: data1.map(item=>item.zoneName)[20],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[20],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[20],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[20],
  },
  {
    s_no: data1.map(item=>item.s_no)[21],
    zone_name: data1.map(item=>item.zoneName)[21],
    sub_parameter_weighted_average_1: data1.map(item=>item.sub_parameter_weighted_average)[21],
    sub_parameter_weighted_average_2: data2.map(item=>item.sub_parameter_weighted_average)[21],
    sub_parameter_weighted_average_3: data3.map(item=>item.sub_parameter_weighted_average)[21],
  }

]

  console.log("usersdata",userData);

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
    const exportData = userData.map((user) => ({
      // Customize object properties to match desired format
      "S no.": user.s_no,
      "Zone Name": user.zone_name,
      "Febraury (2024)": user.Febraury,
      "March (2024)": user.March,
      "April (2024)": user.April,
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
            <div className="row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparativeReport;
