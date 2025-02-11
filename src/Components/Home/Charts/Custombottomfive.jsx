import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import React from 'react';
import ReactFusioncharts from "react-fusioncharts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';


const Custombottomfive = () => {

    // Resolves charts dependancy
charts(FusionCharts);
ZuneTheme(FusionCharts);

const alltop=[
  {
    label: "Ahmedabad",
               link:'/',value:58, color:"#cc0077",
  },
  {
    label: "Bengaluru",
               link: "/",value:67, color:"#ff8800",
  },
  {
    label: "Chennai",
               link: "/",value:68, color:"#40916c",
  },
  {
    label: "Delhi",
    link: "/", value:69, color:"#551a8b",
  },
  {
    label: "Kolkata",
    link: "/", value:73, color:"#3d0c02",
  },
];
const averageReturnFiling = 74.75; 

const dataSource4 = {
  chart: {
    caption: "Custom",
    subcaption: "Bottom 5 Zones",
    yAxisMinValue: "0",
    yAxisMaxValue: "100",
    yAxisStep: "10",
    numDivLines: "10",
    xAxisname: "Bottom 5 Zones (Custom)",
    yAxisName: "All Parameters (Zone Wise)",
    showvalues: "0",
    showsum: "1",
    legendbgalpha: "0",
    plottooltext:
      "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName</div>",
    // stack100percent: "1",
    theme: "zune",
    drawAnchors: "0",
    // plotSpacePercent: "30"
    "seriesname": "Profit %",
    "renderAs": "line",
    "parentYAxis": "S",
  },

  categories: [
          {
            category: alltop.map(index=>({label:index.label}))
          }
        ],
   
  dataset: [
    {
      data:alltop.map(index=>({value:index.value, color:index.color}))
    },
  
  // categories: [
  //   {
  //     category: [
  //       {
  //         label: "Ahemdabad"
  //       },
  //       {
  //         label: "Bengaluru"
  //       },
  //       {
  //         label: "Chennai"
  //       },
  //       {
  //           label: "Delhi"
  //       },
  //       {
  //           label: "Kolkata"
  //       }
  //     ]
  //   }
  // ],
  // dataset: [
  //   {
  //     seriesname: "Timely Payment of Refunds",
  //     data: [
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "13"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Management of Export Obligation [EPCG]",
  //     data: [
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "13"
  //       },
  //       {
  //         value: "10"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "13"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Management of Export Obligation [AA]",
  //     data: [
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "8"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Disposal/Pendency Of Provisional Assessments",
  //     data: [
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "5"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Adjudication",
  //     data: [
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "1"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Investigation",
  //     data: [
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "15"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Arrests and Prosecution",
  //     data: [
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "9"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Monitoring of uncleared and unclaimed cargo",
  //     data: [
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "4"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Disposal Of Confiscated Gold and NDPS",
  //     data: [
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "2"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Recovery of Arrears",
  //     data: [
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "7"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Management of Warehousing Bonds",
  //     data: [
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "2"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Commissionaer(Appeals)",
  //     data: [
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "1"
  //       },
  //       {
  //         value: "1"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Audit",
  //     data: [
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "3"
  //       }
  //     ]
  //   }
  // ]
  {
    seriesname: "National Avg Return Filing",
    renderAs: "Line",
    data: alltop.map(()=>({value:averageReturnFiling})),
    lineThickness: "5",
    color: "#ff0000",
    alpha: "100",
    drawAnchors:"0",
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
        height="500"
        dataFormat="JSON"
        dataSource={dataSource4}
      />
    </>
  );
};

export default Custombottomfive;