import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
import queryString from "query-string";
import apiClient from "../../../Service/ApiClient";
import Spinner from "../../Spinner";

const AllSubParameters = ({
  selectedDate,
  onChangeDate,
  onSelectedOption1,
  selectedOption1,
}) => {
  const [toggle, setToggle] = useState(true);
  const [loading, setloading] = useState(true);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [details, setDetails] = useState([]);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("Zones");
  const [bardata, setBarData] = useState([]);
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };
  const [value2, setValue] = useState(
    dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const handleClick = (event) => {
    setToggle(!toggle);

    if (toggle) {
      setloading(true);
    } else {
      setloading(true);
    }

    onSelectedOption1(event.target.value);
    console.log(event.target.value);
  };

  const fetchData = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/${name}`, {
        params: {
          month_date: newdate,
          type: "zone",
        },
      });
      console.log("url", response);

      // setTimeout(()=>{
      if (response) {
        setloading(false);
      }
      // },3000);

      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      const sorted = response.data.sort(
        (a, b) => b.total_score - a.total_score
      );
      setData(sorted);

      if (name==="gst1c"||name==="gst1d"|| name==="gst1e"|| name==="gst1f"||name==="gst5b"||name==="gst6b"||name==="gst4b"||name==="gst6d"
        ||name==="gst11b"||name==="gst8b"||name==="gst9a"||name==="gst11d"|| name==="gst2"||name==="gst7"||name==="gst10b"||name==="gst1b") {
        const sorted = response.data.sort(
          (a, b) => a.total_score - b.total_score
        );
        setData(sorted);
      }

      // Log the fetched data to the console
      console.log("hello12345678", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  const fetchDatacomm = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/${name}`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });
      console.log("url", response);

      // setTimeout(()=>{
      if (response) {
        setloading(false);
      }
      // },3000);

      const sorted = response.data.sort(
        (a, b) => b.total_score - a.total_score
      );
      setData(sorted);

      if (name==="gst1c"||name==="gst1d"|| name==="gst1e"|| name==="gst1f"||name==="gst5b"||name==="gst6b"||name==="gst4b"||name==="gst6d"
        ||name==="gst11b"||name==="gst8b"||name==="gst9a"||name==="gst11d"||name==="gst7"||name==="gst2"||name==="gst10b"|| name==="gst1b") {
        const sorted = response.data.sort(
          (a, b) => a.total_score - b.total_score
        );
        setData(sorted);
      }

      // Set the fetched data in the component's state
      // setData(
      //   response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      // );

      // Log the fetched data to the console
      console.log("hello12345678", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    if (selectedOption1 === "Zones") {
      fetchData(name);
    } else {
      fetchDatacomm(name);
    }
  }, [name, newdate, selectedOption1]);

  charts(FusionCharts);
  Zune(FusionCharts);

  const getBarColor = (index) => {
    if (index < 5) {
      return "#00FF00"; // First 5 bars
    } else if (index >= 5 && index < 10) {
      return "#FFFF00"; // Next 5 bars
    } else if (index >= data.length - 5) {
      return "#FF0000"; // Next 5 bars
    } else {
      return "#0000FF"; // Last 5 bars
    }
  };

  const getBarColorComm = (index) => {
    const total = data.length;
    const firstQuarter = total * 0.25;
    const secondQuarter = total * 0.5;
    const thirdQuarter = total * 0.75;

    return index < firstQuarter
      ? "#00FF00"
      : index < secondQuarter
      ? "#FFFF00"
      : index < thirdQuarter
      ? "#0000FF"
      : "#FF0000";
  };

  // const colorsallzones=["#00FF00","#FFFF00","#0000FF","#FF0000"];

  function calculateAverage(data) {
    const totalScores = data.map((item) => item.total_score);

    if (totalScores.length === 0) {
      return 0; // Handle the case with no data
    }

    const sum = totalScores.reduce((acc, score) => acc + score, 0);
    return sum / totalScores.length;
  }

  const average = calculateAverage(data);

  function formatString(input) {
    const withSpace = input.replace(/([a-z])([A-Z])/g, "$1 $2");

    const capitalized = withSpace
      .toLowerCase()
      .split(" ")
      .map((word) => word.toUpperCase())
      .join(" ");
    return capitalized;
  }

  const allzones = {
    chart: {
      caption: selectedOption1 === "Zones"
          ? "All Zones"
          : "All Commissionerates",
      yaxisname: "Percentage",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "Zone Name:$label</b>{br}Percentage:$value"
          : "Commissionerate Name:$label</b>{br}Percentage:$value",
      useRoundEdges: "1",
      theme: "zune",
      interactiveLegend: false,
    },
    categories: [
      {
        category:
          selectedOption1 === "Zones"
            ? data.map((index) => ({ label: index.zone_name }))
            : data.map((index) => ({ label: index.commissionerate_name })),
      },
    ],
    dataset: [
      {
        data: data.map((item, index) => ({
          label:
            selectedOption1 === "Zones"
              ? item.zone_name
              : item.commissionerate_name,
          value: item.total_score,
          color:
            selectedOption1 === "Zones"
              ? getBarColor(index)
              : getBarColorComm(index),
        })),
      },
    ],
    annotations: {
      groups: [],
    },
  };

  if (
    name === "gst1a" ||
    name === "gst1b" ||
    name === "gst1c" ||
    name === "gst1d" ||
    name === "gst1e" ||
    name === "gst1f" ||
    name === "gst2"  ||
    name === "gst3a" ||
    name === "gst3b" ||
    name === "gst4a" ||
    name === "gst4b" ||
    name === "gst4c" ||
    name === "gst4d" ||
    name === "gst5a" ||
    name === "gst6a" ||
    name === "gst6b" ||
    name === "gst6c" ||
    name === "gst6d" ||
    name === "gst7"  ||
    name === "gst8a" ||
    name === "gst8b" ||
    name === "gst9a" ||
    name === "gst9b" ||
    name === "gst11a"||
    name === "gst11b"||
    name === "gst11c"||
    name === "gst11d"||
    name === "gst10a"||
    name === "gst10b"||
    name === "gst10c"||
    name === "gst5b"
  ) {
    allzones.dataset.push({
      seriesname:
        name === "gst1a"
          ? "NATIONAL AVERAGE (Application cleared within 7 days)"
          : name === "gst1b"
          ? "NATIONAL AVERAGE (Pendency of PV in(30 days))"
          : name === "gst1c"
          ? "NATIONAL AVERAGE (Deemed Registration)"
          : name === "gst1d"
          ? "NATIONAL AVERAGE (Registration application pending)"
          : name === "gst1e"
          ? "NATIONAL AVERAGE (Reg pending for cancellation)"
          : name === "gst1f"
          ? "NATIONAL AVERAGE (Reg pending for revocation)"
          : name === "gst2"
          ? "NATIONAL AVERAGE (Return due but not filed (Monthly))"
          : name === "gst3a"
          ? "NATIONAL AVERAGE (Scrutiny Completed/Pending)"
          : name === "gst3b"
          ? "NATIONAL AVERAGE (% Recovery/Detection)"
           : name === "gst4a"
          ? "NATIONAL AVERAGE (Investigation completed)"
          : name === "gst4b"
          ? "NATIONAL AVERAGE (Pending > 1 year)"
          : name === "gst4c"
          ? "NATIONAL AVERAGE (Detection/Revenue collected)"
          : name === "gst4d"
          ? "NATIONAL AVERAGE (Recoveries/Dectection (in lakhs))"
          : name === "gst5a"
          ? "NATIONAL AVERAGE (% Cases Disposed in the Month)"
          : name === "gst5b"
          ? "NATIONAL AVERAGE (Time left for adjudication < 6 month )"
          : name === "gst6a"
          ? "NATIONAL AVERAGE (Disposal of cases (ST))"
          : name === "gst6b"
          ? "NATIONAL AVERAGE (Pending > 1 year(ST))"
          : name === "gst6c"
          ? "NATIONAL AVERAGE (Disposal of cases (C.Ex))"
          : name === "gst6d"
           ? "NATIONAL AVERAGE (Disposal of cases (C.Ex))"
          : name === "gst7"
          ? "NATIONAL AVERAGE (Refunds pending > 60 days/Total refund pending)"
          : name === "gst8a"
          ? "NATIONAL AVERAGE (Arrears recoverable/Target up to the month)"
          : name === "gst8b"
          ? "NATIONAL AVERAGE (Arrears pending > 1 year)"
          : name === "gst9a"
          ? "NATIONAL AVERAGE (Prosecution not launched in 2 months/Prosecution sanctioned)"
           : name === "gst9b"
          ? "NATIONAL AVERAGE (Prosecution launched/Arrests made)"
          : name === "gst10a"
          ? "NATIONAL AVERAGE (Taxpayer audited/Total taxpayer allotted)"
          : name === "gst10b"
          ? "NATIONAL AVERAGE (Audit Paras >6 months/Total audit paras pending)"
          : name === "gst10c"
          ? "NATIONAL AVERAGE (Recoveries/Detections in Lakhs)"
          : name === "gst11a"
          ? "NATIONAL AVERAGE (Disposal of commissioner appeals cases)"
          : name === "gst11b"
          ? "NATIONAL AVERAGE (Commissioner appeals cases pending > 1 year)"
          : name === "gst11c"
          ? "NATIONAL AVERAGE (disposal of ADJ/JC appeals cases)"
          : name === "gst11d"
          ? "NATIONAL AVERAGE (ADJ/JC appeals cases)"
          : `NATIONAL AVERAGE ${formatString(name)}`,
      renderAs: "Line",
      data: data.map(() => ({ value: average })),
      lineThickness: "5",
      color: "#ff0000",
      alpha: "100",
      drawAnchors: "0",
    });

    allzones.annotations.groups.push({
      items: [
        {
          id: "avg-text",
          type: "text",
          text: `<strong>National Average:</strong> ${average.toFixed(3)}`,
          align: "left",
          valign: "bottom",
          x:
            name === "gst5b" ||
            name === "gst1c" ||
            name === "gst1d" ||
            name === "gst1e" ||
            name === "gst1f" ||
            name === "gst6b"||name==="gst6d"|| name==="gst11b"||name==="gst11d"
              ? "$canvasStartX + $chartLeftMargin + 10"
              : "$canvasEndX + $chartRightMargin - 285",
          y:
            name === "gst5b" ||
            name === "gst1c" ||
            name === "gst1d" ||
            name === "gst1e" ||
            name === "gst1f" ||
            name === "gst6b"|| name==="gst6d"||name==="gst11b"||name==="gst11d"
              ? "$canvasStartY+10"
              : "$canvasStartY",
          scaleText: "1",
          fontSize: "22",
          color: "#ff0000",
        },
      ],
    });
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div class="body flex-grow-1">
          <div className="row">
            <div className="msg-box">
              <div className="lft-box">
                {selectedOption1 === "Zones" ? (
                  <h2>All Zones</h2>
                ) : (
                  <h2>All Commissionerates</h2>
                )}
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
          <div className="row">
            <div className="top-date-sec">
              <div className="top-date-lft">
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
                          field:{
                            readOnly:true
                          }
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className="top-date-rgt">
                <div className="switches-container">
                  <input
                    type="radio"
                    id="switchMonthly"
                    name="switchPlan"
                    value="Zones"
                    onChange={handleClick}
                    checked={selectedOption1 === "Zones"}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    onChange={handleClick}
                    value="Commissionerate"
                    checked={selectedOption1 === "Commissionerate"}
                  />
                  <label htmlFor="switchMonthly">Zones</label>
                  <label htmlFor="switchYearly">Commissionerate</label>
                  <div className="switch-wrapper">
                    <div className="switch">
                      <div>Zones</div>
                      <div>Commissionerate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="text-center zone-heading">
              {name === "gst3a" ? (
                <h3>% Scrutiny Completed</h3>
              ) : name === "gst3b" ? (
                <h3>% Recovery/Detection</h3>
              ) : name === "gst5a" ? (
                <h3>% Cases disposed in the Month/total cases pending</h3>
              ) : name === "gst5b" ? (
                <h3>Time left for adjudication &lt;6 month </h3>
              ) : name === "gst1a" ? (
                <h3>Application cleared within 7 days</h3>
              ) : name === "gst1b" ? (
                <h3>Pendency of PV in (30 days)</h3>
              ) : name === "gst1c" ? (
                <h3>Deemed Registration</h3>
              ) : name === "gst1d" ? (
                <h3>Registration application pending</h3>
              ) : name === "gst1d" ? (
                <h3>Registration application pending</h3>
              ) : name === "gst1e" ? (
                <h3>Reg Pending for cancellation</h3>
              ) : name === "gst1f" ? (  
                <h3>Reg Pending for revocation</h3>
              ) : name === "gst2" ? (
                <h3>Return due but not filed (Monthly)</h3>
              ) : name === "gst4a" ? (
                <h3>Investigation Completed</h3>
              ) : name === "gst4b" ? (
                <h3>Pending &gt; 1 year</h3>
              ) : name === "gst4c" ? (
                <h3>Detections/Revenue collected</h3> 
              ) : name === "gst4d" ? (
                  <h3>Recoveries/Detection (In Lakhs)</h3>
              ) : name === "gst6a" ? (
                <h3>Disposal of cases (ST)</h3>
              ) : name === "gst6b" ? (
                <h3>Pending &gt; 1 year(ST)</h3>
              ) : name === "gst6c" ? (
                <h3>Disposal of cases (C.Ex)</h3>
              ) : name === "gst6d" ? (
                <h3>Pending &gt; 1 year (C.Ex)</h3>
              ) : name === "gst7" ? (
                <h3>Refunds pending &gt; 60 days/Total refund pending</h3>
              ) : name === "gst8a" ? (
                <h3>Arrears recoverable/Target up to the month</h3>
              ) : name === "gst8b" ? (
                <h3>Arrears pending &gt; 1 year</h3>
              ) : name === "gst9b" ? (
                <h3>Prosecution launched/Total Arrest</h3>
              ) : name === "gst11a" ? (
                <h3>Disposal of Commissioner appeals cases</h3>
              ) : name === "gst9a" ? (
                <h3>Prosecution not launched in 2 months/Prosecution sanctioned</h3>
              ) : name === "gst11b" ? (
                <h3>Commissioner appeals cases pending &gt; 1 year</h3>
              ) : name === "gst11c" ? (
                <h3>Disposal of ADJ/JC appeals cases</h3>
              ) : name === "gst11d" ? (
                <h3>ADJ/JC appeals cases</h3>
              ) : name === "gst10a" ? (
                <h3>Taxpayer audited/Total taxpayer allotted</h3>
              ) : name === "gst10b" ? (
                <h3>Audit Paras &lt; 6 months/Total audit paras pending</h3>
              ) : name === "gst10c" ? (
                <h3>Recoveries/Detections in Lakhs</h3>
              ) : selectedOption1 === "Zones" ? (
                <h3>All Zones</h3>
              ) : (
                <h3>All Commissionerates</h3>
              )}
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 order-1 order-lg-1">
              <div className="card mb-4">
                <ReactFusioncharts
                  type="stackedcolumn3dline"
                  width="100%"
                  height="500"
                  dataFormat="JSON"
                  dataSource={allzones}
                />
              </div>
            </div>
          </div>
          {/* <div className="row">
          <div className="view-btn">
            <Link to="/">
              <Button variant="contained" className="ml-4">
                Back
              </Button>
            </Link>
          </div>
        </div> */}
        </div>
      )}
    </>
  );
};

export default AllSubParameters;
