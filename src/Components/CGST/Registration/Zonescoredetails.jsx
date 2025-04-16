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
// import Commscoredetails from "./Commscoredetails";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
import Spinner from "../../Spinner";

var relevantAspects;
const Zonescoredetails = ({ selectedDate, onChangeDate }) => {
  const [selectedOption, setSelectedOption] = useState("Zones");
  // const [value2, setValue] = React.useState(dayjs());
  // console.log(value2);
  // const formattedDate = value2 ? value2.format('MM YYYY') : '';
  // console.log("val123",formattedDate);

  // const [value2, setValue] = useState(
  //   dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  // );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  const [zoneName, setZoneName] = useState("");

  const handleDateChange = (value) => {
    onChangeDate(value);
  };

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  // const [selected, setSelected] = useState("Zones");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const { zone_code } = queryParams;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  const { name } = queryParams;

  const columns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key:
        name === "arrest_and_prosecution" ||
          name === "gst_arrest_and_prosecution" ||
          name === "adjudication(legacy cases)" ||
          name === "recovery_of_arrears" ||
          name === "registration" ||
          name === "investigation" ||
          name === "audit" ||
          name === "scrutiny/assessment"
          ? "zone_name"
          : "zoneName",
      label: "Zone",
    },
    // {
    //   key:"commName",
    //   label:"Commissionerate Name",
    // },
    // {
    //   key: "gst",
    //   label: "Sub Parameters",
    // },
    // {
    //   key: "absval",
    //   label: "Return Not Filed/Total Return Pending",
    // },
    // {
    //   key: "totalScore",
    //   label: "Score of Sub Parameters %",
    // },
    // {
    //     key:"zonal_rank",
    //     label:"Commissionerate Rank",
    // }
  ];

  switch (name) {
    case "returnFiling":
      columns.splice(2, 0, {
        key: "gst",
        label: "Parameter",
      });

      columns.splice(4, 0, {
        key: "totalScore",
        label: "Percentage Not Filed",
      });

      columns.splice(3, 0, {
        key: "absval",
        label: "Return Not Filed/Total Return Due",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average ",
      });

      break;

    case "refunds":
      columns.splice(2, 0, {
        key: "gst",
        label: "Parameter",
      });

      columns.splice(4, 0, {
        key: "totalScore",
        label: "Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absval",
        label: "Refund > 60 days/Total Refunds Pending",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "scrutiny/assessment":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: "Percentage for the month",
      });
      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "adjudication":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "totalScore",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absval",
        label: "Absolute Number",
      });
      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "adjudication(legacy cases)":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });
      break;
    case "appeals":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "totalScore",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absval",
        label: "Absolute Number",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });
      break;

    case "recovery_of_arrears":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: "Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });
      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });
      break;

    case "arrest_and_prosecution":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });
      break;
    case "gst_arrest_and_prosecution":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });
      break;
    case "registration":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });
      // // columns.splice(5, 0, {
      // //   key: "way_to_grade",
      // //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "investigation":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });
      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    case "audit":
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "total_score",
        label: " Percentage for the month",
      });

      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Absolute Number",
      });

      // columns.splice(5, 0, {
      //   key: "way_to_grade",
      //   label: "Score out of 10",
      // });

      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average",
      });

      break;

    default:
      columns.splice(2, 0, {
        key: "gst",
        label: "Sub Parameters",
      });

      columns.splice(4, 0, {
        key: "totalScore",
        label: "Score of Sub Parameters %",
      });

      columns.splice(3, 0, {
        key: "absval",
        label: "Absolute Number",
      });

      break;
  }

  const fetchDatazone = async (name) => {
    try {
      if (name === "arrest_and_prosecution") {
        const endpoints = ["gst9a", "gst9b"];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Responses", responses);

        if (responses) {
          setLoading(false);
        }

        relevantAspects = "ARREST AND PROSECUTION";

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "recovery_of_arrears") {
        const endpoints = ["gst8a", "gst8b"]; // You can modify this array as needed

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = "RECOVERY OF ARREARS";

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "registration") {
        const endpoints = [
          "gst1a",
          "gst1b",
          "gst1c",
          "gst1d",
          "gst1e",
          "gst1f",
        ];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));

      } else if (name === "investigation") {
        const endpoints = ["gst4a", "gst4b", "gst4c", "gst4d"];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));

      } else if (name === "audit") {
        const endpoints = ["gst10a", "gst10b", "gst10c"];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "scrutiny/assessment") {
        const endpoints = ["gst3a", "gst3b"];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "gst_arrest_and_prosecution") {
        const endpoints = ["gst9a", "gst9b"];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "adjudication(legacy cases)") {
        const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setLoading(false);
        }

        relevantAspects = name.toUpperCase();

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter((item) => item.zone_code === zone_code);
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      }
      else {
        const response = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "commissary",
            zone_code: zone_code,
          },
        });

        if (response) {
          setLoading(false);
        }
        console.log(name);
        const zonename = response.data.map((item) => item.zoneName)[0];
        setZoneName(zonename);
        console.log("url", response);

        relevantAspects = response.data.map((item) => item.ra)[0];
        console.log("ra", relevantAspects);

        if (zone_code) {
          const arr = response.data.map(
            (item) => item.sub_parameter_weighted_average
          );
          console.log("WA", arr);

          const sum = arr.reduce((accumulator, current) => {
            return accumulator + current;
          }, 0);

          console.log("Sum", sum);
        }

        // Extract the relevant_aspect value from each item in the response data

        // Set the fetched data in the component's state
        setData(
          response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
        );

        // Log the fetched data to the console
        console.log("hello12345678", response.data);
      }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchDatazone(name);
    }
  }, [name, newdate]);

  // const usersData = [
  //   {
  //     id: 1,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 2,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 3,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 4,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 5,
  //     s_no:1,
  //     zone_name_Registration_performance:"Mumbai",
  //     sub_parameters: "GST 1A",
  //     absolute_figures_n_d: "0.25",
  //     score_of_sub_parameters: "0",
  //   },
  //   {
  //     id: 6,
  //     s_no:2,
  //     zone_name_Registration_performance:"Mumbai",
  //     sub_parameters: "GST 1B",
  //     absolute_figures_n_d: "0.1",
  //     score_of_sub_parameters: "04",
  //   },
  //   {
  //     id: 7,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 8,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 9,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 10,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 11,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 12,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 13,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 14,
  //     s_no:2,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  //   {
  //     id: 15,
  //     s_no:1,
  //     zone_name_Registration_performance:"",
  //     sub_parameters: "",
  //     absolute_figures_n_d: "",
  //     score_of_sub_parameters: "",
  //   },
  // ];

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
    const exportData = data.map((user) => {
      switch (name) {
        case "registration": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parmeters": user.gst,
            "Absolute Number": user.absolutevale,
            "Percentage for the month": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "returnFiling": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            "Return Not Filed/Total Returns Due": user.absval,
            "Percentage Not Filed": user.totalScore,
            "Way to Grade (Marks) Score out of 10": user.way_to_grade,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "scrutiny/assessment": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Percentage for the month": user.totalScore,
            "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "investigation": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters %": user.totalScore,
            // "Weighted Average (out of 10)":user.sub_parameter_weighted_average,
          };
        }

        case "adjudication": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Percentage for the month": user.totalScore,
            "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "adjudication(legacy cases)": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Percentage for the month": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "refunds": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            Parameter: user.gst,
            "Refund > 60 days/Total Refunds Pending": user.absval,
            "Percentage for the month": user.totalScore,
            "Way to Grade (Marks) Score out of 10": user.way_to_grade,
            "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "recovery_of_arrears": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Percentage for the month": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "arrest_and_prosecution": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Percentage for the month": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "gst_arrest_and_prosecution": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Percentage for the month": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "audit": {
          return {
            "S.No.": user.s_no,
            Zone: user.zone_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Score of Sub Parameters %": user.total_score,
            "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "appeals": {
          return {
            "S.No.": user.s_no,
            Zone: user.zoneName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Percentage for the month": user.totalScore,
            "Weighted Average (out of 12)": user.sub_parameter_weighted_average,
          };
        }

        default: {
          return {
            "S.No.": user.s_no,
            "Zone Name": user.zoneName,
            "Commissionerate Name": user.commName,
            "Score Details": "Show",
            "Zonal Rank": user.zonal_rank,
            "Total Score(For the Month)": user.totalScore,
          };
        }
      }
    });

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

  if (
    name === "returnFiling" ||
    name === "refunds" ||
    name === "scrutiny/assessment" ||
    name === "adjudication" ||
    name === "adjudication(legacy cases)"
  ) {
    scopedColumns.gst = (item) => (
      <td>
        <Link
          to={`/Subpara?name=${item.gst
            .trim()
            .replace(/\s+/g, "")
            .toLowerCase()}`}
        >
          {item.gst.trim().replace(/\s+/g, "")}
        </Link>
      </td>
    );
  }

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption: data.map((item) => item.zone_name)[0],
      yaxisname: "Percentage",
      xaxisname: "Subparameters",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext: "Total Score:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data: data.map((item, index) => ({
      label: item.gst,
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
      {loading ? (<Spinner />) : (
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

              {/* <div className="rgt-sec">
              <div className="switches-container2">
                <input
                  type="radio"
                  id="switchMonthly"
                  name="switchPlan"
                  value="Zones"
                  
                  defaultChecked
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  value="Commissionerate"
                  
                  
                />
                <label htmlFor="switchMonthly">Zones</label>
                <label htmlFor="switchYearly" >Commissionerate</label>
                <div className="switch-wrapper2">
                  <div className="switch2">
                    <div>Zones</div>
                    <div>Commissionerate</div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>

            {/* {name==="scrutiny/assessment"?(
              <div className="box-main bg-blue">
                <div className="row  custom-tb mb">
                  <div className="container mt-2">
                    <div className="card">
                      <div className="card-header">
                        <strong>{name.toUpperCase()}</strong>
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
                />
              </div>
                 
              </div>):( */}
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
            {/* )} */}
          </div>
        </div>
      )
      }
    </>
  );
};

export default Zonescoredetails;
