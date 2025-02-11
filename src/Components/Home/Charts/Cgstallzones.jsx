import FusionCharts from "fusioncharts";
import { default as charts } from "fusioncharts/fusioncharts.charts";
import ZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";
import React from "react";
import ReactFusioncharts from "react-fusioncharts";

const generateToolText = (value, seriesColor, textColor, border = true) => {
  const borderStyle = border ? "border-color: #ffffff " : "border: none;";
  return `<div style='background-color: ${seriesColor}; color: ${textColor}; padding: 5px; ${borderStyle}'>${value}</div>`;
};

const Cgstallzones = () => {
  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const averageReturnFiling = 74.75;

  const dataSource1 = {
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
      yAxisName: "Total Sub parameter Zone",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",

      plottooltext:
        "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
      theme: "zune",
      useRoundEdges: "1",
      drawAnchors: "0",
      // seriesname: "Profit %",
      // renderAs: "line",
      // parentYAxis: "S",
    },
    categories: [
      {
        category: [
          {
            label: "Kolkata",
            link: "/kolkata",
          },
          {
            label: "Ahmedabad",
            link: "/",
          },
          {
            label: "Jaipur",
            link: "/",
          },
          {
            label: "Bengaluru",
            link: "/",
          },
          {
            label: "Nagpur",
            link: "/",
          },
          {
            label: "Hyderabad",
            link: "/",
          },
          {
            label: "Guwahati",
            link: "/",
          },
          {
            label: "Delhi",
            link: "/",
          },
          {
            label: "Chennai",
            link: "/",
          },
          {
            label: "Lucknow",
            link: "/",
          },
        ],
      },
    ],
    dataset: [
      {
        seriesname: "Registration",
        data: [
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "10",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },

          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#31363F",
              "#ffffff",
              false
            ),
          },
        ],
        color: "#31363F",
      },
      {
        seriesname: "Return Filing",
        data: [
          {
            value: "10",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },

          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "13",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "10",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "13",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#00ffcc",
              "#000000",
              false
            ),
          },
        ],
        color: "#00ffcc",
      },
      {
        seriesname: "Scrutiny/Assessment",
        data: [
          {
            value: "13",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "13",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "10",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },

          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#a1ff0a",
              "#000000",
              false
            ),
          },
        ],
        color: "#a1ff0a",
      },

      {
        seriesname: "Investigation",
        data: [
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },

          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
          {
            value: "1",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff00ff",
              false
            ),
          },
        ],
        color: "#ff00ff",
      },
      {
        seriesname: "Adjudication",
        data: [
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "10",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },

          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "1",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "1",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#DFF5FF",
              "#000000",
              false
            ),
          },
        ],
        color: "#DFF5FF",
      },
      {
        seriesname: "Adjudication(Legacy Cases)",
        data: [
          {
            value: "15",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "14",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },

          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "15",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ffff00",
              "#000000",
              false
            ),
          },
        ],
        color: "#ffff00",
      },
      {
        seriesname: "Refunds",
        data: [
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "0",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },

          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#cc0077",
              false
            ),
          },
        ],
        color: "#cc0077",
      },
      {
        seriesname: "Recovery of Arrears",
        data: [
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },

          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "1",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#59D5E0",
              "#000000",
              false
            ),
          },
        ],
        color: "#59D5E0",
      },
      {
        seriesname: "Arrest & Prosecution",
        data: [
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },

          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#ff8800",
              false
            ),
          },
        ],
        color: "#ff8800",
      },
      {
        seriesname: "Audit",
        data: [
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "3",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "8",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },

          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#40916c",
              false
            ),
          },
        ],
        color: "#40916c",
      },
      {
        seriesname: "Appeals",
        data: [
          {
            value: "12",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "9",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "7",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "11",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },

          {
            value: "5",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "2",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "6",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
          {
            value: "4",
            toolText: generateToolText(
              "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
              "#3980AE",
              false
            ),
          },
        ],
        color: "#3980AE",
      },

      // Adding a simulated trendline for average registration
      // {
      //   seriesname: "Avg Registration",
      //   renderAs: "line",
      //   data: [
      //     { value: averageRegistration },
      //     { value: averageRegistration },
      //     { value: averageRegistration },
      //     { value: averageRegistration },
      //     { value: averageRegistration }
      //   ],
      //   lineThickness: "2",
      //   color: "#29C3BE",
      //   alpha: "100",
      //   dashed: "1",
      //   dashLen: "4",
      //   dashGap: "2"
      // },
      // Adding a simulated trendline for average return filing
      {
        seriesname: "Avg Return Filing",
        // parentYAxis:"S",
        // showValues:"0",
        renderAs: "Line",
        data: [
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
        ],
        lineThickness: "5",
        color: "#ff0000",
        // vLine:true,
        // linePosition:0.5,
        // alpha: "100",
        // dashed: "1",
        // dashLen: "4",
        // dashGap: "2",
      }
    ],
    annotations: {
      groups: [
        {
          items: [
            {
              id: "avg-text",
              type: "text",
              text: `Average: ${averageReturnFiling}`,
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
      <ReactFusioncharts
        type="stackedcolumn3dline"
        width="100%"
        height="700"
        dataFormat="JSON"
        dataSource={dataSource1}
      />
    </>
  );
};

export default Cgstallzones;
