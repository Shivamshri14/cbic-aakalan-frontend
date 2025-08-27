import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";

import { CSmartTable } from "@coreui/react-pro";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import apiClient from "../../Service/ApiClient";
import Spinner from "../Spinner";

const CustomsMonthlyBifurcation = ({ selectedDate, onChangeDate }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const [totalValues, setTotalValues] = useState({ weighted_average: 0, scale: 0 });


  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const zone_code = Number(queryParams.zone_code); // ensure numeric zone_code

  const [itemsSelect, setItemsSelect] = useState(() => {
    const savedItems = localStorage.getItem("itemsSelect");
    return savedItems ? Number(savedItems) : 20; // Default is 20
  });

  const handleItemsChange = (value) => {
    setItemsSelect(value);
    localStorage.setItem("itemsSelect", value);
  };

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  // const endpointMap = {
  //   Registration: ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"],
  //   "Scrutiny Assessment": ["gst3a", "gst3b"],
  //   Investigation: ["gst4a", "gst4b", "gst4c", "gst4d"],
  //   "GST Adjudication": ["gst5a", "gst5b"],
  //   "Adjudication Legacy Cases": ["gst6a", "gst6b", "gst6c", "gst6d"],
  //   Refunds: ["gst7"],
  //   "Recovery of Arrears": ["gst8a", "gst8b"],
  //   "Arrest & Prosecution": ["gst9a", "gst9b"],
  //   Audit: ["gst10a", "gst10b", "gst10c"],
  //   Appeals: ["gst11a", "gst11b", "gst11c", "gst11d"],
  //   "Return Filing": ["gst2"],
  // };

  // const fetchData = async () => {
  //   setLoading(true);
  //   let allRows = [];
  //   let rowIndex = 1;

  //   const scaleMap = {
  //     Audit: 12,
  //     "Recovery of Arrears": 8,
  //     "Arrest & Prosecution": 6,
  //     Refunds: 5,
  //     "Return Filing": 5,
  //     Appeals: 12,
  //     Registration: 12,
  //     // Others not scaled (default weight = 10)
  //   };

  //   for (const [category, endpoints] of Object.entries(endpointMap)) {
  //     const scale = scaleMap[category] || 10; // Use default 10 if not in scaleMap

  //     const responses = await Promise.all(
  //       endpoints.map((endpoint) =>
  //         apiClient
  //           .get(`/cbic/${endpoint}`, {
  //             params: {
  //               month_date: newdate,
  //               type: "zone",
  //               zone_code,
  //             },
  //           })
  //           .then((res) =>
  //             res.data.map(item => ({
  //               ...item,
  //               sub_parameter_weighted_average: parseFloat(
  //                 ((item.sub_parameter_weighted_average || 0) * scale / 10).toFixed(2)
  //               )
  //             }))
  //           )
  //           .catch((err) => {
  //             console.error(`Error fetching ${endpoint}:`, err);
  //             return [];
  //           })
  //       )
  //     );

  //     const filtered = responses.flat().filter(
  //       (item) => Number(item.zone_code) === Number(zone_code)
  //     );

  //     const grouped = {};

  //     filtered.forEach((item) => {
  //       const zoneName = item.zone_name;
  //       const value = parseFloat(item.sub_parameter_weighted_average || 0);

  //       if (!grouped[zoneName]) {
  //         grouped[zoneName] = value;
  //       } else {
  //         grouped[zoneName] += value;
  //       }
  //     });

  //     for (const [zoneName, totalAvg] of Object.entries(grouped)) {
  //       allRows.push({
  //         s_no: rowIndex++,
  //         zone_name: zoneName,
  //         zone_code: zone_code,
  //         parameter: category,
  //         weighted_average: parseFloat(totalAvg.toFixed(2)),
  //       });
  //     }
  //   }

  //   setTableData(allRows);
  //   setLoading(false);
  // };

  const fetchDataCom = async () => {
    setLoading(true);
    let allRows = [];
    let rowIndex = 1;

    const endpointMap = {
      "Timely payment of Refunds": { endpoints: ["cus1"], scale: 5 },
      "Management of Export Obligation(EPCG)": { endpoints: ["cus2a", "cus2b", "cus2c"], scale: 7 },
      "Management of Export Obligation(AA)": { endpoints: ["cus3a", "cus3b", "cus3c"], scale: 7 },
      "Disposal Pendency": { endpoints: ["cus4a", "cus4b", "cus4c", "cus4d"], scale: 11 },
      Adjudication: { endpoints: ["cus5a", "cus5b", "cus5c"], scale: 10 },
      Investigation: { endpoints: ["cus6a", "cus6b", "cus6c", "cus6d", "cus6e", "cus6f"], scale: 12 },
      "Arrests and Prosecution": { endpoints: ["cus7a", "cus7b"], scale: 6 },
      "Monitoring Of Un-cleared and Unclaimed cargo": { endpoints: ["cus8a", "cus8b"], scale: 6 },
      "Disposal Of Confiscated Gold and Narcotics": { endpoints: ["cus9a", "cus9b"], scale: 4 },
      "Recovery of Arrears": { endpoints: ["cus10a", "cus10b"], scale: 6 },
      "Management Of Warehousing bonds": { endpoints: ["cus11a", "cus11b"], scale: 6 },
      "Commissioner (Appeals)": { endpoints: ["cus12a", "cus12b"], scale: 8 },
      Audit: { endpoints: ["cus13a", "cus13b", "cus13c", "cus13d", "cus13e"], scale: 12 },
    };

    for (const [category, { endpoints, scale }] of Object.entries(endpointMap)) {
      const responses = await Promise.all(
        endpoints.map(endpoint =>
          apiClient
            .get(`/cbic/custom/${endpoint}`, {
              params: {
                month_date: newdate,
                type: "zone",
                zone_code,
              },
            })
            .then(res =>
              res.data.map(item => {
                let value = item.sub_parameter_weighted_average || 0;

                // For "Timely payment of Refunds", don't apply scale
                if (category === "Timely payment of Refunds") {
                  return { ...item, sub_parameter_weighted_average: parseFloat(value) };
                }

                // For other categories, apply scale
                return {
                  ...item,
                  sub_parameter_weighted_average: parseFloat(((value * scale) / 10).toFixed(2)),
                };
              })
            )

            .catch(err => {
              console.error(`Error fetching ${endpoint}:`, err);
              return [];
            })
        )
      );

      const filtered = responses.flat().filter(
        item => Number(item.zone_code) === Number(zone_code)
      );

      const grouped = {};

      filtered.forEach(item => {
        const zoneName = item.zone_name;
        const value = parseFloat(item.sub_parameter_weighted_average || 0);

        if (!grouped[zoneName]) {
          grouped[zoneName] = value;
        } else {
          grouped[zoneName] += value;
        }
      });

      for (const [zoneName, totalAvg] of Object.entries(grouped)) {
        allRows.push({
          s_no: rowIndex++,
          zone_name: zoneName,
          zone_code: zone_code,
          parameter: category,
          weighted_average: parseFloat(totalAvg.toFixed(2)),
          scale: scale, // Add scale to the row
        });
      }
    }

    // ➕ Add Total Row
    const totalWeightedAverage = allRows.reduce(
      (sum, row) => sum + (row.weighted_average || 0),
      0
    );
    const totalscale = allRows.reduce(
      (sum, row) => sum + (row.scale || 0), // Calculate total scale
      0
    );

    setTotalValues({
      weighted_average: parseFloat(totalWeightedAverage.toFixed(2)),
      scale: totalscale
    });


    // allRows.push({
    //   s_no: "Total",
    //   zone_name: "",
    //   zone_code: "",
    //   parameter: "",
    //   weighted_average: parseFloat(totalWeightedAverage.toFixed(2)),
    //   scale: totalscale, // Add total scale to the total row
    // });

    setTableData(allRows);
    setLoading(false);
  };


  useEffect(() => {
    if (zone_code) {
      fetchDataCom();
    }
  }, [zone_code, newdate]);

  const exportToXLS = () => {
    const exportData = tableData.map((item) => ({
      "S.No.": item.s_no,
      Zone: item.zone_name,
      Parameter: item.parameter,
      "Weighted Average Out of (100)": item.scale, // Add scale to the export
      "Weighted Average Scored": item.weighted_average,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const monthLabel = dayjs(selectedDate).format("MMMM_YYYY"); // e.g., June_2025
    const fileName = `Customs_monthly_bifurcation_summary_${monthLabel}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="body flex-grow-1">

      <div className="row">
        <div className="msg-box">
          <div className="lft-box">
            <h2>Monthly Bifurcation Summary</h2>
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


      {/* <div className="msg-box">
        <div className="lft-box col-md-11">
          <h3>Monthly Bifurcation Summary</h3>
        </div>
        <div className="rgt-box">
          <Button variant="contained" className="ml-4 cust-btn" onClick={handleBack}>
            Back
          </Button>
        </div>
      </div> */}

      <div className="date-sec">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Month and Year"
              views={["month", "year"]}
              maxDate={dayjs().subtract(1, "month").startOf("month")}
              value={selectedDate}
              onChange={onChangeDate}
              shouldDisableYear={(year) => year.year() < 2023}
              slotProps={{ field: { readOnly: true } }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="export-btn m-3">
            <button onClick={exportToXLS} className="btn btn-primary">
              Export XLS
            </button>
          </div>

          <div className="table-wrapper">
            <CSmartTable
              columns={[
                { key: "s_no", label: "S.No." },
                { key: "zone_name", label: "Zone" },
                { key: "parameter", label: "Parameter (Customs)" },
                { key: "scale", label: "Weighted Average Out Of (100)" },
                { key: "weighted_average", label: "Weighted Average Scored" },
              ]}
              items={tableData}
              itemsPerPageSelect
              itemsPerPage={itemsSelect}
              onItemsPerPageChange={handleItemsChange}
              pagination
              tableFilter
              columnSorter
              tableProps={{
                className: "add-this-class",
                responsive: true,
                hover: true,
              }}
            />

            {/* ✅ Total displayed separately */}
            <div className="total-summary mt-3 p-3 border rounded bg-light">
              <h5>Total -</h5>
              <p><strong>Weighted Average Out of (100):</strong> {totalValues.scale}</p>
              <p><strong>Weighted Average Scored:</strong> {totalValues.weighted_average}</p>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default CustomsMonthlyBifurcation;
