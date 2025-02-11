import React, { useRef, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const Cgsttopfive3d = () => {
  // Disable the AmCharts logo
  am4core.options.commercialLicense = true;
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create("chartdiv", am4charts.XYChart3D); // Use XYChart3D for 3D charts

    chart.data = [
      {
        category: "Kolkata",
        value1: 5,
        value2: 10,
        value3: 13,
        value4: 8,
        value5: 6,
        value6: 15,
        value7: 4,
        value8: 9,
        value9: 7,
        value10: 2,
        value11: 12,
      },
      {
        category: "Ahmedabad",
        value1: 8,
        value2: 12,
        value3: 13,
        value4: 11,
        value5: 8,
        value6: 2,
        value7: 4,
        value8: 9,
        value9: 7,
        value10: 2,
        value11: 6,
      },
      {
        category: "Jaipur",
        value1: 8,
        value2: 11,
        value3: 10,
        value4: 6,
        value5: 5,
        value6: 14,
        value7: 3,
        value8: 8,
        value9: 5,
        value10: 3,
        value11: 9,
      },
      {
        category: "Bengaluru",
        value1: 10,
        value2: 8,
        value3: 5,
        value4: 9,
        value5: 10,
        value6: 11,
        value7: 6,
        value8: 9,
        value9: 4,
        value10: 2,
        value11: 7,
      },
      {
        category: "Nagpur",
        value1: 9,
        value2: 4,
        value3: 12,
        value4: 3,
        value5: 11,
        value6: 12,
        value7: 0,
        value8: 3,
        value9: 7,
        value10: 8,
        value11: 11,
      },
    ];

    // Enable animated theme
    chart.preloader.disabled = true;
    am4core.useTheme(am4themes_animated);

    chart.paddingRight = 20;

    // let data = [];
    // let visits = 10;
    // for (let i = 1; i < 6; i++) { // Reduce to 5 data points for demonstration
    //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //   data.push({ category: "Category " + i, value1: Math.abs(visits), value2: Math.abs(visits * 0.7), value3: Math.abs(visits * 0.3) });
    // }

    // chart.data = data;

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.title.text = "Top 5 Zones(CGST)";
    categoryAxis.title.fontWeight = "bold";
    categoryAxis.title.fill = "#964B00";

    categoryAxis.renderer.cellStartLocation = 0.1; // Adjust the start location (0-1)
    categoryAxis.renderer.cellEndLocation = 0.8;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.max = 100;
    valueAxis.min = 0;
    valueAxis.renderer.minGridDistance = 10;
    valueAxis.title.text = "Total Sub Parameter Zone";
    valueAxis.title.fontWeight = "bold";
    valueAxis.title.fill = "#964B00";

    // Create series
    let series1 = chart.series.push(new am4charts.ColumnSeries3D());
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.name = "Registration";
    series1.stacked = true;
    series1.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series1.fill = "#ff686b";

    let series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.name = "Return Filing";
    series2.stacked = true;
    series2.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series2.fill = "#a5ffd6";

    let series3 = chart.series.push(new am4charts.ColumnSeries3D());
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.name = "Scrutiny/Assessment";
    series3.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series3.stacked = true;
    series3.fill = "#a2d2ff";

    let series4 = chart.series.push(new am4charts.ColumnSeries3D());
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "value4";
    series4.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series4.name = "Investigation";
    series4.stacked = true;
    series4.fill = "#ffafcc";

    let series5 = chart.series.push(new am4charts.ColumnSeries3D());
    series5.dataFields.categoryX = "category";
    series5.dataFields.valueY = "value5";
    series5.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series5.name = "Adjudication";
    series5.stacked = true;
    series5.fill = "#fcf5c9";

    let series6 = chart.series.push(new am4charts.ColumnSeries3D());
    series6.dataFields.categoryX = "category";
    series6.dataFields.valueY = "value6";
    series6.name = "Adjudication(Legacy Cases)";
    series6.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series6.stacked = true;
    series6.fill = "#d4bffb";

    let series7 = chart.series.push(new am4charts.ColumnSeries3D());
    series7.dataFields.categoryX = "category";
    series7.dataFields.valueY = "value7";
    series7.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series7.name = "Refunds";
    series7.stacked = true;
    series7.fill = "#35c9c2";

    let series8 = chart.series.push(new am4charts.ColumnSeries3D());
    series8.dataFields.categoryX = "category";
    series8.dataFields.valueY = "value8";
    series8.name = "Recovery of Arrears";
    series8.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series8.stacked = true;
    series8.fill = "#ee7214";

    let series9 = chart.series.push(new am4charts.ColumnSeries3D());
    series9.dataFields.categoryX = "category";
    series9.dataFields.valueY = "value9";
    series9.name = "Arrest & Prosecution";
    series9.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series9.stacked = true;
    series9.fill = "#f7b787";

    let series10 = chart.series.push(new am4charts.ColumnSeries3D());
    series10.dataFields.categoryX = "category";
    series10.dataFields.valueY = "value10";
    series10.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series10.name = "Audit";
    series10.stacked = true;
    series10.fill = "#f9e8d9";

    let series11 = chart.series.push(new am4charts.ColumnSeries3D());
    series11.dataFields.categoryX = "category";
    series11.dataFields.valueY = "value11";
    series11.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series11.name = "Appeals";
    series11.stacked = true;
    series11.fill = "#527853";

    const averageLineSeries = chart.series.push(new am4charts.LineSeries());
    averageLineSeries.data = chart.data.map((item) => ({
      category: item.category,
      average: 74.75,
    }));
    averageLineSeries.dataFields.categoryX = "category";
    averageLineSeries.dataFields.valueY = "average";
    averageLineSeries.strokeWidth = 4;
    averageLineSeries.stroke = am4core.color("#888000"); // Color of the average line
    averageLineSeries.tooltipText = "Average : {valueY}";
    averageLineSeries.name = "Average";

    let title = chart.titles.create();
    title.text = "CGST Top Five Zones";
    title.fontSize = 17;
    title.fontFamily="Times New Roman"
    title.align="center";
    title.fill="#964B00";
    title.fontWeight="bold";

    let bullet = averageLineSeries.bullets.push(new am4charts.Bullet());

    bullet.adapter.add("locationX", (location, target) => {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.categoryX === "Bengaluru") {
        let labelBullet = bullet.createChild(am4core.Label);
        labelBullet.text = "Average: {valueY}";
        labelBullet.dy = -80; // Adjust the position of the label
        labelBullet.dx = -60;
        labelBullet.fontSize = "14px";
        labelBullet.fill = averageLineSeries.stroke; // Match the color of the line
      }
      return location;
    });

    const labelBullet = series2.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{values.valueY.total}";
    labelBullet.label.dy = -20; // Position the label above the bar
    labelBullet.label.fill = am4core.color("#000000");
    labelBullet.label.isMeasured = false; // Disable interaction

    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.cursorOverStyle =
      am4core.MouseCursorStyle.default;
    chart.legend.itemContainers.template.interactionsEnabled = false;
    chart.legend.fontSize = "12px";

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  return (
    <>
      <div id="chartdiv" style={{ width: "100%", height: "600px" }}></div>
    </>
  );
};

export default Cgsttopfive3d;
