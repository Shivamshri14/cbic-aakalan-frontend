import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import dayjs from "dayjs";

const Breadcrumb = ({selectedDate, onChangeDate}) => {
  const location = useLocation();
  const { pathname } = location;
  const pathnames = pathname.split("/").filter((x) => x);
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code, come_name } = queryParams;
  const [zoneName, setZoneName] = useState("");
  const [zoneName0, setZoneName0]=useState("");
  const [commName, setCommName]=useState("");

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const fetchDatasubcom = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/${name}`, {
        params: {
          month_date: newdate,
          type: "commissary",
          zone_code: zone_code,
        },
      });

      const zonename = response.data.map((item) => item.zone_name)[0];
      console.log("Zone Name:", zonename);
      setZoneName(zonename);
      console.log("url", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBreadcrumb= async(name)=>{
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "commissary",
          zone_code: zone_code,
        },
      });

      const zonename0 = response.data.map((item) => item.zoneName)[0];
      console.log("Zone Name:", zonename0);
      setZoneName0(zonename0);
      console.log("url", response);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchComm= async(name)=>{
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "come_name",
          zone_code: zone_code,
          come_name:come_name,
        },
      });

      const commname = response.data.map((item) => item.commName)[0];
      console.log("Zone Name:", commname);
      setCommName(commname);
      console.log("url", response);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchDatazonewisecomm = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "zone",
          zone_code: zone_code,
        },
      });

      const zonename = response.data.map((item) => item.zoneName)[0];
      setZoneName(zonename);
      console.log("url", response);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchDatasubcom(name);
    }

    if(name){
      fetchBreadcrumb(name);
    }

    if(name){
      fetchComm(name);
    }

    if(name){
      fetchDatazonewisecomm(name);
    }
  }, [name]);

  const adjustedPathnames = () => {
    let adjusted = [...pathnames];
    // console.log("Pathname", pathname);
    // console.log("Adjusted", adjusted);

    // Insert specific breadcrumbs dynamically
    if (
      name === "registration" ||
      name === "returnFiling" ||
      name === "scrutiny/assessment" ||
      name === "investigation" ||
      name === "adjudication" ||
      name === "adjudication(legacy cases)" ||
      name === "refunds" ||
      name === "recovery of arrears" ||
      name === "arrest and prosecution" ||
      name === "audit" ||
      (name === "appeals" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", name];
      console.log("Parameter", adjusted);

      if(zone_code){
        adjusted.push(zoneName);
      }
    }
  

    if(pathname==="/custompara" || pathname==="/customzonescoredetails" || pathname==="/customcommscoredetails"){
    if (
      name === "timelyrefunds" ||
      name === "epcg" ||
      name === "export_obligation(AA)" ||
      name === "disposal/pendency" ||
      name === "adjudication" ||
      name === "investigation" ||
      name === "arrest_and_prosecution" ||
      name === "unclaimed_cargo" ||
      name === "DisposalOfConfiscatedGoldAndNDPS" ||
      name === "recovery_of_arrears" ||
      name==="management_of_warehousing_bonds"||
      name==="CommissionerAppeals"||
      (name === "audit" && adjusted.length > 0)
    ) {
      adjusted = ["customs", name];
      console.log("Parameter", adjusted);

      if(zone_code && name){
        adjusted.push(zoneName);
      }
    }
   }

   if(pathname==="/MISTable"){
    if (
      name === "timelyrefunds" ||
      name === "epcg" ||
      name === "export_obligation(AA)" ||
      name === "disposal/pendency" ||
      name === "adjudication" ||
      name === "investigation" ||
      name === "arrest_and_prosecution" ||
      name === "unclaimed_cargo" ||
      name === "DisposalOfConfiscatedGoldAndNDPS" ||
      name === "recovery_of_arrears" ||
      name==="management_of_warehousing_bonds"||
      name==="CommissionerAppeals"||
      (name === "audit" && adjusted.length > 0)
    ) {
      adjusted = ["MIS-Report", name];
      console.log("Parameter", adjusted);
    }
   }

   if(pathname==="/MISTable")
   if (
    name === "registration" ||
    name === "returnFiling" ||
    name === "scrutiny/assessment" ||
    name === "investigation" ||
    name === "adjudication" ||
    name === "adjudication(legacy cases)" ||
    name === "refunds" ||
    name === "recovery of arrears" ||
    name === "arrest and prosecution" ||
    name === "audit" ||
    (name === "appeals" && adjusted.length > 0)
  ) {
    adjusted = ["MIS-Report", name];
    console.log("Parameter", adjusted);
  }

    //Registration
    if (
      name === "gst1a" ||
      name === "gst1b" ||
      name === "gst1c" ||
      name === "gst1d" ||
      name === "gst1e" ||
      (name === "gst1f" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", "registration", name];

      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if(name==="cus1" && adjusted.length>0){
      adjusted=["customs","Timely payment of Refunds",name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    //ReturnFiling
    if (name === "gst2" && adjusted.length > 0) {
      adjusted = ["cgst", "returnFiling", name];

      if (zone_code) {
        adjusted = ["cgst", "returnFiling", name, zoneName];
      }
    }

    if(name==="cus2a"|| name==="cus2b"|| (name==="cus2c" && adjusted.length>0)){
      adjusted=["customs","Management of Export Obligation(EPCG)",name];

      if(zone_code){
        adjusted=["customs","Management of Export Obligation(EPCG)",name,zoneName];
      }
    }

    // Scrutiny/Assessment
    if (name === "gst3a" || (name === "gst3b" && adjusted.length > 0)) {
      adjusted = ["cgst", "scrutiny/assessment", name];

      if (zone_code) {
        adjusted = ["cgst", "scrutiny/assessment", name, zoneName];
      }
    }

    if(name==="cus3a"|| name==="cus3b" ||(name==="cus3c" && adjusted.length>0)){
      adjusted = ["customs", "Management of Export Obligation(AA)", name];

      if(zone_code){
        adjusted = ["customs", "Management of Export Obligation(AA)", name,zoneName];
      }
    }

    //Investigation
    if (
      name === "gst4a" ||
      name === "gst4b" ||
      name === "gst4c" ||
      (name === "gst4d" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", "investigation", name];

      if (zone_code) {
        adjusted = ["cgst", "investigation", name, zoneName];
      }
    }

    if(name==="cus4a" || name==="cus4b"|| name==="cus4c" || (name==="cus4d" && adjusted.length>0)){
      adjusted=["customs","Disposal/Pendency Of Provisional Assessments",name];

      if(zone_code){
        adjusted=["customs","Disposal/Pendency Of Provisional Assessments",name,zoneName];
      }
    }

    //adjudication
    if (name === "gst5a" || (name === "gst5b" && adjusted.length > 0)) {
      adjusted = ["cgst", "adjudication", name];

      if (zone_code) {
        adjusted = ["cgst", "adjudication", name, zoneName];
      }
    }

    if (name === "cus5a" ||name==="cus5b"|| (name === "cus5c" && adjusted.length > 0)) {
      adjusted = ["customs", "Adjudication", name];

      if (zone_code) {
        adjusted = ["customs", "Adjudication", name, zoneName];
      }
    }

    //adjudication(legacy cases)
    if (
      name === "gst6a" ||
      name === "gst6b" ||
      name === "gst6c" ||
      (name === "gst6d" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", "adjudication(legacy cases)", name];

      if (zone_code) {
        adjusted = ["cgst", "adjudication(legacy cases)", name, zoneName];
      }
    }

    if (
      name === "cus6a" ||
      name === "cus6b" ||
      name === "cus6c" || name==="cus6d" || name==="cus6e"||
      (name === "cus6f" && adjusted.length > 0)
    ) {
      adjusted = ["customs", "Investigation", name];

      if (zone_code) {
        adjusted = ["customs", "Investigation", name, zoneName];
      }
    }

    //Refunds
    if (name === "gst7" && adjusted.length > 0) {
      adjusted = ["cgst", "refunds", name];

      if (zone_code) {
        adjusted = ["cgst", "refunds", name, zoneName];
      }
    }

    if (name === "cus7a" || (name==="cus7b" && adjusted.length > 0)) {
      adjusted = ["customs", "Arrests and Prosecution", name];

      if (zone_code) {
        adjusted = ["customs", "Arrests and Prosecution", name, zoneName];
      }
    }

    //Recovery of Arrears
    if (name === "gst8a" || (name === "gst8b" && adjusted.length > 0)) {
      adjusted = ["cgst", "recovery of arrears", name];

      if (zone_code) {
        adjusted = ["cgst", "recovery of arrears", name, zoneName];
      }
    }

    if (name === "cus8a" || (name === "cus8b" && adjusted.length > 0)) {
      adjusted = ["customs", "Monitoring Of Un-cleared and Unclaimed cargo", name];

      if (zone_code) {
        adjusted = ["customs", "Monitoring Of Un-cleared and Unclaimed cargo", name, zoneName];
      }
    }

    //arrest and prosecution
    if (name === "gst9a" || (name === "gst9b" && adjusted.length > 0)) {
      adjusted = ["cgst", "arrest and prosecution", name];

      if (zone_code) {
        adjusted = ["cgst", "arrest and prosecution", name, zoneName];
      }
    }

    if (name === "cus9a" || (name === "cus9b" && adjusted.length > 0)) {
      adjusted = ["customs", "Disposal Of Confiscated Gold and N (Narcotics)", name];

      if (zone_code) {
        adjusted = ["customs", "Disposal Of Confiscated Gold and N (Narcotics)", name, zoneName];
      }
    }

    //audit
    if (
      name === "gst10a" ||
      name === "gst10b" ||
      (name === "gst10c" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", "audit", name];

      if (zone_code) {
        adjusted = ["cgst", "audit", name, zoneName];
      }
    }

    if (
      name === "cus10a" ||
      (name === "cus10b" && adjusted.length > 0)
    ) {
      adjusted = ["customs", "Recovery of Arrears", name];

      if (zone_code) {
        adjusted = ["customs", "Recovery of Arrears", name, zoneName];
      }
    }

    //appeals
    if (
      name === "gst11a" ||
      name === "gst11b" ||
      name === "gst11c" ||
      (name === "gst11d" && adjusted.length > 0)
    ) {
      adjusted = ["cgst", "appeals", name];

      if (zone_code) {
        adjusted = ["cgst", "appeals", name, zoneName];
      }
    }

    if (
      name === "cus11a" ||
      (name === "cus11b" && adjusted.length > 0)
    ) {
      adjusted = ["customs", "Management Of Warehousing bonds", name];

      if (zone_code) {
        adjusted = ["customs", "Management Of Warehousing bonds", name, zoneName];
      }
    }

    if (
      name === "cus12a" ||
      (name === "cus12b" && adjusted.length > 0)
    ) {
      adjusted = ["customs", "Commissioner (Appeals)", name];

      if (zone_code) {
        adjusted = ["customs", "Commissioner (Appeals)", name, zoneName];
      }
    }

    if (
      name === "cus13a" || name==="cus13b" || name==="cus13c" || name==="cus13d" ||
      (name === "cus13e" && adjusted.length > 0)
    ) {
      adjusted = ["customs", "Audit", name];

      if (zone_code) {
        adjusted = ["customs", "Audit", name, zoneName];
      }
    }

    return adjusted;
  };


  const adjustedPath = adjustedPathnames();

  const getCustomLink = (segment) => {
    switch (segment) {
      case "registration":
      case "returnFiling":
      case "scrutiny/assessment":
      case "investigation":
      case "adjudication":
      case "adjudication(legacy cases)":
      case "refunds":
      case "recovery of arrears":
      case "arrest and prosecution":
      case "audit":
      case "appeals":
        return "/";

        case "Timely payment of Refunds":
      case "Management of Export Obligation(EPCG)":
      case "Management of Export Obligation(AA)":
      case "Disposal/Pendency Of Provisional Assessments":
      case "Adjudication":
      case "Investigation":
      case "Arrests and Prosecution":
      case "Monitoring Of Un-cleared and Unclaimed cargo":
      case "Disposal Of Confiscated Gold and N (Narcotics)":
      case "Recovery of Arrears":
      case "Management Of Warehousing bonds":
        case "Commissioner (Appeals)":
        case "Audit":
          return "/customs";

      case "gst1a":
      case "gst1b":
      case "gst1c":
      case "gst1d":
      case "gst1e":
      case "gst1f":
      case "gst2":
      case "gst3a":
      case "gst3b":
      case "gst4a":
      case "gst4b":
      case "gst4c":
      case "gst4d":
      case "gst5a":
      case "gst5b":
      case "gst6a":
      case "gst6b":
      case "gst6c":
      case "gst6d":
      case "gst7":
      case "gst8a":
      case "gst8b":
      case "gst9a":
      case "gst9b":
      case "gst10a":
      case "gst10b":
      case "gst10c":
      case "gst11a":
      case "gst11b":
      case "gst11c":
      case "gst11d":
        return `/Subpara?name=${segment}`;

        case "cus1":
          case "cus2a":
          case "cus2b":
          case "cus2c":
          case "cus3a":
          case "cus3b":
          case "cus3c":
          case "cus4a":
          case "cus4b":
          case "cus4c":
          case "cus4d":
          case "cus5a":
          case "cus5b":
          case "cus5c":
          case "cus6a":
          case "cus6b":
          case "cus6c":
          case "cus6d":
          case "cus6e":
          case "cus6f":
          case "cus7a":
          case "cus7b":
          case "cus8a":
          case "cus8b":
          case "cus9a":
          case "cus9b":
          case "cus10a":
          case "cus10b":
          case "cus11a":
          case "cus11b":
          case "cus12a":
            case "cus12b":
              case "cus13a":
                case "cus13b":
                  case "cus13c":
                    case "cus13d":
                      case "cus13e":
            return `/customsubpara?name=${segment}`;
      default:
        return `/${adjustedPath
          .slice(0, adjustedPath.indexOf(segment) + 1)
          .join("/")}`;
    }
  };

  return (
    <div className="container-fluid px-4 breadcrumb-custom">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb my-0">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>
          {adjustedPath.map((value, index) => {
            const isLast = index === adjustedPath.length - 1;
            return (
              <li
                key={value}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
              >
                {isLast ? (
                  <span>{zone_code?(zoneName ? zoneName : (zoneName0 ? zoneName0 : commName)): name ? name.toUpperCase() : value.toUpperCase()}</span>
                ) : (
                  <Link to={getCustomLink(value)}>{value.toUpperCase()}</Link>
                )}
              </li>
            );
          })}
          
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
