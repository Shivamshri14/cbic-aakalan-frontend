import React from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';


const Cgstbottomfive = () => {

// Resolves charts dependancy
charts(FusionCharts);
ZuneTheme(FusionCharts);

const averageReturnFiling = 74.75; 

const dataSource = {
chart: {
    caption: "CGST",
    subcaption: "Bottom 5 Zones",
    yAxisMinValue: "0",
    yAxisMaxValue: "100",
    yAxisStep: "10",
    numDivLines: "10",
    xAxisname: "Bottom 5 Zones (CGST)",
    yAxisName: "Total Sub parameter Zone",
    showvalues: "0",
    showsum: "1",
    theme: "zune",
    legendbgalpha: "0",
    interactiveLegend:'1',
    plottooltext:
      "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>",
    // stack100percent: "1",
   
    // plotSpacePercent: "30"
    // "seriesname": "Profit %",
    // "renderAs": "line",
    // "parentYAxis": "S",
  },
  categories: [
    {
      category: [
        {
          label: "Hyderabad"
        },
        {
          label: "Guwahati"
        },
        {
          label: "Delhi"
        },
        {
            label: "Chennai"
        },
        {
            label: "Lucknow"
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: "Registration",
      data: [
        {
          value: "12"
        },
        {
          value: "3"
        },
        {
          value: "12"
        },
        {
          value: "2"
        },
        {
          value: "6"
        }
      ],
        color : "#31363F"
    },
    {
        seriesname: "Return Filing",
        data: [
          {
            value: "3"
          },
          {
            value: "13"
          },
          {
            value: "10"
          },
          {
            value: "13"
          },
          {
            value: "8"
          }
        ],
        color: "#00ffcc"
      },
      {
        seriesname: "Scrutiny/Assessment",
        data: [
          {
            value: "2"
          },
          {
            value: "8"
          },
          {
            value: "8"
          },
          {
            value: "8"
          },
          {
            value: "6"
          }
        ],
        color : "#a1ff0a"
      },
      {
        seriesname: "Investigation",
        data: [
          {
            value: "1"
          },
          {
            value: "5"
          },
          {
            value: "5"
          },
          {
            value: "5"
          },
          {
            value: "12"
          }
        ],
        color : "#ff00ff"
      },
      {
        seriesname: "Adjudication",
        data: [
          {
            value: "9"
          },
          {
            value: "2"
          },
          {
            value: "1"
          },
          {
            value: "1"
          },
          {
            value: "3"
          }
        ],
        color : "#DFF5FF"
      },
      {
        seriesname: "adjudication(legacy cases)",
        data: [
          {
            value: "3"
          },
          {
            value: "4"
          },
          {
            value: "3"
          },
          {
            value: "15"
          },
          {
            value: "7"
          }
        ],
        color : "#ffff00"
      },
      {
        seriesname: "Refunds",
        data: [
          {
            value: "9"
          },
          {
            value: "9"
          },
          {
            value: "9"
          },
          {
            value: "9"
          },
          {
            value: "6"
          }
        ],
        color : "#cc0077"

      },
      {
        seriesname: "Recovery of Arrears",
        data: [
          {
            value: "2"
          },
          {
            value: "4"
          },
          {
            value: "1"
          },
          {
            value: "4"
          },
          {
            value: "3"
          }
        ],
        color: "#59D5E0"

      },
      {
        seriesname: "Arrest & Prosecution",
        data: [
          {
            value: "2"
          },
          {
            value: "2"
          },
          {
            value: "2"
          },
          {
            value: "2"
          },
          {
            value: "4"
          }
        ],
        color :"#ff8800"

      },
      {
        seriesname: "Audit",
        data: [
          {
            value: "7"
          },
          {
            value: "7"
          },
          {
            value: "7"
          },
          {
            value: "7"
          },
          {
            value: "11"
          }
        ],
        color : "#40916c"

      },
      {
        seriesname: "Appeals",
        data: [
          {
            value: "4"
          },
          {
            value: "6"
          },
          {
            value: "6"
          },
          {
            value: "2"
          },
          {
            value: "5"
          }
        ]
      },
      {
        seriesname: "National Avg Return Filing",
        renderAs: "Line",
        data: [
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling },
          { value: averageReturnFiling }
        ],
        lineThickness: "5",
        color: "#ff0000",
        drawAnchors:"0",
        // alpha: "100",
        // dashed: "1",
        // dashLen: "4",
        // dashGap: "2",
        // color : "#3572EF"
      }
  ],
  annotations: {
    groups: [
      {
        items: [
          {
            id: "avg-text",
            type: "text",
            text: `National Average: ${averageReturnFiling}`,
            align: "right",
            x: "$chartEndX - 50",
            y: "$chartStartY + 70",
            fontSize: "14",
            color: "#000000"
          }
        ]
      }
    ]
  }
};
    
  return (
    <>
  <ReactFusioncharts
        type="stackedcolumn3dline"
        width="100%"
        height="650"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </>
  )
}

export default Cgstbottomfive