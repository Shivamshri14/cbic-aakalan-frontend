import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const AllParameters = ({
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

  const [data, setData] = useState([]);
  const [bardata, setBarData] = useState([]);
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

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

        // Combine the responses from all endpoints into a single array
        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSEcomm", allData);

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

        const reducedAllData = Object.values(summedByZone);

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);

      } else if (name === "recovery_of_arrears") {

        const endpoints = ["gst8a", "gst8b"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      } else if (name === "registration") {

        const endpoints = ["gst1a", "gst1b","gst1c", "gst1d","gst1e", "gst1f"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      } else if (name === "investigation") {

        const endpoints = ["gst4a", "gst4b","gst4c", "gst4d"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      } else if (name === "audit") {

        const endpoints = ["gst10a", "gst10b","gst10c"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      } else if (name === "scrutiny/assessment") {

        const endpoints = ["gst3a", "gst3b"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      } else if (name === "adjudication(legacy cases)") {
        try {
          const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];
      
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient.get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              }).then((response) => response.data)
            )
          );
      
          console.log("Responses", responses);
          setloading(false); // Ensure loading is set to false after API calls complete
      
          // Flatten responses
          const allData = responses.flat();
      
          console.log("FINAL RESPONSE", allData);
      
          // Aggregate data by zone_code
          const summedByZone = allData.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            acc[zoneCode] = acc[zoneCode] || { ...item, sub_parameter_weighted_average: 0 };
      
            acc[zoneCode].sub_parameter_weighted_average += item.sub_parameter_weighted_average || 0;
            return acc;
          }, {});
      
          const reducedAllData = Object.values(summedByZone).map((item) => ({
            ...item,
            sub_parameter_weighted_average: Number(item.sub_parameter_weighted_average.toFixed(2)), // Ensuring number format
          }));
      
          console.log("Reduced All Data:", reducedAllData);
      
          // Sort data in descending order
          const sorted = reducedAllData.sort(
            (a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
          );
      
          console.log("Sorted", sorted);
          setBarData([...sorted]);
      
        } catch (error) {
          console.error("Error fetching adjudication data:", error);
        }
      } else if (name === "gst_arrest_and_prosecution") {

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setBarData([...sorted]);
      }
       else {
        const response = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });
        console.log("gun", response.data);

        if (response) {
          setloading(false);
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
          setBarData([...appealserial]);
        }

        const sorted = response.data.sort(
          (a, b) => b.totalScore - a.totalScore
        );
        setBarData([...sorted]);

        if (name === "scrutiny/assessment") {
          const sorted = response.data.sort(
            (a, b) => b.totalScore - a.totalScore
          );
          setBarData([...sorted]);
        }

        if (name === "refunds" || name === "returnFiling") {
          const sorted = response.data.sort(
            (a, b) => a.totalScore - b.totalScore
          );

          console.log("Sorted", sorted);
          setBarData([...sorted]);
        }

        setData(
          response.data.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );

        setBarData([...sorted]);
      }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  const fetchDatacomm = async (name) => {
    try {

      if (name === "arrest_and_prosecution") {
        const endpoints = ["cus7a", "cus7b"];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
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

        console.log("Responses", responses);

        if (responses) {
          setloading(false);
        }

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
        console.log("Sortedcomm", sorted);

        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        setBarData([...sorted]);


      } else if (name === "investigation") {

        const endpoints = ["gst4a", "gst4b","gst4c", "gst4d"];

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        setBarData([...sorted]);
      } else if (name === "audit") {

        const endpoints = ["gst10a", "gst10b", "gst10c"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        setBarData([...sorted]);
      } else if (name === "registration") {

        const endpoints = ["gst1a", "gst1b","gst1c", "gst1d","gst1e", "gst1f"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        setBarData([...sorted]);
      } else if (name === "adjudication(legacy cases)") {
        try {
          const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];
      
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient.get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              }).then((response) => response.data)
            )
          );
      
          console.log("Responses", responses);
          setloading(false); // Ensure loading is set to false after API calls complete
      
          // Flatten responses into a single array
          const allData = responses.flat();
          console.log("FINAL RESPONSE", allData);
      
          // Aggregate data by commissionerate_name
          const summedByComm = allData.reduce((acc, item) => {
            const commName = item.commissionerate_name;
            acc[commName] = acc[commName] || { ...item, sub_parameter_weighted_average: 0 };
      
            acc[commName].sub_parameter_weighted_average += item.sub_parameter_weighted_average || 0;
            return acc;
          }, {});
      
          // Convert to array and format the values
          const reducedAllData = Object.values(summedByComm).map((item) => ({
            ...item,
            sub_parameter_weighted_average: Number(item.sub_parameter_weighted_average.toFixed(2)),
          }));
      
          console.log("Reduced All Data:", reducedAllData);
      
          // Sort data in descending order
          const sorted = reducedAllData.sort(
            (a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
          );
      
          console.log("Sorted", sorted);
      
          // Add serial numbers
          setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
          setBarData([...sorted]);
      
        } catch (error) {
          console.error("Error fetching adjudication data:", error);
        }
      } else if (name === "recovery_of_arrears") {

        const endpoints = ["gst8a", "gst8b"]; 

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

        const reducedAllData = Object.values(summedByZone).map((item)=>({
          ...item, sub_parameter_weighted_average: item.sub_parameter_weighted_average.toFixed(2)
        }));

        console.log("Reduced All Data:", reducedAllData);

        const sorted = reducedAllData.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        console.log("Sorted", sorted);
        setData(sorted.map((item,index)=>({...item, s_no:index+1})));
        setBarData([...sorted]);
      } else if (name === "scrutiny/assessment") {
        try {
          const endpoints = ["gst3a", "gst3b"];
      
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient.get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              }).then((response) => response.data)
            )
          );
      
          console.log("Responses", responses);
          setloading(false); // Ensure loading is set to false after API calls complete
      
          // Flatten responses into a single array
          const allData = responses.flat();
          console.log("FINAL RESPONSE", allData);
      
          // Aggregate data by commissionerate_name
          const summedByComm = allData.reduce((acc, item) => {
            const commName = item.commissionerate_name;
            acc[commName] = acc[commName] || { ...item, sub_parameter_weighted_average: 0 };
      
            acc[commName].sub_parameter_weighted_average += item.sub_parameter_weighted_average || 0;
            return acc;
          }, {});
      
          // Convert to array and format the values
          const reducedAllData = Object.values(summedByComm).map((item) => ({
            ...item,
            sub_parameter_weighted_average: Number(item.sub_parameter_weighted_average.toFixed(2)),
          }));
      
          console.log("Reduced All Data:", reducedAllData);
      
          // Sort data in descending order
          const sorted = reducedAllData.sort(
            (a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
          );
      
          console.log("Sorted", sorted);
      
          // Add serial numbers
          setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
          setBarData([...sorted]);
      
        } catch (error) {
          console.error("Error fetching adjudication data:", error);
        }
      } else if (name === "gst_arrest_and_prosecution") {
        try {
          const endpoints = ["gst9a", "gst9b"];
      
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient.get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              }).then((response) => response.data)
            )
          );
      
          console.log("Responses", responses);
          setloading(false); // Ensure loading is set to false after API calls complete
      
          // Flatten responses into a single array
          const allData = responses.flat();
          console.log("FINAL RESPONSE", allData);
      
          // Aggregate data by commissionerate_name
          const summedByComm = allData.reduce((acc, item) => {
            const commName = item.commissionerate_name;
            acc[commName] = acc[commName] || { ...item, sub_parameter_weighted_average: 0 };
      
            acc[commName].sub_parameter_weighted_average += item.sub_parameter_weighted_average || 0;
            return acc;
          }, {});
      
          // Convert to array and format the values
          const reducedAllData = Object.values(summedByComm).map((item) => ({
            ...item,
            sub_parameter_weighted_average: Number(item.sub_parameter_weighted_average.toFixed(2)),
          }));
      
          console.log("Reduced All Data:", reducedAllData);
      
          // Sort data in descending order
          const sorted = reducedAllData.sort(
            (a, b) => b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
          );
      
          console.log("Sorted", sorted);
      
          // Add serial numbers
          setData(sorted.map((item, index) => ({ ...item, s_no: index + 1 })));
          setBarData([...sorted]);
      
        } catch (error) {
          console.error("Error fetching adjudication data:", error);
        }
      }
       else{
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });
      console.log("guncomm", response.data);

      const response01 = await apiClient.get(`/cbic/gst11a`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });

      const response11 = await apiClient.get(`/cbic/gst11b`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });

      const response21 = await apiClient.get(`/cbic/gst11c`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });

      const response31 = await apiClient.get(`/cbic/gst11d`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });

      const appeal = [response01, response11, response21, response31];

      console.log("Appeal", appeal);

      const totalByParam0 = {};

      // Process each response
      appeal.forEach((response) => {
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

      console.log("totalByParam0", totalByParam0);

      const sorted = response.data.sort((a, b) => b.totalScore - a.totalScore);
      setBarData([...sorted]);

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

      if (name === "refunds" || name === "returnFiling") {
        const sorted = response.data.sort(
          (a, b) => a.totalScore - b.totalScore
        );
        setBarData([...sorted]);
      }

      if (name === "adjudication" || name === "scrutiny/assessment") {
        const sorted = response.data.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );
        setBarData([...sorted]);
      }



      if (name === "appeals") {
        setBarData([...appealserial]);
      }

      if (response) {
        setloading(false);
      }
      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );
    }
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
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

  useEffect(() => {
    if (selectedOption1 === "Zones") {
      fetchData(name);
    } else {
      fetchDatacomm(name);
    }
  }, [name, newdate, selectedOption1]);

  charts(FusionCharts);
  Zune(FusionCharts);
  
  

  const colorsallcomm = [
    "#00FF00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00cfff",
    "#800000",
    "#006066",
    "#808000",
    "#000000",
    "#9900FF",
    "#FF6347",
    "#a1ff0a",
    "#ff00ff",
    "#DFF5FF",
    "#cc4877",
    "#59D5E0",
    "#ff8800",
    "#939185",
    "#3971Ac",
    "#FF0000",
  ];

  const getBarColor = (index) => {
    const colors =
      name === "adjudication" || name === "refunds" || name === "returnFiling"
        ? bardata.map((item) => item.way_to_grade)  // For refunds/returnFiling, use way_to_grade
        : name === "adjudication"
          ? data.map((item) => item.totalScore)
          : bardata.map((item) => item.sub_parameter_weighted_average);
    
    const total = colors[index % colors.length];
  
    console.log("TOTAL", total);
  
    if (total <= 10 && total >= 7.5) {
      return "#00FF00";  // Green for scores between 7.5 and 10
    } else if (total >= 5 && total < 7.5) {
      return "#FFFF00";  // Yellow for scores between 5 and 7.5
    } else if (total >= 0 && total <= 2.5) {
      return "#FF0000";  // Red for scores between 0 and 2.5
    } else {
      return "#0000FF";  // Blue for scores outside the above ranges
    }
  };
  

  const getBarColorComm = (index) => {
    const colors =
      name === "refunds" || name === "returnFiling"
        ? bardata.map((item) => item.way_to_grade)  // For refunds/returnFiling, use way_to_grade
        : data.map((item) => item.sub_parameter_weighted_average);  // Default for other cases
    
    const total = colors.length;
    console.log("total", total);
    const firstQuarter = total * 0.25;
    const secondQuarter = total * 0.5;
    const thirdQuarter = total * 0.75;
  
    return index < firstQuarter
      ? "#b159d8"   // Green for the first quarter of the data
      : index < secondQuarter
      ? "#b159d8"   // Yellow for the second quarter of the data
      : index < thirdQuarter
      ? "#b159d8"   // Blue for the third quarter of the data
      : "#b159d8";  // Red for the last quarter of the data
  };
  

  // const colorsallzones=["#00FF00","#FFFF00","#0000FF","#FF0000"];

  function calculateAverage(data) {
    const totalScores = data.map((item) => item.totalScore);

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
      caption:
        // name === "returnFiling" ? `${formatString(name)}(Percentage Not Filed)`:
        // name === "refunds" ? `${formatString(name)} (Percentage Refund Pending Beyond 60 Days/Total Refund Pending)`:
        // name === "scrutiny/assessment" ? `${formatString(name)} (Score)`
        // :name === "adjudication" ? `${formatString(name)} (Score)`:
        selectedOption1 === "Zones" ? "All Zones" : "All Commissionerates",
      yaxisname:
        name === "refunds" || name === "returnFiling" || name === "adjudication(legacy cases)"|| name === "scrutiny/assessment"
          ? "Total Score"
          : "Total Score",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        name === "refunds" || name === "returnFiling"|| name === "adjudication(legacy cases)"|| name === "scrutiny/assessment"
          ? selectedOption1 === "Zones"
            ? "<b>Zone Name:$label</b>{br}Score:$value"
            : "<b>Commissionerate Name:$label</b>{br}Score:$value"
          : selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Total Score:$value"
          : "<b>Commissionerate Name:$label</b>{br}Total Score:$value",
      useRoundEdges: "1",
      interactiveLegend: false,
    },
    categories: [
      {
        category: 
        (name==="recovery_of_arrears"|| name==="arrest_and_prosecution" || name === "gst_arrest_and_prosecution" ||  name === "adjudication(legacy cases)" || name === "scrutiny/assessment" || name==="audit"|| name==="registration" || name === "investigation")?
        selectedOption1 === "Zones"
            ? bardata.map((index) => ({ label: index.zone_name }))
            : bardata.map((index) => ({ label: index.commissionerate_name })):
          selectedOption1 === "Zones"
            ? bardata.map((index) => ({ label: index.zoneName }))
            : bardata.map((index) => ({ label: index.commName })),
      },
    ],
    dataset: [
      {
        data: bardata.map((item, index) => ({
          label:
            (name === "recovery_of_arrears" || name === "arrest_and_prosecution" || name==="gst_arrest_and_prosecution" || name === "adjudication(legacy cases)" ||name === "scrutiny/assessment"|| name==="audit"|| name==="registration" || name === "investigation")
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
                name === "audit" || name === "investigation"
              ? item.sub_parameter_weighted_average
              : name === "refunds" ||
                name === "returnFiling"
              ? item.way_to_grade
              : name === "appeals" ||
                name === "recovery_of_arrears" ||
                name === "audit" || name === "investigation" ||
                name === "arrest_and_prosecution"|| name==="registration" || name === "gst_arrest_and_prosecution" || name === "adjudication(legacy cases)" 
              ? item.sub_parameter_weighted_average
              : name === "scrutiny/assessment"
              ? item.sub_parameter_weighted_average
              : item.totalScore,
          color:
            selectedOption1 === "Zones"
              ? getBarColor(index)
              : // (name==="adjudication"|| name==="scrutiny/assessment")? colorsallcomm[index % colorsallcomm.length]:
                getBarColorComm(index),
        })),
      },
    ],
    annotations: {
      groups: [],
    },
  };

  console.log("allzones",allzones);

  if (name === "" || name === "") {
    allzones.dataset.push({
      seriesname:
        name === "returnFiling"
          ? `NATIONAL AVERAGE ${formatString(name)}(Percentage Not Filed)`
          : name === "refunds"
          ? `NATIONAL AVERAGE ${formatString(
              name
            )}(Percentage Refund Pending Beyond 60 Days/Total Refund Pending)`
          : name === "scrutiny/assessment"
          ? `NATIONAL AVERAGE ${formatString(name)} (Score)`
          : name === "adjudication"
          ? `NATIONAL AVERAGE ${formatString(name)} (Score)`
          : `NATIONAL AVERAGE ${formatString(name)}`,
      renderAs: "Line",
      data: bardata.map(() => ({ value: average })),
      lineThickness: "5",
      color: "#ff0000",
      alpha: "100",
      drawAnchors: "0",
    });

    allzones.annotations.groups.push({
      items: [
        {
          id: "avg-text",
          type: "text",
          text:
            name === "refunds"
              ? selectedOption1 === "Zones"
                ? `<strong>National Average:</strong> ${average.toFixed(3)}`
                : `<strong>National Average:</strong> 10.728`
              : `<strong>National Average:</strong> ${average.toFixed(3)}`,
          align: "left",
          valign: "bottom",
          x: "$canvasStartX + $chartLeftMargin + 10",
          y: "$canvasStartY+10",
          scaleText: "1",
          fontSize: "22",
          color: "#ff0000",
        },
      ],
    });
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
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
            <div class="text-center zone-heading">
              {name === "returnFiling" ? (
                <h3>{formatString(name)}</h3>
              ) : name === "refunds" ? (
                <h3>
                  {formatString(name)} 
                </h3>
              ) : name === "scrutiny/assessment" ? (
                <h3>{formatString(name)}(Score)</h3>
              ) : name === "adjudication" ? (
                <h3>{formatString(name)} (Score)</h3>
              ) : (
                <h3>{name.toUpperCase()}</h3>
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
      )}
    </>
  );
};

export default AllParameters;
