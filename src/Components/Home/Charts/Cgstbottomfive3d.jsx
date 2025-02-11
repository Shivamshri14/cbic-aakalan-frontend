import React, { useRef, useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const Cgstbottomfive3d = () => {
  // Disable the AmCharts logo
  am4core.options.commercialLicense = true;
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = am4core.create("chartdivbottom", am4charts.XYChart3D); // Use XYChart3D for 3D charts

    chart.data = [
      {
        category: "Hyderabad",
        value1: 12,
        value2: 3,
        value3: 2,
        value4: 1,
        value5: 9,
        value6: 3,
        value7: 9,
        value8: 2,
        value9: 2,
        value10: 7,
        value11: 4,
      },
      {
        category: "Guwahati",
        value1: 3,
        value2: 13,
        value3: 8,
        value4: 5,
        value5: 2,
        value6: 4,
        value7: 9,
        value8: 4,
        value9: 2,
        value10: 7,
        value11: 6,
      },
      {
        category: "Delhi",
        value1: 12,
        value2: 10,
        value3: 8,
        value4: 5,
        value5: 1,
        value6: 3,
        value7: 9,
        value8: 1,
        value9: 2,
        value10: 7,
        value11: 6,
      },
      {
        category: "Chennai",
        value1: 2,
        value2: 13,
        value3: 8,
        value4: 5,
        value5: 1,
        value6: 15,
        value7: 9,
        value8: 4,
        value9: 2,
        value10: 7,
        value11: 2,
      },
      {
        category: "Lucknow",
        value1: 6,
        value2: 8,
        value3: 6,
        value4: 12,
        value5: 3,
        value6: 7,
        value7: 6,
        value8: 3,
        value9: 4,
        value10: 11,
        value11: 5,
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
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.title.text = "Bottom 5 Zones(CGST)";
    categoryAxis.title.fontWeight = "bold";
    categoryAxis.title.fill = "#964B00";

    categoryAxis.renderer.cellStartLocation = 0.1;
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
    series1.fill = "#FF0000";

    let series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.name = "Return Filing";
    series2.stacked = true;
    series2.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series2.fill = "#00FF15";

    let series3 = chart.series.push(new am4charts.ColumnSeries3D());
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.name = "Scrutiny/Assessment";
    series3.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series3.stacked = true;
    series3.fill = "#00BFFF";

    let series4 = chart.series.push(new am4charts.ColumnSeries3D());
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "value4";
    series4.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series4.name = "Investigation";
    series4.stacked = true;
    series4.fill = "#FF7700";

    let series5 = chart.series.push(new am4charts.ColumnSeries3D());
    series5.dataFields.categoryX = "category";
    series5.dataFields.valueY = "value5";
    series5.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series5.name = "Adjudication";
    series5.stacked = true;
    series5.fill = "#FF0095";

    let series6 = chart.series.push(new am4charts.ColumnSeries3D());
    series6.dataFields.categoryX = "category";
    series6.dataFields.valueY = "value6";
    series6.name = "Adjudication(Legacy Cases)";
    series6.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series6.stacked = true;
    series6.fill = "#00FBFF";

    let series7 = chart.series.push(new am4charts.ColumnSeries3D());
    series7.dataFields.categoryX = "category";
    series7.dataFields.valueY = "value7";
    series7.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series7.name = "Refunds";
    series7.stacked = true;
    series7.fill = "#9B5DE5";

    let series8 = chart.series.push(new am4charts.ColumnSeries3D());
    series8.dataFields.categoryX = "category";
    series8.dataFields.valueY = "value8";
    series8.name = "Recovery of Arrears";
    series8.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series8.stacked = true;
    series8.fill = "#9E480E";

    let series9 = chart.series.push(new am4charts.ColumnSeries3D());
    series9.dataFields.categoryX = "category";
    series9.dataFields.valueY = "value9";
    series9.name = "Arrest & Prosecution";
    series9.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series9.stacked = true;
    series9.fill = "#f7b538";

    let series10 = chart.series.push(new am4charts.ColumnSeries3D());
    series10.dataFields.categoryX = "category";
    series10.dataFields.valueY = "value10";
    series10.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series10.name = "Audit";
    series10.stacked = true;
    series10.fill = "#283618";

    let series11 = chart.series.push(new am4charts.ColumnSeries3D());
    series11.dataFields.categoryX = "category";
    series11.dataFields.valueY = "value11";
    series11.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
    series11.name = "Appeals";
    series11.stacked = true;
    series11.fill = "#5D87AD";

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
    averageLineSeries.textDecoration = "74.75";
    averageLineSeries.name = "Average";

    let title = chart.titles.create();
    title.text = "CGST Bottom Five Zones";
    title.fontSize = 17;
    title.fontFamily="Times New Roman";
    title.align="center";
    title.fill="#964B00";
    title.fontWeight="bold";

    let bullet = averageLineSeries.bullets.push(new am4charts.Bullet());

    // Add label to the bullet
    bullet.adapter.add("locationX", (location, target) => {
      const dataItem = target.dataItem;
      if (dataItem && dataItem.categoryX === "Chennai") {
        let labelBullet = bullet.createChild(am4core.Label);
        labelBullet.text = "Average:{valueY}";
        labelBullet.dy = -80;
        labelBullet.dx = -60;
        labelBullet.fontSize = "14px";
        labelBullet.fill = averageLineSeries.stroke;
      }
      return location;
    });

    // Add legend
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
      <div id="chartdivbottom" style={{ width: "100%", height: "600px" }}></div>
    </>
  );
};

export default Cgstbottomfive3d;
