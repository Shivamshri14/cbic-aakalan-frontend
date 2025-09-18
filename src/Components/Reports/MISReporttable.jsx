import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./misreport.scss";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import queryString from "query-string";
import { CSmartTable } from "@coreui/react-pro";
import Spinner from "../Spinner";
import * as XLSX from 'xlsx';
import { WidthWide } from "@mui/icons-material";

const MISReporttable = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { pathname } = location;
  const [loading, setLoading] = useState(true);

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const previousmonth1 = dayjs(selectedDate)
    .subtract(1, "month")
    .format("YYYY-MM-DD");
  const previousmonth2 = dayjs(selectedDate)
    .subtract(2, "month")
    .format("YYYY-MM-DD");
  const previousmonth3 = dayjs(selectedDate)
    .subtract(3, "month")
    .format("YYYY-MM-DD");
  const previousmonth4 = dayjs(selectedDate)
    .subtract(4, "month")
    .format("YYYY-MM-DD");
  const previousmonth5 = dayjs(selectedDate)
    .subtract(5, "month")
    .format("YYYY-MM-DD");

  console.log("newdate", newdate);
  console.log("previousmonth1", previousmonth1);
  console.log("previousmonth2", previousmonth2);
  console.log("previousmonth3", previousmonth3);
  console.log("previousmonth4", previousmonth4);
  console.log("previousmonth5", previousmonth5);

  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const [data6, setData6] = useState([]);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const fetchData = async (name) => {
    try {
      if (name === "adjudicationLegacy") {
        const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "registration") {
        const endpoints = ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "returnFiling") {
        const endpoints = ["gst2"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            //weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "scrutiny") {
        const endpoints = ["gst3a", "gst3b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "investigation") {
        const endpoints = ["gst4a", "gst4b", "gst4c", "gst4d"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "adjudication") {
        const endpoints = ["gst5a", "gst5b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "refunds") {
        const endpoints = ["gst7"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 5) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "recoveryOfArrears") {
        const endpoints = ["gst8a", "gst8b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 8) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "arrestAndProsecution") {
        const endpoints = ["gst9a", "gst9b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "audit") {
        const endpoints = ["gst10a", "gst10b", "gst10c"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "appeals") {
        const endpoints = ["gst11a", "gst11b", "gst11c", "gst11d"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      }

      // else if (name === "TimelyPaymentOfRefunds") {
      //   const responsei = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response", responsei);

      //   const responseii = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: previousmonth1,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseii);

      //   const responseiii = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: previousmonth2,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseiii);

      //   const responseiv = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: previousmonth3,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseiv);

      //   const responsev = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: previousmonth4,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responsev);

      //   const responsevi = await apiClient.get(
      //     `/cbic/custom/parameter/timelyrefunds`,
      //     {
      //       params: {
      //         month_date: previousmonth5,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responsevi);

      //   //MIS Reports API
      //   const response1 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "1_Month",
      //       },
      //     }
      //   );

      //   const response2 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "2_Month",
      //       },
      //     }
      //   );

      //   const response3 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "3_Month",
      //       },
      //     }
      //   );

      //   const response4 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "4_Month",
      //       },
      //     }
      //   );

      //   const response5 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "5_Month",
      //       },
      //     }
      //   );

      //   const response6 = await apiClient.get(
      //     `/cbic/CustomMISReports/${name}`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "6_Month",
      //       },
      //     }
      //   );

      //   console.log("Response1", response1.data);
      //   console.log("Response2", response2.data);
      //   console.log("Response3", response3.data);
      //   console.log("Response4", response4.data);
      //   console.log("Response5", response5.data);
      //   console.log("Response6", response6.data);

      //   const sorted1 = responsei.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );

      //   console.log("Sorted1", sorted1);
      //   const sorted2 = responseii.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );
      //   const sorted3 = responseiii.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );
      //   const sorted4 = responseiv.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );
      //   const sorted5 = responsev.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );
      //   const sorted6 = responsevi.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );

      //   const enhancedData1 = sorted1.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   // const enhancedData1 = sorted1.map((item, index) => {
      //   //   const total = sorted1.length;
      //   //   const firstquarter = total * 0.25;
      //   //   const secondquarter = total * 0.5;
      //   //   const thirdquarter = total * 0.75;

      //   //   let props = {};
      //   //   if (index < firstquarter) {
      //   //     props = { color: "success" };
      //   //   } else if (index >= firstquarter && index < secondquarter) {
      //   //     props = { color: "warning" };
      //   //   } else if (index >= thirdquarter) {
      //   //     props = { color: "danger" };
      //   //   } else {
      //   //     props = { color: "primary" };
      //   //   }

      //   //   return {
      //   //     ...item,
      //   //     _props: props, // Add _props field dynamically
      //   //     s_no: index + 1,
      //   //   };
      //   // });

      //   const enhancedData2 = sorted2.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const enhancedData3 = sorted3.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const enhancedData4 = sorted4.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const enhancedData5 = sorted5.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const enhancedData6 = sorted6.map((item, index) => {
      //     const total = item.way_to_grade;



      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" };
      //     } else if (total >= 5 && total < 7.5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" };
      //     } else {
      //       props = { color: "primary" };
      //     }

      //     return {
      //       ...item,
      //       _props: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   if (
      //     response1 &&
      //     response2 &&
      //     response3 &&
      //     response4 &&
      //     response5 &&
      //     response6
      //   ) {
      //     setLoading(false);
      //   }

      //   const matchingdata1 = response1.data.map((item) => {
      //     const matchingitem = enhancedData1.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   const matchingdata2 = response2.data.map((item) => {
      //     const matchingitem = enhancedData2.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   const matchingdata3 = response3.data.map((item) => {
      //     const matchingitem = enhancedData3.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   const matchingdata4 = response4.data.map((item) => {
      //     const matchingitem = enhancedData4.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   const matchingdata5 = response5.data.map((item) => {
      //     const matchingitem = enhancedData5.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   const matchingdata6 = response6.data.map((item) => {
      //     const matchingitem = enhancedData6.find(
      //       (item0) => item0.zone_code === item.zone_code
      //     );
      //     if (matchingitem) {
      //       return {
      //         ...item,
      //         _cellProps: matchingitem._props, // Substituting _props as _cellProps
      //       };
      //     }

      //     return item;
      //   });

      //   console.log("Matching Data1", matchingdata1);
      //   console.log("Matching Data2", matchingdata2);
      //   console.log("Matching Data3", matchingdata3);
      //   console.log("Matching Data4", matchingdata4);
      //   console.log("Matching Data5", matchingdata5);
      //   console.log("Matching Data6", matchingdata6);

      //   setData1(matchingdata1);
      //   setData2(matchingdata2);
      //   setData3(matchingdata3);
      //   setData4(matchingdata4);
      //   setData5(matchingdata5);
      //   setData6(matchingdata6);
      // }
      
      else if (name === "TimelyPaymentOfRefunds") {
        const endpoints = ["cus1"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            //weighted_average: ((item.sub_parameter_weighted_average * 5) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "epcg") {
        const endpoints = ["cus2a", "cus2b", "cus2c"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 7) / 10).toFixed(2),
            //weighted_average_out_of_8: ((item.sub_parameter_weighted_average * 8) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "aa") {
        const endpoints = ["cus3a", "cus3b", "cus3c"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 7) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "disposalPendency") {
        const endpoints = ["cus4a", "cus4b", "cus4c", "cus4d"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            Weighted_average: ((item.sub_parameter_weighted_average * 11) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "Adjudication") {
        const endpoints = ["cus5a", "cus5b", "cus5c"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            weighted_average: item.sub_parameter_weighted_average.toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "cus_investigation") {
        const endpoints = ["cus6a", "cus6b", "cus6c", "cus6d", "cus6e", "cus6f"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "cus_arrestAndProsecution") {
        const endpoints = ["cus7a", "cus7b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "unclaimed_cargo") {
        const endpoints = ["cus8a", "cus8b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "DisposalOfConfiscatedGoldAndNDPS") {
        const endpoints = ["cus9a", "cus9b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "recovery_Of_Arrears") {
        const endpoints = ["cus10a", "cus10b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "mowb") {
        const endpoints = ["cus11a", "cus11b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 6) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "CommissionerAppeals") {
        const endpoints = ["cus12a", "cus12b"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 8) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      } else if (name === "cus_audit") {
        const endpoints = ["cus13a", "cus13b", "cus13c", "cus13d", "cus13e"];
        const months = [newdate, previousmonth1, previousmonth2, previousmonth3, previousmonth4, previousmonth5];

        // Fetch data for all months and endpoints
        const responses = await Promise.all(
          months.map((month) =>
            Promise.all(
              endpoints.map((endpoint) =>
                apiClient
                  .get(`/cbic/custom/${endpoint}`, { params: { month_date: month, type: "zone" } })
                  .then((response) => ({
                    data: response.data,
                    gst: endpoint.toUpperCase(),
                  }))
                  .catch((error) => {
                    console.error(`❌ API error for ${endpoint} (${month}):`, error);
                    return { data: [], gst: endpoint.toUpperCase() }; // Return empty data on failure
                  })
              )
            )
          )
        );

        // Stop loading when all data is received
        setLoading(false);

        // Function to process data
        const processData = (responseData) => {
          const allData = responseData.flatMap((response) =>
            response.data.map((item) => ({ ...item, gst: response.gst }))
          );

          console.log("✅ FINAL RESPONSE", allData);

          // Summing sub_parameter_weighted_average by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const value = parseFloat(item.sub_parameter_weighted_average) || 0; // Convert to number, default 0

            if (!acc[zoneCode]) {
              acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 };
            }
            acc[zoneCode].sub_parameter_weighted_average += value;

            return acc;
          }, {});

          // Formatting and sorting data
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            //weighted_average: item.sub_parameter_weighted_average.toFixed(2),
            weighted_average: ((item.sub_parameter_weighted_average * 12) / 10).toFixed(2),
          }));

          console.log("✅ Reduced All Data:", reducedAllData);

          const sorted = reducedAllData.sort((a, b) => a.zone_code - b.zone_code);

          // Apply coloring based on weighted_average
          return sorted.map((item, index) => {
            const total = item.sub_parameter_weighted_average;
            let props = {};

            if (total >= 7.5) {
              props = { color: "success" }; // High performance
            } else if (total >= 5) {
              props = { color: "warning" };
            } else if (total <= 2.5) {
              props = { color: "danger" }; // Low performance
            } else {
              props = { color: "primary" }; // Normal
            }

            return {
              ...item,
              _cellProps: props,
              s_no: index + 1,
            };
          });
        };

        // Process data for each month
        const enhancedData1 = processData(responses[0]);
        const enhancedData2 = processData(responses[1]);
        const enhancedData3 = processData(responses[2]);
        const enhancedData4 = processData(responses[3]);
        const enhancedData5 = processData(responses[4]);
        const enhancedData6 = processData(responses[5]);

        // Debugging Logs
        console.log("✅ Enhanced Data 1", enhancedData1);
        console.log("✅ Enhanced Data 2", enhancedData2);
        console.log("✅ Enhanced Data 3", enhancedData3);
        console.log("✅ Enhanced Data 4", enhancedData4);
        console.log("✅ Enhanced Data 5", enhancedData5);
        console.log("✅ Enhanced Data 6", enhancedData6);

        // Update state with the processed data
        setData1(enhancedData1);
        setData2(enhancedData2);
        setData3(enhancedData3);
        setData4(enhancedData4);
        setData5(enhancedData5);
        setData6(enhancedData6);
      }

      
      else {
        //Zone parameters API
        const responsei = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });

        console.log("Response", responsei);

        const responseii = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: previousmonth1,
            type: "parameter",
          },
        });

        console.log("Response20", responseii);

        const responseiii = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: previousmonth2,
            type: "parameter",
          },
        });

        console.log("Response20", responseiii);

        const responseiv = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: previousmonth3,
            type: "parameter",
          },
        });

        console.log("Response20", responseiv);

        const responsev = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: previousmonth4,
            type: "parameter",
          },
        });

        console.log("Response20", responsev);

        const responsevi = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: previousmonth5,
            type: "parameter",
          },
        });

        console.log("Response20", responsevi);

        //MIS Reports API
        const response1 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "1_Month",
          },
        });

        const response2 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "2_Month",
          },
        });

        const response3 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "3_Month",
          },
        });

        const response4 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "4_Month",
          },
        });

        const response5 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "5_Month",
          },
        });

        const response6 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
          params: {
            month_date: newdate,
            type: "6_Month",
          },
        });

        console.log("Response1", response1.data);
        console.log("Response2", response2.data);
        console.log("Response3", response3.data);
        console.log("Response4", response4.data);
        console.log("Response5", response5.data);
        console.log("Response6", response6.data);

        if (name === "returnFiling") {
          const sorted1 = responsei.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const sorted2 = responseii.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const sorted3 = responseiii.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const sorted4 = responseiv.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const sorted5 = responsev.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );
          const sorted6 = responsevi.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );

          const enhancedData1 = response1.data.map((item, index) => {
            const total = item.weighted_average;

            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          // const enhancedData1 = sorted1.map((item, index) => {
          //   const total = sorted1.length;
          //   const firstquarter = total * 0.25;
          //   const secondquarter = total * 0.5;
          //   const thirdquarter = total * 0.75;

          //   let props = {};
          //   if (index < firstquarter) {
          //     props = { color: "success" };
          //   } else if (index >= firstquarter && index < secondquarter) {
          //     props = { color: "warning" };
          //   } else if (index >= thirdquarter) {
          //     props = { color: "danger" };
          //   } else {
          //     props = { color: "primary" };
          //   }

          //   return {
          //     ...item,
          //     _props: props, // Add _props field dynamically
          //     s_no: index + 1,
          //   };
          // });

          const enhancedData2 = response2.data.map((item, index) => {
            const total = item.weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData3 = response3.data.map((item, index) => {
            const total = item.weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData4 = response4.data.map((item, index) => {
            const total = item.weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData5 = response5.data.map((item, index) => {
            const total = item.weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData6 = response6.data.map((item, index) => {
            const total = item.weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          if (
            response1 &&
            response2 &&
            response3 &&
            response4 &&
            response5 &&
            response6
          ) {
            setLoading(false);
          }

          const matchingdata1 = response1.data.map((item) => {
            const matchingitem = enhancedData1.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata2 = response2.data.map((item) => {
            const matchingitem = enhancedData2.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata3 = response3.data.map((item) => {
            const matchingitem = enhancedData3.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata4 = response4.data.map((item) => {
            const matchingitem = enhancedData4.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata5 = response5.data.map((item) => {
            const matchingitem = enhancedData5.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata6 = response6.data.map((item) => {
            const matchingitem = enhancedData6.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          console.log("Matching Data1", matchingdata1);
          console.log("Matching Data2", matchingdata2);
          console.log("Matching Data3", matchingdata3);
          console.log("Matching Data4", matchingdata4);
          console.log("Matching Data5", matchingdata5);
          console.log("Matching Data6", matchingdata6);

          setData1(matchingdata1);
          setData2(matchingdata2);
          setData3(matchingdata3);
          setData4(matchingdata4);
          setData5(matchingdata5);
          setData6(matchingdata6);
        } else {
          const sorted1 = responsei.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          const sorted2 = responseii.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          const sorted3 = responseiii.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          const sorted4 = responseiv.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          const sorted5 = responsev.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          const sorted6 = responsevi.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );

          const enhancedData1 = sorted1.map((item, index) => {
            const total = item.sub_parameter_weighted_average;

            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          // const enhancedData1 = sorted1.map((item, index) => {
          //   const total = sorted1.length;
          //   const firstquarter = total * 0.25;
          //   const secondquarter = total * 0.5;
          //   const thirdquarter = total * 0.75;

          //   let props = {};
          //   if (index < firstquarter) {
          //     props = { color: "success" };
          //   } else if (index >= firstquarter && index < secondquarter) {
          //     props = { color: "warning" };
          //   } else if (index >= thirdquarter) {
          //     props = { color: "danger" };
          //   } else {
          //     props = { color: "primary" };
          //   }

          //   return {
          //     ...item,
          //     _props: props, // Add _props field dynamically
          //     s_no: index + 1,
          //   };
          // });

          const enhancedData2 = sorted2.map((item, index) => {
            const total = item.sub_parameter_weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData3 = sorted3.map((item, index) => {
            const total = item.sub_parameter_weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData4 = sorted4.map((item, index) => {
            const total = item.sub_parameter_weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData5 = sorted5.map((item, index) => {
            const total = item.sub_parameter_weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          const enhancedData6 = sorted6.map((item, index) => {
            const total = item.sub_parameter_weighted_average;



            let props = {};
            if (total <= 10 && total >= 7.5) {
              props = { color: "success" };
            } else if (total >= 5 && total < 7.5) {
              props = { color: "warning" };
            } else if (total >= 0 && total <= 2.5) {
              props = { color: "danger" };
            } else {
              props = { color: "primary" };
            }

            return {
              ...item,
              _props: props, // Add _props field dynamically
              s_no: index + 1,
            };
          });

          if (
            response1 &&
            response2 &&
            response3 &&
            response4 &&
            response5 &&
            response6
          ) {
            setLoading(false);
          }

          const matchingdata1 = response1.data.map((item) => {
            const matchingitem = enhancedData1.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata2 = response2.data.map((item) => {
            const matchingitem = enhancedData2.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata3 = response3.data.map((item) => {
            const matchingitem = enhancedData3.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata4 = response4.data.map((item) => {
            const matchingitem = enhancedData4.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata5 = response5.data.map((item) => {
            const matchingitem = enhancedData5.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          const matchingdata6 = response6.data.map((item) => {
            const matchingitem = enhancedData6.find(
              (item0) => item0.zone_code === item.zone_code
            );
            if (matchingitem) {
              return {
                ...item,
                _cellProps: matchingitem._props, // Substituting _props as _cellProps
              };
            }

            return item;
          });

          console.log("Matching Data1", matchingdata1);
          console.log("Matching Data2", matchingdata2);
          console.log("Matching Data3", matchingdata3);
          console.log("Matching Data4", matchingdata4);
          console.log("Matching Data5", matchingdata5);
          console.log("Matching Data6", matchingdata6);

          setData1(matchingdata1);
          setData2(matchingdata2);
          setData3(matchingdata3);
          setData4(matchingdata4);
          setData5(matchingdata5);
          setData6(matchingdata6);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchData(name);
    }
  }, [name, newdate]);


  const zones = [
    "AHMEDABAD CE & GST", "BENGALURU CE & GST", "BHOPAL CE & GST", "BHUBANESHWAR CE & GST",
    "CHANDIGARH CE & GST", "CHENNAI CE & GST", "DELHI CE & GST", "GUWAHATI CE & GST",
    "HYDERABAD CE & GST", "JAIPUR CE & GST", "KOLKATA CE & GST", "LUCKNOW CE & GST",
    "MEERUT CE & GST", "MUMBAI CE & GST", "NAGPUR CE & GST", "PANCHKULA CE & GST",
    "PUNE CE & GST", "RANCHI CE & GST", "THIRUVANANTHAPURAM CE & GST", "VADODARA CE & GST",
    "VISHAKAPATNAM CE & GST"
  ].sort(); // Sort the zones alphabetically here


  // Create a lookup table for each month to ensure data alignment
  const createZoneDataMap = (dataArray) => {
    const map = {};
    dataArray.forEach((item) => {
      map[item.zone_name] = item;
    });
    return map;
  };

  const dataMaps = [
    createZoneDataMap(data6),
    createZoneDataMap(data5),
    createZoneDataMap(data4),
    createZoneDataMap(data3),
    createZoneDataMap(data2),
    createZoneDataMap(data1),
  ];

  const data = zones.map((zone, idx) => ({
    s_no: idx + 1,
    zone_name: zone,
    weighted_average_1: dataMaps[0][zone]?.weighted_average || "NA",
    _cellProps: {
      weighted_average_1: dataMaps[0][zone]?._cellProps || {},
      weighted_average_2: dataMaps[1][zone]?._cellProps || {},
      weighted_average_3: dataMaps[2][zone]?._cellProps || {},
      weighted_average_4: dataMaps[3][zone]?._cellProps || {},
      weighted_average_5: dataMaps[4][zone]?._cellProps || {},
      weighted_average_6: dataMaps[5][zone]?._cellProps || {},
    },
    weighted_average_2: dataMaps[1][zone]?.weighted_average || "NA",
    weighted_average_3: dataMaps[2][zone]?.weighted_average || "NA",
    weighted_average_4: dataMaps[3][zone]?.weighted_average || "NA",
    weighted_average_5: dataMaps[4][zone]?.weighted_average || "NA",
    weighted_average_6: dataMaps[5][zone]?.weighted_average || "NA",
    date_1: dataMaps[0][zone]?.date || dayjs(previousmonth5).format("MMMM YYYY"),
    date_2: dataMaps[1][zone]?.date || dayjs(previousmonth4).format("MMMM YYYY"),
    date_3: dataMaps[2][zone]?.date || dayjs(previousmonth3).format("MMMM YYYY"),
    date_4: dataMaps[3][zone]?.date || dayjs(previousmonth2).format("MMMM YYYY"),
    date_5: dataMaps[4][zone]?.date || dayjs(previousmonth1).format("MMMM YYYY"),
    date_6: dataMaps[5][zone]?.date || dayjs(newdate).format("MMMM YYYY"),
  }));

  console.log("✅ Final Fixed Data:", data);


  const exportToXLS = () => {
    // Determine which data set to use for export
    const dataToExport =
      name === "TimelyPaymentOfRefunds" || name === "disposalPendency" || name === "investigation" ||
        name === "Adjudication" || name === "epcg" || name === "aa" || name === "cus_investigation" ||
        name === "DisposalOfConfiscatedGoldAndNDPS" || name === "cus_arrestAndProsecution" || name === "unclaimed_cargo" ||
        name === "CommissionerAppeals" || name === "recovery_Of_Arrears" || name === "mowb" || name === "cus_audit"
        ? datacustom
        : data;

    // Prepare the data for export
    const exportFormattedData = dataToExport.map((item) => {
      const row = {
        "S. No.": item.s_no,
        "Zone Name": item.zone_name,
      };
      // Dynamically add columns for each month's weighted average
      for (let i = 1; i <= 6; i++) {
        const dateKey = `date_${i}`;
        const weightedAvgKey = `weighted_average_${i}`;
        row[item[dateKey]] = item[weightedAvgKey];
      }
      return row;
    });

    // Create a worksheet from the formatted JSON data
    const ws = XLSX.utils.json_to_sheet(exportFormattedData);
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "MIS Report");

    // Generate a dynamic file name
    const monthLabel = dayjs(selectedDate).format("MMMM_YYYY");
    const reportTitle = columns[0].group; // Get the main group title for the report
    const fileName = `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${monthLabel}.xlsx`;

    // Write the workbook to an Excel file
    XLSX.writeFile(wb, fileName);
  };



  // Function to create a lookup table for each month's data
  const createCustomDataMap = (dataArray) => {
    return dataArray.reduce((map, item) => {
      map[item.zone_name] = item;
      return map;
    }, {});
  };

  // Create lookup tables for each month
  const dataMapsCustom = [data6, data5, data4, data3, data2, data1].map(createCustomDataMap);

  // Get unique zone names from the API response dynamically and sort them
  const zonesFromApi = [
    ...new Set([...data6, ...data5, ...data4, ...data3, ...data2, ...data1].map((item) => item.zone_name)),
  ].sort(); // Sort the dynamically retrieved zones alphabetically

  // Generate final structured data
  const datacustom = zonesFromApi
    .map((zone, idx) => {
      const weightedAvgValues = [
        dataMapsCustom[0][zone]?.weighted_average ?? null,
        dataMapsCustom[1][zone]?.weighted_average ?? null,
        dataMapsCustom[2][zone]?.weighted_average ?? null,
        dataMapsCustom[3][zone]?.weighted_average ?? null,
        dataMapsCustom[4][zone]?.weighted_average ?? null,
        dataMapsCustom[5][zone]?.weighted_average ?? null,
      ];

      // Filter out zones where all months have missing data
      if (weightedAvgValues.every((val) => val === null)) {
        return null;
      }

      return {
        s_no: idx + 1,
        zone_name: zone,
        _cellProps: {
          weighted_average_1: dataMapsCustom[0][zone]?._cellProps || {},
          weighted_average_2: dataMapsCustom[1][zone]?._cellProps || {},
          weighted_average_3: dataMapsCustom[2][zone]?._cellProps || {},
          weighted_average_4: dataMapsCustom[3][zone]?._cellProps || {},
          weighted_average_5: dataMapsCustom[4][zone]?._cellProps || {},
          weighted_average_6: dataMapsCustom[5][zone]?._cellProps || {},
        },
        weighted_average_1: dataMapsCustom[0][zone]?.weighted_average ?? 0, // Keep zero values
        weighted_average_2: dataMapsCustom[1][zone]?.weighted_average ?? 0,
        weighted_average_3: dataMapsCustom[2][zone]?.weighted_average ?? 0,
        weighted_average_4: dataMapsCustom[3][zone]?.weighted_average ?? 0,
        weighted_average_5: dataMapsCustom[4][zone]?.weighted_average ?? 0,
        weighted_average_6: dataMapsCustom[5][zone]?.weighted_average ?? 0,
        date_1: dataMapsCustom[0][zone]?.date || dayjs(previousmonth5).format("MMMM YYYY"),
        date_2: dataMapsCustom[1][zone]?.date || dayjs(previousmonth4).format("MMMM YYYY"),
        date_3: dataMapsCustom[2][zone]?.date || dayjs(previousmonth3).format("MMMM YYYY"),
        date_4: dataMapsCustom[3][zone]?.date || dayjs(previousmonth2).format("MMMM YYYY"),
        date_5: dataMapsCustom[4][zone]?.date || dayjs(previousmonth1).format("MMMM YYYY"),
        date_6: dataMapsCustom[5][zone]?.date || dayjs(newdate).format("MMMM YYYY"),
      };
    })
    .filter((item) => item !== null); // Remove null values


  console.log("✅ Final Fixed datacustom:", datacustom);




  const columns = [
    {
      group: {
        // CGST entries
        registration: 'CGST("Registration Out of 12/100")',
        returnFiling: 'CGST("Return Filing Out of 5/100")',
        scrutiny: 'CGST("Scrutiny/Assessment Out of 10/100")',
        investigation: 'CGST("Investigation Out of 10/100")',
        adjudication: 'CGST("Adjudication Out of 10/100")',
        adjudicationLegacy: 'CGST("Adjudication (Legacy cases) Out of 10/100")',
        refunds: 'CGST("Refunds Out of 5/100")',
        recoveryOfArrears: 'CGST("Recovery of Arrears Out of 8/100")',
        arrestAndProsecution: 'CGST("Arrest and Prosecution Out of 6/100")',
        audit: 'CGST("Audit Out of 12/100")',
        appeals: 'CGST("Appeals Out of 12/100")',

        // CUSTOMS entries
        TimelyPaymentOfRefunds: 'CUSTOMS("Timely payment of Refunds Out of 5/100")',
        epcg: 'CUSTOMS("Management of Export Obligation(EPCG) Out of 7/100")',
        aa: 'CUSTOMS("Management of Export Obligation(AA) Out of 7/100")',
        disposalPendency: 'CUSTOMS("Disposal/Pendency Of Provisional Assessments Out of 11/100")',
        Adjudication: 'CUSTOMS("Adjudication Out of 10/100")',
        cus_investigation: 'CUSTOMS("Investigation Out of 12/100")',
        cus_arrestAndProsecution: 'CUSTOMS("Arrests and Prosecution Out of 6/100")',
        unclaimed_cargo: 'CUSTOMS("Monitoring Of Un-cleared and Unclaimed cargo Out of 6/100")',
        DisposalOfConfiscatedGoldAndNDPS: 'CUSTOMS("Disposal Of Confiscated Gold and NDPS Out of 4/100")',
        recovery_Of_Arrears: 'CUSTOMS("Recovery of Arrears Out of 6/100")',
        mowb: 'CUSTOMS("Management Of Warehousing bonds Out of 6/100")',
        CommissionerAppeals: 'CUSTOMS("Commissioner (Appeals) Out of 8/100")',
        cus_audit: 'CUSTOMS("Audit Out of 12/100")'
      }[name] || "CUSTOMS",


      children: [
        {
          key: "s_no",
          label: "S. No.",
          _cellProps: { scope: "col" },
        },
        {
          key: "zone_name",
          label: "Zone Name",
          _cellProps: { scope: "col" },
        },
        ...[1, 2, 3, 4, 5, 6].map((num) => ({
          key: `weighted_average_${num}`,
          label: name === "epcg"
            ? datacustom?.[0]?.[`date_${num}`] || "Unknown Date"
            : data?.[0]?.[`date_${num}`] || "Unknown Date",
          _cellProps: { scope: "col" },
        })),
      ],
    }

  ];

  const handleChange = (e) => {
    onSelectedOption1(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="body flex-grow-1 inner-box bg-white">
          <div className="row">
            <div className="msg-box">
              <div className="lft-box">
                <h2>MIS Report Table</h2>
              </div>
              <div className="rgt-box">
                <div className="view-btn">
                  <Link to="/mis-report">
                    <Button
                      variant="contained"
                      className="ml-4 cust-btn"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Link>
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
                      // minDate={dayjs('2024-04-01')}
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
            </div> */}
          </div>
          <div className="container-fluid">
            <div className=" bg-blue report-sec mb p-3">
              <h2 className="mb-5">MIS Reports</h2>
              <div className="export-btn m-3">
                <button onClick={exportToXLS} className="btn btn-primary" style={{ marginRight: "45px" }}>
                  Export XLS
                </button>
              </div>
              <CSmartTable
                cleaner
                clickableRows={false}
                columns={columns}
                items={
                  name === "TimelyPaymentOfRefunds" || name === "disposalPendency" || name === "investigation" ||
                    name === "Adjudication" || name === "epcg" || name === "aa" || name === "cus_investigation" ||
                    name === "DisposalOfConfiscatedGoldAndNDPS" || name === "cus_arrestAndProsecution" || name === "unclaimed_cargo" ||
                    name === "CommissionerAppeals" || name === "recovery_Of_Arrears" || name === "mowb" || name === "cus_audit"
                    ? datacustom
                    : data
                }
                itemsPerPage={1000}
                tableFilter
                tableProps={{
                  className: "add-this-class custom-table",
                  responsive: true,
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
        </div>
      )}
    </>
  );
};

export default MISReporttable;