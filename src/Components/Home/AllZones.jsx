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
import queryString from "query-string";
import apiClient from "../../Service/ApiClient";
import FusionCharts from "fusioncharts";
import { default as charts } from "fusioncharts/fusioncharts.charts";
import ZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";
import ReactFusioncharts from "react-fusioncharts";

const Allzones = ({
  selectedDate,
  onChangeDate,
  selectedOption,
  onSelectedOption,
}) => {
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };
  const handleClick = (event) => {
    setToggle(!toggle);
    onSelectedOption(event.target.value);
    console.log(event.target.value);
  };
  const location = useLocation();

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const [datas, setDatas] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);

  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;

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

      const rest = responses.map((item) => ({ ...item }));
      console.log("Responses", responses);
      console.log("Rest", rest);

      const response1 = responses[0];
      const response2 = responses[1];
      const response3 = responses[2];
      const response4 = responses[3];
      const response5 = responses[4];
      const response6 = responses[5];

      console.log("rest1",response1.data);
      console.log("rest2",response2.data);
      console.log("rest3",response3.data);
      console.log("rest4",response4.data);
      console.log("rest5",response5.data);

      if (
        response2 &&
        response2.data &&
        response2.data.map((item) => item.totalScore) !== undefined
      ) {
        const totalScore = response2.data.map((item) => item.totalScore);

        // Iterate through the items in response3 and set sub_parameter_weighted_average to totalScore
        response2.data.forEach((item, index) => {
          item.sub_parameter_weighted_average = totalScore[index];
        });

        console.log("Updated response3 data with totalScore:", response3.data);
      } else {
        console.log("totalScore not found in response3 data.");
      }


      if (
        response5 &&
        response5.data &&
        response5.data.map((item) => item.parameter_wise_weighted_average) !== undefined
      ) {
        const totalScore = response5.data.map((item) => item.parameter_wise_weighted_average);

        // Iterate through the items in response3 and set sub_parameter_weighted_average to totalScore
        response5.data.forEach((item, index) => {
          item.sub_parameter_weighted_average = totalScore[index];
        });

        console.log("Updated response5 data with totalScore:", response5.data);
      } else {
        console.log("totalScore not found in response3 data.");
      }



      const accumulationMap = new Map();

      responses.flatMap((response) =>
        response.data.forEach((item) => {
          const key = item.zone_code;
          if (!accumulationMap.has(key)) {
            accumulationMap.set(key, {
              ...item,
              sub_parameter_weighted_average: 0,
            });
          }
          const accumulatedItem = accumulationMap.get(key);
          accumulatedItem.sub_parameter_weighted_average +=
            item.sub_parameter_weighted_average;
          accumulationMap.set(key, accumulatedItem);
        })
      );
      const allData = Array.from(accumulationMap.values());
      console.log("Consolidated and Summed Data", allData);

      const finalData = allData.map((item) => {
        item.sub_parameter_weighted_average = parseFloat(
          item.sub_parameter_weighted_average
        );
        return item;
      });
      console.log(
        "Final Summed Data with Total Score and Weighted Average",
        finalData
      );

      const sorted = finalData.sort(
        (a, b) =>
          b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
      );

      console.log("Sorted", sorted);

      setDatas(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

      setData1(
        response1.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      setData2(
        response2.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      setData3(
        response3.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      setData4(
        response4.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      setData5(
        response5.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      // setData6(
      //   response6.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      // );

      // Log the fetched data to the console
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newdate]);

  const chartData = {
    series: [
      {
        name: "Registration",
        data: [5, 8, 8, 10, 9],
        color: "#4472c4",
      },
      {
        name: "Return Filing",
        data: [10, 12, 11, 8, 4],
        color: "#ed7d31",
      },
      {
        name: "Scrutiny/Assessment",
        data: [13, 13, 10, 5, 12],
        color: "#A5A5A5",
      },
      {
        name: "Investigation",
        data: [8, 11, 6, 9, 3],
        color: "#FFBF00",
      },
      {
        name: "Adjudication",
        data: [6, 8, 5, 10, 11],
        color: "#5B9BD5",
      },
      {
        name: "Adjudication(Legacy Cases)",
        data: [15, 2, 14, 11, 12],
        color: "#6EAC44",
      },
      {
        name: "Refunds",
        data: [4, 4, 3, 6, 0],
        color: "#264478",
      },
      {
        name: "Recovery of Arrears",
        data: [9, 9, 8, 9, 3],
        color: "#9E480E",
      },
      {
        name: "Arrest & Prosecution",
        data: [7, 7, 5, 4, 7],
        color: "#636363",
      },
      {
        name: "Audit",
        data: [2, 2, 3, 2, 8],
        color: "#946C00",
      },
      {
        name: "Appeals",
        data: [12, 6, 9, 7, 11],
        color: "#5D87AD",
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 200,
        stacked: true,
        toolbar: {
          show: false,
        },
        events: {
          //   dataPointSelection: function (event, chartContext, config) {
          //     const categoryIndex = config.dataPointIndex;
          //     console.log(categoryIndex);

          //     const clickedDay =
          //       chartData.options.xaxis.categories[categoryIndex];
          //     console.log(clickedDay);

          //     switch (clickedDay) {
          //       case "Kolkata":
          //         window.location.href = "/kolkata";
          //         break;
          //       default:
          //         break;
          //     }
          //   },
          mounted: function (chartContext, config) {
            setTimeout(() => {
              const labels = document.querySelectorAll(
                "#chart1 .apexcharts-xaxis-texts-g text"
              );
              labels.forEach((label, index) => {
                label.style.cursor = "pointer";
                label.addEventListener("click", () => {
                  const clickedLabel =
                    chartData.options.xaxis.categories[index];
                  console.log(`Clicked on label: ${clickedLabel}`);
                  switch (clickedLabel) {
                    case "Kolkata":
                      window.location.href = "/kolkata";
                      break;
                    // case "Ahmedabad":
                    //   window.location.href = "/ahmedabad";
                    //   break;
                    // case "Jaipur":
                    //   window.location.href = "/jaipur";
                    //   break;
                    // case "Bengaluru":
                    //   window.location.href = "/bengaluru";
                    //   break;
                    // case "Nagpur":
                    //   window.location.href = "/nagpur";
                    //   break;
                    default:
                      break;
                  }
                });
              });
            }, 0);
          },
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              // formatter: function (val) {
              //   return val + "%";
              // },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "text",
        categories: ["Kolkata", "Ahmedabad", "Jaipur", "Bengaluru", "Nagpur"],
        tickAmount: 5,
        tickPlacement: "between",
        hideOverlappingLabels: true,
        crosshairs: {
          show: true,
          width: "tickWidth",
          position: "front",
          opacity: 1,
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 10,
      },
      legend: {
        position: "bottom",
        onItemClick: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: true,
        intersect: true,
        x: {
          show: false,
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: 74.75,
            y2: 76,
            fillColor: "#ff0000",
            yAxisIndex: 0,
            opacity: 1,
            label: {
              borderWidth: 0,
              offsetX: 0,
              offsetY: -12,
              text: "74.75", // Label for the average line
              style: {
                color: "#ff0000",
                offsetX: 0,
                offsetY: -3,
                position: "right",
                fontWeight: 1000,
              },
            },
          },
        ],
      },
    },
  };
  const customtopfive = {
    series: [
      {
        name: "Refunds",
        data: [4, 12, 9, 12, 2],
        color: "#4B77C6",
      },
      {
        name: "EPCG",
        data: [7, 13, 4, 2, 5],
        color: "#ED7A2D",
      },
      {
        name: "Advanced",
        data: [9, 8, 12, 8, 8],
        color: "#9F9F9F",
      },
      {
        name: "Provisional Assessment",
        data: [10, 5, 3, 5, 13],
        color: "#FFC30A",
      },
      {
        name: "Adjudication",
        data: [6, 2, 11, 6, 10],
        color: "#70A8DA",
      },
      {
        name: "Investigation",
        data: [10, 6, 12, 11, 6],
        color: "#6AAA3F",
      },
      {
        name: "Arrest & Prosecution",
        data: [7, 9, 0, 9, 9],
        color: "#1D3C72",
      },
      {
        name: "Unclaimed and Unclear",
        data: [5, 4, 3, 4, 4],
        color: "#9A4004",
      },
      {
        name: "Confiscated Gold",
        data: [6, 2, 7, 3, 2],
        color: "#585858",
      },
      {
        name: "Recovery of Arrears",
        data: [4, 8, 8, 7, 7],
        color: "#997401",
      },
      {
        name: "Warehousing Bound",
        data: [8, 6, 5, 6, 5],
        color: "#225B8F",
      },
      {
        name: "Appeals",
        data: [1, 1, 3, 1, 1],
        color: "#365D1C",
      },
      {
        name: "Audit",
        data: [3, 3, 1, 3, 3],
        color: "#678DD0",
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 400,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              // formatter: function (val) {
              //   return val + "%";
              // },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "text",
        categories: [
          "Hyderabad",
          "Kochi",
          "Tiruchirappalli",
          "Patna",
          "Mumbai",
        ],
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 10,
      },
      legend: {
        position: "bottom",
        onItemClick: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: true,
        intersect: true,
        x: {
          show: false,
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      // annotations: {
      //   yaxis: [
      //     {
      //       y: 72.3, // Set the value of the average line
      //       borderColor: "#000", // Color of the average line
      //       label: {
      //         borderColor: "#00E396",
      //         style: {
      //           color: "#000",
      //         },
      //         text: "72.3", // Label for the average line
      //       },
      //       strokeWidth: 200,
      //     },
      //   ],
      // },
    },
  };

  const all = [
    {
      value: "80",
      color: "#FF0000",
      label: "Hydrabad",
      link: "/",
    },
    {
      value: "79",
      color: "#FFFF00",
      label: "Kochi",
      link: "/",
    },
    {
      value: "78",
      color: "#00FF00",
      label: "Tiruchirappalli",
      link: "/",
    },
    {
      value: "77",
      color: "#0000FF",
      label: "Patna",
      link: "/",
    },
    {
      value: "75",
      color: "#00ffff",
      label: "Mumbai",
      link: "/",
    },
    {
      label: "Kolkata",
      link: "/",
      value: 73,
      color: "#3d0c02",
    },
    {
      label: "Delhi",
      link: "/",
      value: 69,
      color: "#551a8b",
    },
    {
      label: "Chennai",
      link: "/",
      value: 68,
      color: "#40916c",
    },
    {
      label: "Bengaluru",
      link: "/",
      value: 67,
      color: "#ff8800",
    },
    {
      label: "Ahmedabad",
      link: "/",
      value: 58,
      color: "#cc0077",
    },
  ];
  const rearrangedData1 = datas.map((zone) => {
    return (
      data1.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData2 = datas.map((zone) => {
    return (
      data2.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData3 = datas.map((zone) => {
    return (
      data3.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  console.log("Adjudication", rearrangedData3);

  const rearrangedData4 = datas.map((zone) => {
    return (
      data4.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData5 = datas.map((zone) => {
    return (
      data5.find((item) => item.zone_code === zone.zone_code) || {
        parameter_wise_weighted_average: 0,
      }
    );
  });

  // const rearrangedData6 = datas.map((zone) => {
  //   return (
  //     data6.find((item) => item.zone_code === zone.zone_code) || {
  //       sub_parameter_weighted_average: 0,
  //     }
  //   );
  // });

  const getBarColor = (index) => {
    const total = datas.length;
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

  const averageReturnFiling = 74.75;

  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const colorstop = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00ffff",
    "#cc0077",
    "#ff8800",
    "#40916c",
    "#551a8b",
    "#3d0c02",
  ];
  const dataSource = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "CGST",
      subcaption: "All Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "All Zones (CGST)",
      yAxisName: "Total Score (Zone Wise)",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend: "0",
      plottooltext:
        "<b>Zone Name-: $label</b>{br}Total Score: $value{br}Parameter:$seriesname",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
    },
    categories: [
      {
        category: datas.map((item) => ({
          label: item.zoneName,
          link: `/kolkata?zone_code=${item.zone_code}`,
        })),
      },
    ],
    dataset: [
      {
        seriesname: "Return Filing",
        data: rearrangedData1.map((item, index) => ({
          value: item.sub_parameter_weighted_average,
          color: getBarColor(index),
        })),
      },
      // {
      //   seriesname: "Scrutiny/Assessment",
      //   data: rearrangedData2.map((item, index) => ({
      //     value: item.sub_parameter_weighted_average,
      //     color: getBarColor(index),
      //   })),
      // },
      {
        seriesname: "Adjudication",
        data: rearrangedData2.map((item, index) => ({
          value: item.totalScore,
          color: getBarColor(index),
        })),
      },
      {
        seriesname: "Adjudication(Legacy Cases)",
        data: rearrangedData3.map((item, index) => ({
          value: item.sub_parameter_weighted_average,
          color: getBarColor(index),
        })),
      },
      {
        seriesname: "Refunds",
        data: rearrangedData4.map((item, index) => ({
          value: item.sub_parameter_weighted_average,
          color: getBarColor(index),
        })),
      },
      {
        seriesname: "Appeals",
        data: rearrangedData5.map((item, index) => ({
          value: item.parameter_wise_weighted_average,
          color: getBarColor(index),
        })),
      },
      // {
      //   seriesname: "National Avg Return Filing",
      //   renderAs: "Line",
      //   data:details.map(()=>({value:averageReturnFiling})),
      //   lineThickness: "5",
      //   color: "#ff0000",
      //   alpha: "100",
      //   drawAnchors:"0",
      // }
    ],
    annotations: {
      groups: [
        {
          items: [
            {
              id: "avg-text",
              type: "text",
              // text: `National Average: ${averageReturnFiling}`,
              align: "right",
              x: "$chartEndX - 50",
              y: "$chartStartY + 70",
              fontSize: "14",
              color: "#000000",
            },
          ],
        },
      ],
    },
  };

  const colorscustom = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00ffff",
    "#cc0077",
    "#ff8800",
    "#40916c",
    "#551a8b",
    "#3d0c02",
  ];
  const dataSourcecustom = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "Customs",
      subcaption: "All Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "All Zones (Cutoms)",
      yAxisName: "All Parameters (Zone Wise)",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend: "0",
      plottooltext:
        "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
    },
    categories: [
      {
        category: all.map((item) => ({ label: item.label, link: item.link })),
      },
    ],
    dataset: [
      // {
      //   // seriesname: "Registration",
      //   data: data.map((item,index)=>({
      //     label:item.zoneName,
      //     value:item.totalScore,
      //     color: colorstop[index %colorstop.length],
      //   })),
      //   color : "#31363F",
      // },
      {
        data: all.map((item) => ({ value: item.value, color: item.color })),
      },
      {
        seriesname: "National Avg Return Filing",
        renderAs: "Line",
        data: all.map(() => ({ value: averageReturnFiling })),
        lineThickness: "5",
        color: "#ff0000",
        alpha: "100",
        drawAnchors: "0",
      },
    ],
    annotations: {
      groups: [
        {
          items: [
            {
              id: "avg-text",
              type: "text",
              text: `National Average: ${averageReturnFiling.toFixed(2)}`,
              align: "right",
              x: "$chartEndX - 50",
              y: "$chartStartY + 70",
              fontSize: "14",
              color: "#000000",
            },
          ],
        },
      ],
    },
  };

  return (
    <>
      <div className="body flex-grow-1">
        <div className="row">
          <div className="msg-box">
            <div className="lft-box">
              <h2>All Zones</h2>
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
        <div className="row ">
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
                  value="CGST"
                  onChange={handleClick}
                  checked={selectedOption === "CGST"}
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  onChange={handleClick}
                  value="Customs"
                  checked={selectedOption === "Customs"}
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
          </div>
        </div>

        {selectedOption === "CGST" ? (
          <>
            <div class="row">
              <div class="text-center zone-heading">
                <h3> {selectedOption.toUpperCase()}</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 order-1 order-lg-1">
                <div className="card mb-4">
                  <ReactFusioncharts
                    type="stackedcolumn3dline"
                    width="100%"
                    height="650"
                    dataFormat="JSON"
                    dataSource={dataSource}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-btn">
                <Link to="/">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div class="row">
              <div class="text-center zone-heading">
                <h3> {selectedOption.toUpperCase()}</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 order-1 order-lg-1">
                <div className="card mb-4">
                  {/* <Cgstallzones/> */}
                  <ReactFusioncharts
                    type="stackedcolumn3dline"
                    width="100%"
                    height="650"
                    dataFormat="JSON"
                    dataSource={dataSourcecustom}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-btn">
                <Link to="/">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Allzones;
