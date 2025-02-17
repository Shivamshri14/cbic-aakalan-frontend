import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ReactApexChart from "react-apexcharts";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Commdata from "../Home/Charts/Commdata";
import Commpiechart from "../Home/Charts/Commpiechart";
import apiClient from "../../Service/ApiClient";
import queryString from "query-string";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '50%',
  // border: "2px solid black",
  maxWidth: "100%",
  height: "auto",
  bgcolor: "background.paper",
  p: 4,
  cursor:"pointer",
};

const close = {
  position: "relative",
  textAlign:"center",
  background: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
};

const Kolkata = ({ selectedDate, onChangeDate }) => {
  // const [value2, setValue] = useState(dayjs().subtract(1, "month").subtract(1, "year").startOf("month"));

  // const [value2, setValue] = React.useState(dayjs());
  // const formattedDate = value2 ? value2.format("MM YYYY") : "";
  // console.log("val123", formattedDate);

  // const [toggle, setToggle] = useState(true);
  const [selected, setSelected] = useState("Monthly");
  const [activeChart, setActiveChart] = useState("Monthly");

  const [ismonthModalOpen, setismonthModalOpen] = useState(false);
  const [isyearModalOpen, setisyearModalOpen] = useState(false);
  const [monthClickedLabel, setMonthClickedLabel] = useState(true);
  const [yearClickedLabel, setYearClickedLabel] = useState(true);

  const handlemonthClick = (event) => {
    // setToggle(!toggle);
    setSelected(event.target.value);
    console.log(event.target.value);
  };

  const handleyearClick = (event) => {
    setSelected(event.target.value);
    console.log(event.target.value);
  };

  const handlemonthOpen = (label) => {
    setMonthClickedLabel(label);
    setismonthModalOpen(true);
  };

  const handleyearOpen = (label) => {
    setYearClickedLabel(label);
    setisyearModalOpen(true);
  };

  const handlemonthLabelClick = (label) => {
    handlemonthOpen(label);
  };

  const handleyearLabelClick = (label) => {
    handleyearOpen(label);
  };

  const handlemonthClose = () => {
    setismonthModalOpen(false);
  };

  const handleyearClose = () => {
    setisyearModalOpen(false);
  };

  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { type } = queryParams;
  const { zone_code } = queryParams;
  const [loading, setloading] = useState(true);
  const [data, setData] = useState([]);
  const [data1,setData1]=useState([]);
  const [data2,setData2]=useState([]);

  const fetchData = async () => {
    try {

      const response1 = await apiClient.get(`/cbic/MIS/returnFiling`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "CurrentMonth",
        },
      });


      // const response11 = await apiClient.get(`/cbic/MIS/scrutiny/assessment`, {
      //   params: {
      //     month_date: newdate,
      //     zone_code: zone_code,
      //     type: "CurrentMonth",
      //   },
      // });

    
      const response12 = await apiClient.get(`/cbic/MIS/adjudication`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "CurrentMonth",
        },
      });

      const response13 = await apiClient.get(`/cbic/MIS/adjudication(legacy cases)`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "CurrentMonth",
        },
      });

      const response14 = await apiClient.get(`/cbic/MIS/refunds`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "CurrentMonth",
        },
      });

      const response15 = await apiClient.get(`/cbic/MIS/appeals`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "CurrentMonth",
        },
      });

      const response2 = await apiClient.get(`/cbic/MIS/returnFiling`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "1_MonthBack",
        },
      });

      // const response21 = await apiClient.get(`/cbic/MIS/scrutiny/assessment`, {
      //   params: {
      //     month_date: newdate,
      //     zone_code: zone_code,
      //     type: "1_MonthBack",
      //   },
      // });

      
      const response22 = await apiClient.get(`/cbic/MIS/adjudication`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "1_MonthBack",
        },
      });

      const response23 = await apiClient.get(`/cbic/MIS/adjudication(legacy cases)`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "1_MonthBack",
        },
      });

      const response24 = await apiClient.get(`/cbic/MIS/refunds`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "1_MonthBack",
        },
      });

      const response25 = await apiClient.get(`/cbic/MIS/appeals`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "1_MonthBack",
        },
      });


      const response3 = await apiClient.get(`/cbic/MIS/returnFiling`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "2_MonthBack",
        },
      });


      // const response31 = await apiClient.get(`/cbic/MIS/scrutiny/assessment`, {
      //   params: {
      //     month_date: newdate,
      //     zone_code: zone_code,
      //     type: "2_MonthBack",
      //   },
      // });

      const response32 = await apiClient.get(`/cbic/MIS/adjudication`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "2_MonthBack",
        },
      });

      const response33 = await apiClient.get(`/cbic/MIS/adjudication(legacy cases)`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "2_MonthBack",
        },
      });

      const response34 = await apiClient.get(`/cbic/MIS/refunds`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "2_MonthBack",
        },
      });

      const response35 = await apiClient.get(`/cbic/MIS/appeals`, {
        params: {
          month_date: newdate,
          zone_code: zone_code,
          type: "2_MonthBack",
        },
      });

      console.log("April:",response1.data);
      console.log("March:",response2.data);
      console.log("February:",response3.data);
      console.log("OverallData",[...response1.data, ...response2.data, ...response3.data]);

      setData([...response1.data, 
        //...response11.data, 
        ...response12.data, ...response13.data, ...response14.data,
        ...response15.data
      ]);
      console.log("Data",data);
      setData1([...response2.data, 
        //...response21.data, 
        ...response22.data, ...response23.data, ...response24.data,
        ...response25.data
      ]);
      console.log("Data1",data1);
      setData2([...response3.data,
         //...response31.data, 
         ...response32.data, ...response33.data, ...response34.data,
        ...response35.data
      ]);
      console.log("Data2",data2);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [newdate]);

  // const chartData = {
  //   series: [
  //     {
  //       name: "Registration",
  //       data: [12, 2, 12, 3, 12],
  //       color: "#4472c4",
  //     },
  //     {
  //       name: "Return Filing",
  //       data: [13, 13, 10, 13, 3],
  //       color: "#ed7d31",
  //     },
  //     {
  //       name: "Scrutiny/Assessment",
  //       data: [8, 8, 8, 8, 2],
  //       color: "#A5A5A5",
  //     },
  //     {
  //       name: "Investigation",
  //       data: [5, 5, 5, 5, 1],
  //       color: "#FFBF00",
  //     },
  //     {
  //       name: "Adjudication",
  //       data: [2, 1, 1, 2, 9],
  //       color: "#5B9BD5",
  //     },
  //     {
  //       name: "adjudication(legacy cases)",
  //       data: [6, 15, 3, 4, 3],
  //       color: "#6EAC44",
  //     },
  //     {
  //       name: "Refunds",
  //       data: [9, 9, 9, 9, 9],
  //       color: "#264478",
  //     },
  //     {
  //       name: "Recovery of Arrears",
  //       data: [4, 4, 1, 4, 2],
  //       color: "#9E480E",
  //     },
  //     {
  //       name: "Arrest & Prosecution",
  //       data: [2, 2, 2, 2, 2],
  //       color: "#636363",
  //     },
  //     {
  //       name: "Audit",
  //       data: [8, 7, 7, 7, 7],
  //       color: "#946C00",
  //     },
  //     {
  //       name: "Appeals",
  //       data: [6, 2, 6, 6, 4],
  //       color: "#5D87AD",
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       type: "bar",
  //       options3d: {
  //         enabled: true,
  //         depth: 20,
  //         viewDistance: 25,
  //       },
  //       height: 200,
  //       stacked: true,
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     xaxis: {
  //       type: "text",
  //       categories: ["Siliguri", "Kolkata-North", "Howrah", "Haldia", "Bolpur"],
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
  //       x: {
  //         show: false,
  //       },
  //       y: {
  //         formatter: function (value) {
  //           return value + "%";
  //         },
  //       },
  //     },
  //   },
  // };

  const linechart = {
    series: [
      {
        name: "KOLKATA -(April 2022)",
        data: [10, 7, 6, 12, 16, 5, 9, 4, 2, 7, 8],
      },
      {
        name: "KOLKATA -(April 2023)",
        data: [5, 2, 13, 8, 6, 15, 4, 9, 7, 2, 10],
      },
      {
        name: "KOLKATA -(April 2024)",
        data: [10, 5, 8, 13, 7, 10, 12, 5, 6, 9, 11],
      },
      // {
      //   name:data.map(item=>item.zoneName),
      //   data:data.map(item=>{item.total_score_of_year})),
      // },
      // {
      //   name:data.map(item=>item.zoneName),
      //   data:data.map(item=>{item.total_score_previous_year})),
      // },
      // {
      //   name:data.map(item=>item.zoneName),
      //   data:data.map(item=>{item.total_score_previous_year_2})),
      // }
    ],
    options: {
      chart: {
        type: "line",
        stacked: true,
        height: 400,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        width: "100%",
        id: "linechartyear",
        events: {
          click: function (event, chartContext, config) {
            // setTimeout(() => {
            const labels = document.querySelectorAll(
              "#linechartyear .apexcharts-xaxis-texts-g text"
            );
            labels.forEach((label, index) => {
              label.style.cursor = "pointer";
              label.addEventListener("click", () =>
                handleyearLabelClick(linechart.options.xaxis.categories[index])
              );
            });
            // }, 0);
            // const label= linechartmonth.options.xaxis.categories[config.dataPointIndex];
            // handlemonthLabelClick(label);
          },
        },
      },
      markers: {
        size: 4,
        shape: "circle",
      },
      responsive: [
        {
          breakpoint: 500,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "text",
        categories: [
          "Registration",
          "Return Filing",
          //"	Scrutiny/Assessment",
          "Investigation",
          "Adjudication",
          "adjudication(legacy cases)",
          "Refunds",
          "Recovery of Arrears",
          "Arrest & Prosecution",
          "Audit",
          "Appeals",
        ],
        // categories:data.map(item=>({label:item.padrameter_name})),
        tickPlacement: "between",
        labels: {
          style: {
            fontSize: "10px",
            width: "200px",
            height: "20px",
            cursor: "pointer",
          },
        },
      },
      // yaxis: {
      //   min: 0,
      //   max: 100,
      //   tickAmount: 10,
      // },
      legend: {
        position: "bottom",
        offsetY: 8,
        onItemClick: false,
      },
    },
  };

  const getFormattedMonth = (now) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    });
    return formatter.format(now);
  };

  const getCurrentMonth = () => {
    const date = new Date(selectedDate);
    return getFormattedMonth(date);
  };

  const getPreviousMonth = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - 1);
    return getFormattedMonth(date);
  };

  const getPreviousMonth2 = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - 2);
    return getFormattedMonth(date);
  };

  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();
  const previousMonth2 = getPreviousMonth2();

  const linechartmonth = {
    series: [
      // {
      //   name: "KOLKATA -(February 2024)",
      //   data: [5, 10, 13, 8, 6, 15, 4, 9, 7, 2, 12],
      // },
      // {
      //   name: "KOLKATA -(March 2024)",
      //   data: [10, 5, 8, 13, 7, 10, 12, 5, 6, 9, 4],
      // },
      // {
      //   name: "KOLKATA -(April 2024)",
      //   data: [4, 10, 6, 5, 12, 10, 7, 14, 8, 6, 10],
      // },
      {
        name: data2.map(
          (item) => `${item.zoneName}(${previousMonth2.toUpperCase()})`
        )[0],
        data:data2.map((item)=>item.sub_parameter_weighted_average),
      },
      {
        name: data1.map(
          (item) => `${item.zoneName}(${previousMonth.toUpperCase()})`
        )[0],
        data:data1.map((item)=>item.sub_parameter_weighted_average),
      },
      {
        name: data.map(
          (item) => `${item.zoneName}(${currentMonth.toUpperCase()})`
        )[0],
        data:data.map((item)=>item.sub_parameter_weighted_average),
      },
    ],
    options: {
      chart: {
        type: "line",
        // height: 200,
        stacked: false,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        width: "100%",
        id: "linechartmonth",
        events: {
          click: function (event, chartContext, config) {
            // setTimeout(() => {
            const labels = document.querySelectorAll(
              "#linechartmonth .apexcharts-xaxis-texts-g text"
            );
            labels.forEach((label, index) => {
              label.style.cursor = "pointer";
              label.addEventListener("click", () =>
                handlemonthLabelClick(
                  linechartmonth.options.xaxis.categories[index]
                )
              );
            });
            // }, 0);
            // const label= linechartmonth.options.xaxis.categories[config.dataPointIndex];
            // handlemonthLabelClick(label);
          },
        },
      },
      markers: {
        size: 4,
        shape: "circle",
      },
      responsive: [
        {
          breakpoint: 500,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories:data.map(item=>(item.ra==="Percentage of returns which were due but not filed vis-à-vis total returns due")?
        "RETURN FILING":(item.ra==="Number of refunds applications pending beyond 60 days of receipt vis-à-vis total number of refunds applications pending at the end of the month"
        )?"REFUNDS":item.ra.toUpperCase()),
        tickPlacement: "between",
        labels: {
          style: {
            fontSize: "10px",
            width: "500px",
            height: "100px",
            cursor: "pointer",
          },
        },
      },
      legend: {
        position: "bottom",
        offsetY: 8,
        onItemClick: false,
      },
      // tooltip: {
      //   enabled: false,
      // },
    },
  };

  const renderModalContentmonth = (label) => {

    const linechartmonthregistration = {
      series: [],
      options: {
        chart: {
          type: "line",
          height: 200,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        markers: {
          size: 4,
          shape: "circle",
        },
        title: {
          text: `Month Wise ${label}`,
          align: "center",
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Times New Roman",
            color: "#263238",
          },
        },
        responsive: [
          {
            breakpoint: 500,
          },
        ],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "category",
          categories:[`${previousMonth2}`, `${previousMonth}`, `${currentMonth}`],
          tickPlacement: "between",
          title: {
            text: label,
            style: {
              color: "#000fff",
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-title",
            },
          },
        },
        tooltip: {
          enabled: true,
          y: {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      },
    };

    if(label==="Return Filling"){
      linechartmonthregistration.series.push({
        name:data.map(item=>item.padrameter_name)[0],
        data:data.map(item=>[item.total_score_previous_month_2, item.total_score_previous_month, item.total_score_of_month])[0],
      });
    }
    else if(label==="Scrutiny & Assessment"){
      linechartmonthregistration.series.push({
        name:data.map(item=>item.padrameter_name)[1],
        data:data.map(item=>[item.total_score_previous_month_2, item.total_score_previous_month, item.total_score_of_month])[1],
      });
    }

    else if(label==="Refunds"){
      linechartmonthregistration.series.push({
        name:data.map(item=>item.padrameter_name)[2],
        data:data.map(item=>[item.total_score_previous_month_2, item.total_score_previous_month, item.total_score_of_month])[2],
      });
    }
    else{
      linechartmonthregistration.series.push({
        name:data.map(item=>item.padrameter_name),
        data:data.map(item=>[item.total_score_previous_month_2, item.total_score_previous_month, item.total_score_of_month]),
      });
    }

    switch (label) {
      case "Return Filling":
        case "Scrutiny & Assessment":
          case "Refunds":
        return (
          <Box sx={style}>
            <Button onClick={handlemonthClose} sx={close}>
              <CloseIcon sx={close} />
            </Button>
            <ReactApexChart
              options={linechartmonthregistration.options}
              series={linechartmonthregistration.series}
              type="line"
              height={400}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  const renderModalContentyear = (label) => {

    const linechartyearregistration = {
      series: [
        {
          name: "Registration",
          data: [10, 5, 10],
        },
      ],
      options: {
        chart: {
          type: "line",
          height: 200,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 500,
          },
        ],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "category",
          categories: ["April 2022", "April 2023", "April 2024"],
          tickPlacement: "between",
          title: {
            text: "Registration",
            style: {
              color: "#000fff",
              fontSize: "20px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-title",
            },
          },
        },
        yaxis: {
          min: 0,
          max: 16,
          tickAmount: 8,
        },
        title: {
          text: "Year-wise Registration",
          align: "center",
          style: {
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Times New Roman",
            color: "#263238",
          },
        },
        tooltip: {
          enabled: true,
          y: {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        },
      },
    };
  
    switch (label) {
      case "Registration":
        return (
          <Box sx={style}>
            <Button onClick={handleyearClose} className="closebtn">
              <CloseIcon sx={close} />
            </Button>
            <ReactApexChart
              options={linechartyearregistration.options}
              series={linechartyearregistration.series}
              type="line"
              height={400}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  // am4core.options.commercialLicense = true;
  // const chartRef = useRef(null);
  // useEffect(() => {
  //   // Themes begin

  //   am4core.useTheme(am4themes_animated);
  //   // Themes end
  //   am4core.useTheme(am4themes_animated);
  //   // Themes end

  //   var chart = am4core.create("chartdiv", am4charts.PieChart3D);
  //   chart.preloader.disabled = true;
  //   chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
  //   // var chart = am4core.create("chartdiv", am4charts.PieChart3D);
  //   // chart.preloader.disabled = true;
  //   // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  //chart.legend = new am4charts.Legend();

  //   chart.data = [
  //     {
  //       Parameter: "Registration",
  //       5,
  //       color: am4core.color("#4472c4"),
  //     },
  //     {
  //       Parameter: "Return Filing",
  //       10,
  //       color: am4core.color("#ed7d31"),
  //     },
  //     {
  //       Parameter: "Scrutiny/Assessment",
  //       13,
  //       color: am4core.color("#264442"),
  //     },
  //     {
  //       Parameter: "Investigation",
  //       8,
  //       color: am4core.color("#FFBF00"),
  //     },
  //     {
  //       Parameter: "Adjudication",
  //       6,
  //       color: am4core.color("#5B9BD5"),
  //     },
  //     {
  //       Parameter: "adjudication(legacy cases)",
  //       15,
  //       color: am4core.color("#6EAC44"),
  //     },
  //     {
  //       Parameter: "Refunds",
  //       4,
  //       color: am4core.color("#A5A5A5"),
  //     },
  //     {
  //       Parameter: "Recovery of Arrears",
  //       9,
  //       color: am4core.color("#9E480E"),
  //     },
  //     {
  //       Parameter: "Arrest & Prosecution",
  //       7,
  //       color: am4core.color("#636363"),
  //     },
  //     {
  //       Parameter: "Audit",
  //       2,
  //       color: am4core.color("#946C00"),
  //     },
  //     {
  //       Parameter: "Appeals",
  //       12,
  //       color: am4core.color("#5D87AD"),
  //     },
  //   ];
  //   // chart.data = [
  //   //   {
  //   //     Parameter: "Registration",
  //   //     5,
  //   //     color: am4core.color("#4472c4"),
  //   //   },
  //   //   {
  //   //     Parameter: "Return Filing",
  //   //     10,
  //   //     color: am4core.color("#ed7d31"),
  //   //   },
  //   //   {
  //   //     Parameter: "Scrutiny/Assessment",
  //   //     13,
  //   //     color: am4core.color("#264442"),
  //   //   },
  //   //   {
  //   //     Parameter: "Investigation",
  //   //     8,
  //   //     color: am4core.color("#FFBF00"),
  //   //   },
  //   //   {
  //   //     Parameter: "Adjudication",
  //   //     6,
  //   //     color: am4core.color("#5B9BD5"),
  //   //   },
  //   //   {
  //   //     Parameter: "adjudication(legacy cases)",
  //   //     15,
  //   //     color: am4core.color("#6EAC44"),
  //   //   },
  //   //   {
  //   //     Parameter: "Refunds",
  //   //     4,
  //   //     color: am4core.color("#A5A5A5"),
  //   //   },
  //   //   {
  //   //     Parameter: "Recovery of Arrears",
  //   //     9,
  //   //     color: am4core.color("#9E480E"),
  //   //   },
  //   //   {
  //   //     Parameter: "Arrest & Prosecution",
  //   //     7,
  //   //     color: am4core.color("#636363"),
  //   //   },
  //   //   {
  //   //     Parameter: "Audit",
  //   //     2,
  //   //     color: am4core.color("#946C00"),
  //   //   },
  //   //   {
  //   //     Parameter: "Appeals",
  //   //     12,
  //   //     color: am4core.color("#5D87AD"),
  //   //   },
  //   // ];

  //   var series = chart.series.push(new am4charts.PieSeries3D());
  //   series.dataFields.value = "value";
  //   series.dataFields.category = "Parameter";
  //   series.labels.template.disabled = false;
  //   series.labels.template.text = "{value}";
  //   series.ticks.template.disabled = true;
  //   series.alignLabels = false;
  //   //series.labels.template.relativeRotation=180;
  //   series.legendSettings.labelText = "{Parameter}";
  //   series.legendSettings.valueText = " ";
  //   series.slices.template.tooltipText =
  //     "[bold]{Parameter}[/]\n Absolute no. : {value}\n Percentage : {value.percent.formatNumber('#.0')}%";
  //   series.slices.template.propertyFields.fill = "color";
  //   series.labels.template.marginTop = am4core.Percent(100);

  //   // series.labels.template.text="{category}";
  //   series.legendSettings.labelText = "{category}";
  //   chart.legend.fontSize = "12px";
  //   chart.legend.labels.template.text = "{Parameter}";
  //   chart.legend.position = "bottom";
  //   chart.legend.layout = "grid";

  //   let marker = chart.legend.markers.template;
  //   marker.width = 10;
  //   marker.height = 10;
  //   // let marker = chart.legend.markers.template;
  //   // marker.width = 10;
  //   // marker.height = 10;

  //   // chartRef.current = chart;

  // //   // series.labels.template.adapter.add("radius", function (radius, target) {
  // //   //   if (target.dataItem && target.dataItem.values.value.percent < 100) {
  // //   //     return 0;
  // //   //   }
  // //   //   return radius;
  // //   // });

  //   return () => {
  //     if (chartRef.current) {
  //       chartRef.current.dispose();
  //     }
  //   };
  // }, []);
  // const piechart = {
  //   series: [5, 10, 13, 8, 6, 15, 4, 9, 7, 2, 12],
  //   options: {
  //     chart: {
  //       type: "pie",
  //       options3d: {
  //         enabled: true,
  //         alpha: 45,
  //         beta: 90,
  //       },
  //     },
  //     labels: [
  //       "Registration",
  //       "Return Filing",
  //       "Scrutiny/Assessment",
  //       "Investigation",
  //       "Adjudication",
  //       "adjudication(legacy cases)",
  //       "Refunds",
  //       "Recovery of Arrears",
  //       "Arrest & Prosecution",
  //       "Audit",
  //       "Appeals",
  //     ],
  //     colors: [
  //       "#4472c4",
  //       "#ed7d31",
  //       "#A5A5A5",
  //       "#FFBF00",
  //       "#5B9BD5",
  //       "#6EAC44",
  //       "#264478",
  //       "#9E480E",
  //       "#636363",
  //       "#946C00",
  //       "#5D87AD",
  //     ],
  //     tooltip: {
  //       enabled: true,
  //       y: {
  //         formatter: function (value) {
  //           return value + "%";
  //         },
  //       },
  //     },
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           legend: {
  //             position: "bottom",
  //           },
  //         },
  //       },
  //     ],

  //     legend: {
  //       position: "bottom",
  //       onItemClick: false,
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     plotOptions: {
  //       pie: {
  //         {},
  //       },
  //     },
  //   },
  // };

  // const piechart = {
  //   chart: {
  //     caption: "Market Share of Web Servers",
  //     subCaption: "2024",
  //     showValues: "1",
  //     showPercentInTooltip: "0",
  //     numberPrefix: "$",
  //     enableMultiSlicing: "1",
  //     theme: "fusion",
  //     plottooltext: "<b>$percentValue</b> of web servers run on <b>$label</b>",
  //   },
  //   data: [
  //     {
  //       label: "Apache",
  //       "32647479",
  //     },
  //     {
  //       label: "Microsoft",
  //       "22100932",
  //     },
  //     {
  //       label: "Zeus",
  //       "14376",
  //     },
  //     {
  //       label: "Other",
  //       "18674221",
  //     },
  //   ],
  // };
  
  

  
  return (
    <>
      <div className="body flex-grow-1 custom-sec">
        <div className="container-lg px-4">
          <div className="row">
            <div className="col-md-4 col-lg-3 mb-4">
              <div className="date-main">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker", "DatePicker", "DatePicker"]}
                  >
                    <DatePicker
                      label={"Month and Year"}
                      views={["month", "year"]}
                      // minDate={dayjs("2024-04-01")}
                      maxDate={dayjs().subtract(1, "month").startOf("month")}
                      value={selectedDate}
                      onChange={handleChangeDate}
                      renderInput={(params) => <TextField {...params} />}
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
            <div className="col-md-3"></div>
            <div className="col-md-4 order-3 order-lg-3">
              <div className="switches-container">
                <input
                  type="radio"
                  id="switchMonthly"
                  name="switchPlan"
                  value="Monthly"
                  onChange={handlemonthClick}
                  checked={selected === "Monthly"}
                  onClick={() => setActiveChart("Monthly")}
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  value="Yearly"
                  onChange={handleyearClick}
                  checked={selected === "Yearly"}
                  onClick={() => setActiveChart("Yearly")}
                />
                <label htmlFor="switchMonthly">Monthly</label>
                <label htmlFor="switchYearly">Yearly</label>
                <div className="switch-wrapper">
                  <div className="switch">
                    <div>Monthly</div>
                    <div>Yearly</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2 order-4 mb-4 mt-2">
              <div className="view-btn">
                <Link to="/cgst">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            {/* <div className="col-md-6 mb-6 order-2 order-lg-2">
              <div className="card">
                <div className="card-header">
                  <strong>Commissionerate Wise Ranking</strong>
                  <span className="small ms-1">View Details</span>
                </div>
                <div className="card-body">
                  <Commdata selectedDate={selectedDate} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-6 order-4 order-lg-4"> */}
              {/* {toggle ? ( */}
              {activeChart === "Monthly" ? (
                <div className="card mb-5">
                  <div className="card-header">
                    <strong>Month Wise</strong>
                    {/* <span className='small ms-1' onClick={handlemonthOpen2}>
                      View Details
                    </span> */}
                  </div>
                  <div className="card-body">
                    <ReactApexChart
                      options={linechartmonth.options}
                      series={linechartmonth.series}
                      type="line"
                      height={400}
                      id="linechartmonth"
                    />
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={ismonthModalOpen}
                      onHide={handlemonthClose}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Fade in={ismonthModalOpen}>
                        {renderModalContentmonth(monthClickedLabel)}
                      </Fade>
                    </Modal>
                  </div>
                </div>
              ) : (
                <div className="card mb-5">
                  <div className="card-header">
                    <strong>Year Wise</strong>
                    {/* <span className='small ms-1' onClick={handlemonthOpen}>
                      View Details
                    </span> */}
                  </div>
                  <div className="card-body">
                    <ReactApexChart
                      options={linechart.options}
                      series={linechart.series}
                      type="line"
                      height={400}
                      id="linechartyear"
                    />
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={isyearModalOpen}
                      onHide={handleyearClose}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Fade in={isyearModalOpen}>
                        {renderModalContentyear(yearClickedLabel)}
                      </Fade>
                    </Modal>
                  </div>
                </div>
              )}
              {/* )} */}
            {/* </div> */}
            {/* <div className='col-md-4 order-1 order-lg-1'>
              <div className='switches-container mt-5 mb-4'>
                <input
                  type='radio'
                  id='switchMonthly'
                  name='switchPlan'
                  value='Monthly'
                  onChange={handlemonthClick}
                  checked={selected==='Monthly'}
                />
                <input
                  type='radio'
                  id='switchYearly'
                  name='switchPlan'
                  value='Yearly'
                  onChange={handlemonthClick}
                  checked={selected==='Yearly'}
                />
                <label htmlFor='switchMonthly'>Monthly</label>
                <label htmlFor='switchYearly'>Yearly</label>
                <div className='switch-wrapper'>
                  <div className='switch'>
                    <div>Monthly</div>
                    <div>Yearly</div>
                  </div>
                </div>
              </div>
            </div> */}
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
      </div>
    </>
  );
};

export default Kolkata;
