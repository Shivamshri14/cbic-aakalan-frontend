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

const CGSTMonthlyBifurcation = ({ selectedDate, onChangeDate }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const [totalValues, setTotalValues] = useState({ scale: 0, weighted_average: 0 });


  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const zone_code = Number(queryParams.zone_code); // ensure numeric zone_code

  const [itemsSelect, setItemsSelect] = useState(() => {
    const savedItems = localStorage.getItem("itemsSelect");
    return savedItems ? Number(savedItems) : 5;
  });
  const handleItemsChange = (number) => {
    setItemsSelect(number);
  };

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  const endpointMap = {
    Registration: ["gst1a", "gst1b", "gst1c", "gst1d", "gst1e", "gst1f"],
    "Return Filing": ["gst2"],
    "Scrutiny & Assessment": ["gst3a", "gst3b"],
    Investigation: ["gst4a", "gst4b", "gst4c", "gst4d"],
    Adjudication: ["gst5a", "gst5b"],
    "Adjudication(legacy cases)": ["gst6a", "gst6b", "gst6c", "gst6d"],
    Refunds: ["gst7"],
    "Recovery of Arrears": ["gst8a", "gst8b"],
    "Arrest & Prosecution": ["gst9a", "gst9b"],
    Audit: ["gst10a", "gst10b", "gst10c"],
    Appeals: ["gst11a", "gst11b", "gst11c", "gst11d"],

  };

  const fetchData = async () => {
    setLoading(true);
    let allRows = [];
    let rowIndex = 1;

    const scaleMap = {
      Audit: 12,
      "Recovery of Arrears": 8,
      "Arrest & Prosecution": 6,
      Refunds: 5,
      "Return Filing": 5,
      Appeals: 12,
      Registration: 12,
      // Others not scaled (default weight = 10)
    };

    for (const [category, endpoints] of Object.entries(endpointMap)) {
      const scale = scaleMap[category] || 10; // Use default 10 if not in scaleMap

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          apiClient
            .get(`/cbic/${endpoint}`, {
              params: {
                month_date: newdate,
                type: "zone",
                zone_code,
              },
            })
            .then((res) =>
              res.data.map(item => ({
                ...item,
                sub_parameter_weighted_average: parseFloat(
                  ((item.sub_parameter_weighted_average || 0) * scale / 10).toFixed(2)
                )
              }))
            )
            .catch((err) => {
              console.error(`Error fetching ${endpoint}:`, err);
              return [];
            })
        )
      );

      const filtered = responses.flat().filter(
        (item) => Number(item.zone_code) === Number(zone_code)
      );

      const grouped = {};

      filtered.forEach((item) => {
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
          scale: scale,
          // weighted_average_by_parameter_out_of: scale,
        });
      }
    }

    const totalWeightedAverage = allRows.reduce(
      (sum, row) => sum + (row.weighted_average || 0),
      0
    );
    const totalscale = allRows.reduce((sum, row) => sum + (row.scale || 0), 0);

    // Save total values for summary box
    setTotalValues({
      scale: totalscale,
      weighted_average: parseFloat(totalWeightedAverage.toFixed(2))
    });


    // allRows.push({
    //   s_no: "Total",
    //   zone_name: "",
    //   zone_code: "",
    //   parameter: "",
    //   weighted_average: parseFloat(totalWeightedAverage.toFixed(2)),
    //   scale: totalscale,
    // });

    setTableData(allRows);
    setLoading(false);
  };


  useEffect(() => {
    if (zone_code) {
      fetchData();
    }
  }, [zone_code, newdate]);

  const exportToXLS = () => {
    const exportData = tableData.map((item) => ({
      "S.No.": item.s_no,
      Zone: item.zone_name,
      Parameter: item.parameter,
      "Weighted Average Out of (100)": item.scale,
      "Weighted Average Scored": item.weighted_average,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const monthLabel = dayjs(selectedDate).format("MMMM_YYYY"); // e.g., June_2025
    const fileName = `CGST_monthly_bifurcation_summary_${monthLabel}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };


  return (
    <div className="body flex-grow-1 custom-sec">
      <div className="msg-box">
        <div className="lft-box col-md-11">
          <h3>Monthly Bifurcation Summary</h3>
        </div>
        <div className="rgt-box">
          <Button variant="contained" className="ml-4 cust-btn" onClick={handleBack}>
            Back
          </Button>
        </div>
      </div>

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

          <>
            <div className="export-btn m-3">
              <button onClick={exportToXLS} className="btn btn-primary">
                Export XLS
              </button>
            </div>

            <CSmartTable
              columns={[
                { key: "s_no", label: "S.No." },
                { key: "zone_name", label: "Zone" },
                { key: "parameter", label: "Parameter (CGST)" },
                { key: "scale", label: "Weighted Average Out of (100)" },
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

            {/* ✅ Total Summary Box */}
            <div className="total-summary mt-3 p-3 border rounded bg-light">
              <h5>Total -</h5>
              <p><strong>Weighted Average Out of (100):</strong> {totalValues.scale}</p>
              <p><strong>Weighted Average Scored:</strong> {totalValues.weighted_average}</p>
            </div>
          </>

        </>
      )}
    </div>
  );
};

export default CGSTMonthlyBifurcation;
