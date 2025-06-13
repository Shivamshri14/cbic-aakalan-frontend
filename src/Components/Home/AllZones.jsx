import React, { useState, useEffect } from "react";
//import ReactApexChart from "react-apexcharts";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import queryString from "query-string";
import apiClient from "../../Service/ApiClient";
import FusionCharts from "fusioncharts";
import { default as charts } from "fusioncharts/fusioncharts.charts";
import ZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";
import ReactFusioncharts from "react-fusioncharts";

const AllZones = ({
  selectedDate,
  onChangeDate,
  selectedOption,
  onSelectedOption,
}) => {
  const [toggle, setToggle] = useState(true);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const handleBack = () => {
    navigate(-1);
  };

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };
  const handleClick = (event) => {
    setToggle(!toggle);
    onSelectedOption(event.target.value);
    console.log(event.target.value);
  };
  const location = useLocation();

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  //cgst
  const [data, setData] = useState([]);
  const [data_registration, setData_registration] = useState([]);
  const [data1, setData1] = useState([]); //return filing
  const [data_scrutiny_assessment, setData_scrutiny_assessment] = useState([]);
  const [data_investigation, setData_investigation] = useState([]);
  const [data_gst_adjudication, setData_gst_adjudication] = useState([]);
  const [data_adjudication_legacy_cases, setData_adjudication_legacy_cases] = useState([]);
  const [data_gst_refund, setData_gst_refund] = useState([]);
  const [data_recovery_of_arrears, setData_recovery_of_arrears] = useState([]);
  const [data_arrest_prosecution, setData_arrest_prosecution] = useState([]);
  const [data_audit, setData_audit] = useState([]);
  const [data_appeals, setData_appeals] = useState([]);

  //customs
  const [datascustom, setDatascustom] = useState([]);
  const [dataepcg, setDataepcg] = useState([]);
  const [dataaa, setDataaa] = useState([]);
  const [dataDisposal_Pendency, setDataDisposal_Pendency] = useState([]);
  const [Data_AdjudicationData, setDataAdjudicationData] = useState([]);
  const [data_cus_investigation, setDatacusinvestigation] = useState([]);
  const [data_cus_arrest_and_prosecution, setDatacusarrest_and_prosecution] = useState([]);
  const [data_cus_timelyrefunds, setDatacustimelyrefunds] = useState([]);
  const [data_cus_unclaimed_cargo, setDatacusunclaimed_cargo] = useState([]);
  const [data_cus_DisposalOfConfiscatedGoldAndNDPS, setDatacus_DisposalOfConfiscatedGoldAndNDPS] = useState([]);
  const [data_cus_recovery_of_arrears, setDatacus_recovery_of_arrears] = useState([]);
  const [data_cus_management_of_warehousing_bonds, setDatacus_management_of_warehousing_bonds] = useState([]);
  const [data_cus_CommissionerAppeals, setDatacus_CommissionerAppeals] = useState([]);
  const [data_cus_audit, setDatacus_audit] = useState([]);

  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;

  const fetchData = async () => {
    try {
      // Define the endpoints for each dataset
      const endpoints_registration = ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"];
      const endpoints_scrutiny_assessment = ["gst3a", "gst3b"];
      const endpoints_investigation = ["gst4a", "gst4b", "gst4c", "gst4d"];
      const endpoints_gst_adjudication = ["gst5a", "gst5b"];
      const endpoints_adjudication_legacy_cases = ["gst6a", "gst6b", "gst6c", "gst6d"];
      const endpoints_refunds = ["gst7"];
      const endpoints_recovery_of_arrears = ["gst8a", "gst8b"];
      const endpoints_arrest_prosecution = ["gst9a", "gst9b"];
      const endpoints_audit = ["gst10a", "gst10b", "gst10c"]; // New audit endpoints
      const endpoints_appeals = ["gst11a", "gst11b", "gst11c", "gst11d"]; // New appeals endpoints
      const endpoints_return_filing = ["gst2"]; // New return filing endpoint

      // Fetch the data from the endpoints
      const responses_registration = await Promise.all(
        endpoints_registration.map((endpoint) =>
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
      console.log("Responses registration", responses_registration);

      const responses_scrutiny_assessment = await Promise.all(
        endpoints_scrutiny_assessment.map((endpoint) =>
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
      console.log("Responses scrutiny_assessment", responses_scrutiny_assessment);

      const responses_investigation = await Promise.all(
        endpoints_investigation.map((endpoint) =>
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
      console.log("Responses investigation", responses_investigation);

      const responses_gst_adjudication = await Promise.all(
        endpoints_gst_adjudication.map((endpoint) =>
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
      console.log("Responses gst_adjudication", responses_gst_adjudication);

      const responses_adjudication_legacy_cases = await Promise.all(
        endpoints_adjudication_legacy_cases.map((endpoint) =>
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
      console.log("Responses adjudication_legacy_cases", responses_adjudication_legacy_cases);

      const responses_refunds = await Promise.all(
        endpoints_refunds.map((endpoint) =>
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
      console.log("Responses refunds", responses_refunds);

      // Fetch recovery of arrears data
      const responses_recovery_of_arrears = await Promise.all(
        endpoints_recovery_of_arrears.map((endpoint) =>
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
      console.log("responses_recovery_of_arrears", responses_recovery_of_arrears);

      // Fetch arrest prosecution data
      const response_arrest_prosecution = await Promise.all(
        endpoints_arrest_prosecution.map((endpoint) =>
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
      console.log("response_arrest_prosecution", response_arrest_prosecution);

      // Fetch audit data
      const responses_audit = await Promise.all(
        endpoints_audit.map((endpoint) =>
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
      console.log("responses_audit", responses_audit);

      // Fetch appeals data
      const responses_appeals = await Promise.all(
        endpoints_appeals.map((endpoint) =>
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
      console.log("responses_appeals", responses_appeals);

      // Fetch return filing data
      const responses_return_filing = await Promise.all(
        endpoints_return_filing.map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: { month_date: newdate, type: "zone" },
            })
            .then((response) => {
              const data = response.data;

              // Assuming data is an array of objects, and you want to map "sub_parameter_weighted_average" to "weighted_average_out_of_5_return_filing"
              data.forEach((item) => {
                item.weighted_average_out_of_5_return_filing = parseFloat(item.sub_parameter_weighted_average); // Default to 0 if "sub_parameter_weighted_average" is missing or null
              });

              return {
                data,
                gst: endpoint.toUpperCase(),
              };
            })
        )
      );
      console.log("responses_return_filing", responses_return_filing);

      console.log("Responses from all endpoints:",
        responses_registration,
        responses_scrutiny_assessment,
        responses_investigation,
        responses_gst_adjudication,
        responses_adjudication_legacy_cases,
        responses_refunds,
        responses_recovery_of_arrears,
        response_arrest_prosecution,
        responses_audit,
        responses_appeals,
        responses_return_filing // New log for return filing
      );

      // Helper function to merge data by zone, ensuring no duplicates and summing the weighted averages
      const mergeDataByZone = (registration_Data, scrutiny_assessmentData, investigation_Data, gst_adjudication_Data, gst_adjudication_legacy_cases_Data, refund_Data, recovery_of_arrears_Data, arrest_prosecution_Data, audit_Data, appeals_Data, return_filing_Data) => {
        const combinedMap = new Map();

        // Merge all data categories
        const mergeData = (data, zoneCodeField, zoneNameField, keyPrefix) => {
          data.forEach((item) => {
            const zoneCode = item[zoneCodeField];
            if (!combinedMap.has(zoneCode)) {
              combinedMap.set(zoneCode, {
                zone_code: zoneCode,
                zone_name: item[zoneNameField],
                weighted_average_out_of_12_registration: 0,
                sub_parameter_weighted_average_scrutiny_assessment: 0,
                sub_parameter_weighted_average_investigation: 0,
                sub_parameter_weighted_average_Adjudication: 0,
                sub_parameter_weighted_average_adjudication_legacy_cases: 0,
                weighted_average_out_of_5_refunds: 0,
                weighted_average_out_of_8_recovery_of_arrears: 0,
                weighted_average_out_of_6_arrest_prosecution: 0, // Added for arrest prosecution
                weighted_average_out_of_12_audit: 0, // Added for audit
                weighted_average_out_of_12_appeals: 0, // Added for appeals
                weighted_average_out_of_5_return_filing: 0, // Added for return filing
              });
            }
            const current = combinedMap.get(zoneCode);
            current[keyPrefix] += parseFloat(item.sub_parameter_weighted_average || 0);
          });
        };

        // Merge each dataset
        mergeData(registration_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_12_registration');
        mergeData(scrutiny_assessmentData, 'zone_code', 'zone_name', 'sub_parameter_weighted_average_scrutiny_assessment');
        mergeData(investigation_Data, 'zone_code', 'zone_name', 'sub_parameter_weighted_average_investigation');
        mergeData(gst_adjudication_Data, 'zone_code', 'zone_name', 'sub_parameter_weighted_average_Adjudication');
        mergeData(gst_adjudication_legacy_cases_Data, 'zone_code', 'zone_name', 'sub_parameter_weighted_average_adjudication_legacy_cases');
        mergeData(refund_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_5_refunds');
        mergeData(recovery_of_arrears_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_8_recovery_of_arrears');
        mergeData(arrest_prosecution_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_6_arrest_prosecution'); // Merging arrest prosecution data
        mergeData(audit_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_12_audit'); // Merging audit data
        mergeData(appeals_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_12_appeals'); // Merging appeals data
        mergeData(return_filing_Data, 'zone_code', 'zone_name', 'weighted_average_out_of_5_return_filing'); // Merging return filing data

        // Convert the Map to an array for sorting
        return Array.from(combinedMap.values());
      };
      const registration_Data = responses_registration.flatMap((response) => response.data.map((item) => ({ ...item })));
      const scrutiny_assessmentData = responses_scrutiny_assessment.flatMap((response) => response.data.map((item) => ({ ...item })));
      const investigation_Data = responses_investigation.flatMap((response) => response.data.map((item) => ({ ...item })));
      const gst_adjudication_Data = responses_gst_adjudication.flatMap((response) => response.data.map((item) => ({ ...item })));
      const gst_adjudication_legacy_cases_Data = responses_adjudication_legacy_cases.flatMap((response) => response.data.map((item) => ({ ...item })));
      const refund_Data = responses_refunds.flatMap((response) => response.data.map((item) => ({ ...item })));
      const recovery_of_arrears_Data = responses_recovery_of_arrears.flatMap((response) => response.data.map((item) => ({ ...item })));
      const arrest_prosecution_Data = response_arrest_prosecution.flatMap((response) => response.data.map((item) => ({ ...item }))); // Handling arrest prosecution data
      const audit_Data = responses_audit.flatMap((response) => response.data.map((item) => ({ ...item }))); // Handling audit data
      const appeals_Data = responses_appeals.flatMap((response) => response.data.map((item) => ({ ...item }))); // Handling appeals data
      const return_filing_Data = responses_return_filing.flatMap((response) => response.data.map((item) => ({ ...item }))); // Handling return filing data

      // Combine and merge data
      const mergedData = mergeDataByZone(
        registration_Data,
        scrutiny_assessmentData,
        investigation_Data,
        gst_adjudication_Data,
        gst_adjudication_legacy_cases_Data,
        refund_Data,
        recovery_of_arrears_Data,
        arrest_prosecution_Data,
        audit_Data,
        appeals_Data,
        return_filing_Data
      );

      // Filter out specific zones
      const filteredData = mergedData.filter((item) =>
        !["DG NORTH", "DG WEST", "DG EAST", "DG SOUTH", "DG (HQ)"].includes(item.zone_name)
      );

      // Final data mapping and adding totals
      const finalData = filteredData.map((item) => {
        item.weighted_average_out_of_12_registration = parseFloat((item.weighted_average_out_of_12_registration * 12) / 10).toFixed(2);
        item.sub_parameter_weighted_average_scrutiny_assessment = parseFloat(item.sub_parameter_weighted_average_scrutiny_assessment).toFixed(2);
        item.sub_parameter_weighted_average_investigation = parseFloat(item.sub_parameter_weighted_average_investigation).toFixed(2);
        item.sub_parameter_weighted_average_Adjudication = parseFloat(item.sub_parameter_weighted_average_Adjudication).toFixed(2);
        item.sub_parameter_weighted_average_adjudication_legacy_cases = parseFloat(item.sub_parameter_weighted_average_adjudication_legacy_cases).toFixed(2);
        item.weighted_average_out_of_5_refunds = parseFloat((item.weighted_average_out_of_5_refunds * 5) / 10).toFixed(2);
        item.weighted_average_out_of_8_recovery_of_arrears = parseFloat((item.weighted_average_out_of_8_recovery_of_arrears * 8) / 10).toFixed(2);
        item.weighted_average_out_of_6_arrest_prosecution = parseFloat((item.weighted_average_out_of_6_arrest_prosecution * 6) / 10).toFixed(2);
        item.weighted_average_out_of_12_audit = parseFloat((item.weighted_average_out_of_12_audit * 12) / 10).toFixed(2);
        item.weighted_average_out_of_12_appeals = parseFloat((item.weighted_average_out_of_12_appeals * 12) / 10).toFixed(2);
        item.weighted_average_out_of_5_return_filing = parseFloat((item.weighted_average_out_of_5_return_filing * 5) / 10).toFixed(2); // For return filing

        // Calculate the total weighted average by adding all weighted averages
        const total_weighted_average =
          parseFloat(item.weighted_average_out_of_12_registration) +
          parseFloat(item.sub_parameter_weighted_average_scrutiny_assessment) +
          parseFloat(item.sub_parameter_weighted_average_investigation) +
          parseFloat(item.sub_parameter_weighted_average_Adjudication) +
          parseFloat(item.sub_parameter_weighted_average_adjudication_legacy_cases) +
          parseFloat(item.weighted_average_out_of_5_refunds) +
          parseFloat(item.weighted_average_out_of_8_recovery_of_arrears) +
          parseFloat(item.weighted_average_out_of_6_arrest_prosecution) +
          parseFloat(item.weighted_average_out_of_12_audit) +
          parseFloat(item.weighted_average_out_of_12_appeals) +
          parseFloat(item.weighted_average_out_of_5_return_filing); // Include return filing in the total

        // Add the total weighted average to the item
        item.total_weighted_average = total_weighted_average;


        return item;
      });

      // Sort the zones by total weighted average in descending order
      const sortedFinalData = finalData.sort(
        (a, b) => b.total_weighted_average - a.total_weighted_average
      );

      console.log("Final Sorted Data total_weighted_average custom", sortedFinalData);

      // Set the state for each zone

      setData(
        sortedFinalData.map((item, index) => ({ ...item, s_no: index + 1 }))
      );
      setData_registration(
        sortedFinalData.filter((item) => item.weighted_average_out_of_12_registration > 0)
      );
      setData_scrutiny_assessment(
        sortedFinalData.filter((item) => item.sub_parameter_weighted_average_scrutiny_assessment > 0)
      );
      setData_investigation(
        sortedFinalData.filter((item) => item.sub_parameter_weighted_average_investigation > 0)
      );
      setData_gst_adjudication(
        sortedFinalData.filter((item) => item.sub_parameter_weighted_average_Adjudication > 0)
      );
      setData_adjudication_legacy_cases(
        sortedFinalData.filter((item) => item.sub_parameter_weighted_average_adjudication_legacy_cases > 0)
      );
      setData_gst_refund(
        sortedFinalData.filter((item) => item.weighted_average_out_of_5_refunds > 0)
      );
      setData_recovery_of_arrears(
        sortedFinalData.filter((item) => item.weighted_average_out_of_8_recovery_of_arrears > 0)
      );
      setData_arrest_prosecution(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_arrest_prosecution > 0)
      );
      setData_audit(
        sortedFinalData.filter((item) => item.weighted_average_out_of_12_audit > 0)
      );
      setData_appeals(
        sortedFinalData.filter((item) => item.weighted_average_out_of_12_appeals > 0)
      );
      setData1(
        sortedFinalData.filter((item) => item.weighted_average_out_of_5_return_filing > 0)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataCom = async () => {
    try {
      // Define the endpoints for each dataset
      const endpoints_Disposal_Pendency = ["cus4a", "cus4b", "cus4c", "cus4d"];
      const endpoints_epcg = ["cus2a", "cus2b", "cus2c"];
      const endpoints_aa = ["cus3a", "cus3b", "cus3c"];
      const endpoints_Adjudication = ["cus5a", "cus5b", "cus5c"];
      const endpoints_cus_investigation = ["cus6a", "cus6b", "cus6c", "cus6d", "cus6e", "cus6f"];
      const endpoints_cus_arrest_and_prosecution = ["cus7a", "cus7b"];
      const endpoints_cus_timelyrefunds = ["cus1"];
      const endpoints_cus_unclaimed_cargo = ["cus8a", "cus8b"];
      const endpoints_cus_DisposalOfConfiscatedGoldAndNDPS = ["cus9a", "cus9b"];
      const endpoints_cus_recovery_of_arrears = ["cus10a", "cus10b"];
      const endpoints_cus_management_of_warehousing_bonds = ["cus11a", "cus11b"];
      const endpoints_cus_CommissionerAppeals = ["cus12a", "cus12b"];
      const endpoints_cus_audit = ["cus13a", "cus13b", "cus13c", "cus13d", "cus13e"];


      // Fetch the data from the endpoints
      const responses_Disposal_Pendency = await Promise.all(
        endpoints_Disposal_Pendency.map((endpoint) =>
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

      const responses_epcg = await Promise.all(
        endpoints_epcg.map((endpoint) =>
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

      const responses_aa = await Promise.all(
        endpoints_aa.map((endpoint) =>
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

      const responses_Adjudication = await Promise.all(
        endpoints_Adjudication.map((endpoint) =>
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

      const responses_cus_investigation = await Promise.all(
        endpoints_cus_investigation.map((endpoint) =>
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

      const responses_cus_arrest_and_prosecution = await Promise.all(
        endpoints_cus_arrest_and_prosecution.map((endpoint) =>
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

      const responses_cus_timelyrefunds = await Promise.all(
        endpoints_cus_timelyrefunds.map((endpoint) =>
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

      const responses_cus_unclaimed_cargo = await Promise.all(
        endpoints_cus_unclaimed_cargo.map((endpoint) =>
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

      const responses_cus_DisposalOfConfiscatedGoldAndNDPS = await Promise.all(
        endpoints_cus_DisposalOfConfiscatedGoldAndNDPS.map((endpoint) =>
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

      const responses_cus_recovery_of_arrears = await Promise.all(
        endpoints_cus_recovery_of_arrears.map((endpoint) =>
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

      const responses_cus_management_of_warehousing_bonds = await Promise.all(
        endpoints_cus_management_of_warehousing_bonds.map((endpoint) =>
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

      const responses_cus_CommissionerAppeals = await Promise.all(
        endpoints_cus_CommissionerAppeals.map((endpoint) =>
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

      const responses_cus_audit = await Promise.all(
        endpoints_cus_audit.map((endpoint) =>
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

      console.log("Responses from all endpoints:", responses_Disposal_Pendency, responses_epcg, responses_aa, responses_Adjudication, responses_cus_investigation, responses_cus_arrest_and_prosecution, responses_cus_timelyrefunds, responses_cus_unclaimed_cargo, responses_cus_DisposalOfConfiscatedGoldAndNDPS, responses_cus_recovery_of_arrears, responses_cus_management_of_warehousing_bonds, responses_cus_audit);

      // Helper function to merge data by zone, ensuring no duplicates and summing the weighted averages
      const mergeDataByZone = (disposalData, epcgData, aaData, AdjudicationData, Investiation_cus_Data, arrest_and_prosecution_cus_Data, timelyrefunds_cus_Data, unclaimed_cargo_cus_Data, DisposalOfConfiscatedGoldAndNDPS_cus_Data, recovery_of_arrears_cus_Data, management_of_warehousing_bonds_cus_Data, audit_cus_Data, CommissionerAppeals_cus_Data) => {
        const combinedMap = new Map();

        // Merge Disposal/Pendency data
        disposalData.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from Disposal/Pendency
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          combinedMap.get(zoneCode).weighted_average_out_of_11 += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        // Merge EPCG data
        epcgData.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from EPCG if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the weighted average of EPCG to the combined map
          current.weighted_average_out_of_7_epcg += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        // Merge "aa" data
        aaData.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from "aa" if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the weighted average of "aa" to the combined map
          current.weighted_average_out_of_7_aa += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        // Merge AdjudicationData data
        AdjudicationData.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.sub_parameter_weighted_average_AdjudicationData += parseFloat(item.sub_parameter_weighted_average || 0);
        });


        Investiation_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_12_investigation += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        arrest_and_prosecution_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_6_cus_arrest_prosecution += parseFloat(item.sub_parameter_weighted_average || 0);
        });


        timelyrefunds_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_5_cus_timelyrefunds += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        unclaimed_cargo_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_6_cus_unclaimed_cargo += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        DisposalOfConfiscatedGoldAndNDPS_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        recovery_of_arrears_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_6_cus_recovery_of_arrears += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        management_of_warehousing_bonds_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,

            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_6_cus_management_of_warehousing_bonds += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        CommissionerAppeals_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_8_cus_CommissionerAppeals += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        audit_cus_Data.forEach((item) => {
          const zoneCode = item.zone_code;
          if (!combinedMap.has(zoneCode)) {
            combinedMap.set(zoneCode, {
              zone_code: zoneCode,
              zone_name: item.zone_name,  // Store zone_name from AdjudicationData if not already set
              weighted_average_out_of_11: 0,
              weighted_average_out_of_7_epcg: 0,
              weighted_average_out_of_7_aa: 0,
              sub_parameter_weighted_average_AdjudicationData: 0,
              weighted_average_out_of_12_investigation: 0,
              weighted_average_out_of_6_cus_arrest_prosecution: 0,
              weighted_average_out_of_5_cus_timelyrefunds: 0,
              weighted_average_out_of_6_cus_unclaimed_cargo: 0,
              weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
              weighted_average_out_of_6_cus_recovery_of_arrears: 0,
              weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
              weighted_average_out_of_8_cus_CommissionerAppeals: 0,
              weighted_average_out_of_12_cus_audit: 0,
            });
          }
          // Ensure zone_name is not overwritten; it should retain the first encountered name
          const current = combinedMap.get(zoneCode);
          current.zone_name = current.zone_name || item.zone_name;

          // Add the investigation data directly without summing or modifying
          current.weighted_average_out_of_12_cus_audit += parseFloat(item.sub_parameter_weighted_average || 0);
        });

        // Convert the Map to an array for sorting
        return Array.from(combinedMap.values());
      };

      const Data_Disposal_Pendency = responses_Disposal_Pendency.flatMap((response) => response.data.map((item) => ({ ...item })));
      const Data_epcg = responses_epcg.flatMap((response) => response.data.map((item) => ({ ...item })));
      const Data_aa = responses_aa.flatMap((response) => response.data.map((item) => ({ ...item })));
      const Data_Adjudication = responses_Adjudication.flatMap((response) => response.data.map((item) => ({ ...item })));
      const Investiation_cus_Data = responses_cus_investigation.flatMap((response) => response.data.map((item) => ({ ...item })));
      const arrest_and_prosecution_cus_Data = responses_cus_arrest_and_prosecution.flatMap((response) => response.data.map((item) => ({ ...item })));
      const timelyrefunds_cus_Data = responses_cus_timelyrefunds.flatMap((response) => response.data.map((item) => ({ ...item })));
      const unclaimed_cargo_cus_Data = responses_cus_unclaimed_cargo.flatMap((response) => response.data.map((item) => ({ ...item })));
      const DisposalOfConfiscatedGoldAndNDPS_cus_Data = responses_cus_DisposalOfConfiscatedGoldAndNDPS.flatMap((response) => response.data.map((item) => ({ ...item })));
      const recovery_of_arrears_cus_Data = responses_cus_recovery_of_arrears.flatMap((response) => response.data.map((item) => ({ ...item })));
      const management_of_warehousing_bonds_cus_Data = responses_cus_management_of_warehousing_bonds.flatMap((response) => response.data.map((item) => ({ ...item })));
      const CommissionerAppeals_cus_Data = responses_cus_CommissionerAppeals.flatMap((response) => response.data.map((item) => ({ ...item })));
      const audit_cus_Data = responses_cus_audit.flatMap((response) => response.data.map((item) => ({ ...item })));

      // Combine and merge data
      const mergedData = mergeDataByZone(Data_Disposal_Pendency, Data_epcg, Data_aa, Data_Adjudication, Investiation_cus_Data, arrest_and_prosecution_cus_Data, timelyrefunds_cus_Data, unclaimed_cargo_cus_Data, DisposalOfConfiscatedGoldAndNDPS_cus_Data, recovery_of_arrears_cus_Data, management_of_warehousing_bonds_cus_Data, audit_cus_Data, CommissionerAppeals_cus_Data);

      const filteredData = mergedData.filter((item) =>
        !["DG NORTH", "DG WEST", "DG EAST", "DG SOUTH", "DG (HQ)", "DRI DG"].includes(item.zone_name)
      );

      // Final data mapping and adding totals
      const finalData = filteredData.map((item) => {
        // Format the fields
        item.weighted_average_out_of_11 = ((item.weighted_average_out_of_11 * 11) / 10).toFixed(2);
        item.weighted_average_out_of_7_epcg = ((item.weighted_average_out_of_7_epcg * 7) / 10).toFixed(2);
        item.weighted_average_out_of_7_aa = ((item.weighted_average_out_of_7_aa * 7) / 10).toFixed(2);
        item.sub_parameter_weighted_average_AdjudicationData = parseFloat(item.sub_parameter_weighted_average_AdjudicationData).toFixed(2);
        item.weighted_average_out_of_12_investigation = ((item.weighted_average_out_of_12_investigation * 12) / 10).toFixed(2);
        item.weighted_average_out_of_6_cus_arrest_prosecution = ((item.weighted_average_out_of_6_cus_arrest_prosecution * 6) / 10).toFixed(2);
        item.weighted_average_out_of_5_cus_timelyrefunds = ((item.weighted_average_out_of_5_cus_timelyrefunds)).toFixed(2);
        item.weighted_average_out_of_6_cus_unclaimed_cargo = ((item.weighted_average_out_of_6_cus_unclaimed_cargo * 6) / 10).toFixed(2);
        item.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS = ((item.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS * 4) / 10).toFixed(2);
        item.weighted_average_out_of_6_cus_recovery_of_arrears = ((item.weighted_average_out_of_6_cus_recovery_of_arrears * 6) / 10).toFixed(2);
        item.weighted_average_out_of_6_cus_management_of_warehousing_bonds = ((item.weighted_average_out_of_6_cus_management_of_warehousing_bonds * 6) / 10).toFixed(2);
        item.weighted_average_out_of_8_cus_CommissionerAppeals = ((item.weighted_average_out_of_8_cus_CommissionerAppeals * 8) / 10).toFixed(2);
        item.weighted_average_out_of_12_cus_audit = ((item.weighted_average_out_of_12_cus_audit * 12) / 10).toFixed(2);

        // Calculate the total weighted average by adding all weighted averages
        const total_weighted_average =
          parseFloat(item.weighted_average_out_of_11) +
          parseFloat(item.weighted_average_out_of_7_epcg) +
          parseFloat(item.weighted_average_out_of_7_aa) +
          parseFloat(item.sub_parameter_weighted_average_AdjudicationData) +
          parseFloat(item.weighted_average_out_of_12_investigation) +
          parseFloat(item.weighted_average_out_of_6_cus_arrest_prosecution) +
          parseFloat(item.weighted_average_out_of_5_cus_timelyrefunds) +
          parseFloat(item.weighted_average_out_of_6_cus_unclaimed_cargo) +
          parseFloat(item.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS) +
          parseFloat(item.weighted_average_out_of_6_cus_recovery_of_arrears) +
          parseFloat(item.weighted_average_out_of_6_cus_management_of_warehousing_bonds) +
          parseFloat(item.weighted_average_out_of_8_cus_CommissionerAppeals) +
          parseFloat(item.weighted_average_out_of_12_cus_audit);

        // Add the total weighted average to the item
        item.total_weighted_average = total_weighted_average;

        return item;
      });

      // Sort the zones by total weighted average in descending order
      const sortedFinalData = finalData.sort(
        (a, b) => b.total_weighted_average - a.total_weighted_average
      );

      console.log("Final Sorted Data total_weighted_average custom", sortedFinalData);

      // Set the state for each zone (Disposal/Pendency + EPCG + aa + Investigation)
      setDatascustom(
        sortedFinalData.map((item, index) => ({ ...item, s_no: index + 1 }))
      );
      setDataDisposal_Pendency(
        sortedFinalData.filter((item) => item.weighted_average_out_of_11 > 0) // Filter only zones from Disposal/Pendency
      );
      setDataepcg(
        sortedFinalData.filter((item) => item.weighted_average_out_of_7_epcg > 0) // Filter only zones from EPCG
      );
      setDataaa(
        sortedFinalData.filter((item) => item.weighted_average_out_of_7_aa > 0) // Filter only zones from AA
      );
      setDataAdjudicationData(
        sortedFinalData.filter((item) => item.sub_parameter_weighted_average_AdjudicationData > 0) // Filter only zones from Investigation
      );
      setDatacusinvestigation(
        sortedFinalData.filter((item) => item.weighted_average_out_of_12_investigation > 0) // Filter only zones from AA
      );
      setDatacusarrest_and_prosecution(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_cus_arrest_prosecution > 0) // Filter only zones from AA
      );
      setDatacustimelyrefunds(
        sortedFinalData.filter((item) => item.weighted_average_out_of_5_cus_timelyrefunds > 0) // Filter only zones from AA
      );
      setDatacusunclaimed_cargo(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_cus_unclaimed_cargo > 0) // Filter only zones from AA
      );
      setDatacus_DisposalOfConfiscatedGoldAndNDPS(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS > 0) // Filter only zones from AA
      );
      setDatacus_recovery_of_arrears(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_cus_recovery_of_arrears > 0) // Filter only zones from AA
      );
      setDatacus_management_of_warehousing_bonds(
        sortedFinalData.filter((item) => item.weighted_average_out_of_6_cus_management_of_warehousing_bonds > 0) // Filter only zones from AA
      );
      setDatacus_CommissionerAppeals(
        sortedFinalData.filter((item) => item.weighted_average_out_of_8_cus_CommissionerAppeals > 0) // Filter only zones from AA
      );
      setDatacus_audit(
        sortedFinalData.filter((item) => item.weighted_average_out_of_12_cus_audit > 0) // Filter only zones from AA
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataCom();
  }, [newdate]);

  const chartData = {
    series: [
      {
        name: "Registration",
        data: [5, 8, 8, 10, 9],
        color: "#4472c4",
      },
      {
        name: "Return Filing",
        data: [10, 12, 11, 8, 4],
        color: "#ed7d31",
      },
      {
        name: "Scrutiny/Assessment",
        data: [13, 13, 10, 5, 12],
        color: "#A5A5A5",
      },
      {
        name: "Investigation",
        data: [8, 11, 6, 9, 3],
        color: "#FFBF00",
      },
      {
        name: "Adjudication",
        data: [6, 8, 5, 10, 11],
        color: "#5B9BD5",
      },
      {
        name: "adjudication(legacy cases)",
        data: [15, 2, 14, 11, 12],
        color: "#6EAC44",
      },
      {
        name: "Refunds",
        data: [4, 4, 3, 6, 0],
        color: "#264478",
      },
      {
        name: "Recovery of Arrears",
        data: [9, 9, 8, 9, 3],
        color: "#9E480E",
      },
      {
        name: "Arrest & Prosecution",
        data: [7, 7, 5, 4, 7],
        color: "#636363",
      },
      {
        name: "Audit",
        data: [2, 2, 3, 2, 8],
        color: "#946C00",
      },
      {
        name: "Appeals",
        data: [12, 6, 9, 7, 11],
        color: "#5D87AD",
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 200,
        stacked: true,
        toolbar: {
          show: false,
        },
        events: {
          //   dataPointSelection: function (event, chartContext, config) {
          //     const categoryIndex = config.dataPointIndex;
          //     console.log(categoryIndex);

          //     const clickedDay =
          //       chartData.options.xaxis.categories[categoryIndex];
          //     console.log(clickedDay);

          //     switch (clickedDay) {
          //       case "Kolkata":
          //         window.location.href = "/kolkata";
          //         break;
          //       default:
          //         break;
          //     }
          //   },
          mounted: function (chartContext, config) {
            setTimeout(() => {
              const labels = document.querySelectorAll(
                "#chart1 .apexcharts-xaxis-texts-g text"
              );
              labels.forEach((label, index) => {
                label.style.cursor = "pointer";
                label.addEventListener("click", () => {
                  const clickedLabel =
                    chartData.options.xaxis.categories[index];
                  console.log(`Clicked on label: ${clickedLabel}`);
                  switch (clickedLabel) {
                    case "Kolkata":
                      window.location.href = "/kolkata";
                      break;
                    // case "Ahmedabad":
                    //   window.location.href = "/ahmedabad";
                    //   break;
                    // case "Jaipur":
                    //   window.location.href = "/jaipur";
                    //   break;
                    // case "Bengaluru":
                    //   window.location.href = "/bengaluru";
                    //   break;
                    // case "Nagpur":
                    //   window.location.href = "/nagpur";
                    //   break;
                    default:
                      break;
                  }
                });
              });
            }, 0);
          },
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              // formatter: function (val) {
              //   return val + "%";
              // },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "text",
        categories: ["Kolkata", "Ahmedabad", "Jaipur", "Bengaluru", "Nagpur"],
        tickAmount: 5,
        tickPlacement: "between",
        hideOverlappingLabels: true,
        crosshairs: {
          show: true,
          width: "tickWidth",
          position: "front",
          opacity: 1,
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 10,
      },
      legend: {
        position: "bottom",
        onItemClick: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: true,
        intersect: true,
        x: {
          show: false,
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: 74.75,
            y2: 76,
            fillColor: "#ff0000",
            yAxisIndex: 0,
            opacity: 1,
            label: {
              borderWidth: 0,
              offsetX: 0,
              offsetY: -12,
              text: "74.75", // Label for the average line
              style: {
                color: "#ff0000",
                offsetX: 0,
                offsetY: -3,
                position: "right",
                fontWeight: 1000,
              },
            },
          },
        ],
      },
    },
  };
  const customtopfive = {
    series: [
      {
        name: "Refunds",
        data: [4, 12, 9, 12, 2],
        color: "#4B77C6",
      },
      {
        name: "EPCG",
        data: [7, 13, 4, 2, 5],
        color: "#ED7A2D",
      },
      {
        name: "Advanced",
        data: [9, 8, 12, 8, 8],
        color: "#9F9F9F",
      },
      {
        name: "Provisional Assessment",
        data: [10, 5, 3, 5, 13],
        color: "#FFC30A",
      },
      {
        name: "Adjudication",
        data: [6, 2, 11, 6, 10],
        color: "#70A8DA",
      },
      {
        name: "Investigation",
        data: [10, 6, 12, 11, 6],
        color: "#6AAA3F",
      },
      {
        name: "Arrest & Prosecution",
        data: [7, 9, 0, 9, 9],
        color: "#1D3C72",
      },
      {
        name: "Unclaimed and Unclear",
        data: [5, 4, 3, 4, 4],
        color: "#9A4004",
      },
      {
        name: "Confiscated Gold",
        data: [6, 2, 7, 3, 2],
        color: "#585858",
      },
      {
        name: "Recovery of Arrears",
        data: [4, 8, 8, 7, 7],
        color: "#997401",
      },
      {
        name: "Warehousing Bound",
        data: [8, 6, 5, 6, 5],
        color: "#225B8F",
      },
      {
        name: "Appeals",
        data: [1, 1, 3, 1, 1],
        color: "#365D1C",
      },
      {
        name: "Audit",
        data: [3, 3, 1, 3, 3],
        color: "#678DD0",
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 400,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        redrawOnWindowResize: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              // formatter: function (val) {
              //   return val + "%";
              // },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "text",
        categories: [
          "Hyderabad",
          "Kochi",
          "Tiruchirappalli",
          "Patna",
          "Mumbai",
        ],
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 10,
      },
      legend: {
        position: "bottom",
        onItemClick: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        enabled: true,
        intersect: true,
        x: {
          show: false,
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      // annotations: {
      //   yaxis: [
      //     {
      //       y: 72.3, // Set the value of the average line
      //       borderColor: "#000", // Color of the average line
      //       label: {
      //         borderColor: "#00E396",
      //         style: {
      //           color: "#000",
      //         },
      //         text: "72.3", // Label for the average line
      //       },
      //       strokeWidth: 200,
      //     },
      //   ],
      // },
    },
  };
  const all = [
    {
      value: "80",
      color: "#FF0000",
      label: "Hydrabad",
      link: "/",
    },
    {
      value: "79",
      color: "#FFFF00",
      label: "Kochi",
      link: "/",
    },
    {
      value: "78",
      color: "#00FF00",
      label: "Tiruchirappalli",
      link: "/",
    },
    {
      value: "77",
      color: "#0000FF",
      label: "Patna",
      link: "/",
    },
    {
      value: "75",
      color: "#00ffff",
      label: "Mumbai",
      link: "/",
    },
    {
      label: "Kolkata",
      link: "/",
      value: 73,
      color: "#3d0c02",
    },
    {
      label: "Delhi",
      link: "/",
      value: 69,
      color: "#551a8b",
    },
    {
      label: "Chennai",
      link: "/",
      value: 68,
      color: "#40916c",
    },
    {
      label: "Bengaluru",
      link: "/",
      value: 67,
      color: "#ff8800",
    },
    {
      label: "Ahmedabad",
      link: "/",
      value: 58,
      color: "#cc0077",
    },
  ];

  const rearrangedData_registration = data.map((zone) => {
    return (
      data_registration.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_12_registration: 0,
      }
    );
  });

  const rearrangedData1 = data.map((zone) => {
    return (
      data1.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_5_return_filing: 0,
      }
    );
  });

  console.log("data_scrutiny_assessment", data_scrutiny_assessment);
  const rearrangedData_scrutiny_assessment = data.map((zone) => {
    return (
      data_scrutiny_assessment.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average_scrutiny_assessment: 0,
      }
    );
  });

  console.log("data_investigation", data_investigation);
  const rearrangedData_investigation = data.map((zone) => {
    return (
      data_investigation.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average_investigation: 0,
      }
    );
  });

  console.log("data_gst_adjudication", data_gst_adjudication);
  const rearrangedData_gst_adjudication = data.map((zone) => {
    return (
      data_gst_adjudication.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average_Adjudication: 0,
      }
    );
  });

  console.log("data_gst_adjudication legacy cases", data_adjudication_legacy_cases);
  const rearrangedData_adjudication_legacy_cases = data.map((zone) => {
    return (
      data_adjudication_legacy_cases.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average_adjudication_legacy_cases: 0,
      }
    );
  });

  console.log("data_gst_refund", data_gst_refund);
  const rearrangedData_gst_refund = data.map((zone) => {
    return (
      data_gst_refund.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_5_refunds: 0,
      }
    );
  });

  console.log("data_recovery_of_arrears", data_recovery_of_arrears);
  const rearrangedData_recovery_of_arrears = data.map((zone) => {
    return (
      data_recovery_of_arrears.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_8_recovery_of_arrears: 0,
      }
    );
  });

  console.log("data_arrest_prosecution", data_arrest_prosecution);
  const rearrangedData_arrest_prosecution = data.map((zone) => {
    return (
      data_arrest_prosecution.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_arrest_prosecution: 0,
      }
    );
  });

  console.log("data_audit", data_audit);
  const rearrangedData_audit = data.map((zone) => {
    return (
      data_audit.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_12_audit: 0,
      }
    );
  });

  const rearrangedData_appeals = data.map((zone) => {
    return (
      data_appeals.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_12_appeals: 0,
      }
    );
  });


  //CUSTOM CHART
  const rearrangedDataepcg = datascustom.map((zone) => {
    return (
      dataepcg.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_7_epcg: 0,
      }
    );
  });
  const rearrangedDataaa = datascustom.map((zone) => {
    return (
      dataaa.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_7_aa: 0,
      }
    );
  });

  const rearrangedDataDisposal_Pendency = datascustom.map((zone) => {
    return (
      dataDisposal_Pendency.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_11: 0,
      }
    );
  });

  const rearrangedDataAdjudication = datascustom.map((zone) => {
    return (
      Data_AdjudicationData.find((item) => item.zone_code === zone.zone_code) || {
        sub_parameter_weighted_average_AdjudicationData: 0,
      }
    );
  });

  const rearrangedDatacusinvestigation = datascustom.map((zone) => {
    return (
      data_cus_investigation.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_12_investigation: 0,
      }
    );
  });

  const rearrangedDatacusarrest_prosecution = datascustom.map((zone) => {
    return (
      data_cus_arrest_and_prosecution.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_cus_arrest_prosecution: 0,
      }
    );
  });

  const rearrangedDatacustimelyrefunds = datascustom.map((zone) => {
    return (
      data_cus_timelyrefunds.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_5_cus_timelyrefunds: 0,
      }
    );
  });

  const rearrangedDatacusunclaimed_cargo = datascustom.map((zone) => {
    return (
      data_cus_unclaimed_cargo.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_cus_unclaimed_cargo: 0,
      }
    );
  });

  const rearrangedDatacus_DisposalOfConfiscatedGoldAndNDPS = datascustom.map((zone) => {
    return (
      data_cus_DisposalOfConfiscatedGoldAndNDPS.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS: 0,
      }
    );
  });

  const rearrangedDatacus_recovery_of_arrears = datascustom.map((zone) => {
    return (
      data_cus_recovery_of_arrears.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_cus_recovery_of_arrears: 0,
      }
    );
  });

  const rearrangedDatacus_management_of_warehousing_bonds = datascustom.map((zone) => {
    return (
      data_cus_management_of_warehousing_bonds.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_6_cus_management_of_warehousing_bonds: 0,
      }
    );
  });

  const rearrangedDatacus_CommissionerAppeals = datascustom.map((zone) => {
    return (
      data_cus_CommissionerAppeals.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_8_cus_CommissionerAppeals: 0,
      }
    );
  });

  const rearrangedDatacus_cus_audit = datascustom.map((zone) => {
    return (
      data_cus_audit.find((item) => item.zone_code === zone.zone_code) || {
        weighted_average_out_of_12_cus_audit: 0,
      }
    );
  });

  // const getBarColor = (index) => {
  //   const total = data.length;
  //   const firstQuarter = total * 0.25;
  //   const secondQuarter = total * 0.5;
  //   const thirdQuarter = total * 0.75;

  //   return index < firstQuarter
  //     ? "#00FF00"
  //     : index < secondQuarter
  //       ? "#FFFF00"
  //       : index < thirdQuarter
  //         ? "#0000FF"
  //         : "#FF0000";
  // };

  const getBarColor = (item) => {
    const score = item.total_weighted_average;

    if (score >= 75 && score <= 100) {
      return "#00FF00"; // Green for high scores
    } else if (score >= 50 && score < 75) {
      return "#FFFF00"; // Yellow for medium scores
    } else if (score >= 0 && score <= 25) {
      return "#FF0000"; // Red for low scores
    } else {
      return "#0000FF"; // Blue for mid-low scores (default)
    }
  };

  const averageReturnFiling = 74.75;

  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const colorstop = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00ffff",
    "#cc0077",
    "#ff8800",
    "#40916c",
    "#551a8b",
    "#3d0c02",
  ];

  const dataSource = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "CGST",
      subcaption: "All Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "All Zones (CGST)",
      yAxisName: "Total Score (Zone Wise)",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend: "0",
      plottooltext:
        "<b>Zone Name-: $label</b>{br} Weighted Average: $value{br}Parameter:$seriesname",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
    },
    categories: [
      {
        category: data
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort data in descending order
          .map((item) => ({
            label: item.zone_name,
            link: `/kolkata?zone_code=${item.zone_code}`,
          })),
      },
    ],
    dataset: [
      {
        seriesname: "Registration",
        data: rearrangedData_registration
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_12_registration,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Return Filing",
        data: rearrangedData1
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_5_return_filing,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Scrutiny/Assessment",
        data: rearrangedData_scrutiny_assessment
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.sub_parameter_weighted_average_scrutiny_assessment,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Investigation",
        data: rearrangedData_investigation
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.sub_parameter_weighted_average_investigation,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Adjudication",
        data: rearrangedData_gst_adjudication
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.sub_parameter_weighted_average_Adjudication,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Adjudication (Legacy Cases)",
        data: rearrangedData_adjudication_legacy_cases
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.sub_parameter_weighted_average_adjudication_legacy_cases,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Refunds",
        data: rearrangedData_gst_refund
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_5_refunds,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Recovery of Arrears",
        data: rearrangedData_recovery_of_arrears
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_8_recovery_of_arrears,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Arrest and Prosecution",
        data: rearrangedData_arrest_prosecution
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_6_arrest_prosecution,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Audit",
        data: rearrangedData_audit
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_12_audit,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
      {
        seriesname: "Appeals",
        data: rearrangedData_appeals
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average)
          .map((item) => ({
            value: item.weighted_average_out_of_12_appeals,
            color: getBarColor(item), // Using getBarColor(item) to pass the entire item
          })),
      },
    ],


    annotations: {
      groups: [
        {
          items: [
            {
              id: "avg-text",
              type: "text",
              // text: `National Average: ${averageReturnFiling}`,
              align: "right",
              x: "$chartEndX - 50",
              y: "$chartStartY + 70",
              fontSize: "14",
              color: "#000000",
            },
          ],
        },
      ],
    },
  };

  const colorscustom = [
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00ffff",
    "#cc0077",
    "#ff8800",
    "#40916c",
    "#551a8b",
    "#3d0c02",
  ];
  const dataSourcecustom = {
    chart: {
      tooltip: {
        toolTipBorderColor: "#ffffff",
        toolTipBorderThickness: "0",
      },
      caption: "Customs",
      subcaption: "All Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "All Zones (Cutoms)",
      yAxisName: "All Parameters (Zone Wise)",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend: "0",
      plottooltext:
        "<b>Zone Name-: $label</b>{br}Weighted Average: $value{br}Parameter:$seriesname",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
    },
    categories: [
      {
        category: datascustom
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((zone) => ({
            label: zone.zone_name,
            link: `/kolkata?zone_code=${zone.zone_code}`, // Add link if needed
          })),
      },
    ],
    dataset: [
      {
        seriesname: "Timely Refunds",
        data: rearrangedDatacustimelyrefunds
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_5_cus_timelyrefunds,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "EPCG",
        data: rearrangedDataepcg
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_7_epcg,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },

      {
        seriesname: "AA",
        data: rearrangedDataaa
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_7_aa,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Disposal/Pendency",
        data: rearrangedDataDisposal_Pendency
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_11,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Adjudication",
        data: rearrangedDataAdjudication
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.sub_parameter_weighted_average_AdjudicationData,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Investigation",
        data: rearrangedDatacusinvestigation
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_12_investigation,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Arrest & Prosecution",
        data: rearrangedDatacusarrest_prosecution
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_6_cus_arrest_prosecution,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },

      {
        seriesname: "Unclaimed Cargo",
        data: rearrangedDatacusunclaimed_cargo
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_6_cus_unclaimed_cargo,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Disposal Of Confiscated Gold & NDPS",
        data: rearrangedDatacus_DisposalOfConfiscatedGoldAndNDPS
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_6_cus_DisposalOfConfiscatedGoldAndNDPS,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Recovery of Arrears",
        data: rearrangedDatacus_recovery_of_arrears
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_6_cus_recovery_of_arrears,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Management of Warehousing Bonds",
        data: rearrangedDatacus_management_of_warehousing_bonds
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_6_cus_management_of_warehousing_bonds,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Commissioner Appeals",
        data: rearrangedDatacus_CommissionerAppeals
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_8_cus_CommissionerAppeals,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },
      {
        seriesname: "Audit",
        data: rearrangedDatacus_cus_audit
          .sort((a, b) => b.total_weighted_average - a.total_weighted_average) // Sort in descending order
          .map((item) => ({
            value: item.weighted_average_out_of_12_cus_audit,
            color: getBarColor(item), // Pass the entire item to getBarColor
          })),
      },

    ],

    annotations: {
      groups: [
        {
          items: [
            {
              id: "avg-text",
              type: "text",
              // text: `National Average: ${averageReturnFiling.toFixed(2)}`,
              align: "right",
              x: "$chartEndX - 50",
              y: "$chartStartY + 70",
              fontSize: "14",
              color: "#000000",
            },
          ],
        },
      ],
    },
  };

  return (
    <>
      <div className="body flex-grow-1">
        <div className="row">
          <div className="msg-box">
            <div className="lft-box">
              <h2>All Zones</h2>
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
        <div className="row ">
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
                  value="CGST"
                  onChange={handleClick}
                  checked={selectedOption === "CGST"}
                />
                <input
                  type="radio"
                  id="switchYearly"
                  name="switchPlan"
                  onChange={handleClick}
                  value="Customs"
                  checked={selectedOption === "Customs"}
                />
                <label htmlFor="switchMonthly">CGST</label>
                <label htmlFor="switchYearly">Customs</label>
                <div className="switch-wrapper">
                  <div className="switch">
                    <div>CGST</div>
                    <div>Customs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedOption === "CGST" ? (
          <>
            <div class="row">
              <div class="text-center zone-heading">
                <h3> {selectedOption.toUpperCase()}</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 order-1 order-lg-1">
                <div className="card mb-4">
                  <ReactFusioncharts
                    type="stackedcolumn3dline"
                    width="100%"
                    height="650"
                    dataFormat="JSON"
                    dataSource={dataSource}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-btn">
                <Link to="/">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div class="row">
              <div class="text-center zone-heading">
                <h3> {selectedOption.toUpperCase()}</h3>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 order-1 order-lg-1">
                <div className="card mb-4">
                  {/* <Cgstallzones/> */}
                  <ReactFusioncharts
                    type="stackedcolumn3dline"
                    width="100%"
                    height="650"
                    dataFormat="JSON"
                    dataSource={dataSourcecustom}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="view-btn">
                <Link to="/">
                  <Button variant="contained" className="ml-4">
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AllZones;