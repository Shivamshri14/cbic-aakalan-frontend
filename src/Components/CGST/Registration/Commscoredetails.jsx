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
import Spinner from "../../Spinner";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";

const Commscoredetails = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const [selectedOption, setSelectedOption] = useState("Commissionerate");
  // const [value2, setValue] = React.useState(dayjs());
  // console.log(value2);
  // const formattedDate = value2 ? value2.format('MM YYYY') : '';
  // console.log("val123",formattedDate);

  // const [value2, setValue] = useState(
  //   dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  // );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  const [zoneName, setZoneName] = useState("");

  const [loading, setloading] = useState(true);

  const handleDateChange = (value) => {
    onChangeDate(value);
  };
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code } = queryParams;
  const { come_name } = queryParams;

  var relevantAspects;
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [selected, setSelected] = useState("Commissionerate");
  const columns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key:
        name === "adjudication(legacy cases)" ||
          name === "appeals" ||
          name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" || name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "zone_name"
          : "zoneName",
      label: "Zone",
    },
    {
      key:
        name === "adjudication(legacy cases)" ||
          name === "appeals" ||
          name === "recovery_of_arrears" ||
          name === "arrest_and_prosecution" || name === "registration" || name === "investigation" || name === "audit" || name === "scrutiny/assessment"
          ? "commissionerate_name"
          : "commName",
      label: "Commissionerate",
    },
    // {
    //   key: "gst",
    //   label: "Sub Parameters",
    // },
    // {
    //   key: "absval",
    //   label: "Absolute Figures (N/D)",
    // },
    // {
    //   key: "totalScore",
    //   label: "Score of Sub Parameters (%)",
    // },
    // {
    //     key:"zonal_rank",
    //     label:"Commissionerate Rank",
    // }
  ];

  if (name === "refunds") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Parameter",
    });

    columns.splice(5, 0, {
      key: "totalScore",
      label: "Percentage (For the Month)",
    });

    columns.splice(4, 0, {
      key: "absval",
      label: "Refunds > 60 days/Total Refund Pending",
    });

    columns.splice(6, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "returnFiling") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Parameter",
    });

    columns.splice(5, 0, {
      key: "totalScore",
      label: "Percentage Not Filed",
    });

    columns.splice(4, 0, {
      key: "absval",
      label: "Return Not Filed/Total Return Pending",
    });

    columns.splice(6, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(7, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 5)",
    });
  } else if (name === "scrutiny/assessment") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });
    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "adjudication") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absval",
      label: "Absolute Number",
    });
    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "appeals") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });
    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 12)",
    });
  } else if (name === "adjudication(legacy cases)") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "recovery_of_arrears") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "arrest_and_prosecution") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "way_to_grade",
      label: "Way to Grade (Marks) Score out of 10",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  } else if (name === "registration") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "total_score",
      label: "Score of Sub Parameters (%)",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  }
  else if (name === "investigation") {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "total_score",
      label: "Score of Sub Parameters (%)",
    });

    columns.splice(4, 0, {
      key: "absolutevale",
      label: "Absolute Number",
    });

    columns.splice(6, 0, {
      key: "sub_parameter_weighted_average",
      label: "Weighted Average(out of 10)",
    });
  }
  else {
    columns.splice(3, 0, {
      key: "gst",
      label: "Sub Parameters",
    });

    columns.splice(5, 0, {
      key: "totalScore",
      label: "Score of Sub Parameters (%)",
    });

    columns.splice(4, 0, {
      key: "absval",
      label: "Absolute Number",
    });
  }

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
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

        if (responses) {
          setloading(false);
        }

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
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

        if (responses) {
          setloading(false);
        }

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "investigation") {
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

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "audit") {
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

        if (responses) {
          setloading(false);
        }

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "scrutiny/assessment") {
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

        if (responses) {
          setloading(false);
        }

        const allData = responses.flatMap((response) =>
          response.data.map((item) => ({
            ...item, // Keep all the data intact
            gst: response.gst,
          }))
        );

        const res = allData.filter(
          (item) => item.commissionerate_name === come_name
        );
        console.log("RES", res);

        setData(res.map((item, index) => ({ ...item, s_no: index + 1 })));
      } else if (name === "appeals") {
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

        console.log("CRESPONSE3", response01.data);
        console.log("CRESPONSE3", response11.data);
        console.log("CRESPONSE3", response21.data);
        console.log("CRESPONSE3", response31.data);

        const appeals = [
          ...response01.data,
          ...response11.data,
          ...response21.data,
          ...response31.data,
        ];

        if (appeals) {
          setloading(false);
        }

        const updatedappeals = appeals.map((item, index) => ({
          ...item,
          s_no: index + 1,
        }));

        const appealsByZone = updatedappeals.reduce((acc, item) => {
          if (!acc[item.zone_code]) {
            acc[item.zone_code] = {};
          }

          // Group by commName within the zone_code
          if (!acc[item.zone_code][item.commissionerate_name]) {
            acc[item.zone_code][item.commissionerate_name] = [];
          }

          // Push the item into the appropriate group
          acc[item.zone_code][item.commissionerate_name].push(item);
          return acc;
        }, {});

        const targetZoneCode = zone_code; // Replace with your desired zone_code
        console.log("ZC", targetZoneCode);
        const targetCommName = come_name; // Replace with your desired commName
        console.log("CN", targetCommName);

        if (
          appealsByZone[targetZoneCode] &&
          appealsByZone[targetZoneCode][targetCommName]
        ) {
          console.log(`Zone Code: ${targetZoneCode}`);
          console.log(`  Comm Name: ${targetCommName}`);
          appealsByZone[targetZoneCode][targetCommName].map((item, index) => {
            const gstvalues = ["GST11A", "GST11B", "GST11C", "GST11D"];
            item.gst = gstvalues[index] || "no";
            console.log(
              `S.No: ${(item.s_no = index + 1)}, Name: ${item.zone_name}`,
              `${item.sub_parameter_weighted_average}`,
              `${item.gst}`
            );
          });

          console.log(
            "kitty",
            appealsByZone[targetZoneCode][targetCommName].map(
              (item, index) => ({ ...item, s_no: index + 1 })
            )
          );
        } else {
          console.log("No matching items found.");
        }

        setData(
          appealsByZone[targetZoneCode][targetCommName].map((item, index) => ({
            ...item,
            s_no: index + 1,
          }))
        );
      } else if (name === "adjudication(legacy cases)") {
        try {
          const endpoints = ["gst6a", "gst6b", "gst6c", "gst6d"];

          // Fetch data from all endpoints in parallel
          const responses = await Promise.all(
            endpoints.map((endpoint) =>
              apiClient.get(`/cbic/${endpoint}`, {
                params: { month_date: newdate, type: "all_commissary" },
              }).then((response) => response.data)
            )
          );

          console.log("API Responses:", responses);
          setloading(false); // Set loading to false after API calls complete

          // Flatten all responses into a single array
          const appeals = responses.flat();
          console.log("FINAL RESPONSE", appeals);

          // Add serial numbers to each entry
          const updatedAppeals = appeals.map((item, index) => ({
            ...item,
            s_no: index + 1,
          }));

          // Group data by zone_code -> commissionerate_name
          const appealsByZone = updatedAppeals.reduce((acc, item) => {
            const zoneCode = item.zone_code;
            const commName = item.commissionerate_name;

            if (!acc[zoneCode]) {
              acc[zoneCode] = {};
            }

            if (!acc[zoneCode][commName]) {
              acc[zoneCode][commName] = [];
            }

            acc[zoneCode][commName].push(item);
            return acc;
          }, {});

          // Replace these with actual values
          const targetZoneCode = "your_zone_code_here";
          const targetCommName = "your_comm_name_here";

          console.log("Zone Code:", targetZoneCode);
          console.log("Comm Name:", targetCommName);

          if (
            appealsByZone[targetZoneCode] &&
            appealsByZone[targetZoneCode][targetCommName]
          ) {
            const gstValues = ["GST6A", "GST6B", "GST6C", "GST6D"];

            // Assign GST values correctly
            const updatedData = appealsByZone[targetZoneCode][targetCommName].map(
              (item, index) => ({
                ...item,
                gst: gstValues[index % gstValues.length] || "NO_GST",
                s_no: index + 1,
              })
            );

            console.log("Filtered Data:", updatedData);
            setData(updatedData);
          } else {
            console.log("No matching items found.");
            setData([]);
          }
        } catch (error) {
          console.error("Error fetching adjudication data:", error);
        }
      } else {
        // Make a GET request to the specified endpoint
        const response = await apiClient.get(`/cbic/t_score/${name}`, {
          params: {
            month_date: newdate,
            type: "come_name",
            zone_code: zone_code,
            come_name: come_name,
          },
        });
        // setTimeout(()=>{
        if (response) {
          setloading(false);
        }
        // },1000)

        console.log("Response", response);
        const commname = response.data.map((item) => item.commName)[0];
        setZoneName(commname);
        console.log("Commissionerate Name:", commname);
        console.log("url", response);

        relevantAspects = response.data.map((item) => item.ra);
        console.log("ra:", relevantAspects);

        const response0 = await apiClient.get(`/cbic/gst6a`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        const response1 = await apiClient.get(`/cbic/gst6b`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        const response2 = await apiClient.get(`/cbic/gst6c`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        const response3 = await apiClient.get(`/cbic/gst6d`, {
          params: {
            month_date: newdate,
            type: "all_commissary",
          },
        });

        console.log("CRESPONSE0", response0.data);
        console.log("CRESPONSE1", response1.data);
        console.log("CRESPONSE2", response2.data);
        console.log("CRESPONSE3", response3.data);

        const responses = [
          ...response0.data,
          ...response1.data,
          ...response2.data,
          ...response3.data,
        ];

        console.log("Responses:", responses);

        const updatedData = responses.map((item, index) => ({
          ...item,
          s_no: index + 1,
        }));

        const groupedByZone = updatedData.reduce((acc, item) => {
          if (!acc[item.zone_code]) {
            acc[item.zone_code] = {};
          }

          // Group by commName within the zone_code
          if (!acc[item.zone_code][item.commissionerate_name]) {
            acc[item.zone_code][item.commissionerate_name] = [];
          }

          // Push the item into the appropriate group
          acc[item.zone_code][item.commissionerate_name].push(item);
          return acc;
        }, {});

        const targetZoneCode = zone_code; // Replace with your desired zone_code
        console.log("ZC", targetZoneCode);
        const targetCommName = come_name; // Replace with your desired commName
        console.log("CN", targetCommName);

        if (
          groupedByZone[targetZoneCode] &&
          groupedByZone[targetZoneCode][targetCommName]
        ) {
          console.log(`Zone Code: ${targetZoneCode}`);
          console.log(`  Comm Name: ${targetCommName}`);
          groupedByZone[targetZoneCode][targetCommName].map((item, index) => {
            console.log(
              `S.No: ${(item.s_no = index + 1)}, Name: ${item.zone_name}`,
              `${item.sub_parameter_weighted_average}`
            );
          });

          console.log(
            "kitty",
            groupedByZone[targetZoneCode][targetCommName].map(
              (item, index) => ({ ...item, s_no: index + 1 })
            )
          );
        } else {
          console.log("No matching items found.");
        }

        if (name === "adjudication(legacy cases)") {
          setData(
            groupedByZone[targetZoneCode][targetCommName].map(
              (item, index) => ({ ...item, s_no: index + 1 })
            )
          );
        } else {
          setData(
            response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
          );
        }

        console.log("hello12345678", response.data);
      }

      // Log the fetched data to the console
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchDatacomm(name);
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
    const exportData = data.map((user) => {
      switch (name) {
        case "registration": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters": user.totalScore,
            "Weighted Average(out of 12)": user.sub_parameter_weighted_average,
          };
        }

        case "returnFiling": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            Parameter: user.gst,
            "Return Not Filed/Total Return Pending": user.absval,
            "Percentage Not Filed": user.totalScore,
            "Way to Grade (Marks) Score out of 10": user.way_to_grade,
            "Weighted Average(out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "scrutiny/assessment": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters (%)": user.totalScore,
            "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "investigation": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters (%)": user.totalScore,
            // "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "adjudication": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters (%)": user.totalScore,
            "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "adjudication(legacy cases)": {
          return {
            SNo: user.s_no,
            Zone: user.zone_name,
            Commissionerate: user.commissionerate_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Score of Sub Parameters": user.total_score,
            "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "refunds": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            Parameter: user.gst,
            "Refunds > 60 days/Total Refund Pending": user.absval,
            "Percentage (For the Month)": user.totalScore,
            "Way to Grade (Marks) Score out of 10": user.way_to_grade,
            "Weighted Average(out of 5)": user.sub_parameter_weighted_average,
          };
        }

        case "recovery_of_arrears": {
          return {
            SNo: user.s_no,
            Zone: user.zone_name,
            Commissionerate: user.commissionerate_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "arrest and prosecution": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters (%)": user.totalScore,
            // "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "audit": {
          return {
            SNo: user.s_no,
            Zone: user.zoneName,
            Commissionerate: user.commName,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absval,
            "Score of Sub Parameters (%)": user.totalScore,
            "Weighted Average(out of 10)": user.sub_parameter_weighted_average,
          };
        }

        case "appeals": {
          return {
            SNo: user.s_no,
            Zone: user.zone_name,
            Commissionerate: user.commissionerate_name,
            "Sub Parameters": user.gst,
            "Absolute Number": user.absolutevale,
            "Score of Sub Parameters (%)": user.total_score,
            "Weighted Average(out of 12)": user.sub_parameter_weighted_average,
          };
        }

        default:
          return {
            SNo: user.s_no,
            "Zone Name": user.zoneName,
            "Commissionerate Name": user.commName,
            "Total Score": user.totalScore,
            "Absolute Value": user.absval,
            "Commissionerate Rank": user.zonal_rank,
          };
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
    name === "adjudication(legacy cases)" ||
    name === "adjudication"
  ) {
    scopedColumns.gst = (item) => (
      <td>
        <Link
          to={`Subpara?name=${item.gst
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
      xaxisname: "Commissionerates",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext: "Total Score:$value",
    },
    data: data.map((item, index) => ({
      label: `${item.commName}<br>(${item.gst})`,
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
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="body flex-grow-1 custom-sec">
            <div className="row">
              <div className="msg-box">
                <div className="lft-box">
                  <h2>Commissionerate Score Details</h2>
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
                    checked={selected === "Zones"}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Commissionerate"
                    checked={selected === "Commissionerate"}
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
              </div>
            </div>

            {/* {name === "scrutiny/assessment" ? (
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
      )}
    </>
  );
};

export default Commscoredetails;
