import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import React from 'react';
import ReactFusioncharts from "react-fusioncharts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';

const Customtopfive = () => {

    // Resolves charts dependancy
charts(FusionCharts);
ZuneTheme(FusionCharts);

const allbottom=[
  {
    value:"80", color:"#FF0000" ,label: "Hydrabad",
               link:'/'
  },
  {
    value:"79", color:"#FFFF00",label: "Kochi",
               link:'/'
  },
  {
    value:"78", color:"#00FF00", label: "Tiruchirappalli",
               link:'/'
  },
  {
    value:"77", color:"#0000FF",label: "Patna",
               link:'/'
  },
  {
    value:"75", color:"#00ffff",  label: "Mumbai",
               link:'/'
  },
];

const averageReturnFiling = 74.75; 

const dataSource = {
  chart: {
    caption: "Custom",
    subcaption: "Top 5 Zones",
    yAxisMinValue: "0",
    yAxisMaxValue: "100",
    yAxisStep: "10",
    numDivLines: "10",
    xAxisname: "Top 5 Zones (Custom)",
    yAxisName: "All Parameters (Zone Wise)",
    showvalues: "0",
    showsum: "1",
    legendbgalpha: "0",
    plottooltext:
      "<b>Zone Name-: $label</b>{br}Total Score: $value</div>",
    theme: "zune",
    drawAnchors: "0",
  },
  categories: [
          {
            category: allbottom.map(index=>({label:index.label}))
          }
        ],
   
  dataset: [
    {
      data:allbottom.map(index=>({value:index.value, color:index.color}))
    },
    // {
    //   seriesname: "National Avg Return Filing",
    //   renderAs: "Line",
    //   data: allbottom.map(()=>({value:averageReturnFiling})),
    //   lineThickness: "5",
    //   color: "#ff0000",
    //   alpha: "100",
    //   drawAnchors:"0",
    //   // dashed: "1",
    //   // dashLen: "4",
    //   // dashGap: "2",
    //   // color : "#3572EF"
    // }
  ],
  annotations: {
    groups: [
      {
        items: [
          {
            id: "avg-text",
            type: "text",
            // text: `National Average: ${averageReturnFiling}`,
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
  // dataset: [
  //   {
  //     seriesname: "Timely Payment of Refunds",
  //     data: [
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "2"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Management of Export Obligation [EPCG]",
  //     data: [
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "13"
  //       },
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "5"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Management of Export Obligation [AA]",
  //     data: [
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "8"
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
  //         value: "10"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "13"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Adjudication",
  //     data: [
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "11"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "10"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Investigation",
  //     data: [
  //       {
  //         value: "10"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "12"
  //       },
  //       {
  //         value: "11"
  //       },
  //       {
  //         value: "6"
  //       }
  //     ]
  //   },
  //   {
  //     seriesname: "Arrests and Prosecution",
  //     data: [
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "9"
  //       },
  //       {
  //         value: "0"
  //       },
  //       {
  //         value: "9"
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
  //         value: "5"
  //       },
  //       {
  //         value: "4"
  //       },
  //       {
  //         value: "3"
  //       },
  //       {
  //         value: "4"
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
  //         value: "6"
  //       },
  //       {
  //         value: "2"
  //       },
  //       {
  //         value: "7"
  //       },
  //       {
  //         value: "3"
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
  //         value: "4"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "8"
  //       },
  //       {
  //         value: "7"
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
  //         value: "8"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "5"
  //       },
  //       {
  //         value: "6"
  //       },
  //       {
  //         value: "5"
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
  //         value: "3"
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
  //         value: "1"
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
};




  return (
    <>

<ReactFusioncharts
        type="stackedcolumn3dline"
        width="100%"
        height="500"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </>
  );
};

export default Customtopfive;