import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CCardBody, CAvatar, CBadge, CButton, CCollapse } from "@coreui/react";
import GetAppIcon from "@mui/icons-material/GetApp";
import apiClient from "../../../Service/ApiClient";
import { CSmartTable } from "@coreui/react-pro";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { CSVLink } from "react-csv";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import Button from "@mui/material/Button";
import Spinner from "../../Spinner";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";

const CustomCommscoredetails = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  const [zoneName, setZoneName] = useState("");

  const [loading, setloading] = useState(true);

  const handleDateChange = (value) => {
    onChangeDate(value);
  };
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code } = queryParams;
  const { come_name } = queryParams;

  var relevantAspects;
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selected, setSelected] = useState("Commissionerate");
  const columns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: name === "export_obligation(AA)" || name === "epcg" || name === "disposal/pendency"|| name === "arrest_and_prosecution"||name ==="DisposalOfConfiscatedGoldAndNDPS" || name === "adjudication(legacy cases)" || name === "unclaimed_cargo" ? "zone_name" : "zoneName",
      label: "Zone",
    },
    {
      key: name === "export_obligation(AA)" || name === "epcg" || name === "disposal/pendency" || name === "arrest_and_prosecution"||name ==="DisposalOfConfiscatedGoldAndNDPS" || name === "adjudication(legacy cases)"  || name === "unclaimed_cargo" ? "commissionerate_name" : "commName",
      label: "Commissionerate",
    },
    {
      key: name === "export_obligation(AA)" || name === "epcg" || name === "disposal/pendency" || name === "arrest_and_prosecution"||name ==="DisposalOfConfiscatedGoldAndNDPS" || name === "adjudication(legacy cases)"  || name === "unclaimed_cargo" ? "gst" : "custom",
      label: "Sub Parameters",
    },
    {
      key: name === "export_obligation(AA)" || name === "epcg" || name === "disposal/pendency" || name === "arrest_and_prosecution"||name ==="DisposalOfConfiscatedGoldAndNDPS" || name === "adjudication(legacy cases)" || name === "unclaimed_cargo"  ? "absolutevale" : "absval",
      label: "Absolute Figures (N/D)",
    },
    {
      key: name === "export_obligation(AA)" || name === "epcg" || name === "disposal/pendency" || name === "arrest_and_prosecution"||name ==="DisposalOfConfiscatedGoldAndNDPS" || name === "adjudication(legacy cases)" || name === "unclaimed_cargo"  ? "total_score" : "totalScore",
      label: "Percentage for the month",
    },
    // {
    //   key: name === "export_obligation(AA)" || name === "epcg" ? "sub_parameter_weighted_average" : "subParameterWeightedAverage",
    //   label: "Score (Out of 10)",
    // },
    
    
    // Uncomment this if you need a column for Weighted Average
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted Average",
    // },
  ];
  

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchDatacomm = async (name) => {
    try {
      // Handle the case where name is neither "export_obligation(AA)", "epcg", "disposal/pendency", or "arrest_and_prosecution"
      if (name !== "export_obligation(AA)" && name !== "epcg" && name !== "disposal/pendency" && name !== "arrest_and_prosecution" && name !== "DisposalOfConfiscatedGoldAndNDPS" && name !== "adjudication(legacy cases)" && name !=="unclaimed_cargo") {
        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "come_name",
            zone_code: zone_code,
            come_name: come_name,
          },
        });
  
        if (response) {
          setloading(false);
        }
  
        console.log("Response", response);
        const commname = response.data.map((item) => item.commName);
        setZoneName(commname);
        console.log("Commissionerate Name:", commname);
        console.log("url", response);
  
        relevantAspects = (name === "investigation" ? "INVESTIGATION" : response.data.map((item) => item.ra)[0]);
        console.log("ra:", relevantAspects);
  
        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      // Handle "export_obligation(AA)" case
      else if (name === "export_obligation(AA)") {
        const cusendpoints = ["cus3a", "cus3b", "cus3c"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      // Handle "epcg" case
      else if (name === "epcg") {
        const cusendpoints = ["cus2a", "cus2b", "cus2c"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      // Handle "disposal/pendency" case
      else if (name === "disposal/pendency") {
        const cusendpoints = ["cus4a", "cus4b", "cus4c", "cus4d"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      // Handle "arrest_and_prosecution" case
      else if (name === "arrest_and_prosecution") {
        const cusendpoints = ["cus7a", "cus7b"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      else if (name === "DisposalOfConfiscatedGoldAndNDPS") {
        const cusendpoints = ["cus9a", "cus9b"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      else if (name === "adjudication(legacy cases)") {
        const cusendpoints = ["gst6a", "gst6b","gst6c", "gst6d"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
      else if (name === "unclaimed_cargo") {
        const cusendpoints = ["cus8a", "cus8b"];
  
        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );
  
        console.log("Response", responses);
  
        if (responses) {
          setloading(false);
        }
  
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item,
            gst: response.gst, // Adding the commissionerate name (gst) to each item
          }))
        );
        console.log("FINAL RESPONSE", allData);
  
        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code && item.commissionerate_name === come_name
        );
        console.log("Filtered Data by Zone Code and Commissionerate:", filteredData);
  
        if (filteredData.length === 0) {
          console.error("No data found for the specified zone_code and come_name");
          setloading(false);
        }
  
        setData(
          filteredData.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false); // Stop loading state on error
    }
  };
  
  
  
  
  

  useEffect(() => {
    if (name) {
      fetchDatacomm(name);
    }
  }, [name, newdate]);

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

  switch (name) {

    case "timelyrefunds":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 5)",
      });

      break;

    case "investigation":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 12)",
      });

      break;

    case "DisposalOfConfiscatedGoldAndNDPS":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 4)",
      });

      break;

      case "export_obligation(AA)":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 3)",
      });

      break;

    case "CommissionerAppeals":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 8)",
      });

      break;

      case "epcg":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 7)",
      });

      break;

    default:
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average",
      });

      break;
  }

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
      "S.No.": user.s_no,
      "Commissionerate Name": user.commName,
      "Zone Name": user.zoneName,
      "Total Commissionerate Score(For the Month)": user.totalScore,
      "Score Details": "Show",
      "Commissionerate Rank": user.zonal_rank,
    }));

    return exportData;
  };

  const scopedColumns = {
    avatar: (item) => (
      <td>
        <CAvatar src={`/images/avatars/${item.avatar}`} />
      </td>
    ),
    status: (item) => (
      <td>
        <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
      </td>
    ),
    show_details: (item) => {
      return (
        <td className="py-2">
          <CButton
            color="primary"
            variant="outline"
            shape="square"
            size="sm"
            onClick={() => {
              toggleDetails(item.id);
            }}
          >
            {details.includes(item.id) ? "Hide" : "Show"}
          </CButton>
        </td>
      );
    },
    details: (item) => {
      return (
        <CCollapse visible={details.includes(item.id)}>
          <CCardBody className="p-3">
            <h4>{item.username}</h4>
            <p className="text-muted">User since: {item.registered}</p>
            <CButton size="sm" color="info">
              User Settings
            </CButton>
            <CButton size="sm" color="danger" className="ml-1">
              Delete
            </CButton>
          </CCardBody>
        </CCollapse>
      );
    },
    gst: (item) => <td>{item.gst}</td>,
  };

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption: data.map((item) => item.zone_name)[0],
      yaxisname: "Percentage",
      xaxisname: "Commissionerates",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext: "Total Score:$value",
    },
    data: data.map((item, index) => ({
      label: `${item.commName}<br>(${item.gst})`,
      value: item.totalScore,
      color: colorstopzone[index % colorstopzone.length],
    })),
  };

  const checkSpecialChar = (e) => {
    if (!/[0-9a-zA-Z]/.test(e.key)) {
      e.preventDefault();
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="body flex-grow-1 custom-sec">
            <div className="row">
              <div className="msg-box">
                <div className="lft-box">
                  <h2>Commissionerate Score Details</h2>
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

              <div className="rgt-sec">
                <div className="switches-container2">
                  <input
                    type="radio"
                    id="switchMonthly"
                    name="switchPlan"
                    value="Zones"
                    checked={selected === "Zones"}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Commissionerate"
                    checked={selected === "Commissionerate"}
                    defaultChecked
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

            <div className="box-main bg-blue">
              <div className="row  custom-tb mb">
                <div className="export-btn">
                  <CSVLink
                    data={handleExport()}
                    filename="my_data.csv"
                    className="btn btn-primary m-3"
                  >
                    Export CSV
                  </CSVLink>
                </div>
                <CSmartTable
                  activePage={3}
                  cleaner
                  clickableRows={false}
                  columns={columns}
                  columnSorter
                  items={data}
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
                    className: "add-this-class custom-table",
                    responsive: true,
                    //striped: true,
                    hover: true,
                    align: "middle",
                    border: "primary",
                  }}
                  tableBodyProps={{
                    className: "align-middle",
                  }}
                  onKeyDown={(e) => checkSpecialChar(e)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomCommscoredetails;
