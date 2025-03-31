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
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
import Spinner from "../../Spinner";

const CustomZonewisecomm = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const [zoneName, setZoneName] = useState("");
  console.log("test-hello", selectedDate);
  const [loading, setloading] = useState(true);

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code } = queryParams;

  const columns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: name === "investigation" ||name ==="unclaimed_cargo"||name ==="recovery_of_arrears"||name ==="management_of_warehousing_bonds"||name==="export_obligation(AA)"||name==="disposal/pendency"||name==="arrest_and_prosecution"|| name==="epcg"  || name ==="cus_audit"  || name ==="DisposalOfConfiscatedGoldAndNDPS"? "zone_name" : "zoneName",
      label: `Zone`,
    },
    {
      key: name === "investigation" ||name ==="unclaimed_cargo"||name ==="recovery_of_arrears"||name ==="management_of_warehousing_bonds"||name==="export_obligation(AA)"||name==="disposal/pendency"||name==="arrest_and_prosecution"|| name==="epcg"  || name ==="cus_audit"  || name ==="DisposalOfConfiscatedGoldAndNDPS" ? "commissionerate_name" : "commName",
      label: "Commissionerate",
    },
    // {
    //   key: "gst",
    //   label: "Sub Parameters",
    // },
    // {
    //   key: name==="investigation"?"absolutevale":"absval",
    //   label: "Absolute Number",
    // },
    // {
    //   key: name==="investigation"?"total_score":"totalScore",
    //   label: "Percentage for the month",
    // },
    // {
    //   key:"sub_parameter_weighted_average",
    //   label:"Weighted Average(Out of 10)"
    // }
    // {
    //   key: "s_no",
    //   label: "Rank",
    // },
  ];

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchDataapi = async (name) => {
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
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
                params: { month_date: newdate, type: "all_commissary", zone_code: zone_code },
              })
              .then((response) => ({
                data: response.data
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

        const filteredData = allData.filter(
          (item) => item.zone_code === zone_code
        );
        console.log("Filtered Data by Zone Code", filteredData);

        const sorted = filteredData.sort((a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average);
        setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));

      }
      else {
        // Make a GET request to the specified endpoint
        const response = await apiClient.get(`/cbic/custom/parameter/${name}`, {
          params: {
            month_date: newdate,
            type: "zone",
            zone_code: zone_code,
          },
        });

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
    if (name) {
      fetchDataapi(name);
    }
  }, [name, newdate]);

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

  switch (name) {

    case "timelyrefunds":
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Score (Out of 10)",
      });

      break;

    case "investigation":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;

      case "epcg":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;
    
    case "DisposalOfConfiscatedGoldAndNDPS":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;

      case "cus_audit":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;


      case "export_obligation(AA)":
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;

    default:
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Score (Out of 10)",
      });

      break;
  }

  const handleClick = (event) => {
    onSelectedOption1(event.target.value);
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
      selectedOption1 === "Zones"
        ? data.map((user) => ({
          // Customize object properties to match desired format
          SNo: user.s_no,
          "Zone Name": user.zoneName,
          "Commissionerate Name": user.commName,
          "Total Score": user.totalScore,
          "Absolute Value": user.absval,
          Rank: user.zonal_rank,
        }))
        : // Handle other options (e.g., 'Top 5', 'Bottom 5') with filtered data
        [
          /* Process and format data for Top 5 or Bottom 5 */
        ];

    return exportData;
  };

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption: data.map((item) => item.zoneName)[0],
      yaxisname: "Percentage",
      xaxisname: "Commissionerates",
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
      label: item.commName,
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
      {/* {loading ? (
        <Spinner />
      ) : ( */}
      <div>
        <div className="body flex-grow-1 custom-sec">
          <div className="row">
            <div className="msg-box">
              <div className="lft-box">
                <h2>{zoneName}</h2>
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
                      onChange={handleChangeDate}
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
                  onChange={handleClick}
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  value="Commissionerate"
                  onChange={handleClick}
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
              </div>
            </div> */}
          </div>

          {/* {name === "refunds" || name === "returnFiling" ? (
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
                    itemsPerPageSelect
                    itemsPerPage={5}
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
              </div>
            ) : ( */}
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
                itemsPerPageSelect
                itemsPerPage={5}
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
      {/* )} */}
    </>
  );
};

export default CustomZonewisecomm;
