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

const CustomAllPara = ({
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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

      }
      else if (name === "cus_audit") {

        const cusendpoints = [
          "cus13a",
          "cus13b",
          "cus13c",
          "cus13d",
          "cus13e",
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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

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

        if (responses) {
          setloading(false);
        }

        console.log("Response", responses);

        const accumulationMap = new Map();

        responses.flatMap((response) =>
          response.data.forEach((item) => {
            const key = item.zone_name;
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

      }
      else {
        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });

        if (response) {
          setloading(false);
        }

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

        setBarData([...sorted]);
      }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
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

        const sorted = finalData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
      }
      else if (name === "export_obligation(AA)") {

        const cusendpoints = [
          "cus3a",
          "cus3b",
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
      } 
      else if (name === "cus_audit") {

        const cusendpoints = [
          "cus13a",
          "cus13b",
          "cus13c",
          "cus13d",
          "cus13e",
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        setBarData([...sorted]);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
      }
      else {
        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        if (response) {
          setloading(false);
        }

        const sorted = response.data.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        setBarData([...sorted]);

        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      }
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
    const colors =
      name === "timelyrefunds" 
        ? bardata.map((item) => item.way_to_grade)  // For refunds/returnFiling, use way_to_grade
        : name === "adjudication"
          ? data.map((item) => item.totalScore)
          : bardata.map((item) => item.sub_parameter_weighted_average);
    
    const total = colors[index % colors.length];
  
    console.log("TOTAL", total);
  
    if (total <= 10 && total >= 7.5) {
      return "#00FF00";
    } else if (total >= 5 && total < 7.5) {
      return "#FFFF00";
    } else if (total >= 0 && total <= 2.5) {
      return "#FF0000";
    } else {
      return "#0000FF";
    }
  };
  

  const getBarColorComm = (index) => {
    const total = data.length;
    const firstQuarter = total * 0.25;
    const secondQuarter = total * 0.5;
    const thirdQuarter = total * 0.75;

    return index < firstQuarter
      ? "#b159d8 "
      : index < secondQuarter
        ? "#b159d8 "
        : index < thirdQuarter
          ? "#b159d8 "
          : "#b159d8 ";
  };

  // const colorsallzones=["#00FF00","#FFFF00","#0000FF","#FF0000"];

  function calculateAverage(data  ) {
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
      caption: selectedOption1 === "Zones" ? "All Zones" : "All Commissionerates",
      yaxisname: "Total Score",
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "Zone Name: $label</b>{br}Total Score: $value"
          : "Commissionerate Name: $label</b>{br}Total Score: $value",
      useRoundEdges: "1",
      interactiveLegend: false,
      yAxisStep: "10",
    },
    categories: [
      {
        category: data.map((index) => ({
          label:
            name === "investigation" ||
              name === "epcg" ||
              name === "export_obligation(AA)" || 
              name === "recovery_of_arrears" ||
              name === "arrest_and_prosecution" ||
              name === "disposal/pendency" ||
              name === "management_of_warehousing_bonds" ||
              name === "unclaimed_cargo"
               || name ==="cus_audit"  || name ==="DisposalOfConfiscatedGoldAndNDPS"
              ? selectedOption1 === "Zones"
                ? index.zone_name || "Unknown Zone"
                : index.commissionerate_name || "Unknown Commissionerate"
              : selectedOption1 === "Zones"
                ? index.zoneName || "Unknown Zone"
                : index.commName || "Unknown Commissionerate",
        })),
      },
    ],
    dataset: [
      {
        data: bardata.map((item, index) => ({
          label: 
          name === "investigation" ||
          name === "epcg" ||
          name === "export_obligation(AA)" ||
          name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" ||
          name === "disposal/pendency" ||
          name === "unclaimed_cargo" ||
          name === "cus_audit" ||
          name === "DisposalOfConfiscatedGoldAndNDPS"
            ? selectedOption1 === "Zones"
              ? item.zone_name || "Unknown Zone"
              : item.commissionerate_name || "Unknown Commissionerate"
            : selectedOption1 === "Zones"
              ? item.zoneName || "Unknown Zone"
              : item.commName || "Unknown Commissionerate",
          
        value: name === "timelyrefunds" ? item.way_to_grade : item.sub_parameter_weighted_average || 0,
        
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



  //   if (name==="cus9a"|| name==="cus1"|| name==="cus5a"|| name==="cus5b"|| name==="cus5c"|| name==="cus12a"|| name==="cus9b") {
  //     allzones.dataset.push({
  //       seriesname: name==="cus9a"?"NATIONAL AVERAGE (Gold disposed/Gold ripe for disposal)"
  //       : name==="cus1"?"NATIONAL AVERAGE (Pending > 90 days)"
  //       : name==="cus5a"?"NATIONAL AVERAGE (Disposal of cases)"
  //       : name==="cus5b"?"NATIONAL AVERAGE (Case pending > 1 year)"
  //       : name==="cus5c"?"NATIONAL AVERAGE (Case pending > 1 year(duty involved > 1 crore))":
  //       `NATIONAL AVERAGE ${formatString(name)}`,
  //       renderAs: "Line",
  //       data: data.map(() => ({ value: average })),
  //       lineThickness: "5",
  //       color: "#ff0000",
  //       alpha: "100",
  //       drawAnchors: "0",
  //     });

  //     allzones.annotations.groups.push({
  //       items: [
  //         {
  //           id: "avg-text",
  //           type: "text",
  //           text: `<strong>National Average:</strong> ${average.toFixed(3)}`,
  //           align: "left",
  //           valign: "bottom",
  //           x: "$canvasEndX + $chartRightMargin - 285",
  //           y: "$canvasStartY",
  //           scaleText: "1",
  //           fontSize: "22",
  //           color: "#ff0000",
  //         },
  //       ],
  //     });
  //   }
  //   else{
  //     allzones.dataset.push({
  //       seriesname: name === "gst5b" ? "NATIONAL AVERAGE (Time left < 6 month for adjudication)":`NATIONAL AVERAGE ${formatString(name)}`,
  //       renderAs: "Line",
  //       data: data.map(() => ({ value: average })),
  //       lineThickness: "5",
  //       color: "#ff0000",
  //       alpha: "100",
  //       drawAnchors: "0",
  //     });

  //     allzones.annotations.groups.push({
  //       items: [
  //         {
  //           id: "avg-text",
  //           type: "text",
  //           text: `<strong>National Average:</strong> ${average.toFixed(3)}`,
  //           align: "left",
  //           valign: "bottom",
  //           x: "$canvasStartX + $chartLeftMargin + 10",
  //           y: "$canvasStartY+10",
  //           scaleText: "1",
  //           fontSize: "22",
  //           color: "#ff0000",
  //         },
  //       ],
  //     });
  //   }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
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
                            field: {
                              readOnly: true
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
              {selectedOption1 === "Zones" ? (
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
        </>
      )}
    </>
  );
};

export default CustomAllPara;
