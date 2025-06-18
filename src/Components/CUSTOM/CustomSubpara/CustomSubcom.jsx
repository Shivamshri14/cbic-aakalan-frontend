import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";

import { CAvatar, CBadge, CButton, CCardBody, CCollapse } from "@coreui/react";

import { CSmartTable } from "@coreui/react-pro";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import apiClient from "../../../Service/ApiClient";
import Spinner from "../../Spinner";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
var relevantAspects;
var zonename;
var type;

const CustomSubcom = ({ selectedDate, onChangeDate }) => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState(null);
  const [value2, setValue] = useState(
    dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  console.log("test-hello", value2);

  const handleChangeDate = (value) => {
    onChangeDate(value);
  };
  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code } = queryParams;
  const { type } = queryParams;
  const [loading, setloading] = useState(true);

  // back button move one step back
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const fetchData = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/custom/${name}`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "commissary",
        },
      });

      // setTimeout(()=>{
      if (response) {
        setloading(false);
      }
      // },3000)

      console.log("val12345677", response);

      // Extract the relevant_aspect value from each item in the response data
      relevantAspects = response.data.map((item) => item.relevant_aspect)[0];
      zonename = response.data.map((item) => item.zone_name)[0];

      // Log the relevant_aspect values to the console
      console.log("relevant_aspect values:", relevantAspects);

      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      // Log the fetched data to the console
      console.log("hello", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  // Call fetchData when the component mounts or when the name parameter changes
  useEffect(() => {
    if (name) {
      fetchData(name);
    }
  }, [name, newdate]); // Empty dependency array indicates that this effect runs only once

  const [selectedOption, setSelectedOption] = useState("Zones");

  // const [value2, setValue] = React.useState(dayjs());
  // console.log(value2);
  // const formattedDate = value2 ? value2.format('MM YYYY') : '';
  // console.log("val123",formattedDate);

  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const columns = [
    {
      key: "s_no",
      label: "S.No.",
      field: "s_no",
    },

    {
      key: "commissionerate_name",
      label: "Commissionerate",
      field: "commissionerate_name",
      filter: false,
      sorter: false,
      render: (value) => {
        if ((value = "GST 1A")) {
          return <Link to="/custom">{value}</Link>;
        } else {
          return value;
        }
      },
    },
    {
      key: "zone_name",
      label: "Zone",
      field: "zone_name",
      style: { textAlign: "left" },
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Value",
    //   field: "absolute_value",
    // },
    {
      key: "total_score",
      label: "Percentage for the month",
      field: "total_score",
    },
    {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    },
    // {
    //   key: "insentavization",
    //   label: "Incentivisation",
    // },
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted Average",
    // },
  ];
  switch (name) {
    case "cus1":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Refund Pending > 90 days/total application refund",
      });
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 10)",
      });
      break;
    case "cus2a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Notices issued/EO fulfilment time is over",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus2b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "No revenue protective measures/EO fulfillment time is over",
      });
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 4)",
      });
      break;
    case "cus2c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Duty recovered/duty involved in expired licenses (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus3a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Notices issued/EO time is over",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus3b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "No revenue protective measures/EO fulfillment time is over",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;

    case "cus3c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Duty recover/duty involved in expired licenses (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus4a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "(Non SVB)>6 months PD/total PA",
      });
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus4b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "(Non SVB)>6 months PD bonds/total PD bonds",
      });
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 3)",
      });

      break;
    case "cus4c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Svb finalised/Pending beginning of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;
    case "cus4d":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Svb pending > 1 year/total pending",
      });
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 1)",
      });

      break;
    case "cus5a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases disposed/Cases pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });

      break;
    case "cus5b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases Pending > 1 yr/total pending cases)",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 4)",
      });

      break;
    case "cus5c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ cases where duty involved >1 cr Pending for > 1 yr/total pending cases ",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });

      break;
    case "cus6a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Investigation completed/Investigation pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2 )",
      });

      break;
    case "cus6b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Cases pending > 2 years/total pending",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });

      break;
    case "cus6c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Detection/Revenue collected (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });
      break;
    case "cus6d":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Recovery/Detection(In lakh)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 1)",
      });

      break;
    case "cus6e":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Outright smuggling cases of disposed/pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 1)",
      });
      break;
    case "cus6f":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Commercial fraud cases of disposed/pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });

      break;
    // case "cus9a":
    //   columns.splice(3, 0, {
    //     key: "absolutevale",
    //     label: "Gold disposed/ripe for disposal at start of month",
    //   });
    //   columns.splice(6, 0, {
    //     key: "insentavization",
    //     label: "Incentivisation",
    //   });
    //   columns.splice(7, 0, {
    //     key: "sub_parameter_weighted_average",
    //     label: "Weighted Average (out of 5)",
    //   });
    //   break;
    case "cus7a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Not launched in 2 months of sanction/total sanction",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 6)",
      });

      break;
    case "cus7b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Prosecution launched/arrests",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 4)",
      });
      break;
    case "cus8a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Disposal of packages/pending start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus8b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Pending > 6 month/total pending",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus9a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Gold disposed/ripe for disposal at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus9b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Confiscated narcotics disposed/confiscated narcotics at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus12a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Appeal Cases disposed/pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus12b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Pending > 1 years/total pending",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus11a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "No action on expired bonds/total expired W/H bonds",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus11b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Duty recovered/duty involved in W/H bonds (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus10a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Arrears recovered/target upto the month (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
    case "cus10b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Arrears pending > 1 yr /total pending (In lakhs)",
      });
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;

      case "cus13a":
      columns.splice(6,0,{
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "BEs audited/marked",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;
      case "cus13b":
      columns.splice(6,0,{
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "SBs audited/marked",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

      case "cus13c":
      columns.splice(6,0,{
        key: "insentavization",
        label: "Incentivisation",
      });
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Recovered/detected(In lakhs)",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "cus13d":
      // columns.splice(6,0,{
      //   key: "insentavization",
      //   label: "Incentivisation",
      // });
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "BEs pending>6 months / total BEs pending",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;


    case "cus13e":
      // columns.splice(6,0,{
      //   key: "insentavization",
      //   label: "Incentivisation",
      // });
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "SBs Pending > 6 months / total SBs pending",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    default:
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;
  }

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
      plottooltext: "Percentage:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data: data.map((item, index) => ({
      label: item.commissionerate_name,
      value: item.total_score,
      color: colorstopzone[index % colorstopzone.length],
    })),
  };

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData =
      data.map((user) => ({
        // Customize object properties to match desired format
        SNo: user.s_no,
        "Commissionerate": user.commissionerate_name,
        "Zone": user.zone_name,
        "Absolute Value": user.absolutevale,
        "Total Score(For the Month) %": user.total_score,
        "Way to Grade (Marks) Out of 10": user.way_to_grade,
        "Weighted Average ": user.sub_parameter_weighted_average,
      }))

    return exportData;
  };

  const exportToXLS = () => {
    const data = handleExport();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    const rowHeights = [70, 200, 200, 150, 150, 150, 150, 150];

    for (let i = 0; i < rowHeights.length; i++) {
      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'][i] = { wpx: rowHeights[i] };

      for (let j = 0; j < rowHeights[i].length; j++) {
        const cell = ws[XLSX.utils.encode_cell({ c: i, r: j })];

        if (cell) {
          cell.s = {
            alignment: {
              horizontal: "center",
              vertical: "center"
            }
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "my_data.xlsx");
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
                <div className="lft-box col-md-11">
                  <div className="mid-sec">
                    <div className="card-white">
                      <p>{relevantAspects}</p>
                    </div>
                  </div>
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
                        value={selectedDate} // Set value to `value2` state
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                        shouldDisableYear={shouldDisableYear} // Disable years less than 2022
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
            </div>

            {name === "cus1" || name === "cus2a" || name === "cus2b" || name === "cus2c" || name === "cus3a" || name === "cus3b" || name === "cus3c" || name === "cus3c" ||
              name === "cus4a" || name === "cus4b" || name === "cus4c" || name === "cus4d" ||
              name === "cus5a" || name === "cus5b" || name === "cus5c" || name === "cus6a" || name === "cus6b" || name === "cus6c"
              || name === "cus6d" || name === "cus6e" || name === "cus6f" || name === "cus7a" || name === "cus7b" || name === "cus8a" || name === "cus8b" || name === "cus9a" || name === "cus9b"
              || name === "cus11a" || name === "cus11b" || name === "cus12a" || name === "cus10a" || name === "cus10b" || name === "cus12b"|| name === "cus13a"|| name === "cus13b"|| name === "cus13c"|| name === "cus13d" || name === "cus13e"? (
              <div className="row custom-tb mb col">
                <div className="container mt-2">
                  <div className="card">
                    <div className="card-header">
                      <strong>{data.map((item) => item.zone_name)[0]}</strong>
                    </div>
                    <div className="card-body">
                      <div id="chart">
                        <div className="responsive-chart main-chart">
                          <ReactFusioncharts
                            type="column3d"
                            width="100%"
                            height="500"
                            dataFormat="JSON"
                            dataSource={top5}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="export-btn">
                  <button
                    onClick={exportToXLS}
                    className="btn btn-primary m-3"
                  >
                    Export XLS
                  </button>
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
                  scopedColumns={{
                    avatar: (item) => (
                      <td>
                        <CAvatar src={`/images/avatars/${item.avatar}`} />
                      </td>
                    ),
                    status: (item) => (
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status}
                        </CBadge>
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
                            <p className="text-muted">
                              User since: {item.registered}
                            </p>
                            <CButton size="sm" color="info">
                              User Settings
                            </CButton>
                            <CButton
                              size="sm"
                              color="danger"
                              className="ml-1"
                            >
                              Delete
                            </CButton>
                          </CCardBody>
                        </CCollapse>
                      );
                    },
                  }}
                  sorterValue={{ column: "status", state: "asc" }}
                  tableFilter
                  tableProps={{
                    className: "add-this-class",
                    responsive: true,
                    //striped: true,
                    hover: true,
                    align: "middle",
                    border: "primary",
                  }}
                  onKeyDown={(e) => checkSpecialChar(e)}
                />
              </div>
            ) :
              (
                <>
                  <div className="box-main bg-blue">
                    <div className="row  custom-tb mb">
                      <div className="export-btn">
                        <button onClick={exportToXLS} className="btn btn-primary m-3">
                          Export XLS
                        </button>
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
                        scopedColumns={{
                          avatar: (item) => (
                            <td>
                              <CAvatar src={`/images/avatars/${item.avatar}`} />
                            </td>
                          ),
                          status: (item) => (
                            <td>
                              <CBadge color={getBadge(item.status)}>
                                {item.status}
                              </CBadge>
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
                                  <p className="text-muted">
                                    User since: {item.registered}
                                  </p>
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
                        }}
                        sorterValue={{ column: "status", state: "asc" }}
                        tableFilter
                        tableProps={{
                          className: "add-this-class",
                          responsive: true,
                          //striped: true,
                          hover: true,
                          align: "middle",
                          border: "primary",
                        }}
                        onKeyDown={(e) => checkSpecialChar(e)}
                      />
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </div>
      )}
    </>
  );
};

export default CustomSubcom;
