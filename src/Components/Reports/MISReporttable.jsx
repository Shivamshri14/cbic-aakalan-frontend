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
        const response1 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: newdate,
              type: "parameter",
            },
          }
        );

        console.log("Response1", response1);

        const response2 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: previousmonth1,
              type: "parameter",
            },
          }
        );

        const response3 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: previousmonth2,
              type: "parameter",
            },
          }
        );

        const response4 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: previousmonth3,
              type: "parameter",
            },
          }
        );

        const response5 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: previousmonth4,
              type: "parameter",
            },
          }
        );

        const response6 = await apiClient.get(
          `/cbic/t_score/adjudication(legacy cases)`,
          {
            params: {
              month_date: previousmonth5,
              type: "parameter",
            },
          }
        );

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

        const sortedi = response1.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );
        console.log("sortedi", sortedi);

        const sorted1 = sortedi.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        const sortedii = response2.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );

        const sorted2 = sortedii.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        const sortediii = response3.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );

        const sorted3 = sortediii.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        const sortediv = response4.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );

        const sorted4 = sortediv.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        const sortedv = response5.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );

        const sorted5 = sortedv.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
        );

        const sortedvi = response6.data.sort(
          (a, b) => a.zone_code - b.zone_code
        );

        const sorted6 = sortedvi.sort(
          (a, b) =>
            b.sub_parameter_weighted_average - a.sub_parameter_weighted_average
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

        const newdate0 = dayjs(selectedDate).format("MMMM YYYY");

        const previousmonth10 = dayjs(selectedDate)
          .subtract(1, "month")
          .format("MMMM YYYY");
        const previousmonth20 = dayjs(selectedDate)
          .subtract(2, "month")
          .format("MMMM YYYY");
        const previousmonth30 = dayjs(selectedDate)
          .subtract(3, "month")
          .format("MMMM YYYY");
        const previousmonth40 = dayjs(selectedDate)
          .subtract(4, "month")
          .format("MMMM YYYY");
        const previousmonth50 = dayjs(selectedDate)
          .subtract(5, "month")
          .format("MMMM YYYY");

        const matchingdata1 = response1.data.map((item) => {
          const matchingitem = enhancedData1.find(
            (item0) => item0.zone_code === item.zone_code
          );
          if (matchingitem) {
            return {
              ...item,
              _cellProps: matchingitem._props, // Substituting _props as _cellProps
              weighted_average: item.sub_parameter_weighted_average,
              date: newdate0,
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
              weighted_average: item.sub_parameter_weighted_average,
              date: previousmonth10,
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
              weighted_average: item.sub_parameter_weighted_average,
              date: previousmonth20,
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
              weighted_average: item.sub_parameter_weighted_average,
              date: previousmonth30,
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
              _cellProps: matchingitem._props,
              weighted_average: item.sub_parameter_weighted_average,
              date: previousmonth40,
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
              weighted_average: item.sub_parameter_weighted_average,
              date: previousmonth50,
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
      
      // else if (name === "scrutiny") {
      //   //Zone parameters API
      //   const responsei = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: newdate,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response", responsei);

      //   const responseii = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: previousmonth1,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseii);

      //   const responseiii = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: previousmonth2,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseiii);

      //   const responseiv = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: previousmonth3,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responseiv);

      //   const responsev = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: previousmonth4,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responsev);

      //   const responsevi = await apiClient.get(
      //     `/cbic/t_score/scrutiny/assessment`,
      //     {
      //       params: {
      //         month_date: previousmonth5,
      //         type: "parameter",
      //       },
      //     }
      //   );

      //   console.log("Response20", responsevi);

      //   //MIS Reports API
      //   const response1 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "1_Month",
      //     },
      //   });

      //   const response2 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "2_Month",
      //     },
      //   });

      //   const response3 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "3_Month",
      //     },
      //   });

      //   const response4 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "4_Month",
      //     },
      //   });

      //   const response5 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "5_Month",
      //     },
      //   });

      //   const response6 = await apiClient.get(`/cbic/CgstMISReports/${name}`, {
      //     params: {
      //       month_date: newdate,
      //       type: "6_Month",
      //     },
      //   });

      //   console.log("Response1", response1.data);
      //   console.log("Response2", response2.data);
      //   console.log("Response3", response3.data);
      //   console.log("Response4", response4.data);
      //   console.log("Response5", response5.data);
      //   console.log("Response6", response6.data);

      //   const sorted1 = responsei.data.sort(
      //     (a, b) => b.totalScore - a.totalScore
      //   );
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
      //     const total = item.sub_parameter_weighted_average;

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
      //     const total = item.sub_parameter_weighted_average;

          

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
      //     const total = item.sub_parameter_weighted_average;

          

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
      //     const total = item.sub_parameter_weighted_average;

          

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
      //     const total = item.sub_parameter_weighted_average;

          

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
      //     const total = item.sub_parameter_weighted_average;

          

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

        console.log("Sorted1",sorted1);
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
      
      else if (name === "audit") {
        const endpoints = [
          "gst10a",
          "gst10b",
          "gst10c"
        ];

        // Make API calls for both endpoints
        const responses1 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
                params: { month_date: previousmonth5, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        console.log("response1",responses1);
        console.log("response2",responses2);
        console.log("response3",responses3);
        console.log("response4",responses4);
        console.log("response5",responses5);
        console.log("response6",responses6);

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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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

        console.log("ed1",enhancedData1);
        console.log("ed2",enhancedData2);
        console.log("ed3",enhancedData3);
        console.log("ed4",enhancedData4);
        console.log("ed5",enhancedData5);
        console.log("ed6",enhancedData6);

        setData1(enhancedData6);
        setData2(enhancedData5);
        setData3(enhancedData4);
        setData4(enhancedData3);
        setData5(enhancedData2);
        setData6(enhancedData1);
        
      }

      // else if (name === "epcg") {
      //   const endpoints = [
      //     "cus2a",
      //     "cus2b",
      //     "cus2c"
      //   ];
        

      //   // Make API calls for both endpoints
      //   const responses1 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: newdate, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   const responses2 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: previousmonth1, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   const responses3 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: previousmonth2, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   const responses4 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: previousmonth3, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   const responses5 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: previousmonth4, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   const responses6 = await Promise.all(
      //     endpoints.map((endpoint) =>
      //       apiClient
      //         .get(`/cbic/custom/${endpoint}`, {
      //           params: { month_date: previousmonth5, type: "zone" },
      //         })
      //         .then((response) => ({
      //           data: response.data
      //         }))
      //     )
      //   );

      //   console.log("response1",responses1);
      //   console.log("response2",responses2);
      //   console.log("response3",responses3);
      //   console.log("response4",responses4);
      //   console.log("response5",responses5);
      //   console.log("response6",responses6);

      //   if (responses1 && responses2 && responses3 && responses4 && responses5 && responses6) {
      //     setLoading(false);
      //   }

      //   // Combine the responses from all endpoints into a single array
      //   const allData1 = responses1.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE1", allData1);

      //   const summedByZone1 = allData1.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData1 = Object.values(summedByZone1).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData1);

      //   const sorted1 = reducedAllData1.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted1);

      //   const enhancedData1 = sorted1.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const allData2 = responses2.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE2", allData2);

      //   const summedByZone2 = allData2.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData2 = Object.values(summedByZone2).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData1);

      //   const sorted2 = reducedAllData2.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted1);

      //   const enhancedData2 = sorted2.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const allData3 = responses3.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE3", allData3);

      //   const summedByZone3 = allData3.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData3 = Object.values(summedByZone3).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData3);

      //   const sorted3 = reducedAllData3.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted3);

      //   const enhancedData3 = sorted3.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const allData4 = responses4.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE4", allData4);

      //   const summedByZone4 = allData4.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData4 = Object.values(summedByZone4).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData1);

      //   const sorted4 = reducedAllData4.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted4);

      //   const enhancedData4 = sorted4.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const allData5 = responses5.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE5", allData5);

      //   const summedByZone5 = allData5.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData5 = Object.values(summedByZone5).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData5);

      //   const sorted5 = reducedAllData5.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted1);

      //   const enhancedData5 = sorted5.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   const allData6 = responses6.flatMap((response) =>
      //     response.data.map((item) => ({ ...item, gst: response.gst }))
      //   );
      //   console.log("FINALRESPONSE6", allData6);

      //   const summedByZone6 = allData6.reduce((acc, item) => {
      //     const zoneCode = item.zone_code;
      //     const value = item.sub_parameter_weighted_average || 0; // Default to 0 if missing

      //     // If zone_code is encountered for the first time, initialize it
      //     if (!acc[zoneCode]) {
      //       acc[zoneCode] = { ...item, sub_parameter_weighted_average: 0 }; // Keep other properties intact
      //     }

      //     // Sum only the sub_parameter_weighted_average for each zone_code
      //     acc[zoneCode].sub_parameter_weighted_average += value;

      //     return acc;
      //   }, {});

      //   const reducedAllData6 = Object.values(summedByZone6).map((item) => ({
      //     ...item,
      //     weighted_average:
      //       item.sub_parameter_weighted_average.toFixed(2),
      //   }));

      //   console.log("Reduced All Data:", reducedAllData6);

      //   const sorted6 = reducedAllData6.sort(
      //     (a, b) =>
      //       a.zone_code- b.zone_code
      //   );
      //   console.log("Sorted", sorted6);

      //   const enhancedData6 = sorted6.map((item, index) => {
      //     const total = item.sub_parameter_weighted_average;

      //     let props = {};
      //     if (total <= 10 && total >= 7.5) {
      //       props = { color: "success" }; // Top 5 entries
      //     } else if (total < 7.5 && total >= 5) {
      //       props = { color: "warning" };
      //     } else if (total >= 0 && total <= 2.5) {
      //       props = { color: "danger" }; // Bottom 5 entries
      //     } else {
      //       props = { color: "primary" }; // Remaining entries
      //     }

      //     return {
      //       ...item,
      //       _cellProps: props, // Add _props field dynamically
      //       s_no: index + 1,
      //     };
      //   });

      //   console.log("ed1",enhancedData1);
      //   console.log("ed2",enhancedData2);
      //   console.log("ed3",enhancedData3);
      //   console.log("ed4",enhancedData4);
      //   console.log("ed5",enhancedData5);
      //   console.log("ed6",enhancedData6);

      //   setData1(enhancedData6);
      //   setData2(enhancedData5);
      //   setData3(enhancedData4);
      //   setData4(enhancedData3);
      //   setData5(enhancedData2);
      //   setData6(enhancedData1);
        
      // }
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

        console.log("response1",responses1);
        console.log("response2",responses2);
        console.log("response3",responses3);
        console.log("response4",responses4);
        console.log("response5",responses5);
        console.log("response6",responses6);

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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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

        console.log("ed1",enhancedData1);
        console.log("ed2",enhancedData2);
        console.log("ed3",enhancedData3);
        console.log("ed4",enhancedData4);
        console.log("ed5",enhancedData5);
        console.log("ed6",enhancedData6);

        setData1(enhancedData6);
        setData2(enhancedData5);
        setData3(enhancedData4);
        setData4(enhancedData3);
        setData5(enhancedData2);
        setData6(enhancedData1);
        
      }
      else if (name === "scrutiny") {
        const endpoints = [
          "gst3a",
          "gst3b"
        ];

        // Make API calls for both endpoints
        const responses1 = await Promise.all(
          endpoints.map((endpoint) =>
            apiClient
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
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
              .get(`/cbic/${endpoint}`, {
                params: { month_date: previousmonth5, type: "zone" },
              })
              .then((response) => ({
                data: response.data
              }))
          )
        );

        console.log("response1",responses1);
        console.log("response2",responses2);
        console.log("response3",responses3);
        console.log("response4",responses4);
        console.log("response5",responses5);
        console.log("response6",responses6);

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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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
            a.zone_code- b.zone_code
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

        console.log("ed1",enhancedData1);
        console.log("ed2",enhancedData2);
        console.log("ed3",enhancedData3);
        console.log("ed4",enhancedData4);
        console.log("ed5",enhancedData5);
        console.log("ed6",enhancedData6);

        setData1(enhancedData6);
        setData2(enhancedData5);
        setData3(enhancedData4);
        setData4(enhancedData3);
        setData5(enhancedData2);
        setData6(enhancedData1);
        
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

        console.log("sorted1",sorted1);

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

          console.log("total",total);

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

        console.log("EnhancedData1",enhancedData1);

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

  const data = [
    {
      zone_name: "CHANDIGARH CE & GST",
      weighted_average_1: data6.map((item) => item.weighted_average)[0],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[0],
        weighted_average_2: data5.map((item) => item._cellProps)[0],
        weighted_average_3: data4.map((item) => item._cellProps)[0],
        weighted_average_4: data3.map((item) => item._cellProps)[0],
        weighted_average_5: data2.map((item) => item._cellProps)[0],
        weighted_average_6: data1.map((item) => item._cellProps)[0],
      },
      weighted_average_2: data5.map((item) => item.weighted_average)[0],
      weighted_average_3: data4.map((item) => item.weighted_average)[0],
      weighted_average_4: data3.map((item) => item.weighted_average)[0],
      weighted_average_5: data2.map((item) => item.weighted_average)[0],
      weighted_average_6: data1.map((item) => item.weighted_average)[0],
      date_1:name==="scrutiny"?dayjs(previousmonth5).format("MMMM YYYY"): data6.map((item) => item.date)[0],
      date_2:name==="scrutiny"?dayjs(previousmonth4).format("MMMM YYYY"): data5.map((item) => item.date)[0],
      date_3:name==="scrutiny"?dayjs(previousmonth3).format("MMMM YYYY"): data4.map((item) => item.date)[0],
      date_4:name==="scrutiny"?dayjs(previousmonth2).format("MMMM YYYY"): data3.map((item) => item.date)[0],
      date_5:name==="scrutiny"?dayjs(previousmonth1).format("MMMM YYYY"): data2.map((item) => item.date)[0],
      date_6:name==="scrutiny"?dayjs(newdate).format("MMMM YYYY"): data1.map((item) => item.date)[0],
    },
    {
      zone_name: "DELHI CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[1],
        weighted_average_2: data5.map((item) => item._cellProps)[1],
        weighted_average_3: data4.map((item) => item._cellProps)[1],
        weighted_average_4: data3.map((item) => item._cellProps)[1],
        weighted_average_5: data2.map((item) => item._cellProps)[1],
        weighted_average_6: data1.map((item) => item._cellProps)[1],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[1],
      weighted_average_2: data5.map((item) => item.weighted_average)[1],
      weighted_average_3: data4.map((item) => item.weighted_average)[1],
      weighted_average_4: data3.map((item) => item.weighted_average)[1],
      weighted_average_5: data2.map((item) => item.weighted_average)[1],
      weighted_average_6: data1.map((item) => item.weighted_average)[1],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "PANCHKULA CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[2],
        weighted_average_2: data5.map((item) => item._cellProps)[2],
        weighted_average_3: data4.map((item) => item._cellProps)[2],
        weighted_average_4: data3.map((item) => item._cellProps)[2],
        weighted_average_5: data2.map((item) => item._cellProps)[2],
        weighted_average_6: data1.map((item) => item._cellProps)[2],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[2],
      weighted_average_2: data5.map((item) => item.weighted_average)[2],
      weighted_average_3: data4.map((item) => item.weighted_average)[2],
      weighted_average_4: data3.map((item) => item.weighted_average)[2],
      weighted_average_5: data2.map((item) => item.weighted_average)[2],
      weighted_average_6: data1.map((item) => item.weighted_average)[2],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "LUCKNOW CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[3],
        weighted_average_2: data5.map((item) => item._cellProps)[3],
        weighted_average_3: data4.map((item) => item._cellProps)[3],
        weighted_average_4: data3.map((item) => item._cellProps)[3],
        weighted_average_5: data2.map((item) => item._cellProps)[3],
        weighted_average_6: data1.map((item) => item._cellProps)[3],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[3],
      weighted_average_2: data5.map((item) => item.weighted_average)[3],
      weighted_average_3: data4.map((item) => item.weighted_average)[3],
      weighted_average_4: data3.map((item) => item.weighted_average)[3],
      weighted_average_5: data2.map((item) => item.weighted_average)[3],
      weighted_average_6: data1.map((item) => item.weighted_average)[3],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "MEERUT CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[4],
        weighted_average_2: data5.map((item) => item._cellProps)[4],
        weighted_average_3: data4.map((item) => item._cellProps)[4],
        weighted_average_4: data3.map((item) => item._cellProps)[4],
        weighted_average_5: data2.map((item) => item._cellProps)[4],
        weighted_average_6: data1.map((item) => item._cellProps)[4],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[4],
      weighted_average_2: data5.map((item) => item.weighted_average)[4],
      weighted_average_3: data4.map((item) => item.weighted_average)[4],
      weighted_average_4: data3.map((item) => item.weighted_average)[4],
      weighted_average_5: data2.map((item) => item.weighted_average)[4],
      weighted_average_6: data1.map((item) => item.weighted_average)[4],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "VISHAKAPATNAM CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[5],
        weighted_average_2: data5.map((item) => item._cellProps)[5],
        weighted_average_3: data4.map((item) => item._cellProps)[5],
        weighted_average_4: data3.map((item) => item._cellProps)[5],
        weighted_average_5: data2.map((item) => item._cellProps)[5],
        weighted_average_6: data1.map((item) => item._cellProps)[5],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[5],
      weighted_average_2: data5.map((item) => item.weighted_average)[5],
      weighted_average_3: data4.map((item) => item.weighted_average)[5],
      weighted_average_4: data3.map((item) => item.weighted_average)[5],
      weighted_average_5: data2.map((item) => item.weighted_average)[5],
      weighted_average_6: data1.map((item) => item.weighted_average)[5],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "HYDERABAD CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[6],
        weighted_average_2: data5.map((item) => item._cellProps)[6],
        weighted_average_3: data4.map((item) => item._cellProps)[6],
        weighted_average_4: data3.map((item) => item._cellProps)[6],
        weighted_average_5: data2.map((item) => item._cellProps)[6],
        weighted_average_6: data1.map((item) => item._cellProps)[6],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[6],
      weighted_average_2: data5.map((item) => item.weighted_average)[6],
      weighted_average_3: data4.map((item) => item.weighted_average)[6],
      weighted_average_4: data3.map((item) => item.weighted_average)[6],
      weighted_average_5: data2.map((item) => item.weighted_average)[6],
      weighted_average_6: data1.map((item) => item.weighted_average)[6],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "BENGALURU CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[7],
        weighted_average_2: data5.map((item) => item._cellProps)[7],
        weighted_average_3: data4.map((item) => item._cellProps)[7],
        weighted_average_4: data3.map((item) => item._cellProps)[7],
        weighted_average_5: data2.map((item) => item._cellProps)[7],
        weighted_average_6: data1.map((item) => item._cellProps)[7],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[7],
      weighted_average_2: data5.map((item) => item.weighted_average)[7],
      weighted_average_3: data4.map((item) => item.weighted_average)[7],
      weighted_average_4: data3.map((item) => item.weighted_average)[7],
      weighted_average_5: data2.map((item) => item.weighted_average)[7],
      weighted_average_6: data1.map((item) => item.weighted_average)[7],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "THIRUVANANTHAPURAM CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[8],
        weighted_average_2: data5.map((item) => item._cellProps)[8],
        weighted_average_3: data4.map((item) => item._cellProps)[8],
        weighted_average_4: data3.map((item) => item._cellProps)[8],
        weighted_average_5: data2.map((item) => item._cellProps)[8],
        weighted_average_6: data1.map((item) => item._cellProps)[8],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[8],
      weighted_average_2: data5.map((item) => item.weighted_average)[8],
      weighted_average_3: data4.map((item) => item.weighted_average)[8],
      weighted_average_4: data3.map((item) => item.weighted_average)[8],
      weighted_average_5: data2.map((item) => item.weighted_average)[8],
      weighted_average_6: data1.map((item) => item.weighted_average)[8],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "CHENNAI CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[9],
        weighted_average_2: data5.map((item) => item._cellProps)[9],
        weighted_average_3: data4.map((item) => item._cellProps)[9],
        weighted_average_4: data3.map((item) => item._cellProps)[9],
        weighted_average_5: data2.map((item) => item._cellProps)[9],
        weighted_average_6: data1.map((item) => item._cellProps)[9],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[9],
      weighted_average_2: data5.map((item) => item.weighted_average)[9],
      weighted_average_3: data4.map((item) => item.weighted_average)[9],
      weighted_average_4: data3.map((item) => item.weighted_average)[9],
      weighted_average_5: data2.map((item) => item.weighted_average)[9],
      weighted_average_6: data1.map((item) => item.weighted_average)[9],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "RANCHI CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[10],
        weighted_average_2: data5.map((item) => item._cellProps)[10],
        weighted_average_3: data4.map((item) => item._cellProps)[10],
        weighted_average_4: data3.map((item) => item._cellProps)[10],
        weighted_average_5: data2.map((item) => item._cellProps)[10],
        weighted_average_6: data1.map((item) => item._cellProps)[10],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[10],
      weighted_average_2: data5.map((item) => item.weighted_average)[10],
      weighted_average_3: data4.map((item) => item.weighted_average)[10],
      weighted_average_4: data3.map((item) => item.weighted_average)[10],
      weighted_average_5: data2.map((item) => item.weighted_average)[10],
      weighted_average_6: data1.map((item) => item.weighted_average)[10],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "KOLKATA CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[11],
        weighted_average_2: data5.map((item) => item._cellProps)[11],
        weighted_average_3: data4.map((item) => item._cellProps)[11],
        weighted_average_4: data3.map((item) => item._cellProps)[11],
        weighted_average_5: data2.map((item) => item._cellProps)[11],
        weighted_average_6: data1.map((item) => item._cellProps)[11],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[11],
      weighted_average_2: data5.map((item) => item.weighted_average)[11],
      weighted_average_3: data4.map((item) => item.weighted_average)[11],
      weighted_average_4: data3.map((item) => item.weighted_average)[11],
      weighted_average_5: data2.map((item) => item.weighted_average)[11],
      weighted_average_6: data1.map((item) => item.weighted_average)[11],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "BHUBANESHWAR CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[12],
        weighted_average_2: data5.map((item) => item._cellProps)[12],
        weighted_average_3: data4.map((item) => item._cellProps)[12],
        weighted_average_4: data3.map((item) => item._cellProps)[12],
        weighted_average_5: data2.map((item) => item._cellProps)[12],
        weighted_average_6: data1.map((item) => item._cellProps)[12],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[12],
      weighted_average_2: data5.map((item) => item.weighted_average)[12],
      weighted_average_3: data4.map((item) => item.weighted_average)[12],
      weighted_average_4: data3.map((item) => item.weighted_average)[12],
      weighted_average_5: data2.map((item) => item.weighted_average)[12],
      weighted_average_6: data1.map((item) => item.weighted_average)[12],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "JAIPUR CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[13],
        weighted_average_2: data5.map((item) => item._cellProps)[13],
        weighted_average_3: data4.map((item) => item._cellProps)[13],
        weighted_average_4: data3.map((item) => item._cellProps)[13],
        weighted_average_5: data2.map((item) => item._cellProps)[13],
        weighted_average_6: data1.map((item) => item._cellProps)[13],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[13],
      weighted_average_2: data5.map((item) => item.weighted_average)[13],
      weighted_average_3: data4.map((item) => item.weighted_average)[13],
      weighted_average_4: data3.map((item) => item.weighted_average)[13],
      weighted_average_5: data2.map((item) => item.weighted_average)[13],
      weighted_average_6: data1.map((item) => item.weighted_average)[13],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "AHMEDABAD CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[14],
        weighted_average_2: data5.map((item) => item._cellProps)[14],
        weighted_average_3: data4.map((item) => item._cellProps)[14],
        weighted_average_4: data3.map((item) => item._cellProps)[14],
        weighted_average_5: data2.map((item) => item._cellProps)[14],
        weighted_average_6: data1.map((item) => item._cellProps)[14],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[14],
      weighted_average_2: data5.map((item) => item.weighted_average)[14],
      weighted_average_3: data4.map((item) => item.weighted_average)[14],
      weighted_average_4: data3.map((item) => item.weighted_average)[14],
      weighted_average_5: data2.map((item) => item.weighted_average)[14],
      weighted_average_6: data1.map((item) => item.weighted_average)[14],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "VADODARA CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[15],
        weighted_average_2: data5.map((item) => item._cellProps)[15],
        weighted_average_3: data4.map((item) => item._cellProps)[15],
        weighted_average_4: data3.map((item) => item._cellProps)[15],
        weighted_average_5: data2.map((item) => item._cellProps)[15],
        weighted_average_6: data1.map((item) => item._cellProps)[15],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[15],
      weighted_average_2: data5.map((item) => item.weighted_average)[15],
      weighted_average_3: data4.map((item) => item.weighted_average)[15],
      weighted_average_4: data3.map((item) => item.weighted_average)[15],
      weighted_average_5: data2.map((item) => item.weighted_average)[15],
      weighted_average_6: data1.map((item) => item.weighted_average)[15],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "NAGPUR CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[16],
        weighted_average_2: data5.map((item) => item._cellProps)[16],
        weighted_average_3: data4.map((item) => item._cellProps)[16],
        weighted_average_4: data3.map((item) => item._cellProps)[16],
        weighted_average_5: data2.map((item) => item._cellProps)[16],
        weighted_average_6: data1.map((item) => item._cellProps)[16],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[16],
      weighted_average_2: data5.map((item) => item.weighted_average)[16],
      weighted_average_3: data4.map((item) => item.weighted_average)[16],
      weighted_average_4: data3.map((item) => item.weighted_average)[16],
      weighted_average_5: data2.map((item) => item.weighted_average)[16],
      weighted_average_6: data1.map((item) => item.weighted_average)[16],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "MUMBAI CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[17],
        weighted_average_2: data5.map((item) => item._cellProps)[17],
        weighted_average_3: data4.map((item) => item._cellProps)[17],
        weighted_average_4: data3.map((item) => item._cellProps)[17],
        weighted_average_5: data2.map((item) => item._cellProps)[17],
        weighted_average_6: data1.map((item) => item._cellProps)[17],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[17],
      weighted_average_2: data5.map((item) => item.weighted_average)[17],
      weighted_average_3: data4.map((item) => item.weighted_average)[17],
      weighted_average_4: data3.map((item) => item.weighted_average)[17],
      weighted_average_5: data2.map((item) => item.weighted_average)[17],
      weighted_average_6: data1.map((item) => item.weighted_average)[17],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "PUNE CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[18],
        weighted_average_2: data5.map((item) => item._cellProps)[18],
        weighted_average_3: data4.map((item) => item._cellProps)[18],
        weighted_average_4: data3.map((item) => item._cellProps)[18],
        weighted_average_5: data2.map((item) => item._cellProps)[18],
        weighted_average_6: data1.map((item) => item._cellProps)[18],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[18],
      weighted_average_2: data5.map((item) => item.weighted_average)[18],
      weighted_average_3: data4.map((item) => item.weighted_average)[18],
      weighted_average_4: data3.map((item) => item.weighted_average)[18],
      weighted_average_5: data2.map((item) => item.weighted_average)[18],
      weighted_average_6: data1.map((item) => item.weighted_average)[18],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "BHOPAL CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[19],
        weighted_average_2: data5.map((item) => item._cellProps)[19],
        weighted_average_3: data4.map((item) => item._cellProps)[19],
        weighted_average_4: data3.map((item) => item._cellProps)[19],
        weighted_average_5: data2.map((item) => item._cellProps)[19],
        weighted_average_6: data1.map((item) => item._cellProps)[19],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[19],
      weighted_average_2: data5.map((item) => item.weighted_average)[19],
      weighted_average_3: data4.map((item) => item.weighted_average)[19],
      weighted_average_4: data3.map((item) => item.weighted_average)[19],
      weighted_average_5: data2.map((item) => item.weighted_average)[19],
      weighted_average_6: data1.map((item) => item.weighted_average)[19],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: "GUWAHATI CE & GST",
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[20],
        weighted_average_2: data5.map((item) => item._cellProps)[20],
        weighted_average_3: data4.map((item) => item._cellProps)[20],
        weighted_average_4: data3.map((item) => item._cellProps)[20],
        weighted_average_5: data2.map((item) => item._cellProps)[20],
        weighted_average_6: data1.map((item) => item._cellProps)[20],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[20],
      weighted_average_2: data5.map((item) => item.weighted_average)[20],
      weighted_average_3: data4.map((item) => item.weighted_average)[20],
      weighted_average_4: data3.map((item) => item.weighted_average)[20],
      weighted_average_5: data2.map((item) => item.weighted_average)[20],
      weighted_average_6: data1.map((item) => item.weighted_average)[20],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
  ];

  const datacustom = [
    {
      zone_name: data6.map((item) => item.zone_name)[0],
      weighted_average_1: data6.map((item) => item.weighted_average)[0],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[0],
        weighted_average_2: data5.map((item) => item._cellProps)[0],
        weighted_average_3: data4.map((item) => item._cellProps)[0],
        weighted_average_4: data3.map((item) => item._cellProps)[0],
        weighted_average_5: data2.map((item) => item._cellProps)[0],
        weighted_average_6: data1.map((item) => item._cellProps)[0],
      },
      weighted_average_2: data5.map((item) => item.weighted_average)[0],
      weighted_average_3: data4.map((item) => item.weighted_average)[0],
      weighted_average_4: data3.map((item) => item.weighted_average)[0],
      weighted_average_5: data2.map((item) => item.weighted_average)[0],
      weighted_average_6: data1.map((item) => item.weighted_average)[0],
      date_1: (name==="epcg"||name==="aa")?dayjs(previousmonth5).format("MMMM YYYY"): data6.map((item) => item.date)[0],
      date_2: (name==="epcg"||name==="aa")?dayjs(previousmonth4).format("MMMM YYYY"):data5.map((item) => item.date)[0],
      date_3: (name==="epcg"||name==="aa")?dayjs(previousmonth3).format("MMMM YYYY"):data4.map((item) => item.date)[0],
      date_4: (name==="epcg"||name==="aa")?dayjs(previousmonth2).format("MMMM YYYY"):data3.map((item) => item.date)[0],
      date_5: (name==="epcg"||name==="aa")?dayjs(previousmonth1).format("MMMM YYYY"):data2.map((item) => item.date)[0],
      date_6: (name==="epcg"||name==="aa")?dayjs(newdate).format("MMMM YYYY"):data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[1],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[1],
        weighted_average_2: data5.map((item) => item._cellProps)[1],
        weighted_average_3: data4.map((item) => item._cellProps)[1],
        weighted_average_4: data3.map((item) => item._cellProps)[1],
        weighted_average_5: data2.map((item) => item._cellProps)[1],
        weighted_average_6: data1.map((item) => item._cellProps)[1],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[1],
      weighted_average_2: data5.map((item) => item.weighted_average)[1],
      weighted_average_3: data4.map((item) => item.weighted_average)[1],
      weighted_average_4: data3.map((item) => item.weighted_average)[1],
      weighted_average_5: data2.map((item) => item.weighted_average)[1],
      weighted_average_6: data1.map((item) => item.weighted_average)[1],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[2],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[2],
        weighted_average_2: data5.map((item) => item._cellProps)[2],
        weighted_average_3: data4.map((item) => item._cellProps)[2],
        weighted_average_4: data3.map((item) => item._cellProps)[2],
        weighted_average_5: data2.map((item) => item._cellProps)[2],
        weighted_average_6: data1.map((item) => item._cellProps)[2],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[2],
      weighted_average_2: data5.map((item) => item.weighted_average)[2],
      weighted_average_3: data4.map((item) => item.weighted_average)[2],
      weighted_average_4: data3.map((item) => item.weighted_average)[2],
      weighted_average_5: data2.map((item) => item.weighted_average)[2],
      weighted_average_6: data1.map((item) => item.weighted_average)[2],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[3],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[3],
        weighted_average_2: data5.map((item) => item._cellProps)[3],
        weighted_average_3: data4.map((item) => item._cellProps)[3],
        weighted_average_4: data3.map((item) => item._cellProps)[3],
        weighted_average_5: data2.map((item) => item._cellProps)[3],
        weighted_average_6: data1.map((item) => item._cellProps)[3],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[3],
      weighted_average_2: data5.map((item) => item.weighted_average)[3],
      weighted_average_3: data4.map((item) => item.weighted_average)[3],
      weighted_average_4: data3.map((item) => item.weighted_average)[3],
      weighted_average_5: data2.map((item) => item.weighted_average)[3],
      weighted_average_6: data1.map((item) => item.weighted_average)[3],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[4],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[4],
        weighted_average_2: data5.map((item) => item._cellProps)[4],
        weighted_average_3: data4.map((item) => item._cellProps)[4],
        weighted_average_4: data3.map((item) => item._cellProps)[4],
        weighted_average_5: data2.map((item) => item._cellProps)[4],
        weighted_average_6: data1.map((item) => item._cellProps)[4],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[4],
      weighted_average_2: data5.map((item) => item.weighted_average)[4],
      weighted_average_3: data4.map((item) => item.weighted_average)[4],
      weighted_average_4: data3.map((item) => item.weighted_average)[4],
      weighted_average_5: data2.map((item) => item.weighted_average)[4],
      weighted_average_6: data1.map((item) => item.weighted_average)[4],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[5],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[5],
        weighted_average_2: data5.map((item) => item._cellProps)[5],
        weighted_average_3: data4.map((item) => item._cellProps)[5],
        weighted_average_4: data3.map((item) => item._cellProps)[5],
        weighted_average_5: data2.map((item) => item._cellProps)[5],
        weighted_average_6: data1.map((item) => item._cellProps)[5],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[5],
      weighted_average_2: data5.map((item) => item.weighted_average)[5],
      weighted_average_3: data4.map((item) => item.weighted_average)[5],
      weighted_average_4: data3.map((item) => item.weighted_average)[5],
      weighted_average_5: data2.map((item) => item.weighted_average)[5],
      weighted_average_6: data1.map((item) => item.weighted_average)[5],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[6],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[6],
        weighted_average_2: data5.map((item) => item._cellProps)[6],
        weighted_average_3: data4.map((item) => item._cellProps)[6],
        weighted_average_4: data3.map((item) => item._cellProps)[6],
        weighted_average_5: data2.map((item) => item._cellProps)[6],
        weighted_average_6: data1.map((item) => item._cellProps)[6],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[6],
      weighted_average_2: data5.map((item) => item.weighted_average)[6],
      weighted_average_3: data4.map((item) => item.weighted_average)[6],
      weighted_average_4: data3.map((item) => item.weighted_average)[6],
      weighted_average_5: data2.map((item) => item.weighted_average)[6],
      weighted_average_6: data1.map((item) => item.weighted_average)[6],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[7],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[7],
        weighted_average_2: data5.map((item) => item._cellProps)[7],
        weighted_average_3: data4.map((item) => item._cellProps)[7],
        weighted_average_4: data3.map((item) => item._cellProps)[7],
        weighted_average_5: data2.map((item) => item._cellProps)[7],
        weighted_average_6: data1.map((item) => item._cellProps)[7],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[7],
      weighted_average_2: data5.map((item) => item.weighted_average)[7],
      weighted_average_3: data4.map((item) => item.weighted_average)[7],
      weighted_average_4: data3.map((item) => item.weighted_average)[7],
      weighted_average_5: data2.map((item) => item.weighted_average)[7],
      weighted_average_6: data1.map((item) => item.weighted_average)[7],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[8],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[8],
        weighted_average_2: data5.map((item) => item._cellProps)[8],
        weighted_average_3: data4.map((item) => item._cellProps)[8],
        weighted_average_4: data3.map((item) => item._cellProps)[8],
        weighted_average_5: data2.map((item) => item._cellProps)[8],
        weighted_average_6: data1.map((item) => item._cellProps)[8],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[8],
      weighted_average_2: data5.map((item) => item.weighted_average)[8],
      weighted_average_3: data4.map((item) => item.weighted_average)[8],
      weighted_average_4: data3.map((item) => item.weighted_average)[8],
      weighted_average_5: data2.map((item) => item.weighted_average)[8],
      weighted_average_6: data1.map((item) => item.weighted_average)[8],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[9],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[9],
        weighted_average_2: data5.map((item) => item._cellProps)[9],
        weighted_average_3: data4.map((item) => item._cellProps)[9],
        weighted_average_4: data3.map((item) => item._cellProps)[9],
        weighted_average_5: data2.map((item) => item._cellProps)[9],
        weighted_average_6: data1.map((item) => item._cellProps)[9],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[9],
      weighted_average_2: data5.map((item) => item.weighted_average)[9],
      weighted_average_3: data4.map((item) => item.weighted_average)[9],
      weighted_average_4: data3.map((item) => item.weighted_average)[9],
      weighted_average_5: data2.map((item) => item.weighted_average)[9],
      weighted_average_6: data1.map((item) => item.weighted_average)[9],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[10],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[10],
        weighted_average_2: data5.map((item) => item._cellProps)[10],
        weighted_average_3: data4.map((item) => item._cellProps)[10],
        weighted_average_4: data3.map((item) => item._cellProps)[10],
        weighted_average_5: data2.map((item) => item._cellProps)[10],
        weighted_average_6: data1.map((item) => item._cellProps)[10],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[10],
      weighted_average_2: data5.map((item) => item.weighted_average)[10],
      weighted_average_3: data4.map((item) => item.weighted_average)[10],
      weighted_average_4: data3.map((item) => item.weighted_average)[10],
      weighted_average_5: data2.map((item) => item.weighted_average)[10],
      weighted_average_6: data1.map((item) => item.weighted_average)[10],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[11],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[11],
        weighted_average_2: data5.map((item) => item._cellProps)[11],
        weighted_average_3: data4.map((item) => item._cellProps)[11],
        weighted_average_4: data3.map((item) => item._cellProps)[11],
        weighted_average_5: data2.map((item) => item._cellProps)[11],
        weighted_average_6: data1.map((item) => item._cellProps)[11],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[11],
      weighted_average_2: data5.map((item) => item.weighted_average)[11],
      weighted_average_3: data4.map((item) => item.weighted_average)[11],
      weighted_average_4: data3.map((item) => item.weighted_average)[11],
      weighted_average_5: data2.map((item) => item.weighted_average)[11],
      weighted_average_6: data1.map((item) => item.weighted_average)[11],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[12],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[12],
        weighted_average_2: data5.map((item) => item._cellProps)[12],
        weighted_average_3: data4.map((item) => item._cellProps)[12],
        weighted_average_4: data3.map((item) => item._cellProps)[12],
        weighted_average_5: data2.map((item) => item._cellProps)[12],
        weighted_average_6: data1.map((item) => item._cellProps)[12],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[12],
      weighted_average_2: data5.map((item) => item.weighted_average)[12],
      weighted_average_3: data4.map((item) => item.weighted_average)[12],
      weighted_average_4: data3.map((item) => item.weighted_average)[12],
      weighted_average_5: data2.map((item) => item.weighted_average)[12],
      weighted_average_6: data1.map((item) => item.weighted_average)[12],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[13],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[13],
        weighted_average_2: data5.map((item) => item._cellProps)[13],
        weighted_average_3: data4.map((item) => item._cellProps)[13],
        weighted_average_4: data3.map((item) => item._cellProps)[13],
        weighted_average_5: data2.map((item) => item._cellProps)[13],
        weighted_average_6: data1.map((item) => item._cellProps)[13],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[13],
      weighted_average_2: data5.map((item) => item.weighted_average)[13],
      weighted_average_3: data4.map((item) => item.weighted_average)[13],
      weighted_average_4: data3.map((item) => item.weighted_average)[13],
      weighted_average_5: data2.map((item) => item.weighted_average)[13],
      weighted_average_6: data1.map((item) => item.weighted_average)[13],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[14],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[14],
        weighted_average_2: data5.map((item) => item._cellProps)[14],
        weighted_average_3: data4.map((item) => item._cellProps)[14],
        weighted_average_4: data3.map((item) => item._cellProps)[14],
        weighted_average_5: data2.map((item) => item._cellProps)[14],
        weighted_average_6: data1.map((item) => item._cellProps)[14],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[14],
      weighted_average_2: data5.map((item) => item.weighted_average)[14],
      weighted_average_3: data4.map((item) => item.weighted_average)[14],
      weighted_average_4: data3.map((item) => item.weighted_average)[14],
      weighted_average_5: data2.map((item) => item.weighted_average)[14],
      weighted_average_6: data1.map((item) => item.weighted_average)[14],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[15],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[15],
        weighted_average_2: data5.map((item) => item._cellProps)[15],
        weighted_average_3: data4.map((item) => item._cellProps)[15],
        weighted_average_4: data3.map((item) => item._cellProps)[15],
        weighted_average_5: data2.map((item) => item._cellProps)[15],
        weighted_average_6: data1.map((item) => item._cellProps)[15],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[15],
      weighted_average_2: data5.map((item) => item.weighted_average)[15],
      weighted_average_3: data4.map((item) => item.weighted_average)[15],
      weighted_average_4: data3.map((item) => item.weighted_average)[15],
      weighted_average_5: data2.map((item) => item.weighted_average)[15],
      weighted_average_6: data1.map((item) => item.weighted_average)[15],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[16],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[16],
        weighted_average_2: data5.map((item) => item._cellProps)[16],
        weighted_average_3: data4.map((item) => item._cellProps)[16],
        weighted_average_4: data3.map((item) => item._cellProps)[16],
        weighted_average_5: data2.map((item) => item._cellProps)[16],
        weighted_average_6: data1.map((item) => item._cellProps)[16],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[16],
      weighted_average_2: data5.map((item) => item.weighted_average)[16],
      weighted_average_3: data4.map((item) => item.weighted_average)[16],
      weighted_average_4: data3.map((item) => item.weighted_average)[16],
      weighted_average_5: data2.map((item) => item.weighted_average)[16],
      weighted_average_6: data1.map((item) => item.weighted_average)[16],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[17],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[17],
        weighted_average_2: data5.map((item) => item._cellProps)[17],
        weighted_average_3: data4.map((item) => item._cellProps)[17],
        weighted_average_4: data3.map((item) => item._cellProps)[17],
        weighted_average_5: data2.map((item) => item._cellProps)[17],
        weighted_average_6: data1.map((item) => item._cellProps)[17],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[17],
      weighted_average_2: data5.map((item) => item.weighted_average)[17],
      weighted_average_3: data4.map((item) => item.weighted_average)[17],
      weighted_average_4: data3.map((item) => item.weighted_average)[17],
      weighted_average_5: data2.map((item) => item.weighted_average)[17],
      weighted_average_6: data1.map((item) => item.weighted_average)[17],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[18],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[18],
        weighted_average_2: data5.map((item) => item._cellProps)[18],
        weighted_average_3: data4.map((item) => item._cellProps)[18],
        weighted_average_4: data3.map((item) => item._cellProps)[18],
        weighted_average_5: data2.map((item) => item._cellProps)[18],
        weighted_average_6: data1.map((item) => item._cellProps)[18],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[18],
      weighted_average_2: data5.map((item) => item.weighted_average)[18],
      weighted_average_3: data4.map((item) => item.weighted_average)[18],
      weighted_average_4: data3.map((item) => item.weighted_average)[18],
      weighted_average_5: data2.map((item) => item.weighted_average)[18],
      weighted_average_6: data1.map((item) => item.weighted_average)[18],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[19],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[19],
        weighted_average_2: data5.map((item) => item._cellProps)[19],
        weighted_average_3: data4.map((item) => item._cellProps)[19],
        weighted_average_4: data3.map((item) => item._cellProps)[19],
        weighted_average_5: data2.map((item) => item._cellProps)[19],
        weighted_average_6: data1.map((item) => item._cellProps)[19],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[19],
      weighted_average_2: data5.map((item) => item.weighted_average)[19],
      weighted_average_3: data4.map((item) => item.weighted_average)[19],
      weighted_average_4: data3.map((item) => item.weighted_average)[19],
      weighted_average_5: data2.map((item) => item.weighted_average)[19],
      weighted_average_6: data1.map((item) => item.weighted_average)[19],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[20],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[20],
        weighted_average_2: data5.map((item) => item._cellProps)[20],
        weighted_average_3: data4.map((item) => item._cellProps)[20],
        weighted_average_4: data3.map((item) => item._cellProps)[20],
        weighted_average_5: data2.map((item) => item._cellProps)[20],
        weighted_average_6: data1.map((item) => item._cellProps)[20],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[20],
      weighted_average_2: data5.map((item) => item.weighted_average)[20],
      weighted_average_3: data4.map((item) => item.weighted_average)[20],
      weighted_average_4: data3.map((item) => item.weighted_average)[20],
      weighted_average_5: data2.map((item) => item.weighted_average)[20],
      weighted_average_6: data1.map((item) => item.weighted_average)[20],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[21],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[21],
        weighted_average_2: data5.map((item) => item._cellProps)[21],
        weighted_average_3: data4.map((item) => item._cellProps)[21],
        weighted_average_4: data3.map((item) => item._cellProps)[21],
        weighted_average_5: data2.map((item) => item._cellProps)[21],
        weighted_average_6: data1.map((item) => item._cellProps)[21],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[21],
      weighted_average_2: data5.map((item) => item.weighted_average)[21],
      weighted_average_3: data4.map((item) => item.weighted_average)[21],
      weighted_average_4: data3.map((item) => item.weighted_average)[21],
      weighted_average_5: data2.map((item) => item.weighted_average)[21],
      weighted_average_6: data1.map((item) => item.weighted_average)[21],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[22],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[22],
        weighted_average_2: data5.map((item) => item._cellProps)[22],
        weighted_average_3: data4.map((item) => item._cellProps)[22],
        weighted_average_4: data3.map((item) => item._cellProps)[22],
        weighted_average_5: data2.map((item) => item._cellProps)[22],
        weighted_average_6: data1.map((item) => item._cellProps)[22],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[22],
      weighted_average_2: data5.map((item) => item.weighted_average)[22],
      weighted_average_3: data4.map((item) => item.weighted_average)[22],
      weighted_average_4: data3.map((item) => item.weighted_average)[22],
      weighted_average_5: data2.map((item) => item.weighted_average)[22],
      weighted_average_6: data1.map((item) => item.weighted_average)[22],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
    {
      zone_name: data6.map((item) => item.zone_name)[23],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[23],
        weighted_average_2: data5.map((item) => item._cellProps)[23],
        weighted_average_3: data4.map((item) => item._cellProps)[23],
        weighted_average_4: data3.map((item) => item._cellProps)[23],
        weighted_average_5: data2.map((item) => item._cellProps)[23],
        weighted_average_6: data1.map((item) => item._cellProps)[23],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[23],
      weighted_average_2: data5.map((item) => item.weighted_average)[23],
      weighted_average_3: data4.map((item) => item.weighted_average)[23],
      weighted_average_4: data3.map((item) => item.weighted_average)[23],
      weighted_average_5: data2.map((item) => item.weighted_average)[23],
      weighted_average_6: data1.map((item) => item.weighted_average)[23],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },

    {
      zone_name: data6.map((item) => item.zone_name)[24],
      _cellProps: {
        weighted_average_1: data6.map((item) => item._cellProps)[24],
        weighted_average_2: data5.map((item) => item._cellProps)[24],
        weighted_average_3: data4.map((item) => item._cellProps)[24],
        weighted_average_4: data3.map((item) => item._cellProps)[24],
        weighted_average_5: data2.map((item) => item._cellProps)[24],
        weighted_average_6: data1.map((item) => item._cellProps)[24],
      },
      weighted_average_1: data6.map((item) => item.weighted_average)[24],
      weighted_average_2: data5.map((item) => item.weighted_average)[24],
      weighted_average_3: data4.map((item) => item.weighted_average)[24],
      weighted_average_4: data3.map((item) => item.weighted_average)[24],
      weighted_average_5: data2.map((item) => item.weighted_average)[24],
      weighted_average_6: data1.map((item) => item.weighted_average)[24],
      date_1: data6.map((item) => item.date)[0],
      date_2: data5.map((item) => item.date)[0],
      date_3: data4.map((item) => item.date)[0],
      date_4: data3.map((item) => item.date)[0],
      date_5: data2.map((item) => item.date)[0],
      date_6: data1.map((item) => item.date)[0],
    },
  ];

  const columns = [
    {
      group:
        name === "registration" ||
        name === "returnFiling" ||
        name === "investigation" ||
        name === "adjudication" ||
        name === "refunds" ||
        name === "recoveryOfArrears" ||
        name === "arrestAndProsecution" ||
        name === "audit" ||
        name === "appeals"
          ? `CGST (${data6.map((item) => item.gstname)[0]})`:
          name==="adjudicationLegacy"? "CGST (Adjudication (Legacy Cases))": name==="scrutiny"?"CGST (Scrutiny & Assessment)":
          name==="epcg"?"CUSTOMS (Management of Export Obligation(EPCG))":name==="aa"?"custom3"
          : `CUSTOMS (${data6.map((item) => item.cusname)[0]})`,
      children: [
        {
          key: "zone_name",
          label: "Zone Name",
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_1",
          label: `${name==="epcg"?datacustom.map((item) => item.date_1)[0]:data.map((item) => item.date_1)[0]}`,
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_2",
          label: `${name==="epcg"?datacustom.map((item) => item.date_2)[0]:data.map((item) => item.date_2)[0]}`,
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_3",
          label: `${name==="epcg"?datacustom.map((item) => item.date_3)[0]:data.map((item) => item.date_3)[0]}`,
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_4",
          label: `${name==="epcg"?datacustom.map((item) => item.date_4)[0]:data.map((item) => item.date_4)[0]}`,
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_5",
          label: `${name==="epcg"?datacustom.map((item) => item.date_5)[0]:data.map((item) => item.date_5)[0]}`,
          _cellProps: { scope: "col" },
        },
        {
          key: "weighted_average_6",
          label: `${name==="epcg"?datacustom.map((item) => item.date_6)[0]:data.map((item) => item.date_6)[0]}`,
          _cellProps: { scope: "col" },
        },
      ],
    },
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
                name === "Adjudication" || name==="epcg"||name==="aa"||
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
