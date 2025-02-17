import React, { useState, useEffect } from 'react'
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import ZuneTheme from 'fusioncharts/themes/fusioncharts.theme.zune';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import dayjs from 'dayjs';
import apiClient from '../../../Service/ApiClient'

const Commdata = ({selectedDate}) => {

  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { type } = queryParams;
  const { zone_code } = queryParams;
  const [loading, setloading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`cbic/MonthYear/return_filling/month`, {
        params: {
          type: "comm_name",
          month_date: newdate,
          zone_code: zone_code,
        }
      })

      if (response) {
        setloading(false);
      }

      setData(response.data.map((item, index) => ({ ...item, s_no: index + 1 })));

    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [newdate]);
  const colorstop = [, "#cc0077", "#ff8800", "#40916c", "#551a8b", "#3d0c02", "#31363F"
    , "#a1ff0a", "#ff00ff", "#DFF5FF", "#ffff00", "#cc0077", "#ff8800", "#40916c"];

  charts(FusionCharts);
  ZuneTheme(FusionCharts);

  const dataSource = {

    chart: {
      yAxisMinValue: "0",
      yAxisMaxValue: "100",
      yAxisStep: "10",
      numDivLines: "10",
      xAxisname: "Commissionerates",
      showvalues: "0",
      showsum: "1",
      theme: "zune",
      legendbgalpha: "0",
      plottooltext:
        "<b>Commissionerate Name-: $label</b>{br}<b>Absolute Number:</b>$value {br}",
      // stack100percent: "1",
      plotSpacePercent: '30',

      // plotSpacePercent: "30"
      // "seriesname": "Profit %",
      // "renderAs": "line",
      // "parentYAxis": "S",
    },
    categories: [
      {
        // category: [
        //   {
        //     label: "Siliguri"
        //   },
        //   {
        //     label: "Kolkata-North"
        //   },
        //   {
        //     label: "Howrah"
        //   },
        //   {
        //       label: "Haldia"
        //   },
        //   {
        //       label: "Bolpur"
        //   }
        // ]
        category: data.map((item) => ({ label: item.commName })),
      }
    ],
    dataset: [
      {
        data: data.map((item, index) => ({
          label: item.commName,
          value: item.total_score_previous_month,
          color: colorstop[index % colorstop.length],
        })),
      },
    // {
      // seriesname: "Registration",
      // data: [



    //     {
    //       alue: "75",
    //       ,"#cc0077"
    //     },
    //     {
    //       alue: "68",
    //       ,"#ff8800"
    //     },
    //     {
    //       alue: "64",
    //       ,"#40916c"
    //     },
    //     {
    //       alue: "63",
    //       ,"#551a8b"
    //     },
    //     {
    //       alue: "54",
    //       ,"#3d0c02"
    //     }
    //   ]
    //     ,"#31363F"
    // },
    // {
    //     seriesname: "Return Filing",
    //     data: [
    //       {
    //         value: "13"
    //       },
    //       {
    //         value: "13"
    //       },
    //       {
    //         value: "10"
    //       },
    //       {
    //         value: "13"
    //       },
    //       {
    //         value: "3"
    //       }
    //     ],
    //     color: "#00ffcc"
    //   },
    //   {
    //     seriesname: "Scrutiny/Assessment",
    //     data: [
    //       {
    //         value: "8"
    //       },
    //       {
    //         value: "8"
    //       },
    //       {
    //         value: "8"
    //       },
    //       {
    //         value: "8"
    //       },
    //       {
    //         value: "2"
    //       }
    //     ,
    //     ,"#a1ff0a"
    //   },
    //   {
    //     seriesname: "Investigation",
    //     data: [
    //       {
    //         value: "5"
    //       },
    //       {
    //         value: "5"
    //       },
    //       {
    //         value: "5"
    //       },
    //       {
    //         value: "5"
    //       },
    //       {
    //         value: "1"
    //       }
    //     ,
    //     ,"#ff00ff"
    //   },
    //   {
    //     seriesname: "Adjudication",
    //     data: [
    //       {
    //         value: "2"
    //       },
    //       {
    //         value: "1"
    //       },
    //       {
    //         value: "1"
    //       },
    //       {
    //         value: "2"
    //       },
    //       {
    //         value: "9"
    //       }
    //     ,
    //     ,"#DFF5FF"
    //   },
    //   {
    //     seriesname: "adjudication(legacy cases)",
    //     data: [
    //       {
    //         value: "6"
    //       },
    //       {
    //         value: "15"
    //       },
    //       {
    //         value: "3"
    //       },
    //       {
    //         value: "4"
    //       },
    //       {
    //         value: "3"
    //       }
    //     ,
    //     ,"#ffff00" 
    //   },
    //   {
    //     seriesname: "Refunds",
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
    //         value: "9"
    //       },
    //       {
    //         value: "9"
    //       }
    //     ,
    //     ,"#cc0077"

    //   },
    //   {
    //     seriesname: "Recovery of Arrears",
    //     data: [
    //       {
    //         value: "4"
    //       },
    //       {
    //         value: "4"
    //       },
    //       {
    //         value: "1"
    //       },
    //       {
    //         value: "4"
    //       },
    //       {
    //         value: "2"
    //       }
    //     ],
    //     color: "#59D5E0"

    //   },
    //   {
    //     seriesname: "Arrest & Prosecution",
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
    //         value: "2"
    //       },
    //       {
    //         value: "2"
    //       }
    //     ],
    //     color :"#ff8800"

    //   },
    //   {
    //     seriesname: "Audit",
    //     data: [
    //       {
    //         value: "8"
    //       },
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
    //         value: "7"
    //       }
    //     ,
    //     ,"#40916c"

    //   },
    //   {
    //     seriesname: "Appeals",
    //     data: [
    //       {
    //         value: "6"
    //       },
    //       {
    //         value: "2"
    //       },
    //       {
    //         value: "6"
    //       },
    //       {
    //         value: "6"
    //       },
    //       {
    //         value: "4"
    //       }
    //     ],
    //     color: "#3980AE"
    //   }
  // ]
    ],
};

return (
  <>
    <ReactFusioncharts
      type="stackedcolumn3d"
      width="100%"
      height="500"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  </>
)
}

export default Commdata