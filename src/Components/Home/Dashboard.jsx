import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs"; // Import Day.js library
import React, { useState,useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import Button from "@mui/material/Button";
import Cgstbottomfive from "../Home/Charts/Cgstbottomfive";
import Cgsttopfive from "../Home/Charts/Cgsttopfive";
import Custombottomfive from "../Home/Charts/Custombottomfive";
import Customtopfive from "../Home/Charts/Customtopfive";
import apiClient from '../../Service/ApiClient'
import { useNavigate } from "react-router-dom";
import FusionCharts from "fusioncharts";
import { default as charts } from "fusioncharts/fusioncharts.charts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';
import ReactFusioncharts from "react-fusioncharts";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   // width: '100%',
//   maxWidth: "100%",
//   height: "auto",
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

export const Dashboard = ({
  selectedDate,
  onChangeDate,
  selectedOption,
  onSelectedOption,
}) => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(true);
  const [loading, setloading] = useState(true);

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const handleClick = (event) => {
    setToggle(!toggle);

    if (toggle) {
      setloading(false);
    } else {
      setloading(false);
    }

    onSelectedOption(event.target.value);
    console.log(event.target.value);
  };

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

  const newdate= dayjs(selectedDate).format("YYYY-MM-DD");

  const fetchData = async () => {
    try {
      // const response = await apiClient.get(`/cbic/allParameter/total/parameter`,{
      //   params: {

      //     month_date: newdate,
      //     type: "parameter",

      //   },
      // });

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
      

      const response1 = responses[0];
      const response2 = responses[1];
      const response3 = responses[2];
      const response4 = responses[3];
      const response5 = responses[4];
      const response6 = responses[5];

      console.log("Rest1", response1);
      console.log("Rest2", response2);
      console.log("Rest3", response3);
      console.log("Rest4", response4);
      console.log("Rest5", response5);
      console.log("Rest6", response6);

      if (response1 && response2 && response3 && response4 && response5) {
        setloading(false);
      }

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
        response5.data.map((item) => item.totalScore) !== undefined
      ) {
        const totalScore = response5.data.map((item) => item.parameter_wise_weighted_average);

        // Iterate through the items in response3 and set sub_parameter_weighted_average to totalScore
        response5.data.forEach((item, index) => {
          item.sub_parameter_weighted_average = totalScore[index];
        });

        console.log("Updated response3 data with totalScore:", response5.data);
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

      setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

      setData6(
        response6.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newdate]);

  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // cgst chart
  // const chartData = {
  //   series: [
  //     {
  //       name: "Registration",
  //       data: [5, 8, 8, 10, 9],
  //       color: "#ff686b",
  //     },
  //     {
  //       name: "Return Filing",
  //       data: [10, 12, 11, 8, 4],
  //       color: "#a5ffd6",
  //     },
  //     {
  //       name: "Scrutiny/Assessment",
  //       data: [13, 13, 10, 5, 12],
  //       color: "#a2d2ff",
  //     },
  //     {
  //       name: "Investigation",
  //       data: [8, 11, 6, 9, 3],
  //       color: "#ffafcc",
  //     },
  //     {
  //       name: "Adjudication",
  //       data: [6, 8, 5, 10, 11],
  //       color: "#fcf5c9",
  //     },
  //     {
  //       name: "Adjudication(Legacy Cases)",
  //       data: [15, 2, 14, 11, 12],
  //       color: "#d4bffb",
  //     },
  //     {
  //       name: "Refunds",
  //       data: [4, 4, 3, 6, 0],
  //       color: "#35c9c2",
  //     },
  //     {
  //       name: "Recovery of Arrears",
  //       data: [9, 9, 8, 9, 3],
  //       color: "#ee7214",
  //     },
  //     {
  //       name: "Arrest & Prosecution",
  //       data: [7, 7, 5, 4, 7],
  //       color: "#f7b787",
  //     },
  //     {
  //       name: "Audit",
  //       data: [2, 2, 3, 2, 8],
  //       color: "#f9e8d9",
  //     },
  //     {
  //       name: "Appeals",
  //       data: [12, 6, 9, 7, 11],
  //       color: "#527853",
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       type: "bar",
  //       isFunnel3d: true,
  //       height: 200,
  //       stacked: true,
  //       toolbar: {
  //         show: false,
  //       },
  //       events: {
  //         //   dataPointSelection: function (event, chartContext, config) {
  //         //     const categoryIndex = config.dataPointIndex;
  //         //     console.log(categoryIndex);

  //         //     const clickedDay =
  //         //       chartData.options.xaxis.categories[categoryIndex];
  //         //     console.log(clickedDay);

  //         //     switch (clickedDay) {
  //         //       case "Kolkata":
  //         //         window.location.href = "/kolkata";
  //         //         break;
  //         //       default:
  //         //         break;
  //         //     }
  //         //   },
  //         mounted: function (chartContext, config) {
  //           setTimeout(() => {
  //             const labels = document.querySelectorAll(
  //               "#chart1 .apexcharts-xaxis-texts-g text"
  //             );
  //             console.log(labels);
  //             labels.forEach((label, index) => {
  //               label.style.cursor = "pointer";
  //               label.addEventListener("click", () => {
  //                 const clickedLabel =
  //                   chartData.options.xaxis.categories[index];
  //                 console.log(`Clicked on label: ${clickedLabel}`);
  //                 switch (clickedLabel) {
  //                   case "Kolkata":
  //                     navigate("/kolkata");
  //                     break;
  //                   // case "Ahmedabad":
  //                   //   window.location.href = "/ahmedabad";
  //                   //   break;
  //                   // case "Jaipur":
  //                   //   window.location.href = "/jaipur";
  //                   //   break;
  //                   // case "Bengaluru":
  //                   //   window.location.href = "/bengaluru";
  //                   //   break;
  //                   // case "Nagpur":
  //                   //   window.location.href = "/nagpur";
  //                   //   break;
  //                   default:
  //                     break;
  //                 }
  //               });
  //             });
  //           }, 0);
  //         },
  //       },
  //       redrawOnParentResize: true,
  //       redrawOnWindowResize: true,
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         dataLabels: {
  //           position: "top",
  //           total: {
  //             enabled: true,
  //             // formatter: function (val) {
  //             //   return val + "%";
  //             // },
  //           },
  //         },
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     xaxis: {
  //       type: "text",
  //       categories: ["Kolkata", "Ahmedabad", "Jaipur", "Bengaluru", "Nagpur"],
  //       tickAmount: 5,
  //       tickPlacement: "between",
  //       hideOverlappingLabels: true,
  //       crosshairs: {
  //         show: true,
  //         width: "tickWidth",
  //         position: "front",
  //         opacity: 1,
  //       },
  //     },
  //     yaxis: {
  //       min: 0,
  //       max: 100,
  //       tickAmount: 10,
  //     },
  //     legend: {
  //       position: "bottom",
  //       onItemClick: false,
  //     },
  //     fill: {
  //       opacity: 1,
  //     },
  //     tooltip: {
  //       enabled: true,
  //       intersect: true,
  //       x: {
  //         show: false,
  //       },
  //       y: {
  //         formatter: function (value) {
  //           return value + "%";
  //         },
  //       },
  //     },
  //     annotations: {
  //       yaxis: [
  //         {
  //           y: 74.75,
  //           y2: 76,
  //           fillColor: "#ff0000",
  //           yAxisIndex: 0,
  //           opacity: 1,
  //           label: {
  //             borderWidth: 0,
  //             offsetX: 0,
  //             offsetY: -12,
  //             text: "74.75", // Label for the average line
  //             style: {
  //               color: "#ff0000",
  //               offsetX: 0,
  //               offsetY: -3,
  //               position: "right",
  //               fontWeight: 1000,
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // };

  // const bottomfive = {
  //   series: [
  //     {
  //       name: "Registration",
  //       data: [12, 3, 12, 2, 6],
  //       color: "#FF0000",
  //     },
  //     {
  //       name: "Return Filing",
  //       data: [3, 13, 10, 13, 8],
  //       color: "#00FF15",
  //     },
  //     {
  //       name: "Scrutiny/Assessment",
  //       data: [2, 8, 8, 8, 6],
  //       color: "#00BFFF",
  //     },
  //     {
  //       name: "Investigation",
  //       data: [1, 5, 5, 5, 12],
  //       color: "#FF7700",
  //     },
  //     {
  //       name: "Adjudication",
  //       data: [9, 2, 1, 1, 3],
  //       color: "#FF0095",
  //     },
  //     {
  //       name: "Adjudication(Legacy Cases)",
  //       data: [3, 4, 3, 15, 7],
  //       color: "#00FBFF",
  //     },
  //     {
  //       name: "Refunds",
  //       data: [9, 9, 9, 9, 6],
  //       color: "#9B5DE5",
  //     },
  //     {
  //       name: "Recovery of Arrears",
  //       data: [2, 4, 1, 4, 3],
  //       color: "#9E480E",
  //     },
  //     {
  //       name: "Arrest & Prosecution",
  //       data: [2, 2, 2, 2, 4],
  //       color: "#f7b538",
  //     },
  //     {
  //       name: "Audit",
  //       data: [7, 7, 7, 7, 11],
  //       color: "#283618",
  //     },
  //     {
  //       name: "Appeals",
  //       data: [4, 6, 6, 2, 5],
  //       color: "#5D87AD",
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       type: "bar",
  //       height: 400,
  //       stacked: true,
  //       toolbar: {
  //         show: false,
  //       },
  //       zoom: {
  //         enabled: false,
  //       },
  //       plotOptions: {},
  //       redrawOnWindowResize: true,
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         dataLabels: {
  //           position: "top",
  //           total: {
  //             enabled: true,
  //             // formatter: function (val) {
  //             //   return val + "%";
  //             // },
  //           },
  //         },
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     xaxis: {
  //       type: "text",
  //       categories: ["Hyderabad", "Guwahati", "Delhi", "Chennai", "Lucknow"],
  //     },
  //     yaxis: {
  //       min: 0,
  //       max: 100,
  //       tickAmount: 10,
  //     },
  //     legend: {
  //       position: "bottom",
  //       onItemClick: false,
  //     },
  //     fill: {
  //       opacity: 1,
  //     },
  //     tooltip: {
  //       enabled: true,
  //       intersect: true,
  //       x: {
  //         show: false,
  //       },
  //       y: {
  //         formatter: function (
  //           value,
  //           { series, seriesIndex, dataPointIndex, w }
  //         ) {
  //           return value + "%";
  //         },
  //       },
  //     },
  //     // annotations: {
  //     //   yaxis: [
  //     //     {
  //     //       y: 74.75, // Set the value of the average line
  //     //       borderColor: "#000", // Color of the average line
  //     //       label: {
  //     //         borderColor: "#00E396",
  //     //         style: {
  //     //           color: "#000",
  //     //         },
  //     //         text: "74.75", // Label for the average line
  //     //       },
  //     //       strokeWidth: 200,
  //     //     },
  //     //   ],
  //     // },
  //   },
  // };

  // custom chart
  const customtopfive = {
    series: [
      {
        name: "Timely payment of Refunds",
        data: [4, 12, 9, 12, 2],
        color: "#FF0000",
      },
      {
        name: "Management of Export Obligation(EPCG)",
        data: [7, 13, 4, 2, 5],
        color: "#00FF15",
      },
      {
        name: "Management of Export Obligation(AA)",
        data: [9, 8, 12, 8, 8],
        color: "#00BFFF",
      },
      {
        name: "Disposal/Pendency Of Provisional Assessments",
        data: [10, 5, 3, 5, 13],
        color: "#FF7700",
      },
      {
        name: "Adjudication",
        data: [6, 2, 11, 6, 10],
        color: "#FF0095",
      },
      {
        name: "Investigation",
        data: [10, 6, 12, 11, 6],
        color: "#00FBFF",
      },
      {
        name: "Arrests and Prosecution",
        data: [7, 9, 0, 9, 9],
        color: "#9B5DE5",
      },
      {
        name: "Monitoring Of Un-cleared and Unclaimed cargo",
        data: [5, 4, 3, 4, 4],
        color: "#9E480E",
      },
      {
        name: "Disposal Of Confiscated Gold and NDPS",
        data: [6, 2, 7, 3, 2],
        color: "#f7b538",
      },
      {
        name: "Recovery of Arrears",
        data: [4, 8, 8, 7, 7],
        color: "#283618",
      },
      {
        name: "Management Of  Warehousing bonds",
        data: [8, 6, 5, 6, 5],
        color: "#5D87AD",
      },
      {
        name: "Commissionaer (Appeals)",
        data: [1, 1, 3, 1, 1],
        color: "#365D1C",
      },
      {
        name: "Audit",
        data: [3, 3, 1, 3, 3],
        color: "#6a5acd",
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

  const custombottomfive = {
    series: [
      {
        name: "Timely payment of Refunds",
        data: [12, 3, 12, 6, 2],
        color: "#FF0000",
      },
      {
        name: "Management of Export Obligation(EPCG)",
        data: [3, 13, 10, 8, 13],
        color: "#00FF15",
      },
      {
        name: "Management of Export Obligation(AA)",
        data: [2, 8, 8, 6, 8],
        color: "#00BFFF",
      },
      {
        name: "Disposal/Pendendcy of Provisional Assessment",
        data: [1, 5, 5, 12, 5],
        color: "#FF7700",
      },
      {
        name: "Adjudication",
        data: [9, 2, 1, 3, 1],
        color: "#FF0095",
      },
      {
        name: "Investigation",
        data: [3, 4, 3, 7, 15],
        color: "#800000",
      },
      {
        name: "Arrest & Prosecution",
        data: [9, 9, 9, 6, 9],
        color: "#9B5DE5",
      },
      {
        name: "Monitering of Unclaimed and Unclear cargo",
        data: [2, 4, 1, 3, 4],
        color: "#808000",
      },
      {
        name: "Disposal of Confiscated Gold and NDPS",
        data: [2, 2, 2, 4, 2],
        color: "#9E480E",
      },
      {
        name: "Recovery of Arrears",
        data: [7, 7, 7, 5, 7],
        color: "#f7b538",
      },
      {
        name: "Management of Warehousing Bound",
        data: [4, 6, 6, 5, 2],
        color: "#283618",
      },
      {
        name: "Commissionaer(Appeals)",
        data: [1, 1, 1, 1, 1],
        color: "#000080",
      },
      {
        name: "Audit",
        data: [3, 3, 3, 3, 3],
        color: "#6a5acd",
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
        plotOptions: {},
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
        categories: ["Ahmedabad", "Bengaluru", "Chennai", "Delhi", "Kolkata"],
        tickPlacement: "between",
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
      //       borderColor: "#ff0000", // Color of the average line
      //       label: {
      //         style: {
      //           color: "#000",
      //         },
      //         text: "72.3", // Label for the average line
      //       },
      //       strokeWidth: 400,
      //     },
      //   ],
      // },
    },
  };

  const rearrangedData1 = data.map((zone) => {
    return (
      data1.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData2 = data.map((zone) => {
    return (
      data2.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData3 = data.map((zone) => {
    return (
      data3.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData4 = data.map((zone) => {
    return (
      data4.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const rearrangedData5 = data.map((zone) => {
    return (
      data5.find((item) => item.zone_code === zone.zone_code) || {
        parameter_wise_weighted_average: 0,
      }
    );
  });

  console.log("rearrangedData5",rearrangedData5);

  const rearrangedData6 = data.map((zone) => {
    return (
      data6.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average: 0,
      }
    );
  });

  const averageReturnFiling = 74.75;

  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const colorstop = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#00ffff"];

  const dataSource = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "CGST",
      subcaption: "Top 5 Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "Top 5 Zones (CGST)",
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
      // clickURL: '/kolkata',
    },
    categories: [
      {
        category: data.slice(0, 5).map((index) => ({
          label: index.zoneName,
          // link: `/kolkata?zone_code=${index.zone_code}`,
        })),
      },
    ],
    dataset: [
      {
        seriesname: "Return Filing",
        data: rearrangedData1.slice(0, 5).map((item) => ({
          value: item.sub_parameter_weighted_average,
          color: "00FF00",
        })),
      },
      // {
      //   seriesname: "Scrutiny/Assessment",
      //   data: rearrangedData2.slice(0, 5).map((item) => ({
      //     value: item.sub_parameter_weighted_average,
      //     color: "00FF00",
      //   })),
      // },
      {
        seriesname: "Adjudication",
        data: rearrangedData2.slice(0, 5).map((item) => ({
          value: item.sub_parameter_weighted_average,
          color: "00FF00",
        })),
      },
      {
        seriesname: "Adjudication(Legacy Cases)",
        data: rearrangedData3.slice(0, 5).map((item) => ({
          value: item.sub_parameter_weighted_average,
          color: "00FF00",
        })),
      },
      {
        seriesname: "Refunds",
        data: rearrangedData4.slice(0, 5).map((item) => ({
          value: item.sub_parameter_weighted_average,
          color: "00FF00",
        })),
      },
      {
        seriesname: "Appeals",
        data: rearrangedData5.slice(0, 5).map((item) => ({
          value: item.parameter_wise_weighted_average,
          color: "00FF00",
        })),
      },

      // {
      //   seriesname: "National Avg Return Filing",
      //   renderAs: "Line",
      //   data: bardata.map(()=>({value:averageReturnFiling})),
      //   lineThickness: "5",
      //   color: "#ff0000",
      //   alpha: "100",
      //   drawAnchors:"0",
      //   // dashed: "1",
      //   // dashLen: "4",
      //   // dashGap: "2",
      //   // color : "#3572EF"
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

  const colorsbottom = ["#cc0077", "#ff8800", "#40916c", "#551a8b", "#3d0c02"];

  const dataSourcebottom = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "CGST",
      subcaption: "Bottom 5 Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "Bottom 5 Zones (CGST)",
      yAxisName: "Total Score(Zone Wise)",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend: "0",
      plottooltext:
        "<b>Zone Name-: $label</b>{br}Total Score: $value{br}Parameter: $seriesname",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
    },
    categories: [
      {
        category: data
          .slice(-5)
          .map((item) => ({
            label: item.zoneName,
            // link: `/kolkata?zone_code=${item.zone_code}`,
          })),
      },
    ],
    dataset: [
      {
        seriesname: "Return Filing",
        data: rearrangedData1
          .slice(-5)
          .map((item) => ({
            value: item.sub_parameter_weighted_average,
            color: "FF0000",
          })),
      },
      // {
      //   seriesname: "Scrutiny/Assessment",
      //   data: rearrangedData2
      //     .slice(-5)
      //     .map((item) => ({
      //       value: item.sub_parameter_weighted_average,
      //       color: "FF0000",
      //     })),
      // },
      {
        seriesname: "Adjudication",
        data: rearrangedData2
          .slice(-5)
          .map((item) => ({
            value: item.sub_parameter_weighted_average,
            color: "FF0000",
          })),
      },
      {
        seriesname: "Adjudication(Legacy Cases)",
        data: rearrangedData3
          .slice(-5)
          .map((item) => ({
            value: item.sub_parameter_weighted_average,
            color: "FF0000",
          })),
      },
      {
        seriesname: "Refunds",
        data: rearrangedData4
          .slice(-5)
          .map((item) => ({
            value: item.sub_parameter_weighted_average,
            color: "FF0000",
          })),
      },
      {
        seriesname: "Appeals",
        data: rearrangedData5
          .slice(-5)
          .map((item) => ({
            value: item.parameter_wise_weighted_average,
            color: "FF0000",
          })),
      },
      //   {
      //   data:alltop.map(item=>({value:item.value, color:item.color}))
      // },
      // {
      //   seriesname: "National Avg Return Filing",
      //   renderAs: "Line",
      //   data:bardata.map(()=>({value:averageReturnFiling})),
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="body flex-grow-1">
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
                    //onChange={handleClick}
                    checked={selectedOption === "CGST"}
                    defaultChecked
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    //onChange={handleClick}
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
              <div className="row">
                <div className="text-center zone-heading">
                  <h3>CGST</h3>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 ">
                  <div className="card mb-4">
                    <div className="card-header cgst-top-head">
                      <strong>Top 5 Zones</strong>
                      <span className="small ms-1">
                        <Link to="/allzones">View all zones</Link>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="responsive-chart main-chart">
                        <ReactFusioncharts
                          type="stackedcolumn3dline"
                          width="100%"
                          height="650"
                          dataFormat="JSON"
                          dataSource={dataSource}
                        />
                        <Link to="/allzones">
                          <Button className="openbtn">
                            <KeyboardArrowRightIcon />
                          </Button>
                        </Link>
                        {/* <div className="btn-box">
                          <span className=" cust-btn">
                            <Link to="/">View Details</Link>
                          </span>
                        </div> */}
                        <div id="html-dist"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 order-2 order-lg-2">
                  <div className="card mb-4">
                    <div className="card-header cgst-btm-head">
                      <strong>Bottom 5 Zones</strong>
                      <span className="small ms-1">
                        <Link to="/allzones">View all zones</Link>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="responsive-chart main-chart">
                        <ReactFusioncharts
                          type="stackedcolumn3dline"
                          width="100%"
                          height="650"
                          dataFormat="JSON"
                          dataSource={dataSourcebottom}
                        />
                        <Link to="/allzones">
                          <Button className="openbtn">
                            <KeyboardArrowRightIcon />
                          </Button>
                        </Link>
                      </div>

                      {/* <div className="btn-box">
                        <span className=" cust-btn">
                          <Link to="/">View Details</Link>
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row">
               <div className="col-lg-6 order-1 order-lg-1">
                <div>
                  <div>
                    <div className="card mb-4">
                      <div className="card-header cgst-top-head">
                        <strong>Top 5 Zones</strong>
                        <span className="small ms-1">
                          <Link to="/allzones">View all zones</Link>
                        </span>
                      </div>
                      <div className="card-body">
                        <div id="chart">
                          <div className="responsive-chart main-chart">
                            <ReactApexChart
                              options={chartData.options}
                              series={chartData.series}
                              type="bar"
                              height={400}
                              id="chart1"
                            />
                            <Link to="/allzones">
                              <Button className="openbtn">
                                <KeyboardArrowRightIcon />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="btn-box">
                          <span className=" cust-btn">
                            <Link to="/cgst">View Details</Link>
                          </span>
                        </div>
                        <div id="html-dist"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 order-2 order-lg-2">
                <div className="card mb-4">
                  <div className="card-header cgst-btm-head">
                    <strong>Bottom 5 Zones</strong>
                    <span className="small ms-1">
                      <Link to="/allzones">View all zones</Link>
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="responsive-chart main-chart">
                      <ReactApexChart
                        options={bottomfive.options}
                        series={bottomfive.series}
                        type="bar"
                        height={400}
                        id="chart2"
                      />
                      <Link to="/allzones">
                        <Button className="openbtn">
                          <KeyboardArrowRightIcon />
                        </Button>
                      </Link>
                    </div>

                    <div className="btn-box">
                      <span className=" cust-btn">
                        <Link to="/cgst">View Details</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

              {/* <div className="row">
              <div className="col-lg-6 order-1 order-lg-1">
                <div className="card mb-4">
                  <div className="card-header cgst-top-head">
                    <strong>Top 5 Zones</strong>
                    <span className="small ms-1">
                      <Link to="/allzones">View all zones</Link>
                    </span>
                  </div>

                  <div className="main-chart">
                    <Cgsttopfive3d />
                    <Link to="/allzones">
                      <Button className="openbtn">
                        <KeyboardArrowRightIcon />
                      </Button>
                    </Link>
                  </div>

                  <div className="btn-box">
                    <span className=" cust-btn">
                      <Link to="/cgst">View Details</Link>
                    </span>
                  </div>
                  <div id="html-dist"></div>
                </div>
              </div>
              <div className="col-lg-6 order-2 order-lg-2">
                <div className="card mb-4">
                  <div className="card-header cgst-btm-head">
                    <strong>Bottom 5 Zones</strong>
                    <span className="small ms-1">
                      <Link to="/allzones">View all zones</Link>
                    </span>
                  </div>

                  <div className="main-chart">
                    <Cgstbottomfive3d />
                    <Link to="/allzones">
                      <Button className="openbtn">
                        <KeyboardArrowRightIcon />
                      </Button>
                    </Link>
                  </div>

                  <div className="btn-box">
                    <span className=" cust-btn">
                      <Link to="/cgst">View Details</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
            </>
          ) : (
            <>
              <div className="row">
                <div className="text-center zone-heading">
                  <h3>Customs</h3>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 ">
                  <div className="card mb-4">
                    <div className="card-header cgst-top-head">
                      <strong>Top 5 Zones</strong>
                      <span className="small ms-1">
                        <Link to="/allzones">
                          View all zones
                        </Link>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="responsive-chart main-chart">
                        <Customtopfive />
                        <Link to="/allzones">
                          <Button className="openbtn">
                            <KeyboardArrowRightIcon />
                          </Button>
                        </Link>
                        <div className="btn-box">
                          <span className=" cust-btn">
                            <Link to="/">View Details</Link>
                          </span>
                        </div>
                        <div id="html-dist"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 order-2 order-lg-2">
                  <div className="card mb-4">
                    <div className="card-header cgst-btm-head">
                      <strong>Bottom 5 Zones</strong>
                      <span className="small ms-1">
                        <Link to="/allzones">
                          View all zones
                        </Link>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="responsive-chart main-chart">
                        <Custombottomfive />
                        <Link to="/allzones">
                          <Button className="openbtn">
                            <KeyboardArrowRightIcon />
                          </Button>
                        </Link>
                      </div>

                      <div className="btn-box">
                        <span className=" cust-btn">
                          <Link to="/">View Details</Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="row">
              <div className="col-lg-6 order-1 order-lg-1">
                <div>
                  <div className="card mb-4">
                    <div className="card-header">
                      <strong>Top 5 Zones</strong>
                      <span className="small ms-1">
                        <Link to="/customallzones?name=customs">View all zones</Link>
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="responsive-chart main-chart">
                        <ReactApexChart
                          options={customtopfive.options}
                          series={customtopfive.series}
                          type="bar"
                          height={400}
                          id="chart3"
                        />
                        <Link to="/customallzones?name=customs">
                          <Button className="openbtn">
                            <KeyboardArrowRightIcon />
                          </Button>
                        </Link>
                      </div>
                      <div className="btn-box">
                        <span className=" cust-btn">
                          <Link to="/customs">View Details</Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 order-2 order-lg-2">
                <div className="card mb-4">
                  <div className="card-header">
                    <strong>Bottom 5 Zones</strong>
                    <span className="small ms-1">
                      <Link to="/customallzones?name=customs">View all zones</Link>
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="responsive-chart main-chart">
                      <ReactApexChart
                        options={custombottomfive.options}
                        series={custombottomfive.series}
                        type="bar"
                        height={400}
                        id="chart4"
                      />
                      <Link to="/customallzones?name=customs">
                        <Button className="openbtn">
                          <KeyboardArrowRightIcon />
                        </Button>
                      </Link>
                    </div>
                    <div className="btn-box">
                      <span className=" cust-btn">
                        <Link to="/customs">View Details</Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </>
          )}
        </div>
      )}
    </>
  );
};
