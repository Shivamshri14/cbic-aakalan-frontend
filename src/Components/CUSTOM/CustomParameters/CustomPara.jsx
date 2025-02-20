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
import "../../CGST/Registration/Zoneparameters.scss";
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

const CustomPara = ({
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

  // Function to fetch data using Axios
  const [loading, setloading] = useState(true);

  const fetchData = async (name) => {
    try {
      if (name === "investigation") {

        const cusendpoints = [
          "cus6a",
          "cus6b",
          "cus6c",
          "cus6d",
          "cus6e",
          "cus6f",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_12 = ((item.sub_parameter_weighted_average * 12) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "investigation" ? "INVESTIGATION" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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



        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "epcg") {

        const cusendpoints = [
          "cus2a",
          "cus2b",
          "cus2c",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_7: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_7 = ((item.sub_parameter_weighted_average * 7) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "epcg" ? "Management of Export Obligation(EPCG)" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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



        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "export_obligation(AA)") {

        const cusendpoints = [
          "cus3a",
          "cus3b",
          "cus3c",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_7 = ((item.sub_parameter_weighted_average * 7) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "export_obligation(AA)" ? "Management of Export Obligation(AA)" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "disposal/pendency") {

        const cusendpoints = [
          "cus4a",
          "cus4b",
          "cus4c",
          "cus4d",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_11 = ((item.sub_parameter_weighted_average * 11) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "disposal/pendency" ? "Disposal/Pendency Of Provisional Assessments" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "arrest_and_prosecution") {

        const cusendpoints = [
          "cus7a",
          "cus7b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "arrest_and_prosecution" ? "Arrests and Prosecution" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "DisposalOfConfiscatedGoldAndNDPS") {

        const cusendpoints = [
          "cus9a",
          "cus9b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "DisposalOfConfiscatedGoldAndNDPS" ? "Disposal Of Confiscated Gold and Narcotics" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "unclaimed_cargo") {

        const cusendpoints = [
          "cus8a",
          "cus8b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_12: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "unclaimed_cargo" ? "Monitoring Of Un-cleared and Unclaimed cargo" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "recovery_of_arrears") {

        const cusendpoints = [
          "cus10a",
          "cus10b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_6: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "recovery_of_arrears" ? "RECOVERY OF ARREARS" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else if (name === "management_of_warehousing_bonds") {

        const cusendpoints = [
          "cus11a",
          "cus11b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        console.log("Response", responses);

        if (responses) {
          setloading(false);
        }

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_code;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                weighted_average_out_of_6: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "management_of_warehousing_bonds" ? "Management Of Warehousing bonds" : finalData.map((item) => item.ra)[0]);

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
          const total = item.sub_parameter_weighted_average

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
        setBarData([...sorted]);
        // setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
        setData(enhancedData);
      }
      else {

        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });

        console.log("url", response);

        if (response) {
          setloading(false);
        }

        relevantAspects = response.data.map((item) => item.ra)[0];

        const sorted = response.data.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );



        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );


        console.log("Sorted:", sorted);

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
          const total = item.sub_parameter_weighted_average

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
        console.log("COLOR enhance CHANGED", enhancedData);

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

        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

        if (name === "adjudication" || name === "DisposalOfConfiscatedGoldAndNDPS"
          || name === "CommissionerAppeals" || name === "timelyrefunds"
        ) {
          setData(enhancedData);
        }

        const topfive = sorted.slice(0, 5);
        const bottomfive = sorted.slice(-5);
        setBarData([...topfive, ...bottomfive]);

      }

    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  const fetchDatacomm = async (name) => {
    try {

      if (name === "investigation") {
        const cusendpoints = [
          "cus6a",
          "cus6b",
          "cus6c",
          "cus6d",
          "cus6e",
          "cus6f",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_12 = ((item.sub_parameter_weighted_average * 12) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );

        relevantAspects = (name === "investigation" ? "INVESTIGATION" : finalData.map((item) => item.ra)[0]);;

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
      else if (name === "export_obligation(AA)") {
        const cusendpoints = [
          "cus3a",
          "cus3b",
          "cus3c",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_7 = ((item.sub_parameter_weighted_average * 7) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
      else if (name === "epcg") {
        const cusendpoints = [
          "cus2a",
          "cus2b",
          "cus2c",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_7 = ((item.sub_parameter_weighted_average * 7) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
      else if (name === "disposal/pendency") {
        const cusendpoints = [
          "cus4a",
          "cus4b",
          "cus4c",
          "cus4d",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_11 = ((item.sub_parameter_weighted_average * 11) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
      else if (name === "arrest_and_prosecution") {
        const cusendpoints = [
          "cus7a",
          "cus7b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
          return item;
        });
        console.log(
          "Final Summed Data with Total Score and Weighted Average",
          finalData
        );


        relevantAspects = (name === "recovery_of_arrears" ? "RECOVERY OF ARREARS" : finalData.map((item) => item.ra)[0]);



        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

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
      else if (name === "DisposalOfConfiscatedGoldAndNDPS") {
        const cusendpoints = [
          "cus9a",
          "cus9b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
      else if (name === "unclaimed_cargo") {
        const cusendpoints = [
          "cus8a",
          "cus8b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
      else if (name === "recovery_of_arrears") {
        const cusendpoints = [
          "cus10a",
          "cus10b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

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
      else if (name === "management_of_warehousing_bonds") {
        const cusendpoints = [
          "cus11a",
          "cus11b",
        ];

        const responses = await Promise.all(
          cusendpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              })
              .then((response) => ({
                data: response.data,
                gst: endpoint.toUpperCase(),
              }))
          )
        );

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.commissionerate_name;
            if (!accumulationMap.has(key)) {
              accumulationMap.set(key, {
                ...item,
                sub_parameter_weighted_average: 0,
                total_score: 0,
                gst: response.gst,
              });
            }
            const accumulatedItem = accumulationMap.get(key);
            accumulatedItem.sub_parameter_weighted_average +=
              item.sub_parameter_weighted_average;
            accumulatedItem.total_score += item.total_score; // Update the map with the new summed values
            accumulationMap.set(key, accumulatedItem);
          })
        );
        const allData = Array.from(accumulationMap.values());
        console.log("Consolidated and Summed Data", allData);

        const finalData = allData.map((item) => {
          item.sub_parameter_weighted_average = parseFloat(
            item.sub_parameter_weighted_average.toFixed(1)
          );
          item.weighted_average_out_of_6 = ((item.sub_parameter_weighted_average * 6) / 10).toFixed(1);
          item.total_score = parseFloat(item.total_score.toFixed(1));

          item.total_score = parseFloat(item.total_score.toFixed(1));
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
        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        console.log("url", response);

        if (response) {
          setloading(false);
        }

        relevantAspects = response.data.map((item) => item.ra)[0];

        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );

        const sorted = response.data.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        console.log("Sorted:", sorted);

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
    },
    {
      key: name === "investigation" || name === "epcg" || name === "disposal/pendency" ||
        name === "arrest_and_prosecution" || name === "unclaimed_cargo" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "export_obligation(AA)" || name === "DisposalOfConfiscatedGoldAndNDPS" ? "zone_name" : "zoneName",
      label: "Zone ",
    },
    {
      key: name === "investigation" || name === "epcg" || name === "disposal/pendency" ||
        name === "arrest_and_prosecution" || name === "unclaimed_cargo" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "export_obligation(AA)" || name === "DisposalOfConfiscatedGoldAndNDPS" ? "commissionerate_name" : "commName",
      label: "Commissionerate",
    },
    {
      key: "show_details",
      label: "Score Details",
    },
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted average",
    // },
    {
      key: "zonal_rank",
      label: "Zonal Rank",
    },
  ];

  const commcolumns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: name === "investigation" || name === "epcg" || name === "disposal/pendency" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "unclaimed_cargo" || name === "arrest_and_prosecution" || name === "export_obligation(AA)" || name === "DisposalOfConfiscatedGoldAndNDPS" ? "commissionerate_name" : "commName",
      label: "Commissionerate",
    },
    {
      key: name === "investigation" || name === "epcg" || name === "disposal/pendency" || name === "unclaimed_cargo" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "arrest_and_prosecution" || name === "export_obligation(AA)" || name === "DisposalOfConfiscatedGoldAndNDPS" ? "zone_name" : "zoneName",
      label: "Zone",
    },
    {
      key: "show_details",
      label: "Score Details",
    },
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted average",
    // },
    {
      key: "zonal_rank",
      label: "Commissionerate Rank",
    },
  ];

  switch (name) {

    case "timelyrefunds":
      // columns.splice(3, 0, {
      //   key: "absval",
      //   label: "Absolute Number",
      // });

      // columns.splice(4, 0, {
      //   key: "totalScore",
      //   label: "Percentage For the month",
      // });

      columns.splice(4, 0, {
        key: "way_to_grade",
        label: "Score (out of 10)",
      });

      columns.splice(5, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });

      // commcolumns.splice(3, 0, {
      //   key: "absval",
      //   label: "Absolute Number",
      // });

      // commcolumns.splice(4, 0, {
      //   key: "totalScore",
      //   label: "Percentage for the month",
      // });

      commcolumns.splice(4, 0, {
        key: "way_to_grade",
        label: "Way to Grade (Score out of 10)",
      });

      commcolumns.splice(5, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average(out of 5)",
      });

      break;

    case "investigation":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      columns.splice(5, 0, {
        key: "weighted_average_out_of_12",
        label: "Weighted average (Out of 12)",
      })

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;

    case "epcg":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_7",
        label: "Weighted average (Out of 7)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_7",
        label: "Weighted average (Out of 7)",
      });

      break;
    case "export_obligation(AA)":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_7",
        label: "Weighted average (Out of 7)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_7",
        label: "Weighted average (Out of 7)",
      });

      break;
    case "disposal/pendency":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_11",
        label: "Weighted average (Out of 11)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_11",
        label: "Weighted average (Out of 11)",
      });

      break;
    case "management_of_warehousing_bonds":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      break;
    case "arrest_and_prosecution":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      break;
    case "unclaimed_cargo":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      break;

    case "recovery_of_arrears":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      break;

    case "DisposalOfConfiscatedGoldAndNDPS":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });
      columns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      });

      commcolumns.splice(5, 0, {
        key: "weighted_average_out_of_6",
        label: "Weighted average (Out of 6)",
      });

      break;

    case "adjudication":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      }); columns.splice(5, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 10)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",

      }); commcolumns.splice(5, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average (Out of 10)",
      });

      break;

    case "DisposalOfConfiscatedGoldAndNDPS":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });
      columns.splice(5, 0, {
        key: "parameter_wise_weighted_average",
        label: "Weighted average (Out of 4)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });
      commcolumns.splice(5, 0, {
        key: "parameter_wise_weighted_average",
        label: "Weighted average (Out of 4)",
      });
      break;

    case "CommissionerAppeals":
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });
      columns.splice(5, 0, {
        key: "parameter_wise_weighted_average",
        label: "Weighted average (Out of 8)",
      });

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });
      commcolumns.splice(5, 0, {
        key: "parameter_wise_weighted_average",
        label: "Weighted average (Out of 8)",
      });

      break;

    default:
      columns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average",
      })

      commcolumns.splice(4, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted average",
      })
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

  // Disable watermark
  FusionCharts.options.license({
    creditLabel: false, // Hides the watermark completely
  });


  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];

  const getBarColor = (index) => {

    const color = bardata.map(item => item.sub_parameter_weighted_average);
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

    const colors = [
      "#00FF00",
      "#00FF00",
      "#00FF00",
      "#00FF00",
      "#00FF00",
    ];

    const total = colors[index % colors.length];

    console.log("Total", total);

    return total;
  };

  const getBarColorBottom = (index) => {

    const color = bardata.map(item => item.sub_parameter_weighted_average);
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
  }

  const getBarColorcommbottom = (index) => {

    const colors = [
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
      "#ff0000",
    ];

    const total = colors[index % colors.length];

    console.log("Total", total);

    return total;
  };

  const top5 = {
    chart: {
      caption:
        // name==="timelyrefunds"? selectedOption1==="Zones"?"Top 5 Zones ()":"Top 5 Commissionerates (Application cleared within 7 days)":
        selectedOption1 === "Zones" ? "Top 5 Performing Zones" : "Top 5 Performing Commissionerates",
      yaxisname: "Total Score",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Total Score:$value"
          : "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
    },
    data: bardata.slice(0, 5).map((item, index) => ({
      label:
        name === "investigation" || name === "epcg" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "disposal/pendency" || name === "arrest_and_prosecution" || name === "DisposalOfConfiscatedGoldAndNDPS" || name === "unclaimed_cargo" || name === "export_obligation(AA)"
          ? selectedOption1 === "Zones"
            ? item.zone_name
            : item.commissionerate_name
          : selectedOption1 === "Zones"
            ? item.zoneName
            : item.commName,
      value: item.sub_parameter_weighted_average,
      // color: colorstopzone[index % colorstopzone.length],
      color: selectedOption1 === "Zones" ? getBarColor(index) : getBarColorcomm(index),
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
  const colorsbottomcomm = [
    "#800000",
    "#A0522D",
    "#808000",
    "#000000",
    "#31363F",
  ];

  const bottom5 = {
    chart: {
      caption:
        // name==="timelyrefunds"? selectedOption1==="Zones"?"Bottom 5 Zones ()":"Top 5 Commissionerates (Application cleared within 7 days)":
        selectedOption1 === "Zones"
          ? "Bottom 5 Performing Zones"
          : "Bottom 5 Performing Commissionerates",

      yaxisname: "Total Score",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Total Score:$value"
          : "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
    },
    data: bardata.slice(-5).map((item, index) => ({
      label:
        name === "investigation" || name === "epcg" || name === "recovery_of_arrears" || name === "management_of_warehousing_bonds" || name === "disposal/pendency" || name === "unclaimed_cargo" || name === "arrest_and_prosecution" || name === "DisposalOfConfiscatedGoldAndNDPS" || name === "export_obligation(AA)"
          ? selectedOption1 === "Zones"
            ? item.zone_name
            : item.commissionerate_name
          : selectedOption1 === "Zones"
            ? item.zoneName
            : item.commName,
      value: item.sub_parameter_weighted_average,
      color: selectedOption1 === "Zones" ? getBarColorBottom(index) : getBarColorcommbottom(index),
    })),
  };

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData =
      selectedOption1 === "Zones"
        ? data.map((user) => {
          switch (name) {
            case "timelyrefunds": {
              return {
                SNo: user.s_no,
                "Zone": user.zoneName,
                "Commissionerate": user.commName,
                "Absolute Number": user.absval,
                "Percentage (For the Month)": user.totalScore,
                "Way to Grade (Marks) Out of 10": user.way_to_grade,
                "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
                "Score Details": "Show",
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "epcg": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 7)": user.weighted_average_out_of_7,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "export_obligation(AA)": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 7)": user.weighted_average_out_of_7,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "disposal/pendency": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 11)": user.weighted_average_out_of_11,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "arrest_and_prosecution": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "management_of_warehousing_bonds": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "unclaimed_cargo": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "recovery_of_arrears": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Zonal Rank": user.zonal_rank,
              };
            }
            case "DisposalOfConfiscatedGoldAndNDPS": {
              return {
                SNo: user.s_no,
                "Zone name ": user.zone_name,
                "Commissionerate Name": user.commissionerate_name,
                "Score Details": "Show",
                "Score Out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Zonal Rank": user.zonal_rank,
              };
            }
            // Customize object properties to match desired format
            default: {
              return {
                SNo: user.s_no,
                "Zone": user.zonename,
                "Commissionerate": user.commissionerate_name,
                "Absolute Value": user.absolutevale,
                "Total Score": user.total_score,
                "Way to Grade (Marks) Out of 10": user.way_to_grade,
                "Weighted Average(out of 5)":
                  user.sub_parameter_weighted_average,
              };
            }
          }
        })
        : data.map((user) => {
          switch (name) {
            case "timelyrefunds": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commName,
                "Zone": user.zoneName,
                "Absolute Number": user.absval,
                "Percentage (For the Month)": user.totalScore,
                "Way to Grade (Score out of 10)": user.way_to_grade,
                "Weighted Average (out of 5)": user.sub_parameter_weighted_average,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
            case "export_obligation(AA)": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 7)": user.weighted_average_out_of_7,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "epcg": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 7)": user.weighted_average_out_of_7,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "arrest_and_prosecution": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
            case "unclaimed_cargo": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
            case "recovery_of_arrears": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
            case "management_of_warehousing_bonds": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }
            case "DisposalOfConfiscatedGoldAndNDPS": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 6)": user.weighted_average_out_of_6,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }

            case "disposal/pendency": {
              return {
                SNo: user.s_no,
                "Commissionerate": user.commissionerate_name,
                "Zone": user.zone_name,
                // "Absolute Number": user.absval,
                // "Percentage (For the Month)": user.totalScore,
                // "Way to Grade (Score out of 10)": user.way_to_grade
                "Score out of 10": user.sub_parameter_weighted_average,
                "Weighted Average (out of 11)": user.weighted_average_out_of_11,
                "Score Details": "Show",
                "Commissionerate Rank": user.zonal_rank,
              };
            }


            // Customize object properties to match desired format
            default: {
              return {
                SNo: user.s_no,
                "Commissionerate Name": user.commName,
                "Zone Name": user.zoneName,
                "Absolute Value": user.absval,
                "Total Score": user.total_score,
                "Way to Grade (Marks) Out of 10": user.way_to_grade,
                "Weighted Average(out of 5)":
                  user.sub_parameter_weighted_average,
              };
            }
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
    zoneName: (item) => (
      <td>
        <Link to={`/customzonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
          {item.zoneName}
        </Link>
      </td>
    ),

    commName: (item) => (
      <td>
        <Link to={`/customzonewisecomm?zone_code=${item.zone_code}&name=${name}`}>
          {item.commName}
        </Link>
      </td>
    ),

    zone_name: (item) => (
      <td>
        <Link to={`/customzonewisecomm?zone_code=${item.zone_code}&name=${name}`}
        >
          {item.zone_name}
        </Link>
      </td>
    ),

    commissionerate_name: (item) => (
      <td>
        <Link to={`/customzonewisecomm?zone_code=${item.zone_code}&name=${name}`}
        >
          {item.commissionerate_name}
        </Link>
      </td>
    ),

    absval: (item) => <td>{item.absval}</td>,

    show_details: (item) => {
      return (
        <td className="py-2">
          <Link to={`/customzonescoredetails?zone_code=${item.zone_code}&name=${name}`}
          >
            <CButton color="primary" variant="outline" shape="square" size="sm">
              Show
            </CButton>
          </Link>
        </td>
      );
    },
  };

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
      const comeName = ["investigation", "epcg", "registration", "export_obligation(AA)", "disposal/pendency", "arrest_and_prosecution", "unclaimed_cargo", "recovery_of_arrears", "DisposalOfConfiscatedGoldAndNDPS", "management_of_warehousing_bonds"].includes(name)
        ? encodeURIComponent(item?.commissionerate_name || "")
        : encodeURIComponent(item?.commName || "");

      return (
        <td className="py-2">
          <Link
            to={`/customcommscoredetails?zone_code=${item?.zone_code}&name=${encodeURIComponent(name)}&come_name=${comeName}`}
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
                    <div className="card-header">
                      {selectedOption1 === "Zones" ? (
                        <strong>Top 5 Performing Zones</strong>
                      ) : (
                        <strong>Top 5 Performing Commissionerates</strong>
                      )}
                      <span className="small ms-1">
                        <Link to={`/customallpara?name=${name}`}>
                          View Details
                        </Link>
                      </span>
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
                          {selectedOption1 === "Zones" ? (
                            <Link to={`/customallpara?name=${name}`}>
                              <Button className="openbtn">
                                <KeyboardArrowRightIcon />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/customallpara?name=${name}`}>
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
                    <div className="card-header">
                      {selectedOption1 === "Zones" ? (
                        <strong>Bottom 5 Performing Zones</strong>
                      ) : (
                        <strong>Bottom 5 Performing Commissionerates</strong>
                      )}
                      <span className="small ms-1">
                        <Link to={`/customallpara?name=${name}`}>
                          View Details
                        </Link>
                      </span>
                    </div>
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
                            <Link to={`/customallpara?name=${name}`}>
                              <Button className="openbtn">
                                <KeyboardArrowRightIcon />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/customallpara?name=${name}`}>
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
          </div>
        </div>
      )}
    </>
  );
};

export default CustomPara;
