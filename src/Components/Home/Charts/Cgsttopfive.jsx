import FusionCharts from "fusioncharts";
import { default as charts } from "fusioncharts/fusioncharts.charts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';
import React from 'react';
import ReactFusioncharts from "react-fusioncharts";
import { useNavigate } from "react-router-dom";

const generateToolText = (value, seriesColor, textColor, border=true) => {
  const borderStyle = border ? 'border-color: #ffffff ' : 'border: none;';
  return `<div style='background-color: ${seriesColor}; color: ${textColor}; padding: 5px; ${borderStyle}'>${value}</div>`;
};
const Cgsttopfive = () => {

  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  

  // const averageRegistration = 48; 
  const averageReturnFiling = 74.75; 

  const dataSource = {
    chart: {
       tooltip: {
      toolTipBorderColor: '#ffffff',
       toolTipBorderThickness: '0'
       },
      caption: "CGST",
      subcaption: "Top 5 Zones",
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "Top 5 Zones (CGST)",
      yAxisName: "Total Score of Parameter Zone",
      showvalues: "0",
      showsum: "1",
      legendbgalpha: "0",
      interactiveLegend:'1',
      plottooltext: "<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>",
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
             "link":'/kolkata'
          },
          {
            label: "Ahmedabad",
             "link": "/"
          },
          {
            label: "Jaipur",
             "link": "/"
          },
          {
              label: "Bengaluru",
               "link": "/"
          },
          {
              label: "Nagpur",
              "link": "/"
          }
        ]
      }
    ],
    dataset: [
      {
        seriesname: "Registration",
        data: [
          { value: "5", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#31363F", "#ffffff", false) },
          { value: "8", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#31363F", "#ffffff", false) },
          { value: "8", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#31363F", "#ffffff", false) },
          { value: "10", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#31363F", "#ffffff", false) },
          { value: "9", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#31363F", "#ffffff", false) }
        ],
        color : "#31363F", 
      },
      {
        seriesname: "Return Filing",
        data: [
          { value: "10", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#00ffcc", "#000000", false) },
          { value: "12", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#00ffcc", "#000000", false)  },
          { value: "11", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#00ffcc", "#000000" , false)  },
          { value: "8" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#00ffcc", "#000000", false) },
          { value: "4" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#00ffcc", "#000000", false) }
        ],
        color: "#00ffcc"
        
      },
      {
        seriesname: "Scrutiny/Assessment",
        data: [
          { value: "13", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#a1ff0a", "#000000", false)  },
          { value: "13", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#a1ff0a" , "#000000", false)  },
          { value: "10", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#a1ff0a" ,"#000000", false)  },
          { value: "5", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#a1ff0a" , "#000000", false)  },
          { value: "12", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#a1ff0a" , "#000000", false)  }
        ],
        color: "#a1ff0a"
      },
      
      {
        seriesname: "Investigation",
        data: [
          { value: "8" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff00ff", false)  },
          { value: "11", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff00ff", false)  },
          { value: "6", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff00ff", false)  },
          { value: "9", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff00ff", false)  },
          { value: "3", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff00ff", false)  }
        ],
        color : "#ff00ff"
      },
      {
        seriesname: "Adjudication",
        data: [
          { value: "6"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#DFF5FF", "#000000", false) },
          { value: "8"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#DFF5FF", "#000000", false) },
          { value: "5"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#DFF5FF", "#000000", false) },
          { value: "10"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#DFF5FF", "#000000", false) },
          { value: "11" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#DFF5FF", "#000000", false)  }
        ],
        color : "#DFF5FF"
      },
      {
        seriesname: "Adjudication(Legacy Cases)",
        data: [
          { value: "15"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ffff00", "#000000", false)},
          { value: "2" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ffff00", "#000000", false)},
          { value: "14", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ffff00", "#000000", false) },
          { value: "11", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ffff00", "#000000", false) },
          { value: "12" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ffff00", "#000000", false)}
        ],
         color : "#ffff00" 
      },
      {
        seriesname: "Refunds",
        data: [
          { value: "4" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#cc0077", false)   },
          { value: "4" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#cc0077", false)  },
          { value: "3" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#cc0077", false)  },
          { value: "6"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#cc0077", false) },
          { value: "0" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#cc0077", false)  }
        ],
        color : "#cc0077"
      },
      {
        seriesname: "Recovery of Arrears",
        data: [
          { value: "9"  , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#59D5E0", "#000000", false)  },
          { value: "9" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#59D5E0", "#000000", false)},
          { value: "8", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#59D5E0", "#000000", false) },
          { value: "9", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#59D5E0", "#000000", false) },
          { value: "3" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#59D5E0", "#000000", false)}
        ],
        color: "#59D5E0"
      },
      {
        seriesname: "Arrest & Prosecution",
        data: [
          { value: "7", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff8800", false)},
          { value: "7", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff8800", false),},
          { value: "5", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff8800", false) },
          { value: "4", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff8800", false)},
          { value: "7", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#ff8800", false)}
        ],
        color :"#ff8800"
      },
      {
        seriesname: "Audit",
        data: [
          { value: "2", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#40916c", false) },
          { value: "2", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#40916c", false)  },
          { value: "3", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#40916c", false)  },
          { value: "2", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#40916c", false)  },
          { value: "8", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#40916c", false)  }
        ],
        color : "#40916c"
      },
      {
        seriesname: "Appeals",
        data: [
          { value: "12", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#3980AE", false)  },
          { value: "6", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#3980AE", false)   },
          { value: "9", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#3980AE", false)   },
          { value: "7", toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#3980AE", false)   },
          { value: "11" , toolText: generateToolText("<b>Zone Name-: $label</b>{br}Zone Parameter-: $seriesName{br}Score-: $percentValue</div>", "#3980AE", false)  }
        ],
        color: "#3980AE"
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
        height="650"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    </>
  );
};

export default Cgsttopfive;