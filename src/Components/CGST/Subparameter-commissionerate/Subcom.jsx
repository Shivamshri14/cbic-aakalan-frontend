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

const Subcom = ({ selectedDate, onChangeDate }) => {
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
      const response = await apiClient.get(`/cbic/${name}`, {
        params: {
          month_date: newdate,
          type: "commissary",
          zone_code: zone_code,
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
      label: "Percentage for the Month",
      field: "total_score",
    },
  ];

  if (name === "gst1a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Applications cleared  (in 7 days ) /Application filed",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 1)',
    });
  } else if (name === "gst1b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "PV not completed ( in 30 days ) /Applications marked for PV",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 1)",
    });
  } else if (name === "gst1c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Deemed registrations /Applications received",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 1)",
    });
  } else if (name === "gst1d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg applications pending /Applications received",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 1)",
    });
  } else if (name === "gst1e") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for revocation/ received for revocation",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 3)",
    });
  } else if (name === "gst1f") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Reg pending for revocation/ received for revocation",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 3)",
    });
  } else if (name === "gst2") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Return Not Filed/Total Returns Due",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "gst3a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Scrutiny completed/Returns pending",
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
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "gst3b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections",
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
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "gst4a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Investigation completed/total investigations pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average (Out of 3)',
    });
  } else if (name === "gst4b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:
        "Investigations pending beyond 01 year/total number of investigation cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (Out of 3)",
    });
  } else if (name === "gst4c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Detections/revenue collected (Amount in Lakhs)",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average (Out of 2)',
    });
  } else if (name === "gst4d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/detections (Amount in Lakhs)",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average (Out of 2)',
    });
  } else if (name === "gst5a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Adjudication cases disposed / Adjudication pending cases ",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 5)',
    });
  } else if (name === "gst5b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:
        "Time left for adjudication < 6 months / total adjudication cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "gst6a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases disposed /Total ST case pending",
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
  } else if (name === "gst6b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ST cases pending for >1 year/Total ST case pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else if (name === "gst6c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases disposed / Total Cex",
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
  } else if (name === "gst6d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Cex cases pending > 1year/Total Cex",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else if (name === "gst7") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Refunds pending > 60 days/Total refund pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "gst8a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears recoverable/Target upto the month",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 6)',
    });
  } else if (name === "gst8b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Arrears pending >1 year/ Total arrears pending ",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 4)",
    });
  } else if (name === "gst9a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label:"Prosecution not launched within 2 months/ Prosecution sanctioned",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "gst9b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Prosecution launched /Total arrests",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 5)',
    });
  } else if (name === "gst10a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Taxpayer audited/ Total taxpayer allotted",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average (out of 4)',
    });
  } else if (name === "gst10b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Audit Paras > 6 months/Total audit paras pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 3)",
    });
  } else if (name === "gst10c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Recoveries/Detections ",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 3)',
    });
  } else if (name === "gst11a") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "(Commissioner) appeal cases disposed /Total appeal cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 2.5)',
    });
  } else if (name === "gst11b") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Commissioner appeal cases >1year /Total appeal cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else if (name === "gst11c") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC appeal cases disposed /Total appeal cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
       label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6,0,{
        key:'insentavization',
        label:'Incentivisation'
      })

    columns.splice(7, 0, {
      key:'sub_parameter_weighted_average',
     label:'Weighted Average(out of 2.5)',
    });
  } else if (name === "gst11d") {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "ADC/JC Appeals cases >1 year/ Total appeal cases pending",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 2.5)",
    });
  } else {
    columns.splice(3, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });
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

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData =
    data.map((user) => {
            switch (name) {
              case "gst1a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Applications cleared  (in 7 days ) /Application filed":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };

              case "gst1d":
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Applications Pending/Applications received":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage for the Month": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst3b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Recoveries/Detections": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Detections/Revenue collected ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst4d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Recoveries/Detections": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Service tax cases disposed /Total service tax case pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Service tax cases pending for >1 year/Total service tax case pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Central Excise cases disposed / Total central excise ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst6d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Central Excise cases pending > 1year/Total central excise ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11a": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Commissioner appeal cases /Total pending": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11b": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "Commissioner appeal cases >1year /Total pending":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11c": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ADC/JC Appeals cases/ Total pending ": user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  Incentivisation: user.insentavization,
                  "Subparameter Weighted Average":
                    user.sub_parameter_weighted_average,
                };
              }

              case "gst11d": {
                return {
                  SNo: user.s_no,
                  Zone: user.zone_name,
                  Commissionerate: user.commissionerate_name,
                  "ADC/JC Appeals cases >1 year/ Total pending ":
                    user.absolutevale,
                  // "Ratio": user.ratio,
                  "Percentage %(For the Month)": user.total_score,
                  "Way to Grade (Score out of 10)": user.way_to_grade,
                  "Subparameter Weighted Average":
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

    const rowHeights=[70,200,200,150,150,150,150,150];
    
    for(let i=0; i<rowHeights.length; i++){
      ws['!cols']= ws['!cols'] || [];
      ws['!cols'][i]={wpx: rowHeights[i]};

      for(let j=0; j<rowHeights[i].length;j++){
        const cell= ws[XLSX.utils.encode_cell({c:i, r:j})];

        if(cell){
          cell.s={
            alignment:{
              horizontal:"center",
              vertical:"center"
            }
          };
        }
      }
    }
    
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "my_data.xlsx");
  };

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption: data.map((item) => item.zone_name)[0],
      yaxisname: "Percentage",
      xaxisname:"Commissionerates",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext: "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
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
                          field:{
                            readOnly:true
                          }
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className="rgt-sec">
                {/* <div className="switches-container2">
                <input
                  type="radio"
                  id="switchMonthly"
                  name="switchPlan"
                  value="Zones"
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  value="Commissionerate"
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
              </div> */}
              </div>
            </div>
            <div className="box-main bg-blue">
            {name === "gst3a"||name==="gst3b"||name==="gst6a"||name==="gst6b"||name==="gst6c"||name==="gst6d"
              ||name==="gst1a"||name==="gst1b"||name==="gst1c"||name==="gst1d"||name==="gst1e"||name==="gst1f"
              ||name==="gst2"||name==="gst4a"||name==="gst4b"||name==="gst4c"||name==="gst4d"||name==="gst5a"
              ||name==="gst5b"||name==="gst7"||name==="gst8a"||name==="gst8b"||name==="gst9a"||name==="gst9b"||name==="gst11a"
              ||name==="gst11b"||name==="gst11c"||name==="gst11d"|| name==="gst10a"||name==="gst10b"||name==="gst10c"
               ? (
                <div className="row custom-tb mb col">
                  <div className="container mt-2">
                    <div className="card">
                      <div className="card-header">
                        {name==="gst3a"?<strong>Scrutiny Completed/Pending</strong>:name==="gst3b"?
                        <strong>% Recovery/Detection</strong>:<strong>{data.map(item=>item.zone_name)[0]}</strong>}
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
                      onKeyDown={(e)=>checkSpecialChar(e)}
                    />
                </div>
              ) : (
                <div className="row  custom-tb mb">
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
                    onKeyDown={(e)=>checkSpecialChar(e)}
                    // tableBodyProps={{
                    //   className: "align-middle",
                    // }}
                  />
                </div>
              )}
            </div>
            {/* <div className="row">
            <div className="view-btn">
              <Button variant="contained" className="ml-4" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Subcom;
