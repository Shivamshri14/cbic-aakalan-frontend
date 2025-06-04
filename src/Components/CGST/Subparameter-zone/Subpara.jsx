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
import apiClient from "../../../Service/ApiClient";
import "./Subpara.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Spinner from "../../Spinner";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
var relevantAspects;
var type;

// const urlParmeter= new URLSearchParams(window.location.search);
// var urlname= urlParmeter.get('name');
const Subpara = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const [data, setData] = useState([]);
  const [response, setResponse] = useState(null);
  const [value2, setValue] = useState(
    dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  console.log("test", selectedDate);
  // const [selectedOption, setSelectedOption]=useState("Zones");

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { type } = queryParams;
  const [loading, setloading] = useState(true);
  const [sort, setSort] = useState([]);
  const [bardata, setBarData] = useState([]);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [itemsSelect, setItemsSelect] = useState(() => {
    const savedNumber = localStorage.getItem("itemsSelect");
    return savedNumber ? Number(savedNumber) : 5;
  });

  const handleNumberChange = (number) => {
    setItemsSelect(number);
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

      // Extract the relevant_aspect value from each item in the response data
      relevantAspects = response.data.map((item) => item.relevant_aspect)[0];

      // Log the relevant_aspect values to the console
      console.log("relevant_aspect values:", relevantAspects);

      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      // const sorted = response.data.sort((a, b) => a.total_score - b.total_score);

      // console.log("Sorted:", sorted);
      // const topfive = sorted.slice(0, 5);
      // const bottomfive = sorted.slice(-5);
      // setBarData([...topfive, ...bottomfive]);

      if(name==="gst7"){
        const sorted = response.data.sort((a, b) => a.total_score - b.total_score);

      console.log("Sorted:", sorted);
      const topfive = sorted.slice(0, 5);
      const bottomfive = sorted.slice(-5);
      setBarData([...topfive, ...bottomfive]);
      }

      const enhancedData = response.data.map((item, index) => {
        let props = {};
        const total = response.data.length;
        console.log("Total", total);
        const firstquarter = total * 0.25;
        console.log("FirstQuarter", firstquarter);
        const secondquarter = total * 0.5;
        console.log("SecondQuarter", secondquarter);
        const thirdquarter = total * 0.75;
        console.log("ThirdQuarter", thirdquarter);

        if (index < firstquarter) {
          props = { scope: "row", color: "success" }; // Top 5 entries
        } else if (index >= firstquarter && index < secondquarter) {
          props = { scope: "row", color: "warning" };
        } else if (index >= thirdquarter) {
          props = { scope: "row", color: "danger" }; // Bottom 5 entries
        } else {
          props = { scope: "row", color: "primary" }; // Remaining entries
        }

        return {
          ...item,
          _props: props, // Add _props field dynamically
          s_no: index + 1,
        };
      });

      if (
        name === "gst3a" ||
        name === "gst3b" ||
        name === "gst2" || name==="gst7"||
        name === "gst4a" ||
        name === "gst4b" ||
        name === "gst4c" ||
        name === "gst4d" ||
        name === "gst5a" || 
        name === "gst5b" ||
        name === "gst1a" ||
        name === "gst1b" ||
        name === "gst1c" ||
        name === "gst1d" ||
        name === "gst1e" ||
        name === "gst1f" ||
        name === "gst6a" ||
        name === "gst6b" ||
        name === "gst6c" ||
        name === "gst6d" ||
        name === "gst11b" ||
        name === "gst11d" ||
        name === "gst11a" ||
        name === "gst11c" ||
        name === "gst8a" ||
        name === "gst8b" ||
        name === "gst9a" ||
        name === "gst9b" ||
        name === "gst10a" ||
        name === "gst10b" ||
        name === "gst10c"
      ) {
        setData(enhancedData);
      }

      console.log("COLOR CODE", enhancedData);

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

      // Extract the relevant_aspect value from each item in the response data
      relevantAspects = response.data.map((item) => item.relevant_aspect)[0];

      // Log the relevant_aspect values to the console
      console.log("relevant_aspect values:", relevantAspects);

      // Set the fetched data in the component's state
      
      const sorted = response.data.sort(
        (a, b) => a.total_score - b.total_score
      );

      const sorted1= response.data.sort((a,b)=>b.total_score-a.total_score);

      if(name==="gst1e"||name==="gst1f"||name==="gst2"||name==="gst4b"||name==="gst5b"||name==="gst6b"
        ||name==="gst6d"||name==="gst7"||name==="gst8b"||name==="gst10b"|| name==="gst1d"|| name==="gst11d"|| name==="gst11b"|| name==="gst1b" || name==="gst1c"){
        const sorted = response.data.sort((a, b) => a.total_score - b.total_score);

      console.log("Sorted:", sorted);
      const topfive = sorted.slice(0, 5);
      const bottomfive = sorted.slice(-5);
      setBarData([...topfive, ...bottomfive]);
      }

      if(name==="gst7"){
        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        console.log("sorted",sorted);
      }
      else if(name==="gst11c" || name==="gst11a"|| name==="gst10c"){
        setData(sorted1.map((item,index)=>({...item, s_no:index+1})));
        console.log("sorted1",sorted1);
      }
      else{
        setData(
          response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
        );
      }
      
      const topfive = sorted.slice(0, 5);
      const bottomfive = sorted.slice(-5);
      setBarData([...topfive, ...bottomfive]);

      // Log the fetched data to the console
      console.log("hello12345678", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  // Call fetchData when the component mounts or when the name parameter changes
  useEffect(() => {
    if (selectedOption1 === "Zones") {
      fetchData(name);
    } else {
      fetchDatacomm(name);
    }

    localStorage.setItem("itemsSelect", itemsSelect);
  }, [name, newdate, selectedOption1, itemsSelect]); // Empty dependency array indicates that this effect runs only once

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
    },
    {
      key: "zone_name",
      label: `Zone`,
    },
    {
      key: "commissionerate_name",
      label: "Commissionerate",
      // render: (value) => {
      //   if ((value = "GST 1A ")) {
      //     return <Link to="/custom">{value}</Link>;
      //   } else {
      //     return value;
      //   }
      // },
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Number",
    // },
    // {
    //   key: "total_score",
    //   label: "Percentage % (For the Month)",
    // },

    // {
    //   key: "rank",
    //   label: "Total Score (For the Month)",
    //   field: "total_score",
    // },
  ];

  const columnscomm = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: "commissionerate_name",
      label: "Commissionerate",
    },
    {
      key: "zone_name",
      label: `Zone`,
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Number",
    // },
    {
      key: "total_score",
      label: "Percentage for the Month",
    },

    // {
    //   key: "rank",
    //   label: "Total Score (For the Month)",
    //   field: "total_score",
    // },
  ];

  if (name === "gst1a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Applications cleared  (in 7 days ) /Application filed",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 1)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Applications cleared  (in 7 days ) /Application filed",
    });

    columnscomm.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columnscomm.splice(6,0,{
      key:'insentavization',
      label:'Incentivisation'
    })

    columnscomm.splice(7,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average(out of 1)',
    })
  } else if (name === "gst1b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "PV not completed ( in 30 days ) /Applications marked for PV",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(6,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average(out of 1)',
    })

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "PV not completed ( in 30 days ) /Applications marked for PV",
    });

    columnscomm.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columnscomm.splice(6,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average(out of 1)',
    })
  } else if (name === "gst1c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Deemed registrations /Applications received",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 1)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Deemed registrations /Applications received",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 1)",
    });
  } else if (name === "gst1d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg applications pending /Applications received",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 1)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Reg applications pending /Applications received",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 1)",
    });
  } else if (name === "gst1e") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for cancellation/Initiated for cancellation",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for cancellation/Initiated for cancellation",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });
  } else if (name === "gst1f") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for revocation/ received for revocation",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for revocation/ received for revocation",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });
  } else if (name === "gst2") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Return Not Filed (Monthly)/Total Returns Due(Monthly)",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage Not Filed",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10) ",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(Out of 10)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Return Not Filed (Monthly)/Total Returns Due(Monthly)",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(Out of 10)",
    });
  } else if (name === "gst3a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Scrutiny completed/Returns pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation ",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Score out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Scrutiny completed/Returns pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst3b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections (Amount in lakhs)",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10) ",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation ",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections (Amount in lakhs)",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation ",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst4a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Investigation completed/total investigations pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Investigation completed/total investigations pending",
    });
    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });
  } else if (name === "gst4b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:
        "Investigations pending beyond 01 year/total number of investigation cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label:
        "Investigations pending beyond 01 year/total number of investigation cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });
  } else if (name === "gst4c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Detections/revenue collected (Amount in Lakhs)",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Detections/revenue collected (Amount in Lakhs)",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2)",
    });
  } else if (name === "gst4d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections (Amount in Lakhs)",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections (Amount in Lakhs)",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2)",
    });
  } else if (name === "gst5a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Adjudication cases disposed / Adjudication pending cases ",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Adjudication cases disposed / Adjudication pending cases ",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation ",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst5b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:
        "Time left for adjudication < 6 months / total adjudication cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label:
        "Time left for adjudication < 6 months / total adjudication cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst6a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases disposed /Total ST case pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases disposed /Total ST case pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });
  } else if (name === "gst6b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases pending for >1 year/Total ST case pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases pending for >1 year/Total ST case pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });
  } else if (name === "gst6c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases disposed / Total Cex cases",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases disposed / Total Cex",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });
  } else if (name === "gst6d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases pending > 1year/Total Cex",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases pending > 1year/Total Cex",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });
  } else if (name === "gst7") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Refunds pending > 60 days/Total refund pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(Out of 10)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Refunds pending > 60 days/Total refund pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(Out of 10)",
    });
  } else if (name === "gst8a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears recoverable/Target upto the month (In lakhs)",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 6)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears recoverable/Target upto the month (In lakhs)",
    });

    // columnscomm.splice(4, 0, {
    //   key: "total_score",
    //   label: "Percentage for the month",
    // });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 6)",
    });
  } else if (name === "gst8b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears pending >1 year/ Total arrears pending (In lakhs) ",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 4)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears pending >1 year/ Total arrears pending (In lakhs)",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 4)",
    });
  } else if (name === "gst9a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:
        "Prosecution not launched within 2 months/ Prosecution sanctioned  ",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label:
        "Prosecution not launched within 2 months/ Prosecution sanctioned  ",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst9b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Prosecution launched /Total arrests",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Prosecution launched /Total arrests",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 5)",
    });
  } else if (name === "gst10a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Taxpayer audited/ Total taxpayer allotted",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 4)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Taxpayer audited/ Total taxpayer allotted",
    });

    columnscomm.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columnscomm.splice(6,0,{
      key:'insentavization',
      label:'Incentivisation'
    })

    columnscomm.splice(7,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average (Out of 4)',
    })
  } else if (name === "gst10b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Audit Paras >6 months/Total audit paras pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average (Out of 3)',
    })

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Audit Paras >6 months/Total audit paras pending",
    });

    columnscomm.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average (Out of 3)',
    })
  } else if (name === "gst10c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/Detections in Lakhs",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/Detections in Lakhs",
    });

    columnscomm.splice(5,0,{
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6,0,{
      key:'insentavization',
      label:'Incentivisation'
    })

    columnscomm.splice(7,0,{
      key:'sub_parameter_weighted_average',
      label:'Weighted Average (Out of 3)',
    })
  } else if (name === "gst11a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "(Commissioner) appeal cases disposed /Total appeal cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "(Commissioner) appeal cases disposed /Total appeal cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 2.5)",
    });
  } else if (name === "gst11b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Commissioner appeal cases >1year /Total appeal cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Commissioner appeal cases >1year /Total appeal cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else if (name === "gst11c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC appeal cases disposed /Total appeal cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC appeal cases disposed /Total appeal cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "insentavization",
      label: "Incentivisation",
    });

    columnscomm.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else if (name === "gst11d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC Appeals cases >1 year/ Total appeal cases pending",
    });

    columns.splice(4, 0, {
      key: "total_score",
      label: "Percentage for the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC Appeals cases >1 year/ Total appeal cases pending",
    });

    columnscomm.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columnscomm.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columnscomm.splice(3, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });
  }

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
    onSelectedOption1(event.target.value);
    console.log(event.target.value);

    if (selectedOption1) {
      setloading(true);
    } else {
      setloading(true);
    }
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
    const exportData =
      selectedOption1 === "Zones"
        ? data.map((user) => {
            switch (name) {
              case "gst1a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Applications cleared  (in 7 days ) /Application field":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average": user.sub_parameter_weighted_average,
                };
              }
              case "gst1b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "PV not completed ( in 30 days ) /Applications marked":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst1c":
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Deemed registrations/Applications received":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (out of 1)":
                    user.sub_parameter_weighted_average,
                };

              case "gst1d":
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Applications pending/Applications received":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 1)":
                    user.sub_parameter_weighted_average,
                };

              case "gst1e": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Pending for cancellation/Initiated for cancellation":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst1f": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Pending for revocation/ Received for revocation":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst2": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Returns Not Filed/Total Returns Due": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage Not Filed": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average(Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst3a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Scrutiny completed/Returns pending": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation ": user.insentavization,
                  "Weighted Average(Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst3b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Recoveries/Detections (Amount in lakhs)": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation ": user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Investigation completed/Total investigations pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Investigations pending beyond 01 year/Total number of investigation cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Detections/Revenue collected (Amount in Lakhs)":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Recoveries/Detections (Amount in Lakhs)": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst5a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Adjudication cases disposed / Adjudication pending cases ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation ": user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst5b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Time left for adjudication < 6 months / Total adjudication cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ST cases disposed /Total ST case pending": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ST cases pending for >1 year/Total ST case pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Cex cases disposed / Total Cex cases ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Cex cases pending > 1year/Total Cex ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst7": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Refunds pending > 60 days/Total refund pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 10)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst8a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Arrears recoverable/Target upto the month":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 6)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst8b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Arrears pending >1 year/ Total arrears pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst9a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Prosecution not launched within 2 months/ Prosecution sanctioned ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst9b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Prosecution launched /Total arrests": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst10a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Taxpayer audited/ Total taxpayer allotted":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (Out of 4)": user.sub_parameter_weighted_average,
                };
              }

              case "gst10b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Audit Paras >6 months/Total audit paras pending  ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst10c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Recoveries/Detections": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (Out of 3)": user.sub_parameter_weighted_average,
                };
              }

              case "gst11a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "(Commissioner) appeal cases /Total pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Commissioner appeal cases >1year /Total appeal cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ADC/JC appeal cases disposed/ Total appeal cases pending ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ADC/JC Appeals cases >1 year/ Total appeal cases pending ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }
              default:
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Absolute Value": user.absolutevale,
                  Ratio: user.ratio,
                  "Total Score": user.total_score,
                };
            }
            // Customize object properties to match desired format
          })
        : data.map((user) => {
            switch (name) {
              case "gst1a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Applications cleared  (in 7 days) /Application field":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  // "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  // Incentivisation: user.insentavization,
                  // "Weighted Average":
                  //   user.sub_parameter_weighted_average,
                };
              }
              case "gst1b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "PV not completed (in 30 days) /Applications marked":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average": user.sub_parameter_weighted_average,
                };
              }

              case "gst1c":
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Deemed registrations/Applications received":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (out of 1)":
                    user.sub_parameter_weighted_average,
                };

              case "gst1d":
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Applications Pending/Applications received":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 1)":
                    user.sub_parameter_weighted_average,
                };

              case "gst1e": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  " Reg pending for cancellation/Initiated for cancellation":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst1f": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Reg pending for revocation/ Received for revocation":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst2": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Returns Not Filed/Total Returns Due": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 10)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst3a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Scrutiny completed/Returns pending": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation ": user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst3b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Recoveries/Detections (Amount in lakhs)": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation ": user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Investigation completed/Total investigations pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Investigations pending beyond 01 year/Total number of investigation cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4c": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Detections/Revenue collected (Amount in Lakhs)":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4d": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Recoveries/Detections (Amount in Lakhs)": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst5a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Adjudication cases disposed / Adjudication pending cases ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Incentivisation (Median=1105)": user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst5b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Time left for adjudication < 6 months / Total adjudication cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "ST cases disposed /Total ST case pending": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "ST cases pending for >1 year/Total ST case pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6c": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Cex cases disposed / Total Cex ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6d": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Cex cases pending > 1year/Total Cex ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst7": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Refunds pending > 60 days/Total refund pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 10)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst8a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Arrears recoverable/Target upto the month":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 6)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst8b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Arrears pending >1 year/ Total arrears pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst9a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Prosecution not launched within 2 months/ Prosecution sanctioned ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst9b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Prosecution launched /Total arrests": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst10a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Taxpayer audited/ Total taxpayer allotted":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst10b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Audit Paras >6 months/Total audit paras pending  ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average(Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst10c": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Recoveries/Detections": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11a": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Commissioner appeal cases disposed /Total appeal cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11b": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "Commissioner appeal cases >1year /Total appeal cases pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (Out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11c": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "ADC/JC appeal cases disposed/ Total appeal cases pending ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Weighted Average (out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11d": {
                return {
                  SNo: user.s_no,
                  Commissionerate: user.commissionerate_name,
                  Zone: user.zone_name,
                  "ADC/JC Appeals cases >1 year/ Total pending ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage for the month": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  "Weighted Average (out of 2.5)":
                    user.sub_parameter_weighted_average,
                };
              }
              default:
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Absolute Value": user.absolutevale,
                  Ratio: user.ratio,
                  "Total Score": user.total_score,
                };
            }
          });
    return exportData;
  };

  const exportToXLS = () => {
    const data = handleExport();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    const rowHeights = [70, 200, 200, 150, 150, 150, 150, 150];

    for (let i = 0; i < rowHeights.length; i++) {
      ws["!cols"] = ws["!cols"] || [];
      ws["!cols"][i] = { wpx: rowHeights[i] };

      for (let j = 0; j < rowHeights[i].length; j++) {
        const cell = ws[XLSX.utils.encode_cell({ c: i, r: j })];

        if (cell) {
          cell.s = {
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "my_data.xlsx");
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
    zone_name: (item) => (
      <td>
        {/* <a
          href={`/Subcom?zone_code=${item.zone_code}&name=${name}`}
        > */}
        {item.zone_name}
        {/* </a> */}
      </td>
    ),
    commissionerate_name: (item) => (
      <td>
        <Link to={`/Subcom?zone_code=${item.zone_code}&name=${name}`} className="text-decoration-none">
          {item.commissionerate_name}
        </Link>
      </td>
    ),
    rank: () => <td>-</td>,
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
  };

  if (
    name === "gst3a" ||
    name === "gst3b" ||
    name == "gst5a" ||
    name === "gst5b"
  ) {
    scopedColumns.zone_name = (item) => (
      <td>
        {item.zone_name}
        {/* <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}>

        </Link> */}
      </td>
    );

    // scopedColumns.commissionerate_name = (item) => (
    //   <td>
    //     <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
    //       {item.commissionerate_name}
    //     </Link>
    //   </td>
    // );
  }

  const scopedColumnscomm = {
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
    commissionerate_name: (item) => <td>{item.commissionerate_name}</td>,
    zone_name: (item) => (
      <td>
        <Link to={`/Subcom?zone_code=${item.zone_code}&name=${name}`}>
          {item.zone_name}
        </Link>
      </td>
    ),

    rank: () => <td>-</td>,
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
  };

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption:
        name === "gst1a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Application cleared within 7 days)"
            : "Top 5 Commissionerates (Highest % of Application cleared within 7 days)"
          : name === "gst1b"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of PV not completed (in 30 days))"
            : "Top 5 Commissionerates (Least % of PV not completed (in 30 days))"
          : name === "gst1c"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Deemed Registration)"
            : "Top 5 Commissionerates (Least % of Deemed Registration)"
          : name === "gst1d"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Registration application pending)"
            : "Top 5 Commissionerates (Least % of Registration application pending)"
          : name === "gst1e"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % Reg  of Pending for cancellation)"
            : "Top 5 Commissionerates (Least % Reg of Pending for cancellation)"
          : name === "gst1f"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % Reg of Pending for revocation)"
            : "Top 5 Commissionerates (Least % Reg of Pending for revocation)"
          : name === "gst2"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Return due but not filed)"
            : "Top 5 Commissionerates (Least % of Return due but not filed)"
          : name === "gst3a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Scrutiny Completed/Pending)"
            : "Top 5 Commissionerates (Highest % of Scrutiny Completed/Pending)"
          : name === "gst3b"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Recovery/Detection(In lakh))"
            : "Top 5 Commissionerates (Highest % of Recovery/Detection(In lakh))"
          : name === "gst4a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Investigation completed)"
            : "Top 5 Commissionerates (Highest % of Investigation completed)"
            : name === "gst4b"
            ? selectedOption1 === "Zones"
              ? "Top 5 Zones (Least % of Pending > 1 year/Total cases pending)"
              : "Top 5 Commissionerates ( Least % of Pending > 1 year/Total cases pending)"
          : name === "gst4c"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Detection/Revenue collected Amount in Lakhs)"
            : "Top 5 Commissionerates (Highest % of Detection/Revenue collected Amount in Lakhs)"
          : name === "gst4d"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Recoveries/Detections(In lakhs))"
            : "Top 5 Commissionerates (Highest % of Recoveries/Detections(In lakhs))"
          : name === "gst5a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Cases Disposed in the Month)"
            : "Top 5 Commissionerates (Highest % of Cases Disposed in the Month)"
          : name === "gst5b"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of cases where Time left for adjudication <6 months)"
            : "Top 5 Commissionerates (Least % of cases where Time left for adjudication <6 months)"
          : name === "gst6a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Disposal of cases (ST))"
            : "Top 5 Commissionerates (Highest % of Disposal of cases (ST))"
          : name === "gst6b"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Pending > 1 year(ST))"
            : "Top 5 Commissionerates ( Least % of Pending > 1 year(ST))"
          : name === "gst6c"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Disposal of cases (C.Ex))"
            : "Top 5 Commissionerates (Highest % of Disposal of cases (C.Ex))"
          : name === "gst6d"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Pending > 1 year (C.Ex))"
            : "Top 5 Commissionerates (Least % of Pending > 1 year (C.Ex))"
            : name === "gst7"
            ? selectedOption1 === "Zones"
              ? "Top 5 Zones (Least % of Refunds pending > 60 days/total refund pending)"
              : "Top 5 Commissionerates (Least % of Refunds pending > 60 days/total refund pending)"
          : name === "gst8a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Arrears recoverable/Target up to the month (In lakhs)"
            : "Top 5 Commissionerates (Highest % of Arrears recoverable/Target up to the month(In lakhs)"
            : name === "gst8b"
            ? selectedOption1 === "Zones"
              ? "Top 5 Zones (Least % of Arrears pending > 1 year (In lakhs)"
              : "Top 5 Commissionerates (Least % of Arrears pending > 1 year)(In lakhs)"
          : name === "gst9a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Prosecution not launched in 2 months/Prosecution sanctioned)"
            : "Top 5 Commissionerates (Least % of Prosecution not launched in 2 months/Prosecution sanctioned)"
            : name === "gst9b"
            ? selectedOption1 === "Zones"
              ? "Top 5 Zones (Highest % of Prosecution launched/Total Arrest)"
              : "Top 5 Commissionerates (Highest % of Prosecution launched/Total Arrest)"
          :  name === "gst10a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Taxpayer audited/ Total taxpayer allotted)"
            : "Top 5 Commissionerates (Least % of Taxpayer audited/ Total taxpayer allotted)"
          : name==="gst10b"? selectedOption1==="Zones"?"Top 5 Zones(Least % of Audit Paras >6 months/Total audit paras pending)"
          :"Top 5 Commissionerates(Least % of Audit Paras >6 months/Total audit paras pending)":
          name==="gst10c"? selectedOption1==="Zones"?"Top 5 Zones(Highest % of Recoveries/Detections in Lakhs)":"Top 5 Commissionerates(Highest % of Recoveries/Detections in Lakhs)":
          name === "gst11a"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of Disposal of commissioner appeals cases)"
            : "Top 5 Commissionerates (Highest % of Disposal of commissioner appeals cases)"
          : name === "gst11b"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of Commissioner appeals cases pending > 1 year)"
            : "Top 5 Commissionerates (Least % of Commissioner appeals cases pending > 1 year)"
          : name === "gst11c"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Highest % of disposal of ADJ/JC appeals cases)"
            : "Top 5 Commissionerates (Highest % of disposal of ADJ/JC appeals cases)"
          : name === "gst11d"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % of ADJ/JC appeals cases )"
            : "Top 5 Commissionerates (Least % of ADJ/JC appeals cases)"
          : selectedOption1 === "Zones"
          ? "Top 5 Zones"
          : "Top 5 Commissionerates",
      yaxisname: "Percentage",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Percentage:$value"
          : "<b>Commissionerate Name:$label</b>{br}Percentage:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data: data.slice(0, 5).map((item, index) => ({
      label:
        selectedOption1 === "Zones"
          ? item.zone_name
          : item.commissionerate_name,
      value: item.total_score,
      color: colorstopzone[index % colorstopzone.length],
    })),
  };

  console.log("TOP5", top5);

  const colorsbottomzone = [
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
  ];
  const bottom5 = {
    chart: {
      caption:
        name === "gst1a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Application cleared within 7 days)"
            : "Bottom 5 Commissionerates (Least % of Application cleared within 7 days)"
          : name === "gst1b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of PV not completed (in 30 days))"
            : "Bottom 5 Commissionerates (Highest % of PV not completed (in 30 days))"
          : name === "gst1c"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Deemed Registration)"
            : "Bottom 5 Commissionerates (Highest % of Deemed Registration)"
          : name === "gst1d"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Registration application pending)"
            : "Bottom 5 Commissionerates (Highest % of Registration application pending)"
          : name === "gst1e"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % Reg of Pending for cancellation)"
            : "Bottom 5 Commissionerates (Highest % of Reg Pending for cancellation)"
          : name === "gst1f"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Reg Pending for revocation)"
            : "Bottom 5 Commissionerates ( Highest % Reg of Pending for revocation)"
          : name === "gst2"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Return due but not filed)"
            : "Bottom 5 Commissionerates (Highest % of Return due but not filed)"
          : name === "gst3a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Scrutiny Completed/Pending)"
            : "Bottom 5 Commissionerates (Least % of Scrutiny Completed/Pending)"
          : name === "gst3b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Recovery/Detection(In Lakh))"
            : "Bottom 5 Commissionerates (Least % of Recovery/Detection(In lakh))"
          : name === "gst4a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Investigation completed)"
            : "Bottom 5 Commissionerates (Least % of Investigation completed)"
            : name === "gst4b"
            ? selectedOption1 === "Zones"
              ? "Bottom 5 Zones (Highest % of Pending > 1 year/Total cases pending)"
              : "Bottom 5 Commissionerates (Highest % of Pending > 1 year/Total cases pending)"
          : name === "gst4c"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones ( Least % of Detection/Revenue collected Amount in Lakhs )"
            : "Bottom 5 5 Commissionerates (Least % of Detection/Revenue collected Amount in Lakhs)"
          : name === "gst4d"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Recoveries/Detection(In Lakhs))"
            : "Bottom 5 5 Commissionerates (Least % of Recoveries/Detection(In Lakhs))"
          : name === "gst5a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Cases Disposed in the Month)"
            : "Bottom 5 Commissionerates (Least % Cases Disposed in the Month)"
          : name === "gst5b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of cases where Time left for adjudication <6 months)"
            : "Bottom 5 Commissionerates (Highest % of cases where Time left for adjudication <6 months)"
          : name === "gst6a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Disposal of cases (ST))"
            : "Bottom 5 Commissionerates (Least % of Disposal of cases (ST))"
          : name === "gst6b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Pending > 1 year(ST))"
            : "Bottom 5 Commissionerates (Highest % of Pending > 1 year(ST))"
            : name === "gst7"
            ? selectedOption1 === "Zones"
              ? "Bottom 5 Zones (Highest % of Refunds pending > 60 days/total refund pending)"
              : "Bottom 5 Commissionerates (Highest % of Refunds pending > 60 days/total refund pending))"
            : name === "gst8a"
            ? selectedOption1 === "Zones"
              ? "Bottom 5 Zones (Least % of Arrears recoverable/Target up to the month (In lakhs)"
              : "Bottom 5 Commissionerates (Least % of Arrears recoverable/Target up to the month (In lakhs)"
          : name === "gst8b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Arrears pending > 1 year (In lakhs)"
            : "Bottom 5 Commissionerates (Highest % of Arrears pending > 1 year) (In lakhs)"
          : name === "gst6c"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Disposal of cases (C.Ex))"
            : "Bottom 5 Commissionerates (Least % of Disposal of cases (C.Ex))"
          : name === "gst6d"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Pending > 1 year (C.Ex))"
            : "Bottom 5 Commissionerates (Highest % of Pending > 1 year (C.Ex)"
            : name === "gst9a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Prosecution not launched in 2 months/Prosecution sanctioned)"
            : "Bottom 5 Commissionerates (Highest % of Prosecution not launched in 2 months/Prosecution sanctioned)"
          : name === "gst9b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Prosecution launched/Total Arrest)"
            : "Bottom 5 Commissionerates (Least % of Prosecution launched/Total Arrest)"
          :  name === "gst10a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Taxpayer audited/ Total taxpayer allotted)"
            : "Bottom 5 Commissionerates (Highest % of Taxpayer audited/ Total taxpayer allotted)"
          : name==="gst10b"? selectedOption1==="Zones"?"Bottom 5 Zones(Highest % of Audit Paras >6 months/Total audit paras pending)"
          :"Bottom 5 Commissionerates(Highest % of Audit Paras >6 months/Total audit paras pending)":
          name==="gst10c"? selectedOption1==="Zones"?"Bottom 5 Zones(Least % of Recoveries/Detections in Lakhs)":"Bottom 5 Commissionerates(Least % of Recoveries/Detections in Lakhs)":
          name === "gst11a"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of Disposal of commissioner appeals cases)"
            : "Bottom 5 Commissionerates (Least % of Disposal of commissioner appeals cases)"
          : name === "gst11b"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of Commissioner appeals cases pending > 1 year)"
            : "Bottom 5 Commissionerates (Highest % of Commissioner appeals cases pending > 1 year)"
          : name === "gst11c"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Least % of disposal of ADJ/JC appeals cases)"
            : "Bottom 5 Commissionerates (Least % of disposal of ADJ/JC appeals cases)"
          : name === "gst11d"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % of ADJ/JC appeals cases)"
            : "Bottom 5 Commissionerates (Highest % of ADJ/JC appeals cases)"
          : selectedOption1 === "Zones"
          ? "Bottom 5 Zones"
          : "Bottom 5 Commissionerates",

      yaxisname: "Percentage",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Percentage:$value"
          : "<b>Commissionerate Name:$label</b>{br}Percentage:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data: data.slice(-5).map((item, index) => ({
      label:
        selectedOption1 === "Zones"
          ? item.zone_name
          : item.commissionerate_name,
      value: item.total_score,
      color: colorsbottomzone[index % colorsbottomzone.length],
    })),
  };

  const checkSpecialChar=(e)=>{
    if(!/[0-9a-zA-Z]/.test(e.key)){
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
            <div className="msg-box">
              {/* <h2>GST 1A (Zone) {name.toUpperCase()}</h2> */}
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
                          field:{
                            readOnly:true
                          }
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              {/* <div className="mid-sec">
              <div className="card-white">
                <p>{relevantAspects}</p>
              </div>
            </div> */}
              <div className="rgt-sec">
                {/* {name === "gst3a" || name === "gst3b" ? (
                  <div className="switches-container2">
                    <input
                      type="radio"
                      id="switchMonthly"
                      name="switchPlan"
                      value="Zones"
                      checked={selectedOption1 === "Zones"}
                      onChange={handleClick}
                    />
                    <input
                      type="radio"
                      id="switchYearly"
                      name="switchPlan"
                      value="Commissionerate"
                      checked={selectedOption1 === "Commissionerate"}
                      onChange={handleClick}
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
                ) : (
                  <div className="switches-container2">
                    <input
                      type="radio"
                      id="switchMonthly"
                      name="switchPlan"
                      value="Zones"
                      checked={selectedOption1 === "Zones"}
                      defaultChecked
                    />
                    <input
                      type="radio"
                      id="switchYearly"
                      name="switchPlan"
                      value="Commissionerate"
                      checked={selectedOption1 === "Commissionerate"}
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
                )} */}
                <div className="switches-container2">
                  <input
                    type="radio"
                    id="switchMonthly"
                    name="switchPlan"
                    value="Zones"
                    checked={selectedOption1 === "Zones"}
                    onChange={handleClick}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Commissionerate"
                    checked={selectedOption1 === "Commissionerate"}
                    onChange={handleClick}
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
            <div className="box-main bg-blue col1">
              {name === "gst1c" || name==="gst1b"||name==="gst1a"||
              name === "gst1d" || name==="gst10b"||
              name === "gst1e" ||
              name === "gst7" ||
              name === "gst1f" ||
              name === "gst3a" ||
              name === "gst3b" ||
              name === "gst4a" ||
              name === "gst4b" ||
              name === "gst4c" ||
              name === "gst4d" ||
              name === "gst5a" ||
              name === "gst5b" ||
              name === "gst5a" ||
              name === "gst5b" ||
              name === "gst6a" ||
              name === "gst6b" ||
              name === "gst6c" ||
              name === "gst6d" ||
              name === "gst8a" ||
              name === "gst8b" ||
              name === "gst9a" ||
              name === "gst9b" ||
              name === "gst11b" ||
              name === "gst11a" ||
              name === "gst11c" ||
              name === "gst11d" ||
              name === "gst10a" ||
              name === "gst10b" ||
              name === "gst10c" ||
              name === "gst2" ? (
                <div className="row custom-tb mb col ">
                  <div className="row container">
                    <div className="col-md-6 mt-2 ">
                      <div className="card">
                        {selectedOption1 === "Zones" ? (
                          <div className="card-header">
                            {name === "gst1c" ? (<strong> Top 5 Zones (Least % of Deemed Registration) </strong> ) 
                              : name === "gst1a" ? ( <strong>Top 5 Zones (Highest % of Application cleared within 7 days) </strong> )
                              : name === "gst1b" ? ( <strong>Top 5 Zones (Least % PV not completed (in 30 days)) </strong> ) 
                            : name === "gst1d" ? ( <strong>Top 5 Zones (Least % of Registration application pending) </strong> ) 
                            : name === "gst1e" ? (<strong> Top 5 Zones (Least % of Reg Pending for cancellation)</strong>) 
                            : name === "gst2" ? (<strong> Top 5 Zones (Least % of Return due but not filed)</strong>) 
                            : name === "gst1f" ? ( <strong>Top 5 Zones (Least % of Reg Pending for revocation) </strong>
                            ) : name === "gst3a" ? (
                              <strong>
                                Top 5 Zones (Highest % of Scrutiny
                                Completed/Pending)
                              </strong>
                            ) : name === "gst3b" ? (
                              <strong>
                                Top 5 Zones (Highest % of Recovery/Detection(In
                                Lakh))
                              </strong>
                            ) : name === "gst4a" ? (
                              <strong>
                                Top 5 Zones (Highest % of Investigation
                                completed)
                              </strong>
                               ) : name === "gst4b" ? (
                                <strong>
                                  Top 5 Zones (Least % of Pending &gt; 1 year/Total cases pending)
                                </strong>
                            ) : name === "gst4c" ? (
                              <strong>
                                Top 5 Zones (Highest % of Detection/Revenue
                                collected Amount in Lakhs)
                              </strong>
                            ) : name === "gst4d" ? (
                              <strong>
                                Top 5 Zones (Highest % of
                                Recoveries/Detection(In Lakhs))
                              </strong>
                            ) : name === "gst5a" ? (
                              <strong>
                                Top 5 Zones (Highest % of Cases Disposed in the
                                Month)
                              </strong>
                            ) : name === "gst5b" ? (
                              <strong>
                                Top 5 Zones (Least % of cases where Time left
                                for adjudication &lt; 6 months)
                              </strong>
                            ) : name === "gst6a" ? (
                              <strong>
                                Top 5 Zones (Highest % of Disposal of cases
                                (ST))
                              </strong>
                            ) : name === "gst6b" ? (
                              <strong>
                                Top 5 Zones (Least % of Pending &gt; 1 year(ST))
                              </strong>
                                ) : name === "gst7" ? (
                                  <strong>
                                    Top 5 Zones (Least % of Refunds pending &gt; 60 days/Total refund pending)
                                  </strong>
                               ) : name === "gst8a" ? (
                                <strong>
                                  Top 5 Zones (Highest % of Arrears recoverable/Target up to the month (In lakhs))
                                </strong>
                            ) : name === "gst8b" ? (
                              <strong>
                                Top 5 Zones (Least % of Arrears pending &gt; 1
                                year (In lakhs))
                              </strong>
                            ) : name === "gst6c" ? (
                              <strong>
                                Top 5 Zones (Highest % of Disposal of cases
                                (C.Ex))
                              </strong>
                            ) : 
                            name === "gst6d" ? (
                              <strong>
                                Top 5 Zones (Least % of Pending &gt; 1 year
                                (C.Ex))
                              </strong>
                            ) : 
                            name==="gst9a"?(
                              <strong>Top 5 Zones (Lease % of Prosecution not launched in 2 months/Prosecution sanctioned)</strong>
                            ):
                            name === "gst9b" ? (
                              <strong>
                                Top 5 Zones (Highest % of Prosecution
                                launched/Total Arrest)
                              </strong>
                            ):
                            name==="gst10a"?(
                              <strong>Top 5 Zones (Least % of Taxpayer audited/ Total taxpayer allotted)</strong>
                            ):
                            name==="gst10b"?(
                              <strong>Top 5 Zones(Least % of Audit Paras &gt; 6 months/Total audit paras pending)</strong>
                            ):name==="gst10c"?(
                              <strong>Top 5 Zones(Highest % of Recoveries/Detections in Lakhs)</strong>
                            )
                            : name === "gst11a" ? (
                              <strong>
                                Top 5 Zones (Highest % of Disposal of
                                Commissioner appeals cases)
                              </strong>
                            ) : name === "gst11b" ? (
                              <strong>
                                Top 5 Zones (Least % of Commissioner appeals
                                cases pending &gt; 1 year)
                              </strong>
                            ) : name === "gst11c" ? (
                              <strong>
                                Top 5 Zones (Highest % of Disposal of ADJ/JC
                                appeals cases)
                              </strong>
                            ) : name === "gst11d" ? (
                              <strong>
                                Top 5 Zones (Least % of ADJ/JC appeals cases)
                              </strong>
                            ) : (
                              <strong>Top 5 Zones</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        ) : (
                          <div className="card-header">
                            {name === "gst1c" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Deemed
                                Registration)
                              </strong>
                               ) : name === "gst1a" ? (
                                <strong>
                                  Top 5 Commissionerates (Highest % of Application cleared within 7 days)
                                </strong>
                                 ) : name === "gst1b" ? (
                                  <strong>
                                    Top 5 Commissionerates (Least % of PV not completed (in 30 days))
                                  </strong>
                            ) : name === "gst1d" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Registration
                                application pending)
                              </strong>
                            ) : name === "gst1e" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Reg Pending for
                                cancellation)
                              </strong>
                            ) : name === "gst1f" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Reg Pending for
                                revocation)
                              </strong>
                               ) : name === "gst2" ? (
                                <strong>
                                  Top 5 Commissionerates (Least % of Return due but not filed)
                                </strong>
                            ) : name === "gst3a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Scrutiny
                                Completed/Pending)
                              </strong>
                            ) : name === "gst3b" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of
                                Recovery/Detection(In Lakh))
                              </strong>
                            ) : name === "gst4a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of
                                Investigation completed)
                              </strong>
                               ) : name === "gst4b" ? (
                                <strong>
                                  Top 5 Commissionerates (Least % of
                                  Pending &gt; 1 year/Total cases pending )
                                </strong>
                            ) : name === "gst4c" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of
                                Detection/Revenue collected Amount in Lakhs)
                              </strong>
                            ) : name === "gst4d" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of
                                Recoveries/Detection(In Lakhs))
                              </strong>
                            ) : name === "gst5a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Cases
                                Disposed in the Month)
                              </strong>
                            ) : name === "gst5b" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of cases where
                                Time left for adjudication &lt; 6 months)
                              </strong>
                            ) : name === "gst6a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Disposal of
                                cases (ST))
                              </strong>
                            ) : name === "gst6b" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Pending &gt;
                                1 year(ST))
                              </strong>
                            ) : name === "gst6c" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Disposal of
                                cases (C.Ex))
                              </strong>
                            ) : name === "gst6d" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Pending &gt; 1 year (C.Ex))
                              </strong>
                              ) : name === "gst7" ? (
                                <strong>
                                  Top 5 Commissionerates (Least % of Refunds pending &gt; 60 days/Total refund pending)
                                </strong>
                            ) : name === "gst8a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Arrears recoverable/Target up to the month (In lakhs))
                              </strong>
                          
                          ): name === "gst8b" ? (
                            <strong>
                              Top 5 Commissionerates (Least % of Arrears
                              pending &gt; 1 year (In lakhs))
                            </strong>
                          ) : 
                            name==="gst9a"?(
                              <strong>Top 5 Commissionerates (Least % of Prosecution not launched in 2 months/Prosecution sanctioned)</strong>
                            ):
                            name === "gst9b" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Prosecution
                                launched/Total Arrest)
                              </strong>
                            ) :
                            name==="gst10a"?(
                              <strong>Top 5 Commissionerates (Least % of Taxpayer audited/ Total taxpayer allotted)</strong>
                            ):
                            name==="gst10b"?(
                              <strong>Top 5 Commissionerates(Least % of Audit Paras &gt; 6 months/Total audit paras pending)</strong>
                            ):name==="gst10c"?(
                              <strong>Top 5 Commissionerates(Highest % of Recoveries/Detections in Lakhs)</strong>
                            ):
                            name === "gst11a" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Disposal of
                                Commissioner appeals cases)
                              </strong>
                            ) : name === "gst11b" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of Commissioner
                                appeals cases pending &gt; 1 year)
                              </strong>
                            ) : name === "gst11c" ? (
                              <strong>
                                Top 5 Commissionerates (Highest % of Disposal of
                                ADJ/JC appeals cases)
                              </strong>
                            ) : name === "gst11d" ? (
                              <strong>
                                Top 5 Commissionerates (Least % of ADJ/JC
                                appeals cases)
                              </strong>
                            ) : (
                              <strong>Top 5 Commissionerates</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        )}
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
                              {selectedOption1 === "Zones" ? (
                                <Link to={`/allsubparameters?name=${name}`}>
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              ) : (
                                <Link to={`/allsubparameters?name=${name}`}>
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mt-2">
                      <div className="card">
                        {selectedOption1 === "Zones" ? (
                          <div className="card-header">
                            {name === "gst1c" ? (<strong> Bottom 5 Zones (Highest % of Deemed Registration)</strong> ) 
                            : name === "gst1a" ? (<strong> Bottom 5 Zones (Least % of Application cleared within 7 days)</strong>)
                            : name === "gst1b" ? (<strong> Bottom 5 Zones (Highest % of PV not completed (in 30 days))</strong>) 
                            : name === "gst1d" ? (<strong> Bottom 5 Zones (Highest % of Registration application pending)</strong>)  
                            : name === "gst1e" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of Reg Pending for
                                cancellation)
                              </strong>
                            ) : name === "gst1f" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of Reg Pending for
                                revocation)
                              </strong>
                              ) : name === "gst2" ? (
                                <strong>
                                  Bottom 5 Zones (Highest % of Return due but not filed)
                                </strong>
                            ) : name === "gst3a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Scrutiny
                                Completed/Pending)
                              </strong>
                            ) : name === "gst3b" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Recovery/Detection(In
                                Lakh))
                              </strong>
                            ) : name === "gst4a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Investigation
                                completed)
                              </strong>
                            ) :
                            name === "gst4b" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of
                                Pending &gt; 1 year/Total cases pending )
                              </strong>
                          ) :
                            name === "gst4c" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Detection/Revenue
                                collected Amount in Lakhs)
                              </strong>
                            ) : name === "gst4d" ? (
                              <strong>
                                Bottom 5 Zones (Least % of
                                Recoveries/Detection(In Lakhs))
                              </strong>
                            ) : name === "gst5a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Cases Disposed in the
                                Month)
                              </strong>
                            ) : name === "gst5b" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of cases where Time
                                left for adjudication &lt; 6 months)
                              </strong>
                            ) : name === "gst6a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Disposal of cases
                                (ST))
                              </strong>
                            ) : name === "gst6b" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of Pending &gt; 1
                                year(ST))
                              </strong>
                            ) : name === "gst6c" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Disposal of cases
                                (C.Ex))
                              </strong>
                            ) : name === "gst6d" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of Pending &gt; 1 year
                                (C.Ex))
                              </strong>
                              ) : name === "gst7" ? (
                                <strong>
                                  Bottom 5 Zones (Highest % of Refunds pending &gt; 60 days/Total refund pending)
                                </strong>
                            ) : name === "gst8a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Arrears recoverable/Target up to the month (In lakhs))
                              </strong>
                                ) : name === "gst8b" ? (
                                  <strong>
                                    Bottom 5 Zones (Highest % of Arrears pending
                                    &gt; 1 year (In lakhs))
                                  </strong>
                            ) : 
                            name==="gst9a"?(
                              <strong>Bottom 5 Zones (Highest % of Prosecution not launched in 2 months/Prosecution sanctioned)</strong>
                            ):
                            name === "gst9b" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Prosecution
                                launched/Total Arrest)
                              </strong>
                            ) :
                            name==="gst10a"?(
                              <strong>Bottom 5 Zones (Highest % of Taxpayer audited/ Total taxpayer allotted)</strong>
                            ):
                            name==="gst10b"?(
                              <strong>Bottom 5 Zones (Highest % of Audit Paras &gt; 6 months/Total audit paras pending)</strong>
                            ):name==="gst10c"?(
                              <strong>Bottom 5 Zones (Least % of Recoveries/Detections in Lakhs)</strong>
                            ):
                             name === "gst11a" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Disposal of
                                Commissioner appeals cases)
                              </strong>
                            ) : name === "gst11b" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of Commissioner
                                appeals cases pending &gt; 1 year)
                              </strong>
                            ) : name === "gst11c" ? (
                              <strong>
                                Bottom 5 Zones (Least % of Disposal of ADJ/JC
                                appeals cases)
                              </strong>
                            ) : name === "gst11d" ? (
                              <strong>
                                Bottom 5 Zones (Highest % of ADJ/JC appeals cases)
                              </strong>
                            ) : (
                              <strong>Bottom 5 Zones</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        ) : (
                          <div className="card-header">
                            {name === "gst1c" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of Deemed
                                Registration)
                              </strong>
                            ) : name === "gst1d" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of
                                Registration application pending)
                              </strong>
                               ) : name === "gst1b" ? (
                                <strong>
                                  Bottom 5 Commissionerates (Highest % PV not completed (in 30 days))
                                </strong>
                                ) : name === "gst1a" ? (
                                  <strong>
                                    Bottom 5 Commissionerates (Least % of Application cleared within 7 days)
                                  </strong>
                            ) : name === "gst1e" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of Pending
                                for cancellation)
                              </strong>
                            ) : name === "gst1f" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of Pending
                                for revocation)
                              </strong>
                               ) : name === "gst2" ? (
                                <strong>
                                  Bottom 5 Commissionerates (Highest % of Return due but not filed)
                                </strong>
                            ) : name === "gst3a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Scrutiny
                                Completed/Pending)
                              </strong>
                            ) : name === "gst3b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of
                                Recovery/Detection(In Lakh))
                              </strong>
                            ) : name === "gst4a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of
                                Investigation completed)
                              </strong>
                            ) : 
                            name === "gst4b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of
                                Pending &gt; 1 year/Total cases pending )
                              </strong>
                          ) :
                            name === "gst4c" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of
                                Detection/Revenue collected Amount in Lakhs)
                              </strong>
                            ) : name === "gst4d" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of
                                Recoveries/Detection(In Lakhs))
                              </strong>
                            ) : name === "gst5a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Cases
                                Disposed in the Month)
                              </strong>
                            ) : name === "gst5b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of cases
                                where Time left for adjudication &lt; 6 months)
                              </strong>
                            ) : name === "gst6a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Disposal
                                of cases (ST))
                              </strong>
                            ) : name === "gst6b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of Pending
                                &gt; 1 year(ST))
                              </strong>
                            ) : name === "gst6c" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Disposal
                                of cases (C.Ex))
                              </strong>
                            ) : name === "gst6d" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of Pending
                                &gt; 1 year (C.Ex))
                              </strong>
                               ) : name === "gst7" ? (
                                <strong>
                                  Bottom 5 Commissionerates (Highest % of Refunds pending &gt; 60 days/Total refund pending)
                                </strong>
                            ) : name === "gst8a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Arrears recoverable/Target up to the month (In Lakhs))
                              </strong>
                               ) : name === "gst8b" ? (
                                <strong>
                                  Bottom 5 Commissionerates (Highest % of Arrears
                                  pending &gt; 1 year (In lakhs))
                                </strong>
                            ) : 
                            name==="gst9a"?(
                            <strong>Bottom 5 Commissionerates (Highest % of Prosecution not launched in 2 months/Prosecution sanctioned)</strong>):
                            name === "gst9b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of
                                Prosecution launched/Total Arrest)
                              </strong>
                            ) : 
                            name==="gst10a"?(
                              <strong>Bottom 5 Commissionerates (Highest % of Taxpayer audited/ Total taxpayer allotted)</strong>
                            ):
                            name==="gst10b"?(
                              <strong>Bottom 5 Commissionerates(Highest % of Audit Paras &gt; 6 months/Total audit paras pending)</strong>
                            ):name==="gst10c"?(
                              <strong>Bottom 5 Commissionerates(Least % of Recoveries/Detections in Lakhs)</strong>
                            ):
                            name === "gst11a" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Disposal
                                of Commissioner appeals cases)
                              </strong>
                            ) : name === "gst11b" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of
                                Commissioner appeals cases pending &gt; 1 year)
                              </strong>
                            ) : name === "gst11c" ? (
                              <strong>
                                Bottom 5 Commissionerates (Least % of Disposal
                                of ADJ/JC appeals cases)
                              </strong>
                            ) : name === "gst11d" ? (
                              <strong>
                                Bottom 5 Commissionerates (Highest % of ADJ/JC
                                appeals cases)
                              </strong>
                            ) : (
                              <strong>Bottom 5 Commissionerates</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        )}
                        <div className="card-body">
                          <div id="chart">
                            <div className="responsive-chart main-chart">
                              <ReactFusioncharts
                                type="column3d"
                                width="100%"
                                height="500"
                                dataFormat="JSON"
                                dataSource={bottom5}
                              />

                              {selectedOption1 === "Zones" ? (
                                <Link to={`/allsubparameters?name=${name}`}>
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              ) : (
                                <Link to={`/allsubparameters?name=${name}`}>
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              )}
                            </div>
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
                    activePage={1}
                    cleaner
                    clickableRows={false}
                    columns={
                      selectedOption1 === "Zones" ? columns : columnscomm
                    }
                    columnSorter
                    items={data}
                    itemsPerPageSelect
                    itemsPerPage={itemsSelect}
                    onItemsPerPageChange={handleNumberChange}
                    pagination
                    onRowClick={onRowClick}
                    onFilteredItemsChange={(items) => {
                      console.log(items);
                    }}
                    onSelectedItemsChange={(items) => {
                      console.log(items);
                    }}
                    scopedColumns={
                      selectedOption1 === "Zones"
                        ? scopedColumns
                        : scopedColumnscomm
                    }
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
                    onKeyDown={(e)=>checkSpecialChar(e)}
                    // tableBodyProps={{
                    //   className: "align-middle border-info",
                    //   color:'primary',
                    // }}
                    // tableHeadProps={{
                    //   className:"border-info alert-dark",
                    // }}
                  />
                </div>
              ) : (
                <div className="row custom-tb mb col ">
                  <div className="export-btn">
                    <button
                      onClick={exportToXLS}
                      className="btn btn-primary m-3"
                    >
                      Export XLS
                    </button>
                  </div>

                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows={false}
                    columns={
                      selectedOption1 === "Zones" ? columns : columnscomm
                    }
                    columnSorter
                    items={data}
                    itemsPerPageSelect
                    itemsPerPage={itemsSelect}
                    onItemsPerPageChange={handleNumberChange}
                    pagination
                    onRowClick={onRowClick}
                    onFilteredItemsChange={(items) => {
                      console.log(items);
                    }}
                    onSelectedItemsChange={(items) => {
                      console.log(items);
                    }}
                    scopedColumns={
                      selectedOption1 === "Zones"
                        ? scopedColumns
                        : scopedColumnscomm
                    }
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
                    onKeyDown={(e)=>checkSpecialChar(e)}
                    // tableBodyProps={{
                    //   className: "align-middle border-info",
                    //   color:'primary',
                    // }}
                    // tableHeadProps={{
                    //   className:"border-info alert-dark",
                    // }}
                  />
                </div>
              )}
            </div>

            <div className="row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subpara;
