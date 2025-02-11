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

const AllCustomSubpara = ({
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
      const response = await apiClient.get(`/cbic/custom/${name}`, {
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

      if(name==="cus9a" || name==="cus12a" ||name==="cus2a"||name==="cus3a"||name==="cus3c"||name==="cus4c"|| name==="cus9b" || name==="cus5a" || 
      name==="cus6a"|| name==="cus6c" || name==="cus6d"|| name==="cus6e"|| name==="cus6f"|| name==="cus7b"|| name==="cus8a"|| name==="cus10a"|| name==="cus11b"){
      const sorted = response.data.sort(
        (a, b) => b.total_score - a.total_score
      );
      setData(sorted);
    }
    else{
      const sorted = response.data.sort(
        (a, b) => a.total_score - b.total_score);
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
      const response = await apiClient.get(`/cbic/custom/${name}`, {
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

    
      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      if(name==="cus9a"|| name==="cus12a"||name==="cus2a"||name==="cus3a"||name==="cus3c"||name==="cus4c"|| name==="cus9b" || 
        name==="cus5a" || name==="cus6a"|| name==="cus6c"|| name==="cus6d" || name==="cus6e"|| name==="cus6f"|| name==="cus7b"|| name==="cus8a"|| name==="cus10a"|| name==="cus11b" ) {
        const sorted = response.data.sort(
          (a, b) => b.total_score - a.total_score
        );
        setData(sorted);
      }
      else{
        const sorted = response.data.sort(
          (a, b) => a.total_score - b.total_score);
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
      caption:
      //  name==="cus9a"?"Gold disposed/Gold ripe for disposal":
      // name==="cus9b"?"Narcotics disposed/Pending for disposal":
      // name==="cus1"?"Pending > 90 days":
      // name==="cus2a"?"Notices issued Protective/EO fulfilment time is over":
      // name==="cus2b"?"No revenue protective measures/EO fulfillment time is over":
      // name==="cus5a"?"Disposal of cases":
      // name==="cus5b"?"Case pending > 1 year":
      // name==="cus5c"?"Case pending > 1 year(duty involved > 1 crore)":
      // name==="cus6a"?"Investigation completed":
      // name==="cus6b"?"Pending > 2 years":
      // name==="cus6c"?"Detections/Revenue collected":
      // name==="cus6d"?"Recovery/Detection":
      // name==="cus6e"?"Disposal of cases(outright smuggling)":
      // name==="cus6f"?"Disposal of cases(Commercial fraud)":
      // name==="cus12a"?"Appeals cases disposed/cases pending":
      // name==="cus12b"?"Cases pending > 1 year":
      selectedOption1 === "Zones"
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

  if (name==="cus9a"|| name==="cus1"||name==="cus2a"||name==="cus2b"||name==="cus2c"||name==="cus3a"||name==="cus3b"||
    name==="cus3c"||name==="cus4a"||name==="cus4b"||name==="cus4c"||name==="cus4d"||
     name==="cus5a"|| name==="cus5b"|| name==="cus5c"||name==="cus6a"|| name==="cus6b"||name==="cus6c"
    || name==="cus6d"||name==="cus6e"||name==="cus6f"||name==="cus7a"||name==="cus7b"||name==="cus8a"||name==="cus8b"|| name==="cus12a"
    || name==="cus9b" || name==="cus10a" ||name==="cus10b" ||name==="cus11a" || name==="cus11b" || name==="cus12a"||name==="cus12b") {
    allzones.dataset.push({
      seriesname: name==="cus9a"?"NATIONAL AVERAGE (Gold disposed/Gold ripe for disposal)"
      : name==="cus1"?"NATIONAL AVERAGE (Pending > 90 days)"
      : name==="cus2a"?"NATIONAL AVERAGE (Notices issued/EO fulfilment time is over)"
      : name==="cus2b"?"NATIONAL AVERAGE (No revenue protective measures/EO fulfillment time is over)"
      : name==="cus2c"?"NATIONAL AVERAGE (Duty recovered/duty inolved in expired license)"
      : name==="cus3a"?"NATIONAL AVERAGE (Notices issued/EO time is over)"
      : name==="cus3b"?"NATIONAL AVERAGE (No revenue protective measures/EO fulfillment time is over)"
      : name==="cus3c"?"NATIONAL AVERAGE (Duty recover/duty involved in expired licenses)"
      : name==="cus4a"?"NATIONAL AVERAGE (Non SVB)>6 months PA/total PA)"
      : name==="cus4b"?"NATIONAL AVERAGE (Non SVB)>6 months PD bonds/total PD bonds)"
      : name==="cus4c"?"NATIONAL AVERAGE (Svb finalised/Pending beginning of month)"
      : name==="cus4d"?"NATIONAL AVERAGE (Svb pending > 1 year/total pending)"
      : name==="cus5a"?"NATIONAL AVERAGE (% of adjudication of cases disposed)"
      : name==="cus5b"?"NATIONAL AVERAGE (Case pending > 1 year)"
      : name==="cus5c"?"NATIONAL AVERAGE (Case pending > 1 year (duty involved > 1 crore))"
      : name==="cus9b"?"NATIONAL AVERAGE (Confiscated narcotics disposed/pending for  disposal)"
      : name==="cus12a"?"NATIONAL AVERAGE (Appeal Cases disposed/pending at start of month)"
      : name==="cus12b"?"NATIONAL AVERAGE (Cases pending > 1 year/total pending)"
      : name ==="cus6a"?"NATIONAL AVERAGE (Investigation Completed)"
      : name ==="cus6b"?"NATIONAL AVERAGE (Cases pending > 2 years)"
      : name ==="cus6c"?"NATIONAL AVERAGE (Detections/Revenue collected)"
      : name ==="cus6d"?"NATIONAL AVERAGE (Recovery/Detections)"
      : name ==="cus6e"?"NATIONAL AVERAGE (Disposal of cases(outright smuggling))"
      : name ==="cus6f"?"NATIONAL AVERAGE (Disposal of cases(Commercial fraud))"
      : name ==="cus7a"?"NATIONAL AVERAGE (Not launched in 2 months of sanction/total sanction)"
      : name ==="cus7b"?"NATIONAL AVERAGE (Prosecution launched/arrests)"
      : name ==="cus8a"?"NATIONAL AVERAGE (Disposal of packages/pending beg of month)"
      : name ==="cus8b"?"NATIONAL AVERAGE (Pending > 6 month/total pending)"
      : name ==="cus11a"?"NATIONAL AVERAGE (No action on expired bonds/total expired W/H bonds)"
      : name ==="cus11b"?"NATIONAL AVERAGE (Duty recovered/duty involved in W/H bonds)"
      : name ==="cus10a"?"NATIONAL AVERAGE (Arrears recovered/target upto the month)"
      : name ==="cus10b"?"NATIONAL AVERAGE (Arrears pending > 1 yr /total pending)":
      `NATIONAL AVERAGE ${formatString(name)}`,
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
          x: "$canvasEndX + $chartRightMargin - 285",
          y: "$canvasStartY",
          scaleText: "1",
          fontSize: "22",
          color: "#ff0000",
        },
      ],
    });
  }
  else{
    allzones.dataset.push({
      seriesname: name === "gst5b" ? "NATIONAL AVERAGE (Time left < 6 month for adjudication)":`NATIONAL AVERAGE ${formatString(name)}`,
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
          x: "$canvasStartX + $chartLeftMargin + 10",
          y: "$canvasStartY+10",
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
                {
                selectedOption1 === "Zones" ? (
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
            {name==="cus9a"?(<h3>Gold disposed/Gold ripe for disposal</h3>):
              name==="cus1"?(<h3>Pending &gt; 90 days</h3>):
              name==="cus2a"?(<h3>Notices issued/EO fulfilment time is over</h3>):
              name==="cus2b"?(<h3>No revenue protective measures/EO fulfillment time is over</h3>):
              name==="cus2c"?(<h3>Duty recovered/duty involved in expired licenses</h3>):
              name==="cus3a"?(<h3>Notices issued/EO time is over</h3>):
              name==="cus3b"?(<h3>No revenue measures/EO Protective time is over</h3>):
              name==="cus3c"?(<h3>No revenue protective measures/EO fulfillment time is over</h3>):
              name==="cus4a"?(<h3>(Non SVB) &gt; 6 months PA/total PA</h3>):
              name==="cus4b"?(<h3>(Non SVB) &gt; 6 months PD bonds/total PD bonds</h3>):
              name==="cus4c"?(<h3>SVB finalised/Pending beginning of month</h3>):
              name==="cus4d"?(<h3>SVB pending &gt; 1 year/total pending</h3>):
              name==="cus5a"?(<h3>% of adjudication of cases disposed</h3>):
              name==="cus5b"?(<h3>ADJ Case pending &gt; 1 year</h3>):
              name==="cus5c"?(<h3>ADJ Case pending &gt; 1 year(duty involved &gt; 1 crore)</h3>):
              name==="cus6a"?(<h3>Investigation Completed </h3>):
              name==="cus6b"?(<h3>Cases pending &gt; 2 years </h3>):
              name==="cus6c"?(<h3>Detections/Revenue collected</h3>):
              name==="cus6d"?(<h3>Recovery/Detections</h3>):
              name==="cus6e"?(<h3>Disposal of cases(outright smuggling)</h3>):
              name==="cus6f"?(<h3>Disposal of cases(Commercial fraud)</h3>):
              name==="cus7a"?(<h3>Not launched in 2 months of sanction/total sanction</h3>):
              name==="cus7b"?(<h3>Prosecution launched/arrests</h3>):
              name==="cus8a"?(<h3>Disposal of packages/pending beg of month</h3>):
              name==="cus8b"?(<h3>Pending &gt; 6 month/total pending</h3>):
              name==="cus9b"?(<h3> Confiscated narcotics disposed/pending for disposal</h3>):
              name==="cus10a"?(<h3>Arrears recovered/target upto the month</h3>):
              name==="cus10b"?(<h3> Arrears pending &gt; 1 yr /total pending</h3>):
              name==="cus11a"?(<h3>No action on expired bonds/total expired W/H bonds</h3>):
              name==="cus11b"?(<h3>Duty recovered/duty involved in W/H bonds</h3>):
              name==="cus12a"?(<h3>Appeal Cases disposed/pending at start of month</h3>):
              name==="cus12b"?(<h3>Cases pending &gt; 1 year/total pending</h3>):
              selectedOption1 === "Zones" ? (
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

export default AllCustomSubpara;
