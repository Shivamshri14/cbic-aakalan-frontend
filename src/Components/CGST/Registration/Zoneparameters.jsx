import React, { useState, useEffect } from "react";
import axios from "axios";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CCardBody, CAvatar, CBadge, CButton, CCollapse } from "@coreui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSmartTable } from "@coreui/react-pro";
import "@coreui/coreui/dist/css/coreui.min.css";
import GetAppIcon from "@mui/icons-material/GetApp";
import "./Zoneparameters.scss";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CSVLink } from "react-csv";
import apiClient from "../../../Service/ApiClient";
import * as XLSX from "xlsx";
import queryString from "query-string";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
import Spinner from "../../Spinner";

var relevantAspects;

const Zoneparameters = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const [value2, setValue] = useState(
    dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  );

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  console.log("test", selectedDate);

  const handleDateChange = (value) => {
    onChangeDate(value);
  };
  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  // toggle switcher
  // const [selectedOption, setSelectedOption] = useState("Zones");

  const handleChange = (e) => {
    setToggle(!toggle);

    if (toggle) {
      setloading(true);
    } else {
      setloading(true);
    }

    onSelectedOption1(e.target.value);
    console.log(e.target.value);
  };
  // const [value2, setValue] = React.useState(dayjs());
  // console.log(value2);
  //const newdate = value2 ? value2.format('MM YYYY') : '';

  const [details, setDetails] = useState([]);
  const [data, setData] = useState([]);
  const [bardata, setBarData] = useState([]);
  const [toggle, setToggle] = useState(true);
  // const [sorted, setSorted]=useState([]);

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [loading, setloading] = useState(true);

  const fetchData = async (name) => {
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
          setloading(false);
        }

        relevantAspects = "ARREST AND PROSECUTION";

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        // Step 1: Sum the sub_parameter_weighted_average by zone_code and ensure unique zone_codes
        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        // Step 2: Convert the accumulated object to an array
        const reducedAllData = Object.values(summedByZone);

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = "RECOVERY OF ARREARS";

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "investigation") {
        const endpoints = [
          "gst4a",
          "gst4b",
          "gst4c",
          "gst4d"
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "audit") {
        const endpoints = [
          "gst10a",
          "gst10b",
          "gst10c"
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "scrutiny/assessment") {
        const endpoints = [
          "gst3a",
          "gst3b"
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.zone_code;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else {
        const response = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });

        if (response) {
          setloading(false);
        }

        if (name === "adjudication(legacy cases)") {
          const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];

          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient
                .get(`/cbic/${endpoint}`, {
                  params: { month_date: newdate, type: "zone" },
                })
                .then((response) => ({
                  data: response.data,
                }))
            )
          );

          console.log("Responses", responses);

          const totalsByZone = {};
          const totalByParam = {};

          // Process each response
          responses.forEach((response) => {
            response.data.forEach((item) => {
              const zoneCode = item.zone_code;
              const value = item.sub_parameter_weighted_average;
              const total = item.total_score;

              // Initialize or update the total for the zone_code
              if (!totalsByZone[zoneCode]) {
                totalsByZone[zoneCode] = 0;
              }

              if (!totalByParam[zoneCode]) {
                totalByParam[zoneCode] = 0;
              }

              totalsByZone[zoneCode] += value;
              totalByParam[zoneCode] += total;
            });
          });

          response.data.forEach((item) => {
            const zoneCode = item.zone_code;
            const value = item.sub_parameter_weighted_average;
            const total = item.totalScore;

            if (!totalsByZone[zoneCode]) {
              totalsByZone[zoneCode] = 0;
            }

            if (!totalByParam[zoneCode]) {
              totalsByZone[zoneCode] = 0;
            }

            totalsByZone[zoneCode] += value;
            totalByParam[zoneCode] += total;
          });

          // Log the results
          console.log("Totals by Zone Code:", totalsByZone);
          console.log("Total Score", totalByParam);

          const sorted = response.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );

          const sortedserial0 = sorted.map((item, index) => {
            // const value = totalsByZone[item.zone_code];
            const total = totalByParam[item.zone_code];
            return {
              ...item, // Spread the existing properties
              // sub_parameter_weighted_average:
              //   value !== undefined ? value : item.sub_parameter_weighted_average,
              totalScore: total !== undefined ? total : item.total_score,
              s_no: index + 1,
            };
          });

          setData(sortedserial0);
        }

        if (name === "appeals") {
          const endpoints = ["gst11a", "gst11b", "gst11c", "gst11d"];
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

          const totalByParam0 = {};

          // Process each response
          responses.forEach((response) => {
            response.data.forEach((item) => {
              const zoneCode = item.zone_code;
              const total = item.total_score || 0;

              // Initialize or update the total for the zone_code
              // if (!totalsByZone0[zoneCode]) {
              //   totalsByZone0[zoneCode] = 0;
              // }

              if (!totalByParam0[zoneCode]) {
                totalByParam0[zoneCode] = 0;
              }

              totalByParam0[zoneCode] += total;
            });
          });

          response.data.forEach((item) => {
            const zoneCode = item.zone_code;
            // const value = item.sub_parameter_weighted_average;
            const total = item.totalScore;

            // if (!totalsByZone[zoneCode]) {
            //   totalsByZone[zoneCode] = 0;
            // }

            if (!totalByParam0[zoneCode]) {
              totalByParam0[zoneCode] = 0;
            }

            // totalsByZone[zoneCode] += value;
            totalByParam0[zoneCode] += total;
          });
          console.log("Total Score", totalByParam0);

          const sorted = response.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );

          const appealserial = sorted.map((item, index) => {
            // const value = totalsByZone[item.zone_code];
            const total = totalByParam0[item.zone_code];
            return {
              ...item, // Spread the existing properties
              // sub_parameter_weighted_average:
              //   value !== undefined ? value : item.sub_parameter_weighted_average,
              totalScore: total !== undefined ? total : item.total_score,
              s_no: index + 1,
            };
          });

          console.log("FetchDataappealserial", appealserial);

          setData(appealserial);
        }

        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );

        relevantAspects = response.data.map((item) => item.ra)[0];

        // Log the fetched data to the console
        console.log("helloornate", response.data);
        // const sorted = response.data.sort((a, b) => a.zonal_rank - b.zonal_rank);
        const sorted = response.data.sort(
          (a, b) => b.totalScore - a.totalScore
        );

        console.log("Sorted:", sorted);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].totalScore;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        // sorted.forEach((item) => {
        //   item.zonal_rank = indexed + 1;
        // });

        // if (name === "refunds") {
        //   const sorted1 = response.data.sort(
        //     (a, b) => a.totalScore - b.totalScore
        //   );
        //   sorted1.forEach((item, index) => {
        //     item.zonal_rank = index + 1;
        //   });

        //   const sortedserial1 = sorted1.map((item, index) => ({
        //     ...item,
        //     s_no: index + 1,
        //   }));
        //   setData(sortedserial1);

        //   const topfive1 = sorted1.slice(0, 5);
        //   const bottomfive1 = sorted1.slice(-5);
        //   setBarData([...topfive1, ...bottomfive1]);
        // }

        if (name === "returnFiling" || name === "refunds") {
          const sorted1 = response.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const scoreIndexMap = new Map();
          let currentIndex = 1;

          for (let i = 0; i < sorted1.length; i++) {
            const score = sorted1[i].sub_parameter_weighted_average;

            // If this score hasn't been assigned an index yet, assign it
            if (!scoreIndexMap.has(score)) {
              scoreIndexMap.set(score, currentIndex);
              currentIndex++;
            }

            // Assign the index to each item based on its score
            sorted1[i].zonal_rank = scoreIndexMap.get(score);
          }
          const sortedserial1 = sorted1.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }));
          setData(sortedserial1);

          if (sorted1.length <= 5) {
            const topfive1 = sorted1.slice(0, sorted1.length / 2);
            const bottomfive1 = sorted1.slice(-sorted1.length / 2);
            setBarData([...topfive1, ...bottomfive1]);
          } else if (sorted1.length > 5 && sorted1.length < 10) {
            const topfive1 = sorted1.slice(0, sorted1.length / 2);
            const bottomfive1 = sorted1.slice(-sorted1.length / 2);
            setBarData([...topfive1, ...bottomfive1]);
          } else {
            const topfive1 = sorted1.slice(0, 5);
            const bottomfive1 = sorted1.slice(-5);
            setBarData([...topfive1, ...bottomfive1]);
          }
        }

        if (name === "adjudication") {
          const sorted2 = response.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );

          if (sorted2.length <= 5) {
            const topfive1 = sorted2;
            const bottomfive1 = 0;
            setBarData([...topfive1, ...bottomfive1]);
          } else if (sorted2.length > 5 && sorted2.length < 10) {
            const topfive1 = sorted2.slice(0, 5);
            const bottomfive1 = sorted2.slice(5);
            setBarData([...topfive1, ...bottomfive1]);
          } else {
            const topfive1 = sorted2.slice(0, 5);
            const bottomfive1 = sorted2.slice(-5);
            setBarData([...topfive1, ...bottomfive1]);
          }

          const topfive2 = sorted2.slice(0, 5);
          const bottomfive2 = sorted2.slice(-5);
          setBarData([...topfive2, ...bottomfive2]);
        }

        if (name === "adjudication(legacy cases)" || name === "appeals") {
          const sorted3 = response.data.sort(
            (a, b) =>
              b.sub_parameter_weighted_average -
              a.sub_parameter_weighted_average
          );
          console.log("sorted3", sorted3);

          const topfive3 = sorted3.slice(0, 5);
          console.log("Topfive", topfive3);
          const bottomfive3 = sorted3.slice(-5);
          setBarData([...topfive3, ...bottomfive3]);

          const scoreIndexMap = new Map();
          let currentIndex = 1;

          for (let i = 0; i < sorted3.length; i++) {
            const score = sorted3[i].sub_parameter_weighted_average;

            // If this score hasn't been assigned an index yet, assign it
            if (!scoreIndexMap.has(score)) {
              scoreIndexMap.set(score, currentIndex);
              currentIndex++;
            }

            // Assign the index to each item based on its score
            sorted3[i].zonal_rank = scoreIndexMap.get(score);
          }
        }

        // const sorted2= response.data.sort((a,b)=> b.totalScore - a.totalScore);
        const sortedserial = sorted.map((item, index) => ({
          ...item,
          s_no: index + 1,
        }));

        const enhancedData = sorted.map((item, index) => {
          const total =
            name === "adjudication"
              ? item.totalScore
              : item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        const enhancedData2 = sorted.map((item, index) => {
          const total = item.way_to_grade;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        //   const enhancedData = sorted.map((item, index) => {
        //     const total = sorted.length;

        //     const firstQuarter = total * 0.25;
        // const secondQuarter = total * 0.5;
        // const thirdQuarter = total * 0.75;

        //     let props = {};
        //     if (index < firstQuarter) {
        //       props = { scope: "row", color: "success" }; // Top 5 entries
        //     } else if (index >= firstQuarter && index < secondQuarter) {
        //       props = { scope: "row", color: "warning" };
        //     } else if (index >= thirdQuarter) {
        //       props = { scope: "row", color: "danger" }; // Bottom 5 entries
        //     } else {
        //       props = { scope: "row", color: "primary" }; // Remaining entries
        //     }

        //     return {
        //       ...item,
        //       _props: props, // Add _props field dynamically
        //       s_no: index + 1,
        //     };
        //   });
        // console.log("COLOR enhance CHANGED", enhancedData);

        setData(sortedserial);

        if (
          name === "adjudication" ||
          name === "scrutiny/assessment" ||
          name === "appeals" ||
          name === "adjudication(legacy cases)" ||
          name === "returnFiling" ||
          name === "refunds"
        ) {
          setData(enhancedData);
        }

        // if(name === "returnFiling" || name === "refunds"){
        //   setData(enhancedData2);
        // }
      }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  const fetchDatacomm = async (name) => {
    try {
      if (name === "arrest_and_prosecution") {
        const endpoints = ["gst9a", "gst9b"];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = "ARREST AND PROSECUTION";

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSEcomm", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone);

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        const enhancedData = sorted.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { scope: "row", color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { scope: "row", color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
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

        //setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      } else if (name === "recovery_of_arrears") {
        const endpoints = ["gst8a", "gst8b"]; // You can modify this array as needed

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = "RECOVERY OF ARREARS";

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2), // Format to 2 decimal places
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }

      else if (name === "registration") {
        const endpoints = [
          "gst1a",
          "gst1b",
          "gst1c",
          "gst1d",
          "gst1e",
          "gst1f",
        ]; // You can modify this array as needed

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2), // Format to 2 decimal places
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "investigation") {
        const endpoints = [
          "gst4a",
          "gst4b",
          "gst4c",
          "gst4d"
        ]; // You can modify this array as needed

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2), // Format to 2 decimal places
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "audit") {
        const endpoints = [
          "gst10a",
          "gst10b",
          "gst10c"
        ];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2), // Format to 2 decimal places
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else if (name === "scrutiny/assessment") {
        const endpoints = [
          "gst3a",
          "gst3b"
        ];

        // Make API calls for both endpoints
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

        relevantAspects = name.toUpperCase();

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE", allData);

        const summedByZone = allData.reduce((acc, item) => {
          const zoneCode = item.commissionerate_name;
          const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

          // If zone_code is encountered for the first time, initialize it
          if (!acc[zoneCode]) {
            acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
          }

          // Sum only the sub_parameter_weighted_average for each zone_code
          acc[zoneCode].sub_parameter_weighted_average += value;

          return acc;
        }, {});

        const reducedAllData = Object.values(summedByZone).map((item) => ({
          ...item,
          sub_parameter_weighted_average:
            item.sub_parameter_weighted_average.toFixed(2), // Format to 2 decimal places
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);
      }
      else {
        // Make a GET request to the specified endpoint
        // setloading(true);
        const response = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        // setTimeout(()=>{
        if (response) {
          setloading(false);
        }
        // },3000)
        console.log("gun", response.data);
        // Set the fetched data in the component's state

        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );

        // Log the fetched data to the console
        console.log("helloornate", response.data);
        // const sorted = response.data.sort((a, b) => a.zonal_rank - b.zonal_rank);
        const sorted = response.data.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        console.log("Sorted:", sorted);
        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);

        const scoreIndexMap = new Map();
        let currentIndex = 1;

        for (let i = 0; i < sorted.length; i++) {
          const score = sorted[i].sub_parameter_weighted_average;

          // If this score hasn't been assigned an index yet, assign it
          if (!scoreIndexMap.has(score)) {
            scoreIndexMap.set(score, currentIndex);
            currentIndex++;
          }

          // Assign the index to each item based on its score
          sorted[i].zonal_rank = scoreIndexMap.get(score);
        }

        if (name === "returnFiling" || name === "refunds") {
          const sorted1 = response.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const scoreIndexMap = new Map();
          let currentIndex = 1;

          for (let i = 0; i < sorted1.length; i++) {
            const score = sorted1[i].sub_parameter_weighted_average;

            // If this score hasn't been assigned an index yet, assign it
            if (!scoreIndexMap.has(score)) {
              scoreIndexMap.set(score, currentIndex);
              currentIndex++;
            }

            // Assign the index to each item based on its score
            sorted1[i].zonal_rank = scoreIndexMap.get(score);
          }
          const sortedserial1 = sorted1.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }));
          setData(sortedserial1);

          if (sorted1.length <= 5) {
            const topfive1 = sorted1.slice(0, sorted1.length / 2);
            const bottomfive1 = sorted1.slice(-sorted1.length / 2);
            setBarData([...topfive1, ...bottomfive1]);
          } else if (sorted1.length > 5 && sorted1.length < 10) {
            const topfive1 = sorted1.slice(0, sorted1.length / 2);
            const bottomfive1 = sorted1.slice(-sorted1.length / 2);
            setBarData([...topfive1, ...bottomfive1]);
          } else {
            const topfive1 = sorted1.slice(0, 5);
            const bottomfive1 = sorted1.slice(-5);
            setBarData([...topfive1, ...bottomfive1]);
          }
        }

        const sortedserial = sorted.map((item, index) => ({
          ...item,
          s_no: index + 1,
        }));

        if (name === "adjudication(legacy cases)") {
          const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient
                .get(`/cbic/${endpoint}`, {
                  params: { month_date: newdate, type: "all_commissary" },
                })
                .then((response) => ({
                  data: response.data,
                }))
            )
          );

          console.log("Responses", responses);

          const totalByParam = {};

          // Process each response
          responses.forEach((response) => {
            response.data.forEach((item) => {
              const commName = item.commissionerate_name;
              // const value = item.sub_parameter_weighted_average || 0; // Fallback for undefined values
              const total = item.total_score;

              // Initialize or update the total for the zone_code
              // if (!totalsByZone[commName]) {
              //   totalsByZone[commName] = 0;
              // }

              if (!totalByParam[commName]) {
                totalByParam[commName] = 0;
              }

              // totalsByZone[commName] += value;
              totalByParam[commName] += total;
            });
          });

          // Prepare the data for the new API
          response.data.forEach((item) => {
            const commName = item.commissionerate_name;
            // const value = item.sub_parameter_weighted_average;
            const total = item.total_score;

            // if (!totalsByZone[commName]) {
            //   totalsByZone[commName] = 0;
            // }

            if (!totalByParam[commName]) {
              totalByParam[commName] = 0;
            }

            // totalsByZone[commName] += value;
            totalByParam[commName] += total;
          });

          console.log("Total score by comm", totalByParam);

          const sortedserial0 = sorted.map((item, index) => {
            // const value = totalsByZone[item.commName];
            const total = totalByParam[item.commName];
            return {
              ...item, // Spread the existing properties
              // sub_parameter_weighted_average:
              //   value !== undefined ? value : item.sub_parameter_weighted_average,
              totalScore: total !== undefined ? total : item.total_score,
              s_no: index + 1,
            };
          });

          setData(sortedserial0);
        }

        if (name === "appeals") {
          const endpoints = ["gst11a", "gst11b", "gst11c", "gst11d"];
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient
                .get(`/cbic/${endpoint}`, {
                  params: { month_date: newdate, type: "all_commissary" },
                })
                .then((response) => ({
                  data: response.data,
                }))
            )
          );

          console.log("Responses", responses);

          const totalByParam0 = {};

          // Process each response
          responses.forEach((response) => {
            response.data.forEach((item) => {
              const zoneCode = item.commissionerate_name;
              const total = item.total_score;

              // Initialize or update the total for the zone_code
              // if (!totalsByZone0[zoneCode]) {
              //   totalsByZone0[zoneCode] = 0;
              // }

              if (!totalByParam0[zoneCode]) {
                totalByParam0[zoneCode] = 0;
              }

              totalByParam0[zoneCode] += total;
            });
          });

          response.data.forEach((item) => {
            const zoneCode = item.commName;
            // const value = item.sub_parameter_weighted_average;
            const total = item.totalScore;

            // if (!totalsByZone[zoneCode]) {
            //   totalsByZone[zoneCode] = 0;
            // }

            if (!totalByParam0[zoneCode]) {
              totalByParam0[zoneCode] = 0;
            }

            // totalsByZone[zoneCode] += value;
            totalByParam0[zoneCode] += total;
          });

          console.log("TotalByParam0", totalByParam0);

          const appealserial = sorted.map((item, index) => {
            // const value = totalsByZone[item.commName];
            const total = totalByParam0[item.commName];
            return {
              ...item, // Spread the existing properties
              // sub_parameter_weighted_average:
              //   value !== undefined ? value : item.sub_parameter_weighted_average,
              totalScore: total !== undefined ? total : item.totalScore,
              s_no: index + 1,
            };
          });

          setData(appealserial);
        }
        setData(sortedserial);
      }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  const [itemsSelect, setItemsSelect] = useState(() => {
    const savedItems = localStorage.getItem("itemsSelect");
    return savedItems ? Number(savedItems) : 5;
  });
  const handleItemsChange = (number) => {
    setItemsSelect(number);
  };

  // Call fetchData when the component mounts
  useEffect(() => {
    if (selectedOption1 === "Zones") {
      fetchData(name);
    } else {
      fetchDatacomm(name);
    }

    localStorage.setItem("itemsSelect", itemsSelect);

    setData();
  }, [name, newdate, selectedOption1, itemsSelect]); // Empty dependency array indicates that this effect runs only once

  const columns = [
    {
      key: "s_no",
      label: "S.No.",
      _props: { scope: "col" },
    },
    {
      key:
        name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" ||
          name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "zone_name"
          : "zoneName",
      label: "Zone ",
      _props: { scope: "col" },
    },
    {
      key:
        name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" ||
          name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "commissionerate_name"
          : "commName",
      label: "Commissionerate",
      _props: { scope: "col" },
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Number",
    // },
    // {
    //   key: "totalScore",
    //   label: "Percentage Not Filed",
    // },
    {
      key: "show_details",
      label: "Score Details",
      _props: { scope: "col" },
    },
    {
      key: "zonal_rank",
      label: "Zonal Rank",
      _props: { scope: "col" },
    },
  ];

  const commcolumns = [
    {
      key: "s_no",
      label: "S.No.",
      _props: { scope: "col" },
    },
    {
      key:
        name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" ||
          name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "commissionerate_name"
          : "commName",
      label: "Commissionerate",
      _props: { scope: "col" },
    },
    {
      key:
        name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" ||
          name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "zone_name"
          : "zoneName",
      label: "Zone",
      _props: { scope: "col" },
    },
    // {
    //   key: "totalScore",
    //   label: "Percentage Not Filed",
    // },
    {
      key: "show_details",
      label: "Score Details",
      _props: { scope: "col" },
    },
    {
      key: "zonal_rank",
      label: "Commissionerate Rank",
      _props: { scope: "col" },
    },
  ];

  if (name === "returnFiling") {
    // columns.splice(3, 0, {
    //   key: "absval",
    //   label: "Return Not Filed/Total Return Due",
    //   _props: { scope: "col" },
    // });

    // columns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage Not Filed",
    //   _props: { scope: "col" },
    // });

    columns.splice(4, 0, {
      key: "way_to_grade",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });

    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 5)",
      _props: { scope: "col" },
    });
    // commcolumns.splice(3, 0, {
    //   key: "absval",
    //   label: "Return Not Filed/Total Return Due",
    //   _props: { scope: "col" },
    // });

    // commcolumns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage Not Filed",
    //   _props: { scope: "col" },
    // });

    commcolumns.splice(4, 0, {
      key: "way_to_grade",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });

    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 5)",
      _props: { scope: "col" },
    });
  } else if (name === "refunds") {
    // columns.splice(3, 0, {
    //   key: "absval",
    //   label: "Refund > 60 days/Total Refund Pending",
    //   _props: { scope: "col" },
    // });

    // columns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage(For the Month)",
    //   _props: { scope: "col" },
    // });

    // commcolumns.splice(3, 0, {
    //   key: "totalScore",
    //   label: "Percentage(For the Month)",
    //   _props: { scope: "col" },
    // });

    columns.splice(4, 0, {
      key: "way_to_grade",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });

    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 5)",
      _props: { scope: "col" },
    });

    // commcolumns.splice(3, 0, {
    //   key: "absval",
    //   label: "Refund > 60 days/Total Refund Pending",
    //   _props: { scope: "col" },
    // });

    commcolumns.splice(4, 0, {
      key: "way_to_grade",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });

    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average (out of 5)",
      _props: { scope: "col" },
    });
  }
  else if (name === "adjudication") {
    columns.splice(4, 0, {
      key: "totalScore",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });
    columns.splice(5, 0, {
      key: "totalScore",
      label: "Weighted Average (Score out of 10)",
      _props: { scope: "col" },
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: "Score (out of 10)",
      _props: { scope: "col" },
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average(Score out of 10)",
      _props: { scope: "col" },
    });
  } else if (name === "adjudication(legacy cases)") {
    // columns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage (For the Month)",
    // });

    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: "Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });

    // commcolumns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage (For the Month)",
    // });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: "Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "appeals") {
    // columns.splice(4, 0, {
    //   key: "totalScore",
    //   label: "Percentage (For the Month)",
    // });

    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "parameter_wise_weighted_average",
      label: " Weighted Average (out of 12)",
    });
    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: "Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "parameter_wise_weighted_average",
      label: "Weighted Average(out of 12)",
    });
  }

  else if (name === "recovery_of_arrears") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });
  }
  else if (name === "arrest_and_prosecution") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });
  }
  else if (name === "registration") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });
  }
  else if (name === "investigation") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });
  }
  else if (name === "audit") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });
  }
  else if (name === "scrutiny/assessment") {
    columns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: " Score (out of 10)",
    });
    columns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
    });

    commcolumns.splice(4, 0, {
      key: "sub_parameter_weighted_average",
      label: "Score (out of 10)",
    });
    commcolumns.splice(5, 0, {
      key: "sub_parameter_weighted_average",
      label: " Weighted Average (out of 10)",
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

  charts(FusionCharts);
  Zune(FusionCharts);

  const getBarColor = (index) => {
    const color =
      name === "adjudication"
        ? bardata.map((item) => item.totalScore)
        : bardata.map((item) => item.sub_parameter_weighted_average);
    const colors = color.slice(0, 5);
    const total = colors[index % colors.length];
    console.log("Total", total);

    if (total >= 7.5 && total <= 10) {
      return "#00FF00"; // First 5 bars
    } else if (total < 7.5 && total >= 5) {
      return "#FFFF00"; // Next 5 bars
    } else if (total >= 0 && total <= 2.5) {
      return "#FF0000"; // Next 5 bars
    } else {
      return "#0000FF"; // Last 5 bars
    }
  };

  const getBarColorcomm = (index) => {
    const colors = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];

    const total = colors[index % colors.length];

    console.log("Total", total);

    return total;
  };

  const colorstop = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];

  const top5 = {
    // series: [
    //   {
    //     data: bardata.map(item=>item.totalScore).slice(0,5),
    //   },
    // ],
    // options: {
    //   chart: {
    //     type: "bar",
    //     height: 300,
    //     toolbar: {
    //       show: false,
    //     },
    //   },
    //   plotOptions: {
    //   bar: {
    //   distributed: true
    // }},
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   xaxis: {
    //     categories: bardata.map(item=>item.zoneName).slice(0,5),
    //     labels:{
    //       style:{
    //         fontSize: "9px",
    //       }
    //     }
    //   },
    // },

    chart: {
      caption:
        name === "returnFiling"
          ? selectedOption1 === "Zones"
            ? "Top 5 Zones (Least % pendency of return filing)"
            : "Top 5 Commissionerates (Least % pendency of return filing)"
          : name === "refunds"
            ? selectedOption1 === "Zones"
              ? "Top 5 Zones (Least % pendency of refunds beyond 60 days)"
              : "Top 5 Commissionerates (Least % pendency of refunds beyond 60 days)"
            : name === "scrutiny/assessment" ||
              name === "adjudication" ||
              name === "adjudication(legacy cases)" ||
              name === "arrest_and_prosecution" ||
              name === "audit" ||
              name === "appeals"
              ? selectedOption1 === "Zones"
                ? "Top 5 Performing Zone"
                : "Top 5 Performing Commissionerate"
              : selectedOption1 === "Zones"
                ? "Top 5 Zones"
                : "Top 5 Commissionerates",
      yaxisname: "Total Score",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "20",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Total Score:$value"
          : "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data:
      bardata.length <= 5
        ? bardata.slice(0, bardata.length / 2).map((item, index) => ({
          label: selectedOption1 === "Zones" ? item.zoneName : item.commName,
          value:
            name === "adjudication" || name === "scrutiny/assessment"
              ? selectedOption1 === "Zones"
                ? item.totalScore
                : item.sub_parameter_weighted_average
              : name === "adjudication(legacy cases)" ||
                name === "refunds" ||
                name === "returnFiling"
                ? item.sub_parameter_weighted_average
                : name === "appeals"
                  ? item.sub_parameter_weighted_average
                  : item.totalScore,
          color:
            selectedOption1 === "Zones"
              ? getBarColor(index)
              : getBarColorcomm(index),
        }))
        : bardata.length > 5 && bardata.length < 10
          ? bardata.slice(0, bardata.length / 2).map((item, index) => ({
            label: selectedOption1 === "Zones" ? item.zoneName : item.commName,
            value:
              name === "adjudication" || name === "scrutiny/assessment"
                ? selectedOption1 === "Zones"
                  ? item.totalScore
                  : item.sub_parameter_weighted_average
                : name === "adjudication(legacy cases)"
                  ? item.sub_parameter_weighted_average
                  : name === "appeals"
                    ? item.sub_parameter_weighted_average
                    : item.totalScore,
            color:
              selectedOption1 === "Zones"
                ? getBarColor(index)
                : getBarColorcomm(index),
          }))
          : bardata.slice(0, 5).map((item, index) => ({
            label:
              name === "recovery_of_arrears" ||
                name === "arrest_and_prosecution" ||
                name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                ? selectedOption1 === "Zones"
                  ? item.zone_name
                  : item.commissionerate_name
                : selectedOption1 === "Zones"
                  ? item.zoneName
                  : item.commName,
            value:
              name === "adjudication"
                ? selectedOption1 === "Zones"
                  ? item.totalScore
                  : item.sub_parameter_weighted_average
                : name === "adjudication(legacy cases)" ||
                  name === "refunds" ||
                  name === "returnFiling"
                  ? item.sub_parameter_weighted_average
                  : name === "appeals" ||
                    name === "arrest_and_prosecution" ||
                    name === "recovery_of_arrears" ||
                    name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                    ? item.sub_parameter_weighted_average
                    : item.totalScore,
            color:
              selectedOption1 === "Zones"
                ? getBarColor(index)
                : getBarColorcomm(index),
          })),
  };

  console.log("TOP5", top5);

  const getBarColorbottom = (index) => {
    const color =
      name === "adjudication"
        ? bardata.map((item) => item.totalScore)
        : bardata.map((item) => item.sub_parameter_weighted_average);
    const colors = color.slice(-5);
    const total = colors[index % colors.length];
    console.log("Total", total);

    if (total >= 7.5 && total <= 10) {
      return "#00FF00"; // First 5 bars
    } else if (total < 7.5 && total >= 5) {
      return "#FFFF00"; // Next 5 bars
    } else if (total >= 0 && total <= 2.5) {
      return "#FF0000"; // Next 5 bars
    } else {
      return "#0000FF"; // Last 5 bars
    }
  };

  const getBarColorbottomcomm = (index) => {
    const colors = ["#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000"];

    const total = colors[index % colors.length];
    console.log("Total", total);

    return total;
  };

  const colorsbottomzone = [
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
  ];
  const colorsbottomcomm = [
    "#800000",
    "#A0522D",
    "#808000",
    "#000000",
    "#31363F",
  ];
  const bottom5 = {
    // series: [
    //   {
    //     data: bardata.map(item=>item.totalScore).slice(-5),
    //   },
    // ],
    // options: {
    //   chart: {
    //     type: "bar",
    //     height: 400,
    //     toolbar:{
    //       show:false,
    //     }
    //   },
    //   plotOptions: {
    //     bar: {
    //   distributed: true
    // }
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   xaxis: {
    //     categories: bardata.map(item=>item.zoneName).slice(-5),
    //     labels:{
    //       style:{
    //         fontSize: "10px",
    //       }
    //     }
    //   },
    // },

    chart: {
      caption:
        name === "returnFiling"
          ? selectedOption1 === "Zones"
            ? "Bottom 5 Zones (Highest % pendency of return filing)"
            : "Bottom 5 Commissionerates (Highest % pendency of return filing)"
          : name === "refunds"
            ? selectedOption1 === "Zones"
              ? "Bottom 5 Zones (Highest % pendency of refunds beyond 60 days)"
              : "Bottom 5 Commissionerates (Highest % pendency of refunds beyond 60 days)"
            : name === "scrutiny/assessment" ||
              name === "adjudication" ||
              name === "adjudication(legacy cases)" ||
              name === "adjudication(legacy cases)" ||
              name === "arrest_and_prosecution" ||
              name === "audit" ||
              name === "appeals"
              ? selectedOption1 === "Zones"
                ? "Bottom 5 Performing Zone"
                : "Bottom 5 Performing Commissionerate"
              : selectedOption1 === "Zones"
                ? "Bottom 5 Zones"
                : "Bottom 5 Commissionerates",

      yaxisname: "Total Score",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "20",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Total Score:$value"
          : "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "5",
    },
    data:
      bardata.length <= 5
        ? bardata.slice(-bardata.length / 2).map((item, index) => ({
          label: selectedOption1 === "Zones" ? item.zoneName : item.commName,
          value:
            name === "adjudication"
              ? selectedOption1 === "Zones"
                ? item.totalScore
                : item.sub_parameter_weighted_average
              : name === "adjudication(legacy cases)" ||
                name === "refunds" ||
                name === "returnFiling"
                ? item.sub_parameter_weighted_average
                : name === "appeals"
                  ? item.sub_parameter_weighted_average
                  : item.totalScore,
          // color: colorsbottomzone[index % colorsbottomzone.length],
          color:
            selectedOption1 === "Zones"
              ? getBarColorbottom(index)
              : getBarColorbottomcomm(index),
        }))
        : bardata.length > 5 && bardata.length <= 10
          ? bardata.slice(-bardata.length / 2).map((item, index) => ({
            label:
              name === "recovery_of_arrears" ||
                name === "arrest_and_prosecution" ||
                name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                ? selectedOption1 === "Zones"
                  ? item.zone_name
                  : item.commissionerate_name
                : selectedOption1 === "Zones"
                  ? item.zoneName
                  : item.commName,
            value:
              name === "adjudication"
                ? selectedOption1 === "Zones"
                  ? item.totalScore
                  : item.sub_parameter_weighted_average
                : name === "adjudication(legacy cases)" ||
                  name === "refunds" ||
                  name === "returnFiling"
                  ? item.sub_parameter_weighted_average
                  : name === "appeals" ||
                    name === "arrest_and_prosecution" ||
                    name === "recovery_of_arrears" ||
                    name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                    ? item.sub_parameter_weighted_average
                    : item.totalScore,
            // color: colorsbottomzone[index % colorsbottomzone.length],
            color:
              selectedOption1 === "Zones"
                ? getBarColorbottom(index)
                : getBarColorbottomcomm(index),
          }))
          : bardata.slice(-5).map((item, index) => ({
            label:
              name === "recovery_of_arrears" ||
                name === "arrest_and_prosecution" || name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                ? selectedOption1 === "Zones"
                  ? item.zone_name
                  : item.commissionerate_name
                : selectedOption1 === "Zones"
                  ? item.zoneName
                  : item.commName,
            value:
              name === "adjudication"
                ? selectedOption1 === "Zones"
                  ? item.totalScore
                  : item.sub_parameter_weighted_average
                : name === "adjudication(legacy cases)" ||
                  name === "refunds" ||
                  name === "returnFiling"
                  ? item.sub_parameter_weighted_average
                  : name === "appeals" ||
                    name === "arrest_and_prosecution" ||
                    name === "recovery_of_arrears" ||
                    name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                    ? item.sub_parameter_weighted_average
                    : item.totalScore,
            // color: colorsbottomzone[index % colorsbottomzone.length],
            color:
              selectedOption1 === "Zones"
                ? getBarColorbottom(index)
                : getBarColorbottomcomm(index),
          })),
  };

  console.log("Bottom5", bottom5);

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData =
      selectedOption1 === "Zones"
        ? data.map((user) => {
          // Customize object properties to match desired format
          switch (name) {
            case "registration": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "returnFiling": {
              return {
                "S.No.": user.s_no,
                Zone: user.zoneName,
                Commissionerate: user.commName,
                "Return Not Filed/Total Returns Due": user.absval,
                "Percentage Not Filed": user.totalScore,
                "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                "Weighted Average (out of 5)":
                  user.sub_parameter_weighted_average,
                // "Score Details": "Show",
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "scrutiny/assessment": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "investigation": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "adjudication": {
              return {
                "S.No.": user.s_no,
                Zone: user.zoneName,
                Commissionerate: user.commName,
                "Score Details": "Show",
                "Adjudication Weighted Average(Score out of 10)":
                  user.totalScore,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "adjudication(legacy cases)": {
              return {
                "S.No.": user.s_no,
                Zone: user.zoneName,
                Commissionerate: user.commName,
                "Score Details": "Show",
                "Adjudication(legacy cases) Weighted Average(Score out of 10)":
                  user.totalScore,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "refunds": {
              return {
                "S.No.": user.s_no,
                Zone: user.zoneName,
                Commissionerate: user.commName,
                "Refunds > 60 days/Total Refund Pending": user.absval,
                "Percentage(For the Month)": user.totalScore,
                "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                "Weighted Average (out of 5)":
                  user.sub_parameter_weighted_average,
                "Score Details": "Show",
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "recovery_of_arrears": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "arrest_and_prosecution": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "audit": {
              return {
                "S.No.": user.s_no,
                Zone: user.zone_name,
                Commissionerate: user.commissionerate_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
              };
            }

            case "appeals": {
              return {
                "S.No.": user.s_no,
                Zone: user.zoneName,
                Commissionerate: user.commName,
                "Score Details": "Show",
                "Appeals Weighted Average(Score out of 12)":
                  user.sub_parameter_weighted_average,
                "Zonal Rank": user.zonal_rank,
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
        })
        : data.map((user) => {
          switch (name) {
            case "registration": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Total Commissionerate Score (For the month)":
                  user.totalScore,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "returnFiling": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Return Not Filed/Total Return Due": user.absval,
                "Percentage Not Filed": user.totalScore,
                "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                "Weighted Average(out of 5)":
                  user.sub_parameter_weighted_average,
                // "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "scrutiny/assessment": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                // "Total Commissionerate Score (For the month)":
                //   user.totalScore,
                "Score Details": "Show",
                "Scrutiny & Assessment of Returns Weighted Average(out of 10)":
                  user.sub_parameter_weighted_average,
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "investigation": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Total Commissionerate Score (For the month)":
                  user.totalScore,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "adjudication": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                // "Total Commissionerate Score (For the month)":
                //   user.totalScore,
                "Score Details": "Show",
                "Adjudication Weighted Average(Score out of 10)":
                  user.sub_parameter_weighted_average,
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "adjudication(legacy cases)": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                // "Total Commissionerate Score (For the month)":
                //   user.totalScore,
                "Score Details": "Show",
                "Adjudication(legacy cases) Weighted Average(Score out of 10)":
                  user.sub_parameter_weighted_average,
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "refunds": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Refund > 60 days/Total Refund Pending": user.absval,
                "Percentage(For the Month)": user.totalScore,
                "Way to Grade (Marks) Score out of 10": user.way_to_grade,
                "Weighted Average (out of 5)":
                  user.sub_parameter_weighted_average,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "recovery_of_arrears": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commissionerate_name,
                Zone: user.zone_name,
                "Score Details": "Show",
                "Score(out of 10)": user.sub_parameter_weighted_average,
                "Weighted Average (out of 10)":
                  user.sub_parameter_weighted_average,
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "arrest and prosecution": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "audit": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                "Total Commissionerate Score (For the month)":
                  user.totalScore,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "appeals": {
              return {
                "S.No.": user.s_no,
                Commissionerate: user.commName,
                Zone: user.zoneName,
                // "Total Commissionerate Score (For the month)":
                //   user.totalScore,
                "Score Details": "Show",
                "Appeals Weighted Average(Score out of 12)":
                  user.sub_parameter_weighted_average,
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            default: {
              return {
                "S.No.": user.s_no,
                "Commissionerate Name": user.commName,
                "Zone Name": user.zoneName,
                "Total Score(For the Month)": user.totalScore,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
          }
        });
    // : data.map((user) => ({
    //     // Customize object properties to match desired format
    //     "S.No.": user.s_no,
    //     "Commissionerate Name": user.commName,
    //     "Zone Name": user.zoneName,
    //     "Total Commissionerate Score(For the Month)": user.totalScore,
    //     "Score Details": "Show",
    //     "Commissionerate Rank": user.zonal_rank,
    //   }));

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
    zoneName: (item) => (
      <td>
        {/* <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}> */}
        {item.zoneName}
        {/* </Link> */}
      </td>
    ),

    commName: (item) => (
      <td>
        <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
          {item.commName}
        </Link>
      </td>
    ),

    commissionerate_name: (item) => (
      <td>
        <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
          {item.commissionerate_name}
        </Link>
      </td>
    ),

    absval: (item) => <td>{item.absval}</td>,

    show_details: (item) => {
      return (
        <td className="py-2">
          <Link
            to={`/zonescoredetails?zone_code=${item.zone_code}&name=${name}`}
          >
            <CButton color="primary" variant="outline" shape="square" size="sm">
              Show
            </CButton>
          </Link>
        </td>
      );
    },
  };

  // if (
  //   name === "returnFiling" ||
  //   name === "scrutiny/assessment" ||
  //   name === "refunds"
  // ) {
  //   scopedColumns.zoneName = (item) => (
  //     <td>
  //       {/* <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}> */}
  //       {item.zoneName}
  //       {/* </Link> */}
  //     </td>
  //   );

  //   scopedColumns.commName = (item) => (
  //     <td>
  //       <Link to={`/zonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
  //         {item.commName}
  //       </Link>
  //     </td>
  //   );
  // }

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
    zoneName: (item) => <td>{item.zoneName}</td>,

    commName: (item) => <td>{item.commName}</td>,


    show_details: (item) => {
      return (
        <td className="py-2">
          <Link
            to={`/commscoredetails?zone_code=${item.zone_code
              }&name=${name}&come_name=${name === "recovery_of_arrears" ||
                name === "arrest_and_prosecution" || name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
                ? item.commissionerate_name
                : item.commName
              }`}
          >
            <CButton color="primary" variant="outline" shape="square" size="sm">
              Show
            </CButton>
          </Link>
        </td>
      );
    },
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

            <div className="rgt-sec">
              {/* {name === "returnFiling" ||
              name === "scrutiny/assessment" ||
              name === "refunds" ? (
                <div className="switches-container2">
                  <input
                    type="radio"
                    id="switchMonthly"
                    name="switchPlan"
                    value="Zones"
                    checked={selectedOption1 === "Zones"}
                    onChange={handleChange}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Commissionerate"
                    checked={selectedOption1 === "Commissionerate"}
                    onChange={handleChange}
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
                  onChange={handleChange}
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  value="Commissionerate"
                  checked={selectedOption1 === "Commissionerate"}
                  onChange={handleChange}
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
            <div className="custom-tb mb">
              <div className="row container">
                <div className="col-md-6 mt-2 ">
                  <div className="card">
                    {selectedOption1 === "Zones" ? (
                      <div className="card-header">
                        {name === "returnFiling" ? (
                          <strong>
                            Top 5 Zones (Least % pendency of return filing)
                          </strong>
                        ) : name === "refunds" ? (
                          <strong>
                            Top 5 Zones (Least % pendency of refunds beyond 60
                            days)
                          </strong>
                        ) : name === "scrutiny/assessment" ||
                          name === "adjudication" ||
                          name === "adjudication(legacy cases)" ||
                          name === "adjudication(legacy cases)" ||
                          name === "arrest_and_prosecution" ||
                          name === "audit" ||
                          name === "appeals" ? (
                          <strong>Top 5 Performing Zone</strong>
                        ) : (
                          <strong>Top 5 Zones</strong>
                        )}
                        <span className="small ms-1">
                          <Link to={`/allparameters?name=${name}`}>
                            View Details
                          </Link>
                        </span>
                      </div>
                    ) : (
                      <div className="card-header">
                        {name === "returnFiling" ? (
                          <strong>
                            Top 5 Commissionerates (Least % pendency of return
                            filing)
                          </strong>
                        ) : name === "refunds" ? (
                          <strong>
                            Top 5 Commissionerates (Least % pendency of refunds
                            beyond 60 days)
                          </strong>
                        ) : name === "scrutiny/assessment" ||
                          name === "adjudication" ||
                          name === "adjudication(legacy cases)" ||
                          name === "adjudication(legacy cases)" ||
                          name === "arrest_and_prosecution" ||
                          name === "audit" ||
                          name === "appeals" ? (
                          <strong>Top 5 Performing Commissionerate</strong>
                        ) : (
                          <strong>Top 5 Commissionerates</strong>
                        )}
                        <span className="small ms-1">
                          <Link to={`/allparameters?name=${name}`}>
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
                            <Link to={`/allparameters?name=${name}`}>
                              <Button className="openbtn">
                                <KeyboardArrowRightIcon />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/allparameters?name=${name}`}>
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
                        {name === "returnFiling" ? (
                          <strong>
                            Bottom 5 Zones (Highest % pendency of return filing)
                          </strong>
                        ) : name === "refunds" ? (
                          <strong>
                            Bottom 5 Zones (Highest % pendency of refunds beyond
                            60 days)
                          </strong>
                        ) : name === "scrutiny/assessment" ||
                          name === "adjudication" ||
                          name === "adjudication(legacy cases)" ||
                          name === "adjudication(legacy cases)" ||
                          name === "arrest_and_prosecution" ||
                          name === "audit" ||
                          name === "appeals" ? (
                          <strong>Bottom 5 Performing Zone</strong>
                        ) : (
                          <strong>Bottom 5 Zones</strong>
                        )}
                        <span className="small ms-1">
                          <Link to={`/allparameters?name=${name}`}>
                            View Details
                          </Link>
                        </span>
                      </div>
                    ) : (
                      <div className="card-header">
                        {name === "returnFiling" ? (
                          <strong>
                            Bottom 5 Commissionerates (Highest % pendency of
                            return filing)
                          </strong>
                        ) : name === "refunds" ? (
                          <strong>
                            Bottom 5 Commissionerates (Highest % pendency of
                            refunds beyond 60 days)
                          </strong>
                        ) : name === "scrutiny/assessment" ||
                          name === "adjudication" ||
                          name === "adjudication(legacy cases)" ||
                          name === "adjudication(legacy cases)" ||
                          name === "arrest_and_prosecution" ||
                          name === "audit" ||
                          name === "appeals" ? (
                          <strong>Bottom 5 Performing Commissionerate</strong>
                        ) : (
                          <strong>Bottom 5 Commissionerates</strong>
                        )}
                        <span className="small ms-1">
                          <Link to={`/allparameters?name=${name}`}>
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
                            <Link to={`/allparameters?name=${name}`}>
                              <Button className="openbtn">
                                <KeyboardArrowRightIcon />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/allparameters?name=${name}`}>
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
              <div className="container">
                <div className="export-btn">
                  <button onClick={exportToXLS} className="btn btn-primary">
                    Export XLS
                  </button>
                </div>
                {/* 1085 */}
                <CSmartTable
                  activePage={1}
                  cleaner
                  clickableRows={false}
                  columns={selectedOption1 === "Zones" ? columns : commcolumns}
                  items={data}
                  itemsPerPageSelect
                  itemsPerPage={itemsSelect}
                  onItemsPerPageChange={handleItemsChange}
                  pagination
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
                  onKeyDown={(e) => checkSpecialChar(e)}
                  tableProps={{
                    className: "add-this-class custom-table",
                    responsive: true,
                    //striped: true,
                    hover: true,
                    align: "middle",
                    border: "primary",
                    onKeyDown: checkSpecialChar,
                  }}
                  tableBodyProps={{
                    className: "align-middle",
                  }}

                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Zoneparameters;
