import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../../Service/ApiClient";
import dayjs from "dayjs";

const Breadcrumb = ({ selectedDate, onChangeDate }) => {
  const location = useLocation();
  const { pathname } = location;
  const pathnames = pathname.split("/").filter((x) => x);
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { zone_code, come_name } = queryParams;
  const [zoneName, setZoneName] = useState("");
  const [zoneName0, setZoneName0] = useState("");
  const [commName, setCommName] = useState("");

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const fetchDatasubcom = async (name) => {
    try {
      const response = await apiClient.get(`/cbic/${name}`, {
        params: {
          month_date: newdate,
          type: "commissary",
          zone_code: zone_code,
        },
      });

      const zonename = response.data.map((item) => item.zone_name)[0];
      setZoneName(zonename);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchBreadcrumb = async (name) => {
    try {
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "commissary",
          zone_code: zone_code,
        },
      });

      const zonename0 = response.data.map((item) => item.zoneName)[0];
      setZoneName0(zonename0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchComm = async (name) => {
    try {
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "come_name",
          zone_code: zone_code,
          come_name: come_name,
        },
      });

      const commname = response.data.map((item) => item.commName)[0];
      setCommName(commname);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDatazonewisecomm = async (name) => {
    try {
      const response = await apiClient.get(`/cbic/t_score/${name}`, {
        params: {
          month_date: newdate,
          type: "zone",
          zone_code: zone_code,
        },
      });

      const zonename = response.data.map((item) => item.zoneName)[0];
      setZoneName(zonename);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchDatasubcom(name);
      fetchBreadcrumb(name);
      fetchComm(name);
      fetchDatazonewisecomm(name);
    }
  }, [name]);

  const adjustedPathnames = () => {
    let adjusted = [...pathnames];

    if (pathname.includes("CGSTMonthlyBifurcation")) {
      adjusted = ["MonthlyReport", ...adjusted];
    } else if (pathname.includes("CustomsMonthlyBifurcation")) {
      adjusted = ["MonthlyReport", ...adjusted];
    }

    // Custom parameters that should redirect to /custompara
    const customRedirectParams = [
      "timelyrefunds",
      "epcg",
      "export_obligation(AA)",
      "disposal/pendency",
      "adjudication",
      "Investigation",
      "arrest_and_prosecution",
      "unclaimed_cargo",
      "DisposalOfConfiscatedGoldAndNDPS",
      "recovery_of_arrears",
      "management_of_warehousing_bonds",
      "CommissionerAppeals",
      "cus_audit"
    ];

    // CGST parameters that should redirect to /zoneparameters
    const gstRedirectParams = [
      "registration",
      "returnFiling",
      "scrutiny/assessment",
      "investigation",
      "adjudication",
      "adjudication(legacy cases)",
      "refunds",
      "recovery_of_arrears",
      "gst_arrest_and_prosecution",
      "audit",
      "appeals"
    ];

    const miscustomRedirectParams = [
      "TimelyPaymentOfRefunds",
      "epcg",
      "aa",
      "disposalPendency",
      "Adjudication",
      "cus_investigation",
      "cus_arrestAndProsecution",
      "unclaimed_cargo",
      "DisposalOfConfiscatedGoldAndNDPS",
      "recovery_Of_Arrears",
      "mowb",
      "CommissionerAppeals",
      "cus_audit"
    ];

    // CGST parameters that should redirect to /zoneparameters
    const misgstRedirectParams = [
      "registration",
      "returnFiling",
      "scrutiny",
      "investigation",
      "adjudication",
      "adjudicationLegacy",
      "refunds",
      "recoveryOfArrears",
      "arrestAndProsecution",
      "audit",
      "appeals"
    ];

    // Handle custom parameters redirect
    if (customRedirectParams.includes(name) && (
      pathname === "/custompara" ||
      pathname === "/customzonescoredetails" ||
      pathname === "/customcommscoredetails" ||
      pathname === "/customzonewisecomm" ||
      pathname === "/CustomSubcom"
    )) {
      adjusted = [name];
      if (zone_code && name) {
        adjusted.push(zoneName);
      }
    }

    // Handle GST parameters redirect
    if (gstRedirectParams.includes(name) && (
      pathname === "/zoneparameters" ||
      pathname === "/zonescoredetails" ||
      pathname === "/commscoredetails" ||
      pathname === "/zonewisecomm" ||
      pathname === "/Subcom"
    )) {
      adjusted = [name];
      if (zone_code && name) {
        adjusted.push(zoneName);
      }
    }

    // Handle MIS Table cases with proper naming
    if (pathname === "/MISTable") {
      if (miscustomRedirectParams.includes(name)) {
        // Format Customs parameter names for display
        const formattedName = name
          .replace(/_/g, ' ')
          .replace(/(^|\s)\w/g, char => char.toUpperCase());
        adjusted = ["MIS-Report", `Customs-${formattedName}`];
      } else if (misgstRedirectParams.includes(name)) {
        // Format GST parameter names for display
        const formattedName = name
          .replace(/(^|\s)\w/g, char => char.toUpperCase())
          .replace('legacy cases', '(Legacy Cases)');
        adjusted = ["MIS-Report", `CGST-${formattedName}`];
      }
    }

    // Registration cases
    if (["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"].includes(name)) {
      adjusted = ["registration", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (name === "cus1") {
      adjusted = ["timelyrefunds", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Return Filing
    if (name === "gst2") {
      adjusted = ["returnFiling", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus2a", "cus2b", "cus2c"].includes(name)) {
      adjusted = ["epcg", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Scrutiny/Assessment
    if (["gst3a", "gst3b"].includes(name)) {
      adjusted = ["scrutiny/assessment", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus3a", "cus3b", "cus3c"].includes(name)) {
      adjusted = ["export_obligation(AA)", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Investigation
    if (["gst4a", "gst4b", "gst4c", "gst4d"].includes(name)) {
      adjusted = ["investigation", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus4a", "cus4b", "cus4c", "cus4d"].includes(name)) {
      adjusted = ["disposal/pendency", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Adjudication
    if (["gst5a", "gst5b"].includes(name)) {
      adjusted = ["adjudication", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus5a", "cus5b", "cus5c"].includes(name)) {
      adjusted = ["adjudication", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Adjudication (legacy cases)
    if (["gst6a", "gst6b", "gst6c", "gst6d"].includes(name)) {
      adjusted = ["adjudication(legacy cases)", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus6a", "cus6b", "cus6c", "cus6d", "cus6e", "cus6f"].includes(name)) {
      adjusted = ["Investigation", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Refunds
    if (name === "gst7") {
      adjusted = ["refunds", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus7a", "cus7b"].includes(name)) {
      adjusted = ["arrest_and_prosecution", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Recovery of Arrears
    if (["gst8a", "gst8b"].includes(name)) {
      adjusted = ["recovery_of_arrears", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus8a", "cus8b"].includes(name)) {
      adjusted = ["unclaimed_cargo", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Arrest and Prosecution
    if (["gst9a", "gst9b"].includes(name)) {
      adjusted = ["gst_arrest_and_prosecution", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus9a", "cus9b"].includes(name)) {
      adjusted = ["DisposalOfConfiscatedGoldAndNDPS", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Audit
    if (["gst10a", "gst10b", "gst10c"].includes(name)) {
      adjusted = ["audit", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus10a", "cus10b"].includes(name)) {
      adjusted = ["recovery_of_arrears", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Appeals
    if (["gst11a", "gst11b", "gst11c", "gst11d"].includes(name)) {
      adjusted = ["appeals", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus11a", "cus11b"].includes(name)) {
      adjusted = ["management_of_warehousing_bonds", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus12a", "cus12b"].includes(name)) {
      adjusted = ["CommissionerAppeals", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    if (["cus13a", "cus13b", "cus13c", "cus13d", "cus13e"].includes(name)) {
      adjusted = ["cus_audit", name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Handle CustomSubcom page
    if (pathname === "/CustomSubcom" && name) {
      adjusted = [name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    // Handle Subcom page (GST equivalent)
    if (pathname === "/Subcom" && name) {
      adjusted = [name];
      if (zone_code) {
        adjusted.push(zoneName);
      }
    }

    return adjusted;
  };

  const adjustedPath = adjustedPathnames();

  const getCustomLink = (segment) => {
    // Mapping of all custom parameters to their URLs
    const customParamLinks = {
      // CGST parameters
      "registration": "/zoneparameters?name=registration",
      "returnFiling": "/zoneparameters?name=returnFiling",
      "scrutiny/assessment": "/zoneparameters?name=scrutiny/assessment",
      "investigation": "/zoneparameters?name=investigation",
      "adjudication": "/zoneparameters?name=adjudication",
      "adjudication(legacy cases)": "/zoneparameters?name=adjudication(legacy cases)",
      "refunds": "/zoneparameters?name=refunds",
      "recovery_of_arrears": "/zoneparameters?name=recovery_of_arrears",
      "gst_arrest_and_prosecution": "/zoneparameters?name=gst_arrest_and_prosecution",
      "audit": "/zoneparameters?name=audit",
      "appeals": "/zoneparameters?name=appeals",

      // Customs parameters that should redirect to /custompara
      "timelyrefunds": "/custompara?name=timelyrefunds",
      "epcg": "/custompara?name=epcg",
      "export_obligation(AA)": "/custompara?name=export_obligation(AA)",
      "disposal/pendency": "/custompara?name=disposal/pendency",
      "adjudication": "/custompara?name=adjudication",
      "Investigation": "/custompara?name=Investigation",
      "arrest_and_prosecution": "/custompara?name=arrest_and_prosecution",
      "unclaimed_cargo": "/custompara?name=unclaimed_cargo",
      "DisposalOfConfiscatedGoldAndNDPS": "/custompara?name=DisposalOfConfiscatedGoldAndNDPS",
      "recovery_of_arrears": "/custompara?name=recovery_of_arrears",
      "management_of_warehousing_bonds": "/custompara?name=management_of_warehousing_bonds",
      "CommissionerAppeals": "/custompara?name=CommissionerAppeals",
      "cus_audit": "/custompara?name=cus_audit",

      // GST sub-parameters
      "gst1a": `/Subpara?name=gst1a`,
      "gst1b": `/Subpara?name=gst1b`,
      "gst1c": `/Subpara?name=gst1c`,
      "gst1d": `/Subpara?name=gst1d`,
      "gst1e": `/Subpara?name=gst1e`,
      "gst1f": `/Subpara?name=gst1f`,
      "gst2": `/Subpara?name=gst2`,
      "gst3a": `/Subpara?name=gst3a`,
      "gst3b": `/Subpara?name=gst3b`,
      "gst4a": `/Subpara?name=gst4a`,
      "gst4b": `/Subpara?name=gst4b`,
      "gst4c": `/Subpara?name=gst4c`,
      "gst4d": `/Subpara?name=gst4d`,
      "gst5a": `/Subpara?name=gst5a`,
      "gst5b": `/Subpara?name=gst5b`,
      "gst6a": `/Subpara?name=gst6a`,
      "gst6b": `/Subpara?name=gst6b`,
      "gst6c": `/Subpara?name=gst6c`,
      "gst6d": `/Subpara?name=gst6d`,
      "gst7": `/Subpara?name=gst7`,
      "gst8a": `/Subpara?name=gst8a`,
      "gst8b": `/Subpara?name=gst8b`,
      "gst9a": `/Subpara?name=gst9a`,
      "gst9b": `/Subpara?name=gst9b`,
      "gst10a": `/Subpara?name=gst10a`,
      "gst10b": `/Subpara?name=gst10b`,
      "gst10c": `/Subpara?name=gst10c`,
      "gst11a": `/Subpara?name=gst11a`,
      "gst11b": `/Subpara?name=gst11b`,
      "gst11c": `/Subpara?name=gst11c`,
      "gst11d": `/Subpara?name=gst11d`,

      // Customs sub-parameters
      "cus1": `/customsubpara?name=cus1`,
      "cus2a": `/customsubpara?name=cus2a`,
      "cus2b": `/customsubpara?name=cus2b`,
      "cus2c": `/customsubpara?name=cus2c`,
      "cus3a": `/customsubpara?name=cus3a`,
      "cus3b": `/customsubpara?name=cus3b`,
      "cus3c": `/customsubpara?name=cus3c`,
      "cus4a": `/customsubpara?name=cus4a`,
      "cus4b": `/customsubpara?name=cus4b`,
      "cus4c": `/customsubpara?name=cus4c`,
      "cus4d": `/customsubpara?name=cus4d`,
      "cus5a": `/customsubpara?name=cus5a`,
      "cus5b": `/customsubpara?name=cus5b`,
      "cus5c": `/customsubpara?name=cus5c`,
      "cus6a": `/customsubpara?name=cus6a`,
      "cus6b": `/customsubpara?name=cus6b`,
      "cus6c": `/customsubpara?name=cus6c`,
      "cus6d": `/customsubpara?name=cus6d`,
      "cus6e": `/customsubpara?name=cus6e`,
      "cus6f": `/customsubpara?name=cus6f`,
      "cus7a": `/customsubpara?name=cus7a`,
      "cus7b": `/customsubpara?name=cus7b`,
      "cus8a": `/customsubpara?name=cus8a`,
      "cus8b": `/customsubpara?name=cus8b`,
      "cus9a": `/customsubpara?name=cus9a`,
      "cus9b": `/customsubpara?name=cus9b`,
      "cus10a": `/customsubpara?name=cus10a`,
      "cus10b": `/customsubpara?name=cus10b`,
      "cus11a": `/customsubpara?name=cus11a`,
      "cus11b": `/customsubpara?name=cus11b`,
      "cus12a": `/customsubpara?name=cus12a`,
      "cus12b": `/customsubpara?name=cus12b`,
      "cus13a": `/customsubpara?name=cus13a`,
      "cus13b": `/customsubpara?name=cus13b`,
      "cus13c": `/customsubpara?name=cus13c`,
      "cus13d": `/customsubpara?name=cus13d`,
      "cus13e": `/customsubpara?name=cus13e`,

      // Monthly reports
      "MonthlyReport": "/MonthlyReport",
      "CustomsMonthlyBifurcation": "/CustomsMonthlyBifurcation",
      "CGSTMonthlyBifurcation": "/CGSTMonthlyBifurcation",

      // MIS-Report
      "MIS-Report": "/mis-report"
    };

    // Add CGST root path
    if (pathname === "/cgst") {
      return ["CGST"];
    }

    // Return the custom link if it exists, otherwise build the path
    return customParamLinks[segment] || `/${adjustedPath
      .slice(0, adjustedPath.indexOf(segment) + 1)
      .join("/")}`;
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
                  <span>
                    {zone_code
                      ? (zoneName ? zoneName : (zoneName0 ? zoneName0 : commName))
                      : (name ? name.toUpperCase() : value.toUpperCase())
                    }
                  </span>
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