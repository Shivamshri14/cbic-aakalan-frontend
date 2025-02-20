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
      }
      else if (name === "adjudication") {
        //Zone parameters API
        const responsei = await apiClient.get(`/cbic/t_score/adjudication`, {
          params: {
            month_date: newdate,
            type: "parameter",
          },
        });

        console.log("Response", responsei);

        const responseii = await apiClient.get(`/cbic/t_score/adjudication`, {
          params: {
            month_date: previousmonth1,
            type: "parameter",
          },
        });

        console.log("Response20", responseii);

        const responseiii = await apiClient.get(`/cbic/t_score/adjudication`, {
          params: {
            month_date: previousmonth2,
            type: "parameter",
          },
        });

        console.log("Response20", responseiii);

        const responseiv = await apiClient.get(`/cbic/t_score/adjudication`, {
          params: {
            month_date: previousmonth3,
            type: "parameter",
          },
        });

        console.log("Response20", responseiv);

        const responsev = await apiClient.get(`/cbic/t_score/adjudication`, {
          params: {
            month_date: previousmonth4,
            type: "parameter",
          },
        });

        console.log("Response20", responsev);

        const responsevi = await apiClient.get(`/cbic/t_score/adjudication`, {
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

        const sorted1 = responsei.data.sort(
          (a, b) => b.totalScore - a.totalScore
        );

        console.log("Sorted1", sorted1);
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
          const total = item.totalScore;

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

        console.log("enhancedData1", enhancedData1);

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
          const total = item.totalScore;



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
          const total = item.totalScore;



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
          const total = item.totalScore;



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
          const total = item.totalScore;



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
          const total = item.totalScore;



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



      else if (name === "epcg") {
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
      }

      else if (name === "aa") {
        const endpoints = [
          "cus3a",
          "cus3b",
          "cus3c"
        ];


        // Make API calls for both endpoints
        const responses1 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: newdate, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        const responses2 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: previousmonth1, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        const responses3 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: previousmonth2, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        const responses4 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: previousmonth3, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        const responses5 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: previousmonth4, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        const responses6 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/custom/${endpoint}`, {
                params: { month_date: previousmonth5, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        console.log("response1", responses1);
        console.log("response2", responses2);
        console.log("response3", responses3);
        console.log("response4", responses4);
        console.log("response5", responses5);
        console.log("response6", responses6);

        if (responses1 && responses2 && responses3 && responses4 && responses5 && responses6) {
          setLoading(false);
        }

        // Combine the responses from all endpoints into a single array
        const allData1 = responses1.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE1", allData1);

        const summedByZone1 = allData1.reduce((acc, item) => {
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

        const reducedAllData1 = Object.values(summedByZone1).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData1);

        const sorted1 = reducedAllData1.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted1);

        const enhancedData1 = sorted1.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        const allData2 = responses2.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE2", allData2);

        const summedByZone2 = allData2.reduce((acc, item) => {
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

        const reducedAllData2 = Object.values(summedByZone2).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData1);

        const sorted2 = reducedAllData2.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted1);

        const enhancedData2 = sorted2.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        const allData3 = responses3.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE3", allData3);

        const summedByZone3 = allData3.reduce((acc, item) => {
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

        const reducedAllData3 = Object.values(summedByZone3).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData3);

        const sorted3 = reducedAllData3.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted3);

        const enhancedData3 = sorted3.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        const allData4 = responses4.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE4", allData4);

        const summedByZone4 = allData4.reduce((acc, item) => {
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

        const reducedAllData4 = Object.values(summedByZone4).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData1);

        const sorted4 = reducedAllData4.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted4);

        const enhancedData4 = sorted4.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        const allData5 = responses5.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE5", allData5);

        const summedByZone5 = allData5.reduce((acc, item) => {
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

        const reducedAllData5 = Object.values(summedByZone5).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData5);

        const sorted5 = reducedAllData5.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted1);

        const enhancedData5 = sorted5.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        const allData6 = responses6.flatMap((response) =>
          response.data.map((item) => ({ ...item, gst: response.gst }))
        );
        console.log("FINALRESPONSE6", allData6);

        const summedByZone6 = allData6.reduce((acc, item) => {
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

        const reducedAllData6 = Object.values(summedByZone6).map((item) => ({
          ...item,
          weighted_average:
            item.sub_parameter_weighted_average.toFixed(2),
        }));

        console.log("Reduced All Data:", reducedAllData6);

        const sorted6 = reducedAllData6.sort(
          (a, b) =>
            a.zone_code - b.zone_code
        );
        console.log("Sorted", sorted6);

        const enhancedData6 = sorted6.map((item, index) => {
          const total = item.sub_parameter_weighted_average;

          let props = {};
          if (total <= 10 && total >= 7.5) {
            props = { color: "success" }; // Top 5 entries
          } else if (total < 7.5 && total >= 5) {
            props = { color: "warning" };
          } else if (total >= 0 && total <= 2.5) {
            props = { color: "danger" }; // Bottom 5 entries
          } else {
            props = { color: "primary" }; // Remaining entries
          }

          return {
            ...item,
            _cellProps: props, // Add _props field dynamically
            s_no: index + 1,
          };
        });

        console.log("ed1", enhancedData1);
        console.log("ed2", enhancedData2);
        console.log("ed3", enhancedData3);
        console.log("ed4", enhancedData4);
        console.log("ed5", enhancedData5);
        console.log("ed6", enhancedData6);

        setData1(enhancedData6);
        setData2(enhancedData5);
        setData3(enhancedData4);
        setData4(enhancedData3);
        setData5(enhancedData2);
        setData6(enhancedData1);

      }
      else if (name === "scrutiny") {
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
      }
      else if (name === "recoveryOfArrears") {
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
      }
      else if (name === "arrestAndProsecution") {
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
      }
      else if (name === "audit") {
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
      }

      else if (name === "TimelyPaymentOfRefunds") {
        const responsei = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: newdate,
              type: "parameter",
            },
          }
        );

        console.log("Response", responsei);

        const responseii = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: previousmonth1,
              type: "parameter",
            },
          }
        );

        console.log("Response20", responseii);

        const responseiii = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: previousmonth2,
              type: "parameter",
            },
          }
        );

        console.log("Response20", responseiii);

        const responseiv = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: previousmonth3,
              type: "parameter",
            },
          }
        );

        console.log("Response20", responseiv);

        const responsev = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: previousmonth4,
              type: "parameter",
            },
          }
        );

        console.log("Response20", responsev);

        const responsevi = await apiClient.get(
          `/cbic/custom/parameter/timelyrefunds`,
          {
            params: {
              month_date: previousmonth5,
              type: "parameter",
            },
          }
        );

        console.log("Response20", responsevi);

        //MIS Reports API
        const response1 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "1_Month",
            },
          }
        );

        const response2 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "2_Month",
            },
          }
        );

        const response3 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "3_Month",
            },
          }
        );

        const response4 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "4_Month",
            },
          }
        );

        const response5 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "5_Month",
            },
          }
        );

        const response6 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "6_Month",
            },
          }
        );

        console.log("Response1", response1.data);
        console.log("Response2", response2.data);
        console.log("Response3", response3.data);
        console.log("Response4", response4.data);
        console.log("Response5", response5.data);
        console.log("Response6", response6.data);

        const sorted1 = responsei.data.sort(
          (a, b) => b.totalScore - a.totalScore
        );

        console.log("Sorted1", sorted1);
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
      } else if (name === "Adjudication") {
        const responsei = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: newdate,
              type: "all_commissary",
            },
          }
        );

        console.log("Response", responsei);

        const responseii = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: previousmonth1,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseii);

        const responseiii = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: previousmonth2,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseiii);

        const responseiv = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: previousmonth3,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseiv);

        const responsev = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: previousmonth4,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responsev);

        const responsevi = await apiClient.get(
          `/cbic/custom/parameter/adjudication`,
          {
            params: {
              month_date: previousmonth5,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responsevi);

        //MIS Reports API
        const response1 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "1_Month",
            },
          }
        );

        const response2 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "2_Month",
            },
          }
        );

        const response3 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "3_Month",
            },
          }
        );

        const response4 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "4_Month",
            },
          }
        );

        const response5 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "5_Month",
            },
          }
        );

        const response6 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "6_Month",
            },
          }
        );

        console.log("Response1", response1.data);
        console.log("Response2", response2.data);
        console.log("Response3", response3.data);
        console.log("Response4", response4.data);
        console.log("Response5", response5.data);
        console.log("Response6", response6.data);

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
          const total = item.totalScore;

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
      } else if (name === "Investigation") {
        const responsei = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: newdate,
              type: "all_commissary",
            },
          }
        );

        console.log("Response", responsei);

        const responseii = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: previousmonth1,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseii);

        const responseiii = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: previousmonth2,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseiii);

        const responseiv = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: previousmonth3,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responseiv);

        const responsev = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: previousmonth4,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responsev);

        const responsevi = await apiClient.get(
          `/cbic/custom/parameter/investigation`,
          {
            params: {
              month_date: previousmonth5,
              type: "all_commissary",
            },
          }
        );

        console.log("Response20", responsevi);

        //MIS Reports API
        const response1 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "1_Month",
            },
          }
        );

        const response2 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "2_Month",
            },
          }
        );

        const response3 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "3_Month",
            },
          }
        );

        const response4 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "4_Month",
            },
          }
        );

        const response5 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "5_Month",
            },
          }
        );

        const response6 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "6_Month",
            },
          }
        );

        console.log("Response1", response1.data);
        console.log("Response2", response2.data);
        console.log("Response3", response3.data);
        console.log("Response4", response4.data);
        console.log("Response5", response5.data);
        console.log("Response6", response6.data);

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
      } else if (
        name === "CommissionerAppeals" ||
        name === "DisposalOfConfiscatedGoldAndNDPS"
      ) {
        const responsei = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: newdate,
              type: "all_commissary",
            },
          }
        );

        console.log("responsei", responsei);

        const responseii = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: previousmonth1,
              type: "all_commissary",
            },
          }
        );



        const responseiii = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: previousmonth2,
              type: "all_commissary",
            },
          }
        );



        const responseiv = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: previousmonth3,
              type: "all_commissary",
            },
          }
        );



        const responsev = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: previousmonth4,
              type: "all_commissary",
            },
          }
        );



        const responsevi = await apiClient.get(
          `/cbic/custom/parameter/${name}`,
          {
            params: {
              month_date: previousmonth5,
              type: "all_commissary",
            },
          }
        );



        //MIS Reports API
        const response1 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "1_Month",
            },
          }
        );

        const response2 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "2_Month",
            },
          }
        );

        const response3 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "3_Month",
            },
          }
        );

        const response4 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "4_Month",
            },
          }
        );

        const response5 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "5_Month",
            },
          }
        );

        const response6 = await apiClient.get(
          `/cbic/CustomMISReports/${name}`,
          {
            params: {
              month_date: newdate,
              type: "6_Month",
            },
          }
        );

        console.log("Response1", response1.data);

        const sorted1 = responsei.data.sort(
          (a, b) => b.totalScore - a.totalScore
        );

        console.log("sorted1", sorted1);

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

        const enhancedData1 = response1.data.map((item, index) => {
          const total = item.weighted_average;

          console.log("total", total);

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

        console.log("EnhancedData1", enhancedData1);

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

        setData1(matchingdata1);
        setData2(matchingdata2);
        setData3(matchingdata3);
        setData4(matchingdata4);
        setData5(matchingdata5);
        setData6(matchingdata6);
      } else {
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
    "CHANDIGARH CE & GST", "DELHI CE & GST", "PANCHKULA CE & GST", "LUCKNOW CE & GST",
    "MEERUT CE & GST", "VISHAKAPATNAM CE & GST", "HYDERABAD CE & GST", "BENGALURU CE & GST",
    "THIRUVANANTHAPURAM CE & GST", "CHENNAI CE & GST", "RANCHI CE & GST", "KOLKATA CE & GST",
    "BHUBANESHWAR CE & GST", "JAIPUR CE & GST", "AHMEDABAD CE & GST", "VADODARA CE & GST",
    "NAGPUR CE & GST", "MUMBAI CE & GST", "PUNE CE & GST", "BHOPAL CE & GST", "GUWAHATI CE & GST"
  ];

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

  const data = zones.map((zone) => ({
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



  const zonescustom = [
    "MEERUT CE & GST", "KOLKATA CUS", "HYDERABAD CE & GST", "Bangalore CUS",
    "Chennai CUS", "BHUBANESHWAR CE & GST", "PUNE CE & GST", "MUMBAI - I CUS", "MUMBAI - II CUS", "MUMBAI - III CUS",
    "VISHAKAPATNAM CE & GST", "DELHI CUS", "DELHI PREV", "TIRUCHIRAPALLI PREV",
    "THIRUVANANTHAPURAM CE & GST", "Ahmedabad CUS", "NAGPUR CE & GST", "PATNA PREV",
    "BENGALURU CE & GST", "KOLKATA CE & GST", "AHMEDABAD CE & GST", "MUMBAI CE & GST", "BHOPAL CE & GST"
  ];

  // Function to create a lookup table for each month's data
  const createCustomDataMap = (dataArray) => {
    return dataArray.reduce((map, item) => {
      map[item.zone_name] = item;
      return map;
    }, {});
  };

  // Create lookup tables for each month
  const dataMapsCustom = [data6, data5, data4, data3, data2, data1].map(createCustomDataMap);

  // Get unique zone names from the API response dynamically
  const zonesFromApi = [
    ...new Set([...data6, ...data5, ...data4, ...data3, ...data2, ...data1].map((item) => item.zone_name)),
  ];

  // Generate final structured data
  const datacustom = zonescustom.map((zone) => ({
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
  }));

  console.log(datacustom);



  const columns = [
    {
      group: {
        registration: "CGST",
        returnFiling: "CGST",
        investigation: "CGST",
        adjudication: "CGST",
        refunds: "CGST",
        audit: "CGST (Audit)",
        appeals: "CGST (Appeals)",
        arrestAndProsecution: "CGST (Arrest and Prosecution)",
        adjudicationLegacy: "CGST (Adjudication (Legacy Cases)",
        recoveryOfArrears: "CGST (Recovery of Arrears)",
        scrutiny: "CGST (Scrutiny & Assessment)",
        epcg: "CUSTOMS (Management of Export Obligation (EPCG))",
        aa: "custom3",
      }[name] || "CUSTOMS",

      children: [
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
                      className="ml-4  cust-btn"
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
          <div className=" bg-blue report-sec mb p-3">
            <h2 className="mb-5">MIS Reports</h2>
            <CSmartTable
              cleaner
              clickableRows={false}
              columns={columns}
              items={
                name === "TimelyPaymentOfRefunds" ||
                  name === "Adjudication" || name === "epcg" || name === "aa" ||
                  name === "DisposalOfConfiscatedGoldAndNDPS" ||
                  name === "CommissionerAppeals"
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
      )}
    </>
  );
};

export default MISReporttable;
