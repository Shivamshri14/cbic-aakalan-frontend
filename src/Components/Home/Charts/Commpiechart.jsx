import React from "react";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import ZuneTheme from "fusioncharts/themes/fusioncharts.theme.zune";

const Commpiechart = () => {
  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const dataSource = {
    chart: {
    //   caption: "Split of revenue by product categories",
    //   subCaption: "Last year",
    //   showPercentInTooltip: 1,
    //   decimals: 1,
      enableSmartLabels:0,
      labelDistance:-15,
      showLabels:0,
      showValues:1,
      showpercentvalues:0,
      showLegend:1,
      manageLabelOverflow:1,
       legendPosition: "bottom",
       useDataPlotColorForLabels:1,
       plottooltext:"<b>$label</b>{br}<b>Absolute Value:</b>$value{br} <b>Percentage:</b>$percentValue",
       legendItem:"$label",
       legendNumColumns:2,
       interactiveLegend:1,
       plotHoverEffect:1,
      //Theme
      theme: "zune",
    },
    data: [
      {
        label: "Registration",
        value: 5,
        color: "#4472c4",
      },
      {
        label: "Return Filing",
        value: 10,
        color: "#ed7d31",
      },
      {
        label: "Scrutiny/Assessment",
        value: 13,
        color: "#264442",
      },
      {
        label: "Investigation",
        value: 8,
        color: "#FFBF00",
      },
      {
        label: "Adjudication",
        value: 6,
        color: "#5B9BD5",
      },
      {
        label: "Adjudication(Legacy Cases)",
        value: 15,
        color: "#6EAC44",
      },
      {
        label: "Refunds",
        value: 4,
        color: "#A5A5A5",
      },
      {
        label: "Recovery of Arrears",
        value: 9,
        color: "#9E480E",
      },
      {
        label: "Arrest & Prosecution",
        value: 7,
        color: "#636363",
      },
      {
        label: "Audit",
        value: 2,
        color: "#946C00",
      },
      {
        label: "Appeals",
        value: 12,
        color: "#5D87AD",
      },
    ],
    legend:{
      position:"bottom",
      itemValueText:"",
      showPercentValues:0,
    },
  };

  return (
    <>
      <ReactFusioncharts
        type="pie3d"
        width="100%"
        height="350"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </>
  );
};

export default Commpiechart;
