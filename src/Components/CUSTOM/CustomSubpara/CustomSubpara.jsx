import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
// import "./Zonescoredetails.scss";
import { CAvatar, CBadge, CButton, CCardBody, CCollapse } from "@coreui/react";
import "../../CGST/Subparameter-zone/Subpara.scss";
import { CSmartTable } from "@coreui/react-pro";
import "@coreui/coreui/dist/css/coreui.min.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import apiClient from "../../../Service/ApiClient";
// import "./Subpara.scss";
import Spinner from "../../Spinner";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import Zune from "fusioncharts/themes/fusioncharts.theme.zune";
var relevantAspects;
var type;
// const urlParmeter= new URLSearchParams(window.location.search);
// var urlname= urlParmeter.get('name');
const CustomSubpara = ({
  selectedDate,
  onChangeDate,
  selectedOption1,
  onSelectedOption1,
}) => {
  const handleChangeDate = (value) => {
    onChangeDate(value);
  };

  const [data, setData] = useState([]);
  const [response, setResponse] = useState(null);
  const [value2, setValue] = useState(
    dayjs().subtract(1, "month").subtract(1, "year").startOf("month")
  );
  const newdate = dayjs(selectedDate).format("YYYY-MM-DD");
  console.log("test", selectedDate);
  // const [selectedOption, setSelectedOption]=useState("Zones");

  // Function to disable years less than 2022
  const shouldDisableYear = (year) => {
    return year.year() < 2023;
  };
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const { name } = queryParams;
  const { type } = queryParams;
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchData = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/custom/${name}`, {
        params: {
          month_date: newdate,
          type: "zone",
        },
      });
      console.log("url", response);

      // setTimeout(()=>{
      if (response) {
        setloading(false);
      }
      // },3000);

      // Extract the relevant_aspect value from each item in the response data
      relevantAspects = response.data.map((item) => item.relevant_aspect)[0];

      // Log the relevant_aspect values to the console
      console.log("relevant_aspect values:", relevantAspects);

      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      const enhancedData = response.data.map((item, index) => {
        const total= response.data.length;
        console.log("Total",total);
        const firstquarter=total * 0.25;
        console.log("FirstQuarter",firstquarter);
        const secondquarter= total * 0.5;
        console.log("SecondQuarter",secondquarter);
        const thirdquarter= total*0.75;
        console.log("ThirdQuarter",thirdquarter);
        let props = {};
        if (index < firstquarter) {
          props = { scope: "row", color: "success" }; // Top 5 entries
        } else if (index >= firstquarter && index < secondquarter) {
          props = { scope: "row", color: "warning" };
        } else if (index >= thirdquarter) {
          props = { scope: "row", color: "danger" }; // Bottom 5 entries
        } else {
          props = { scope: "row", color: "primary" }; // Remaining entries
        }

        return {
          ...item,
          _props: props, // Add _props field dynamically
          s_no: index + 1,
        };
      });


      if (name === "cus1" || name === "cus2a"|| name === "cus2b"|| name === "cus2c"||name === "cus3a"||name === "cus3b"||name === "cus3c"||
         name === "cus4a" ||name === "cus4b" ||name === "cus4c" ||name === "cus4d" || name === "cus5a" || name === "cus5b" || name === "cus5c" || name === "cus6a" 
        || name === "cus6b" ||name === "cus6c" || name === "cus6d" || name === "cus6e" ||name === "cus6f" ||name === "cus7a" ||name === "cus7b" ||name === "cus8a" ||name === "cus8b" || name === "cus9a"
        || name === "cus9b"||name === "cus10a"||name === "cus10b"||name === "cus11a"||name === "cus11b"|| name === "cus12a"|| name === "cus12b" || name==="cus13a"|| name==="cus13b"|| name==="cus13c"|| name==="cus13d"|| name==="cus13e"
      ) {
        setData(enhancedData);
      }

      // Log the fetched data to the console
      console.log("hello12345678", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  const fetchDatacomm = async (name) => {
    try {
      // Make a GET request to the specified endpoint
      const response = await apiClient.get(`/cbic/custom/${name}`, {
        params: {
          month_date: newdate,
          type: "all_commissary",
        },
      });
      console.log("url", response);

      // setTimeout(()=>{
      if (response) {
        setloading(false);
      }
      // },3000);

      // Extract the relevant_aspect value from each item in the response data
      relevantAspects = response.data.map((item) => item.relevant_aspect)[0];

      // Log the relevant_aspect values to the console
      console.log("relevant_aspect values:", relevantAspects);

      // Set the fetched data in the component's state
      setData(
        response.data.map((item, index) => ({ ...item, s_no: index + 1 }))
      );

      // Log the fetched data to the console
      console.log("hello12345678", response.data);
    } catch (error) {
      // Log any errors that occur during fetching
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  const [itemsSelect, setItemsSelect] = useState(() => {
    const savedItems = localStorage.getItem("itemsSelect");
    return savedItems ? Number(savedItems) : 5;
  });
  const handleItemsChange = (number) => {
    setItemsSelect(number);
  };

  // Call fetchData when the component mounts or when the name parameter changes
  useEffect(() => {
    if (selectedOption1 === "Zones") {
      fetchData(name);
    } else {
      fetchDatacomm(name);
    }

    localStorage.setItem("itemsSelect",itemsSelect);

  }, [name, newdate, selectedOption1]); // Empty dependency array indicates that this effect runs only once

  // const [value2, setValue] = React.useState(dayjs());
  // console.log(value2);
  // const formattedDate = value2 ? value2.format('MM YYYY') : '';
  // console.log("val123",formattedDate);

  const [details, setDetails] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const columns = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: "zone_name",
      label: "Zone Name",
    },
    {
      key: "commissionerate_name",
      label: "Commissionerate Name",
      // render: (value) => {
      //   if ((value = "GST 1A ")) {
      //     return <Link to="/custom">{value}</Link>;
      //   } else {
      //     return value;
      //   }
      // },
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Number",
    // },
    {
      key: "total_score",
      label: "Percentage (For the Month)",
    },
    {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    },
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted Average",
    // },
    // {
    //   key: "rank",
    //   label: "Total Score (For the Month)",
    //   field: "total_score",
    // },
  ];

  const columnscomm = [
    {
      key: "s_no",
      label: "S.No.",
    },
    {
      key: "commissionerate_name",
      label: "Commissionerate Name",
    },
    {
      key: "zone_name",
      label: "Zone Name",
    },
    // {
    //   key: "absolutevale",
    //   label: "Absolute Number",
    // },
    {
      key: "total_score",
      label: "Percentage (For the Month)",
    },
    {
      key: "way_to_grade",
      label: "Way to Grade (Score out of 10)",
    },
    // {
    //   key: "sub_parameter_weighted_average",
    //   label: "Weighted Average",
    // },
    // {
    //   key: "rank",
    //   label: "Total Score (For the Month)",
    //   field: "total_score",
    // },
  ];

  switch (name) {
    case "cus1":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Refund Pending > 90 days/total application refund",
      });
    
      columns.splice(6, 0, {
        key: "way_to_grade",
        label: "Weighted Average (out of 10)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Refund Pending > 90 days/total application refund",
      });
    
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 10)",
      }); 
       break;
      case "cus2b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "No revenue protective measures/EO fulfillment time is over",
        });
      
        columns.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        });
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "No revenue protective measures/EO fulfillment time is over",
        });
      
        columnscomm.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        }); 
        
        break;
  
      case "cus2a":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "Notices issued/EO fulfilment time is over",
        });
  
        columns.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columns.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 3)",
        });
  
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "Notices issued/EO fulfilment time is over",
        });
  
        columnscomm.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columnscomm.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 3)",
        });
        break;
        case "cus2c":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Duty recovered/duty involved in expired licenses",
          });
    
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Duty recovered/duty involved in expired licenses",
          });
    
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
          break;
          case "cus3a":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "Notice issued/EO time is over",
            });
      
            columns.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 3)",
            });
      
            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "Notice issued/EO time is over",
            });
      
            columnscomm.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 3)",
            });
         
      break;
      case "cus3b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "No revenue protective measures/EO fulfillment time is over",
        });
      
        columns.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        });
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "No revenue protective measures/EO fulfillment time is over",
        });
      
        columnscomm.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        }); 
        
        break;
        case "cus3c":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Duty recover/duty involved in expired licenses",
          });
    
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Duty recover/duty involved in expired licenses",
          });
    
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
          break;
          case "cus4a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "(Non SVB)>6 months PA/total PA",
      });
    
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "(Non SVB)>6 months PA/total PA",
      });
    
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      }); 
       break;
       
       case "cus4b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "(Non SVB)>6 months PD bonds/total PD bonds",
        });
      
        columns.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 3)",
        });
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "(Non SVB)>6 months PD bonds/total PD bonds",
        });
      
        columnscomm.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 3)",
        }); 
         break;
         case "cus4c":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Svb finalised/Pending beginning of month",
          });
    
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Svb finalised/Pending beginning of month",
          });
    
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 3)",
          });
          break;
          case "cus4d":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "Svb pending > 1 year/total pending",
            });
      
            // columns.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 1)",
            });
      
            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "Svb pending > 1 year/total pending",
            });
      
            // columnscomm.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 1)",
            });
            break;

            case "cus8a":
              columns.splice(3, 0, {
                key: "absolutevale",
                label: "Disposal of packages/pending start of the month",
              });
        
              columns.splice(6, 0, {
                key: "insentavization",
                label: "Incentivisation",
              });
        
              columns.splice(7, 0, {
                key: "sub_parameter_weighted_average",
                label: "Weighted Average (out of 5)",
              });
        
              columnscomm.splice(3, 0, {
                key: "absolutevale",
                label: "Disposal of packages/pending start of the month",
              });
        
              columnscomm.splice(6, 0, {
                key: "insentavization",
                label: "Incentivisation",
              });
        
              columnscomm.splice(7, 0, {
                key: "sub_parameter_weighted_average",
                label: "Weighted Average (out of 5)",
              });
              break;
              case "cus8b":
                columns.splice(3, 0, {
                  key: "absolutevale",
                  label: "Pending >6 month/total pending",
                });
              
                columns.splice(6, 0, {
                  key: "sub_parameter_weighted_average",
                  label: "Weighted Average (out of 5)",
                });
                columnscomm.splice(3, 0, {
                  key: "absolutevale",
                  label: "Pending >6 month/total pending",
                });
              
                columnscomm.splice(6, 0, {
                  key: "sub_parameter_weighted_average",
                  label: "Weighted Average (out of 5)",
                }); 
                 break;

    case "cus9a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Gold disposed/ripe for disposal at start of month",
      });

      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });

      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Gold disposed/ripe for disposal at start of month",
      });

      columnscomm.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columnscomm.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;

    case "cus9b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Narcotics disoposed/confiscated narcotic at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });

      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Narcotics disoposed/confiscated narcotic at start of month",
      });

      columnscomm.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columnscomm.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;

    case "cus5a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases disposed/Cases pending at start of month",
      });
   
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
     
      columnscomm.splice(5, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases disposed/ Cases pending at start of month",
      });
    
      columnscomm.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
     
      break;
      case "cus5b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases Pending > 1 yr/total pending cases",
      });
     
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 4)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ Cases Pending > 1 yr/total pending cases",
      });
  
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 4)",
      });
     
      break;
      case "cus5c":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ cases where duty involved >1 cr Pending for > 1 yr/total pending cases",
      });
   
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "ADJ cases where duty involved >1 cr Pending for > 1 yr/total pending cases",
      });
   
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 3)",
      });
      break;

      case "cus12a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Appeal Cases disposed/pending at start of month",
      });

      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });

      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Appeal Cases disposed/pending at start of month",
      });

      columnscomm.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columnscomm.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 5)",
      });
      break;
      case "cus12b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "Cases Pending > 1 years/total pending",
        });
      
        columns.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 5)",
        });
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "Pending > 1 years/total pending",
        });
       
        columnscomm.splice(6, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 5)",
        });
        break;

        case "cus6a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label:"Investigation completed/Investigation pending at start of month",
      });
      columns.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columns.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });

      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Investigation completed/Investigation pending at start of month",
      });
      columnscomm.splice(6, 0, {
        key: "insentavization",
        label: "Incentivisation",
      });

      columnscomm.splice(7, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });
      break;
      case "cus6b":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Cases pending > 2 years/total pending",
      });
     
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Cases pending > 2 years/total pending",
      });
     
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 2)",
      });
     
      break;
      case "cus6c":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "Detection/Revenue collected",
        });
        columns.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columns.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 2)",
        });
  
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "Detection/Revenue collected",
        });
        columnscomm.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columnscomm.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 2)",
        });
        break;

      case "cus6d":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "Recovery/Detection (In lakh)",
        });
        columns.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columns.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 1)",
        });
  
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "Recovery/Detection (In lakh)",
        });
        columnscomm.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columnscomm.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 1)",
        });

        break;
        case "cus6e":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Outright smuggling cases of disposed/pending at start of month",
          });
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 1)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Outright smuggling cases of disposed/pending at start of month",
          });
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 1)",
          });
  
          break;
          case "cus6f":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "Commercial fraud cases of disposed/pending at start of month",
            });
            columns.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
      
            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "Commercial fraud cases of disposed/pending at start of month",
            });
            columnscomm.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
    
            break;
            case "cus7a":
      columns.splice(3, 0, {
        key: "absolutevale",
        label: "Not launched in 2 months of sanction/total sanction",
      });
     
      columns.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 6)",
      });
      columnscomm.splice(3, 0, {
        key: "absolutevale",
        label: "Not launched in 2 months of sanction/total sanction",
      });
     
      columnscomm.splice(6, 0, {
        key: "sub_parameter_weighted_average",
        label: "Weighted Average (out of 6)",
      });
     
      break;
      case "cus7b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "launched/arrests",
        });
        columns.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columns.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        });
  
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "launched/arrests",
        });
        columnscomm.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columnscomm.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 4)",
        });
        break;
        case "cus10a":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Recovered/target upto the month",
          });
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 5)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Recovered/target upto the month",
          });
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 5)",
          });
          break;
        case "cus10b":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "Pending > 1 yr /total pending",
          });
         
          columns.splice(6, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 5)",
          });
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "Pending > 1 yr /total pending",
          });
         
          columnscomm.splice(6, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 5)",
          });
          break;

        case "cus11a":
  columns.splice(3, 0, {
    key: "absolutevale",
    label: "No action on expired bonds/total expired wh bonds",
  });
 
  columns.splice(6, 0, {
    key: "sub_parameter_weighted_average",
    label: "Weighted Average (out of 5)",
  });
  columnscomm.splice(3, 0, {
    key: "absolutevale",
    label: "No action on expired bonds/total expired wh bonds",
  });
 
  columnscomm.splice(6, 0, {
    key: "sub_parameter_weighted_average",
    label: "Weighted Average (out of 5)",
  });
  break;
      case "cus11b":
        columns.splice(3, 0, {
          key: "absolutevale",
          label: "Duty recovered/duty involved",
        });
        columns.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columns.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 5)",
        });
  
        columnscomm.splice(3, 0, {
          key: "absolutevale",
          label: "Duty recovered/duty involved",
        });
        columnscomm.splice(6, 0, {
          key: "insentavization",
          label: "Incentivisation",
        });
  
        columnscomm.splice(7, 0, {
          key: "sub_parameter_weighted_average",
          label: "Weighted Average (out of 5)",
        });

        break;

        case "cus13a":
          columns.splice(3, 0, {
            key: "absolutevale",
            label: "BEs audited/marked",
          });
          columns.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columns.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 2)",
          });
    
          columnscomm.splice(3, 0, {
            key: "absolutevale",
            label: "BEs audited/marked",
          });
          columnscomm.splice(6, 0, {
            key: "insentavization",
            label: "Incentivisation",
          });
    
          columnscomm.splice(7, 0, {
            key: "sub_parameter_weighted_average",
            label: "Weighted Average (out of 2)",
          });
  
          break;

          case "cus13b":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "SBs audited/marked",
            });
            columns.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });

            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "SBs audited/marked",
            });
            columnscomm.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
    
            break;

            case "cus13c":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "Recovered/detected",
            });
            columns.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });

            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "Recovered/detected",
            });
            columnscomm.splice(6, 0, {
              key: "insentavization",
              label: "Incentivisation",
            });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
    
            break;

            case "cus13d":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "BEs pending > 6 months",
            });
            // columns.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });

            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "BEs pending > 6 months",
            });
            // columnscomm.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
    
            break;

            case "cus13e":
            columns.splice(3, 0, {
              key: "absolutevale",
              label: "SBs Pending > 6 months",
            });
            // columns.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columns.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
      
            columnscomm.splice(3, 0, {
              key: "absolutevale",
              label: "SBs Pending > 6 months",
            });
            // columnscomm.splice(6, 0, {
            //   key: "insentavization",
            //   label: "Incentivisation",
            // });
      
            columnscomm.splice(7, 0, {
              key: "sub_parameter_weighted_average",
              label: "Weighted Average (out of 2)",
            });
    
            break;


    default:
      columns.splice(5, 0, {
        key: "way_to_grade",
        label: "Way to Grade (Marks) Out of 10",
      });
      columnscomm.splice(5, 0, {
        key: "way_to_grade",
        label: "Way to Grade (Marks) Out of 10",
      });

      break;
  }

  const headerStyles = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px",
    textAlign: "left",
    fontWeight: "bold",
  };

  const getBadge = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "warning";
      case "Banned":
        return "danger";
      default:
        return "primary";
    }
  };

  const handleClick = (event) => {
    onSelectedOption1(event.target.value);
    console.log(event.target.value);

    if (selectedOption1) {
      setloading(true);
    } else {
      setloading(true);
    }
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const onRowClick = (clickedRow) => {
    setSelectedRow(clickedRow);
  };

  const handleExport = () => {
    // Prepare data for export based on selectedOption and potentially other filters
    const exportData =
      selectedOption1 === "Zones"
        ? data.map((user) => {
            switch (name) {
              case "cus1": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Refund Pending > 90 days/total application refund": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
                };
              }
              case "cus2a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Notices issued/EO fulfilment time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus2b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "No revenue protective measures/EO fulfillment time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 4)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus2c": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Duty recover/duty involved in expired licenses": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus4a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "(Non SVB)>6 months PD/total PA": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                };
              }
              case "cus4b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "(Non SVB)>6 months PD bonds/total PD bonds": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                };
              }
              case "cus4c": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Svb finalised/Pending beginning of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus4d": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Svb pending > 1 year/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 1)": user.sub_parameter_weighted_average,
                  
                };
              }

              case "cus3a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Notices issued/EO time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus3b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "No revenue measures/EO Protective time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 4)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus3c": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Duty recover/duty involved in exp licenses": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                  
                };
              }
              case "cus5a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  " Cases disposed/Cases pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                };
              }

              case "cus5b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Cases pending > 1 yr/total pending cases": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 4)": user.sub_parameter_weighted_average,
                };
              }

              case "cus5c": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Cases pending > 1 year where duty involved > 1 crore": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus6a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Investigation completed/Investigation pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Cases pending > 2 years/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6c": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Detection/Revenue collected": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6d": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Recovery/Detection (In lakh)": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 1)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6e": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Outright smuggling cases of disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 1)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6f": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Commercial fraud cases of disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus7a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Not launched in 2 months of sanction/total sanction": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 6)": user.sub_parameter_weighted_average,
                };
              }
              case "cus7b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "launched/arrests": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus8a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Disposal of packages/pending beg of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus8b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Pending > 6 month/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)": user.sub_parameter_weighted_average,
                };
              }


              case "cus9a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Gold disposed/gold ripe for disposal": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "cus9b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Absolute Number": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus10a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Recovered/target upto the month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus10b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Pending > 1 yr /total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)": user.sub_parameter_weighted_average,
                };
              }
              case "cus11a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "No action on expired bonds/total expired wh bonds": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)": user.sub_parameter_weighted_average,
                };
              }
              case "cus11b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Duty recovered/duty involved": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus12a": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Appeal Cases disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus12b": {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Cases Pending > 1 years/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              // Customize object properties to match desired format
              default: {
                return {
                  SNo: user.s_no,
                  "Zone Name": user.zone_name,
                  "Commissionerate Name": user.commissionerate_name,
                  "Absolute Value": user.absolutevale,
                  "Total Score": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
            }
          })
        : data.map((user) => {
            switch (name) {
              case "cus1": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Refund Pending > 90 days/total application refund": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average (out of 10)": user.sub_parameter_weighted_average,
                };
              }
              case "cus2a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Notices issued/EO fulfilment time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus2b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "No revenue protective measures/EO fulfillment time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus2c": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Duty recovered/duty involved in expired licenses": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus3a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Notices issued/EO time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus3b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "No revenue protective measures/EO fulfillment time is over": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus3c": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Duty recover/duty involved in expired licenses": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus4a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "(Non SVB)>6 months PD/total PA": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus4b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "(Non SVB)>6 months PD bonds/total PD bonds": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus4c": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Svb finalised/Pending beginning of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus4d": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Svb pending > 1 year/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 1)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus5a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Absolute Number": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 3)": user.sub_parameter_weighted_average,
                };
              }

              case "cus5b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Absolute Number": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "cus5c": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Absolute Number": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 3)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus6a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Investigation completed/Investigation pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6b": {
                return {
                  SNo: user.s_no, 
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Cases pending > 2 years/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6c": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Detection/Revenue collected": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6d": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Recovery/Detection(In lakh)": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 1)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6e": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Outright smuggling cases of disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 1)": user.sub_parameter_weighted_average,
                };
              }
              case "cus6f": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Commercial fraud cases of disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average (out of 2)": user.sub_parameter_weighted_average,
                };
              }
              case "cus7a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Not launched in 2 months of sanction/total sanction": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 6)": user.sub_parameter_weighted_average,
                };
              }
              case "cus7b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "launched/arrests": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                "Incentivisation": user.insentavization,
                  "Weighted Average(out of 4)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus8a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Disposal of packages/pending start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus8b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Pending > 6 month/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus9a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Gold disposed/ripe for disposal at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }

              case "cus9b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Confiscated narcotics disposed/confiscated narcotics at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus10a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Arrears recovered/target upto the month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus10b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Arrears pending > 1 yr /total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus11a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "No action on expired bonds/total expired W/H bonds": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus11b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Duty recovered/duty involved in W/H bonds": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus12a": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Appeal Cases disposed/pending at start of month": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Incentivisation": user.insentavization,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              case "cus12b": {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Pending > 1 years/total pending": user.absolutevale,
                  "Percentage (For the Month)": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
              // Customize object properties to match desired format
              default: {
                return {
                  SNo: user.s_no,
                  "Commissionerate Name": user.commissionerate_name,
                  "Zone Name": user.zone_name,
                  "Absolute Value": user.absolutevale,
                  "Total Score": user.total_score,
                  "Way to Grade (Marks) Out of 10": user.way_to_grade,
                  "Weighted Average(out of 5)":
                    user.sub_parameter_weighted_average,
                };
              }
            }
          });

    return exportData;
  };

  const exportToXLS = () => {
    const data = handleExport();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "my_data.xlsx");
  };

  const scopedColumns = {
    avatar: (item) => (
      <td>
        <CAvatar src={`/images/avatars/${item.avatar}`} />
      </td>
    ),
    status: (item) => (
      <td>
        <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
      </td>
    ),
    zone_name: (item) => (
      <td>
        <Link to={`/CustomSubcom?zone_code=${item.zone_code}&name=${name}`}>
          {item.zone_name}
        </Link>
      </td>
    ),
    commissionerate_name: (item) => (
      <td>
        <Link to={`/CustomSubcom?zone_code=${item.zone_code}&name=${name}`}>
          {item.commissionerate_name}
        </Link>
      </td>
    ),
    rank: () => <td>-</td>,
    show_details: (item) => {
      return (
        <td className="py-2">
          <CButton
            color="primary"
            variant="outline"
            shape="square"
            size="sm"
            onClick={() => {
              toggleDetails(item.id);
            }}
          >
            {details.includes(item.id) ? "Hide" : "Show"}
          </CButton>
        </td>
      );
    },
    details: (item) => {
      return (
        <CCollapse visible={details.includes(item.id)}>
          <CCardBody className="p-3">
            <h4>{item.username}</h4>
            <p className="text-muted">User since: {item.registered}</p>
            <CButton size="sm" color="info">
              User Settings
            </CButton>
            <CButton size="sm" color="danger" className="ml-1">
              Delete
            </CButton>
          </CCardBody>
        </CCollapse>
      );
    },
  };

  const scopedColumnscomm = {
    avatar: (item) => (
      <td>
        <CAvatar src={`/images/avatars/${item.avatar}`} />
      </td>
    ),
    status: (item) => (
      <td>
        <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
      </td>
    ),
    commissionerate_name: (item) => <td>{item.commissionerate_name}</td>,
    zone_name: (item) => (
      <td>
        <Link to={`/CustomSubcom?zone_code=${item.zone_code}&name=${name}`}>
          {item.zone_name}
        </Link>
      </td>
    ),

    rank: () => <td>-</td>,
    show_details: (item) => {
      return (
        <td className="py-2">
          <CButton
            color="primary"
            variant="outline"
            shape="square"
            size="sm"
            onClick={() => {
              toggleDetails(item.id);
            }}
          >
            {details.includes(item.id) ? "Hide" : "Show"}
          </CButton>
        </td>
      );
    },
    details: (item) => {
      return (
        <CCollapse visible={details.includes(item.id)}>
          <CCardBody className="p-3">
            <h4>{item.username}</h4>
            <p className="text-muted">User since: {item.registered}</p>
            <CButton size="sm" color="info">
              User Settings
            </CButton>
            <CButton size="sm" color="danger" className="ml-1">
              Delete
            </CButton>
          </CCardBody>
        </CCollapse>
      );
    },
  };

  charts(FusionCharts);
  Zune(FusionCharts);
  const colorstopzone = ["#00FF00", "#00FF00", "#00FF00", "#00FF00", "#00FF00"];
  const top5 = {
    chart: {
      caption:
      name === "cus9a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Gold disposed/Gold ripe for disposal)" : "Top 5 Commissionerates (Highest % of Gold disposed/Gold ripe for disposal)" :
      name === "cus9b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Confiscated narcotics disposed/Pending for disposal)" : "Top 5 Commissionerates (Highest % of Confiscated narcotics disposed/Pending for disposal)":
      name === "cus1" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of refund Pending for > 90 days)" : "Top 5 Commissionerates (Least % of refund Pending for > 90 days)" :
      name === "cus5a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of adjudication of cases disposed)" : "Top 5 Commissionerates (Highest % of adjudication cases disposed" :
      name === "cus5b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % ADJ of Cases pending > 1 year)" : "Top 5 Commissionerates (Least % ADJ of Cases pending > 1 year)" :
      name === "cus5c" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of ADJ Case pending > 1 year where duty involved > 1 crore)" : "Top 5 Commissionerates (Least % ADJ of Case pending > 1 year where duty involved > 1 crore)":
      name === "cus12a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Appeal Cases disposed/pending at start of month)" : "Top 5 Commissionerates (Highest % of Appeal Cases disposed/pending at start of month)":
      name === "cus12b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of Cases Pending > 1 years/total pending)" : "Top 5 Commissionerates (Least % of Cases Pending > 1 years/total pending)":
      name === "cus6a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Investigation Completed)" : "Top 5 Commissionerates ( Highest % of Investigation Completed)":
      name === "cus6b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of cases pending > 2 years)" : "Top 5 Commissionerates (Least % of cases Pending > 2 years)":
      name === "cus6c" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Detection/Revenue collected)" : "Top 5 Commissionerates (Highest % of Detection/Revenue collected)":
      name === "cus6d" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Recovery/Detection (In Lakh))" : "Top 5 Commissionerates (Highest % of Recovery/Detection (In Lakh))":
      name === "cus6e" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Disposal of cases of outright smuggling)" : "Top 5 Commissionerates (Highest % of Disposal of cases of outright smuggling)":
      name === "cus6f" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Disposal of cases of Commercial fraud)" : "Top 5 Commissionerates (Highest % of Disposal of cases of Commercial fraud)":
      name === "cus2a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Notices issued/EO fulfilment time is over)" : "Top 5 Commissionerates (Highest % of Notices issued/EO fulfilment time is over)":
      name === "cus2b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of No revenue protective measures/EO fulfillment time is over)" : "Top 5 Commissionerates (Least % of No revenue protective measures/EO fulfillment time is over)":
      name === "cus2c" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Duty recovered/duty involved in expired licenses)" : "Top 5 Commissionerates (Highest % of Duty recovered/duty involved in expired licenses)":
      name === "cus3a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Notices issued/EO time is over)" : "Top 5 Commissionerates (Highest % of Notices issued/EO time is over)":
      name === "cus3b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of No revenue protective measures/EO fulfillment time is over)" : "Top 5 Commissionerates (Least % of No revenue protective measures/EO fulfillment time is over)":
      name === "cus3c" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Duty recover/duty involved in expired licenses)" : "Top 5 Commissionerates (Highest % of Duty recover/duty involved in expired licenses)":
      name === "cus4a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of (Non SVB)>6 months PA/total PA)" : "Top 5 Commissionerates (Least % of (Non SVB)>6 months PA/total PA)":
      name === "cus4b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of (Non SVB)>6 months PD bonds/total PD bonds)" : "Top 5 Commissionerates (Least % of (Non SVB)>6 months PD bonds/total PD bonds)":
      name === "cus4c" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of SVB finalised/Pending beginning of month)" : "Top 5 Commissionerates (Highest % of SVB finalised/Pending beginning of month)":
      name === "cus4d" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of SVB pending > 1 year/total pending)" : "Top 5 Commissionerates (Least % of SVB pending > 1 year/total pending)":
      name === "cus7a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of Not launched in 2 months of sanction/total sanction)" : "Top 5 Commissionerates (Least % of Not launched in 2 months of sanction/total sanction)":
      name === "cus7b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Prosecution launched/arrests)" : "Top 5 Commissionerates (Highest % of Prosecution launched/arrests)":
      name === "cus8a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Disposal of packages/pending beg of month)" : "Top 5 Commissionerates (Highest % of Disposal of packages/pending beg of month)":
      name === "cus8b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of Pending > 6 month/total pending)" : "Top 5 Commissionerates (Least % of Pending > 6 month/total pending)":
      name === "cus11a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of No action on expired bonds/total expired W/H bonds)" : "Top 5 Commissionerates (Least % of No action on expired bonds/total expired W/H bonds":
      name === "cus11b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Duty recovered/duty involved in W/H bonds)" : "Top 5 Commissionerates (Highest % of Duty recovered/duty involved in W/H bonds)":
      name === "cus10a" ? selectedOption1 === "Zones" ? "Top 5 Zones (Highest % of Arrears recovered/target upto the month)" : "Top 5 Commissionerates (Highest % of Arrears recovered/target upto the month)":
      name === "cus10b" ? selectedOption1 === "Zones" ? "Top 5 Zones (Least % of Arrears pending > 1 yr /total pending)" : "Top 5 Commissionerates (Least % of Arrears pending > 1 yr /total pending":
     
              

           selectedOption1 === "Zones"
          ? "Top 5 Zones"
          : "Top 5 Commissionerates",
      yaxisname: "Percentage",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Percentage:$value"
          : "<b>Commissionerate Name:$label</b>{br}Percentage:$value",
          yAxisMinValue: "0",
          yAxisMaxValue: "100",
          yAxisStep: "10",
    },
    data: data.slice(0, 5).map((item, index) => ({
      label:
        selectedOption1 === "Zones"
          ? item.zone_name
          : item.commissionerate_name,
      value: item.total_score,
      color: colorstopzone[index % colorstopzone.length],
    })),
  };

  console.log("TOP5", top5);

  const colorsbottomzone = [
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
    "#FF0000",
  ];
  const bottom5 = {
    chart: {
      caption:
      name === "cus9a"? selectedOption1 === "Zones"? "Bottom 5 Zones (Least % of Gold disposed/Gold ripe for disposal)": "Bottom 5 Commissionerates(Least % of Gold disposed/Gold ripe for disposal)":
      name === "cus9b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Confiscated narcotics disposed/Pending for disposal)" : "Bottom 5 Commissionerates (Least % of Confiscated narcotics disposed/Pending for disposal)":
      name === "cus1" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of refund Pending for > 90 days)" : "Bottom 5 Commissionerates (Highest % of refund Pending for > 90 days)" :
      name === "cus5a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of adjudication cases Disposed)" : "Bottom 5 Commissionerates (Least % of adjudication cases Disposed)" :
      name === "cus5b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % ADJ of Cases pending > 1 year)" : "Bottom 5 Commissionerates (Highest % of ADJ Cases pending > 1 year)" :
      name === "cus5c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % ADJ of Case pending > 1 year where duty involved > 1 crore)" : "Bottom 5 Commissionerates (Highest % of ADJ Case pending > 1 year where duty involved > 1 crore)":
      // name === "cus5c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Case pending > 1 year(duty involved > 1 crore))" : "Bottom 5 Commissionerates (Case pending > 1 year(duty involved > 1 crore))":
      name === "cus6a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Investigation Completed)" : "Bottom 5 Zones (Least % of Investigation Completed)":
      name === "cus6b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of cases pending > 2 years)" : "Bottom 5 Commissionerates (Highest % of cases pending > 2 years))":
      name === "cus6c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Detection/Revenue collected)" : "Bottom 5 Commissionerates (Least % of Detection/Revenue collected)":
      name === "cus6d" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Recovery/Detection(In Lakh))" : "Bottom 5 Commissionerates (Least % of Recovery/Detection(In Lakh))":
      name === "cus6e" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Disposal of cases of outright smuggling)" : "Bottom 5 Commissionerates (Least % of Disposal of cases of outright smuggling)":
      name === "cus6f" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Disposal of cases of Commercial fraud)" : "Bottom 5 Commissionerates ( Least % of Disposal of cases of Commercial fraud)":
      name === "cus12a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Appeal Cases disposed/pending at start of month)" : "Bottom 5 Commissionerates (Least % of Appeal Cases disposed/pending at start of month)":
      name === "cus12b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of Cases Pending > 1 years/total pending)" : "Bottom 5 Commissionerates (Highest % of Cases Pending > 1 years/total pending)":
      name === "cus2a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Notices issued/EO fulfilment time is over)" : "Bottom 5 Commissionerates (Least % of Notices issued/EO fulfilment time is over)":
      name === "cus2b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of No revenue protective measures/EO fulfillment time is over)" : "Bottom 5 Commissionerates (Highest % of No revenue protective measures/EO fulfillment time is over)":
      name === "cus2c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Duty recovered/duty involved in expired licenses)" : "Bottom 5 Commissionerates (Least % of Duty recovered/duty involved in expired licenses)":
      name === "cus3a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Notices issued/EO time is over)" : "Bottom 5 Commissionerates (Least % of Notices issued/EO time is over)":
      name === "cus3b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of No revenue protective measures/EO fulfillment time is over)" : "Bottom 5 Commissionerates (Highest % of No revenue protective measures/EO fulfillment time is over)":
      name === "cus3c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Duty recover/duty involved in expired licenses)" : "Bottom 5 Commissionerates (Least % of Duty recover/duty involved in expired licenses)":
      name === "cus4a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of (Non SVB)>6 months PA/total PA)" : "Bottom 5 Commissionerates (Highest % of (Non SVB)>6 months PA/total PA)":
      name === "cus4b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of (Non SVB)>6 months PD bonds/total PD bonds)" : "Bottom 5 Commissionerates (Highest % of (Non SVB)>6 months PD bonds/total PD bonds)":
      name === "cus4c" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of SVB finalised/Pending beginning of month)" : "Bottom 5 Commissionerates (Least % of SVB finalised/Pending beginning of month)":
      name === "cus4d" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of SVB pending > 1 year/total pending)" : "Bottom 5 Commissionerates (Highest % of SVB pending > 1 year/total pending)":
      name === "cus7a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of Not launched in 2 months of sanction/total sanction)" : "Bottom 5 Commissionerates (Highest % of Not launched in 2 months of sanction/total sanction)":
      name === "cus7b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Prosecution launched/arrests)" : "Bottom 5 Commissionerates (Least % of Prosecution launched/arrests)":
      name === "cus8a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Disposal of packages/pending beg of month)" : "Bottom 5 Commissionerates (Least % of Disposal of packages/pending beg of month)":
      name === "cus8b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of Pending > 6 month/total pending)" : "Bottom 5 Commissionerates (Highest % of Pending > 6 month/total pending)":
      name === "cus11a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of No action on expired bonds/total expired W/H bonds)" : "Bottom 5 Commissionerates (Highest % of No action on expired bonds/total expired W/H bonds)":
      name === "cus11b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Duty recovered/duty involved in W/H bonds)" : "Bottom 5 Commissionerates (Least % of Duty recovered/duty involved in W/H bonds)":
      name === "cus10a" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Least % of Arrears recovered/target upto the month)" : "Bottom 5 Commissionerates (Least % of Arrears recovered/target upto the month)":
      name === "cus10b" ? selectedOption1 === "Zones" ? "Bottom 5 Zones (Highest % of Arrears pending > 1 yr /total pending)" : "Bottom 5 Commissionerates (Highest % of Arrears pending > 1 yr /total pending)":
        selectedOption1 === "Zones"
          ? "Bottom 5 Zones"
          : "Bottom 5 Commissionerates",

      yaxisname: "Percentage",
      // decimals:'1',
      theme: "zune",
      showvalues: "0",
      numDivLines: "10",
      plottooltext:
        selectedOption1 === "Zones"
          ? "<b>Zone Name:$label</b>{br}Percentage:$value"
          : "<b>Commissionerate Name:$label</b>{br}Percentage:$value",
          yAxisMinValue: "0",
          yAxisMaxValue: "100",
          yAxisStep: "10",
    },
    data: data.slice(-5).map((item, index) => ({
      label:
        selectedOption1 === "Zones"
          ? item.zone_name
          : item.commissionerate_name,
      value: item.total_score,
      color: colorsbottomzone[index % colorsbottomzone.length],
    })),
  };

  const checkSpecialChar=(e)=>{
    if(!/[0-9a-zA-Z]/.test(e.key)){
      e.preventDefault();
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="body flex-grow-1 custom-sec">
            <div className="msg-box">
              {/* <h2>GST 1A (Zone) {name.toUpperCase()}</h2> */}
              <div className="lft-box col-md-11">
                <div className="mid-sec">
                  <div className="card-white">
                    <p>{relevantAspects}</p>
                  </div>
                </div>
              </div>
              <div className="rgt-box">
                <div className="view-btn">
                  <Button
                    variant="contained"
                    className="ml-4  cust-btn"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
            <div className="date-sec">
              <div className="lft-sec">
                <div className="date-main">
                  {/* const mont = today. getMonth() + 1; 
              const year = today. getFullYear(); 
              const date = today. */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker", "DatePicker", "DatePicker"]}
                    >
                      <DatePicker
                        label={"Month and Year"}
                        views={["month", "year"]}
                        maxDate={dayjs().subtract(1, "month").startOf("month")}
                        value={selectedDate} // Set value to `value2` state
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                        shouldDisableYear={shouldDisableYear} // Disable years less than 2022
                        slotProps={{
                          field:{
                            readOnly:true
                          }
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              {/* <div className="mid-sec">
              <div className="card-white">
                <p>{relevantAspects}</p>
              </div>
            </div> */}
              <div className="rgt-sec">
                <div className="switches-container2">
                  <input
                    type="radio"
                    id="switchMonthly"
                    name="switchPlan"
                    value="Zones"
                    onChange={handleClick}
                    checked={selectedOption1 === "Zones"}
                  />
                  <input
                    type="radio"
                    id="switchYearly"
                    name="switchPlan"
                    value="Commissionerate"
                    onChange={handleClick}
                    checked={selectedOption1 === "Commissionerate"}
                  />
                  <label htmlFor="switchMonthly">Zones</label>
                  <label htmlFor="switchYearly">Commissionerate</label>
                  <div className="switch-wrapper2">
                    <div className="switch2">
                      <div>Zones</div>
                      <div>Commissionerate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-main bg-blue col1">
              {name === "cus9a" || name === "cus1" ||name === "cus2a" ||name === "cus2b" ||name === "cus2c" ||name === "cus3a" ||name === "cus3b" ||name === "cus3c" || name === "cus4d" ||
               name === "cus4a" ||name === "cus4b" ||name === "cus4c" ||name === "cus4d" ||name === "cus5a" || name === "cus5b" || name === "cus5c" ||
               name === "cus6a" ||name === "cus6b"||name === "cus6c"|| name === "cus6d"||name === "cus6e"||name === "cus6f"||name === "cus7a"||name === "cus7b"||name === "cus8a"||name === "cus8b"||
                name === "cus9b"||name === "cus10a"||name === "cus10b"||name === "cus11a"|| name === "cus11b"|| name === "cus12a"|| name === "cus12b" || name==="cus13a"|| name==="cus13b"|| name==="cus13c"|| name==="cus13d"|| name==="cus13e"? (
                <div className="row custom-tb mb col ">
                  <div className="row container">
                    <div className="col-md-6 mt-2 ">
                      <div className="card">
                        {selectedOption1 === "Zones" ? (
                          <div className="card-header">
                            {name === "cus9a" ? (<strong>
                                Top 5 Zones (Highest % of Gold disposed/Gold ripe for
                                disposal)
                              </strong>
                              
                            ) : 
                            name === "cus9b" ? (<strong>Top 5 Zones (Highest % of Confiscated narcotics disposed/Pending for disposal)</strong>) :
                            name === "cus1" ? (<strong>Top 5 Zones (Least % of refund Pending for &gt; 90 days)</strong>) :   
                            name === "cus5a" ? (<strong>Top 5 Zones (Highest % of adjudication of cases Disposed )</strong>) : 
                            name === "cus5b" ? (<strong>Top 5 Zones (Least % of ADJ Cases pending &gt; 1 year)</strong>) : 
                            name === "cus5c" ? (<strong>Top 5 Zones (Least % of ADJ Cases pending &gt; 1 year where duty involved &gt; 1 crore )</strong>) :
                            name === "cus6a" ? (<strong>Top 5 Zones (Highest % of Investigation Completed )</strong>) :
                            name === "cus6b" ? (<strong>Top 5 Zones  (Least % of Cases pending &gt; 2 years )</strong>) :
                            name === "cus6c" ? (<strong>Top 5 Zones  (Highest % of Detection/Revenue collected)</strong>) :
                            name === "cus6d" ? (<strong>Top 5 Zones  (Highest % of Recovery/Detection (In Lakh))</strong>) :
                            name === "cus6e" ? (<strong>Top 5 Zones  (Highest % of Disposal of cases of outright smuggling)</strong>) :
                            name === "cus6f" ? (<strong>Top 5 Zones  (Highest % of Disposal of cases ofCommercial fraud)</strong>) :
                            name === "cus12a" ? (<strong>Top 5 Zones (Highest % of Appeal Cases disposed/pending at start of month)</strong>) :
                            name === "cus12b" ? (<strong>Top 5 Zones (Highest % of Cases pending &gt; 1 year/total pending)</strong>) :
                            name === "cus2a" ? (<strong>Top 5 Zones (Highest % of Notices issued/EO fulfilment time is over)</strong>) :
                            name === "cus2b" ? (<strong>Top 5 Zones (Least % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus2c" ? (<strong>Top 5 Zones (Highest % of Duty recovered/duty involved in expired licenses)</strong>) :
                            name === "cus3a" ? (<strong>Top 5 Zones (Highest % of Notices issued/EO time is over)</strong>) :
                            name === "cus3b" ? (<strong>Top 5 Zones (Least % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus3c" ? (<strong>Top 5 Zones (Highest % of Duty recover/duty involved in expired licenses)</strong>) : 
                            name === "cus4a" ? (<strong>Top 5 Zones (Least % of (Non SVB) &gt; 6 months PA/total PA)</strong>) : 
                            name === "cus4b" ? (<strong>Top 5 Zones (Least % of (Non SVB) &gt; 6 months PD bonds/total PD bonds)</strong>) :
                            name === "cus4c" ? (<strong>Top 5 Zones (Highest % of SVB finalised/Pending beginning of month)</strong>) : 
                            name === "cus4d" ? (<strong>Top 5 Zones (Least % of SVB pending &gt; 1 year/total pending)</strong>) :
                            name === "cus7a" ? (<strong>Top 5 Zones (Least % of Not launched in 2 months of sanction/total sanction)</strong>) :
                            name === "cus7b" ? (<strong>Top 5 Zones (Highest % of Prosecution launched/arrests)</strong>) : 
                            name === "cus8a" ? (<strong>Top 5 Zones (Highest % of Disposal of packages/pending beg of month)</strong>) : 
                            name === "cus8b" ? (<strong>Top 5 Zones (Least % of Pending &gt; 6 month/total pending)</strong>) :
                            name === "cus11a" ? (<strong>Top 5 Zones (Least % of No action on expired bonds/total expired W/H bonds)</strong>) : 
                            name === "cus11b" ? (<strong>Top 5 Zones (Highest % of Duty recovered/duty involved in W/H bonds)</strong>) : 
                            name === "cus10a" ? (<strong>Top 5 Zones (Highest % of Arrears recovered/target upto the month)</strong>) :   
                            name === "cus10b" ? (<strong>Top 5 Zones (Least % of Arrears pending &gt; 1 yr /total pending)</strong>) :  
                            (
                              <strong>Top 5 Zones</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allcustomsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        ) : (
                          <div className="card-header">
                            {name === "cus9a" ? ( <strong>Top 5 Commissionerates(Least % of Gold disposed/Gold ripe for disposal)</strong>) : 
                            name === "cus1" ? (<strong>Top 5 Commissionerates   (Least % of refund Pending for &gt; 90 days) </strong> ) :  
                            name === "cus5a" ? (<strong>Top 5 Commissionerates  (Highest % of adjudication cases Disposed)</strong>) : 
                            name === "cus5b" ? (<strong>Top 5 Commissionerates  (Least % of ADJ Cases pending &gt; 1 year)</strong>) : 
                            name === "cus5c" ? ( <strong>Top 5 Commissionerates (Least % of Cases pending &gt; 1 year where duty involved &gt; 1 crore)</strong> ) :
                            name === "cus6a" ? (<strong>Top 5 Commissionerates  (Highest % of Investigation Completed )</strong>) :
                            name === "cus6b" ? (<strong>Top 5 Commissionerates  (Least % of Cases pending &gt; 2 years )</strong>) : 
                            name === "cus6c" ? (<strong>Top 5 Commissionerates  (Highest % of Detection/Revenue collected)</strong>) :
                            name === "cus6d" ? (<strong>Top 5 Commissionerates  (Highest % of Recovery/Detection (In Lakh))</strong>) :
                            name === "cus6e" ? (<strong>Top 5 Commissionerates  (Highest % of Disposal of cases of outright smuggling)</strong>) :
                            name === "cus6f" ? (<strong>Top 5 Commissionerates  (Highest % of Disposal of cases of Commercial fraud)</strong>) :
                            name === "cus9b" ? (<strong>Top 5 Commissionerates  (Highest % of Confiscated narcotics disposed/Pending for disposal)</strong>) :
                            name === "cus12a" ? (<strong>Top 5 Commissionerates (Highest % of Appeal Cases disposed/pending at start of month)</strong>) :
                            name === "cus12b" ? (<strong>Top 5 Commissionerates (Highest % of Cases pending &gt; 1 year/total pending)</strong>) :
                             name === "cus2a" ? (<strong>Top 5 Commissionerates (Highest % of Notices issued/EO fulfilment time is over)</strong>) :
                            name === "cus2b" ? (<strong>Top 5 Commissionerates (Least % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus2c" ? (<strong>Top 5 Commissionerates (Highest % of Duty recovered/duty involved in expired licenses)</strong>) :
                            name === "cus3a" ? (<strong>Top 5 Commissionerates (Highest % of Notices issued/EO time is over)</strong>) :
                            name === "cus3b" ? (<strong>Top 5 Commissionerates (Least % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus3c" ? (<strong>Top 5 Commissionerates (Highest % of Duty recover/duty involved in expired licenses)</strong>) : 
                            name === "cus4a" ? (<strong>Top 5 Commissionerates (Least % of (Non SVB) &gt; 6 months PA/total PA)</strong>) : 
                            name === "cus4b" ? (<strong>Top 5 Commissionerates (Least % of (Non SVB) &gt; 6 months PD bonds/total PD bonds)</strong>) :
                            name === "cus4c" ? (<strong>Top 5 Commissionerates (Highest % of SVB finalised/Pending beginning of month)</strong>) : 
                            name === "cus4d" ? (<strong>Top 5 Commissionerates (Least % of SVB pending &gt; 1 year/total pending)</strong>) :
                            name === "cus7a" ? (<strong>Top 5 Commissionerates (Least % of Not launched in 2 months of sanction/total sanction)</strong>) :
                            name === "cus7b" ? (<strong>Top 5 Commissionerates (Highest % of Prosecution launched/arrests)</strong>) :
                            name === "cus8a" ? (<strong>Top 5 Commissionerates (Highest % of Disposal of packages/pending beg of month)</strong>) : 
                            name === "cus8b" ? (<strong>Top 5 Commissionerates (Least % of Pending &gt; 6 month/total pending)</strong>) : 
                            name === "cus11a" ? (<strong>Top 5 Commissionerates (Least % of No action on expired bonds/total expired W/H bonds)</strong>) :  
                            name === "cus11b" ? (<strong>Top 5 Commissionerates (Highest % of Duty recovered/duty involved in W/H bonds)</strong>) :
                            name === "cus10a" ? (<strong>Top 5 Commissionerates (Highest % of Arrears Recovered/target upto the month)</strong>) :   
                            name === "cus10b" ? (<strong>Top 5 Commissionerates (Least % of Arrears pending &gt; 1 yr /total pending)</strong>) :      
                            (
                              <strong>Top 5 Commissionerates</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allcustomsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        )}
                        <div className="card-body">
                          <div id="chart">
                            <div className="responsive-chart main-chart">
                              <ReactFusioncharts
                                type="column3d"
                                width="100%"
                                height="500"
                                dataFormat="JSON"
                                dataSource={top5}
                              />
                              {selectedOption1 === "Zones" ? (
                                <Link
                                  to={`/allcustomsubparameters?name=${name}`}
                                >
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              ) : (
                                <Link
                                  to={`/allcustomsubparameters?name=${name}`}
                                >
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mt-2">
                      <div className="card">
                        {selectedOption1 === "Zones" ? (
                          <div className="card-header">
                            {name === "cus9a" ? (<strong> Bottom 5 Zones (Least % of Gold disposed/Gold ripe for disposal)</strong> ) : 
                            name === "cus9b" ? (<strong>Bottom 5 Zones (Least % of Narcotics disposed/Pending for disposal)</strong>) :
                            name === "cus1" ? (<strong>Bottom 5 Zones (Highest % of refund Pending for &gt; 90 days)</strong>) : 
                            name === "cus5a" ? (<strong>Bottom 5 Zones (Least % of adjudication of cases Disposed)</strong>) : 
                            name === "cus5b" ? (<strong> Bottom 5 Zones (Highest % of ADJ Cases pending &gt; 1 year)</strong>) : 
                            name === "cus5c" ? (<strong>Bottom 5 Zones (Highest % of ADJ Cases pending &gt; 1 year(duty involved &gt; 1 crore) )</strong>) :
                            name === "cus6a" ? (<strong>Bottom 5 Zones (Least % of Investigation Completed)</strong>) :
                            name === "cus6b" ? (<strong>Bottom 5 Zones  (Highest % of Pending &gt; 2 years)</strong>) :
                            name === "cus6c" ? (<strong>Bottom 5 Zones  (Least % of Detection/Revenue collected)</strong>) :
                            name === "cus6d" ? (<strong>Bottom 5 Zones  (Least % of Recovery/Detection(In Lakh))</strong>) :
                            name === "cus6e" ? (<strong>Bottom 5 Zones  (Least % of Disposal of cases of outright smuggling)</strong>) :
                            name === "cus6f" ? (<strong>Bottom 5 Zones  (Least % of Disposal of cases of Commercial fraud)</strong>) :
                            name === "cus12a" ? (<strong>Bottom 5 Zones (Least % of Appeal cases disposed/cases pending )</strong>) :
                            name === "cus12b" ? (<strong>Bottom 5 Zones (Highest % of Cases pending &gt; 1 year )</strong>) :
                            name === "cus2a" ? (<strong>Bottom 5 Zones (Least % of Notices issued/EO fulfilment time is over)</strong>) :
                            name === "cus2b" ? (<strong>Bottom 5 Zones (Highest % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus2c" ? (<strong>Bottom 5 Zones (Least % of Duty recovered/duty involved in expired licenses)</strong>) :
                            name === "cus3a" ? (<strong>Bottom 5 Zones (Least % of Notices issued/EO time is over)</strong>) :
                            name === "cus3b" ? (<strong>Bottom 5 Zones (Highest % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                            name === "cus3c" ? (<strong>Bottom 5 Zones (Least % of Duty recover/duty involved in expired licenses)</strong>) :
                            name === "cus4a" ? (<strong>Bottom 5 Zones (Highest % of (Non SVB) &gt; 6 months PA/total PA)</strong>) : 
                            name === "cus4b" ? (<strong>Bottom 5 Zones (Highest % of (Non SVB) &gt; 6 months PD bonds/total PD bonds)</strong>) :
                            name === "cus4c" ? (<strong>Bottom 5 Zones (Least % of SVB finalised/Pending beginning of month)</strong>) : 
                            name === "cus4d" ? (<strong>Bottom 5 Zones (Highest % of SVB pending &gt; 1 year/total pending)</strong>) :
                            name === "cus7a" ? (<strong>Bottom 5 Zones (Highest % of Not launched in 2 months of sanction/total sanction)</strong>) :
                            name === "cus7b" ? (<strong>Bottom 5 Zones (Least % of launched/arrests)</strong>) :
                            name === "cus8a" ? (<strong>Bottom 5 Zones (Least % of Disposal of packages/pending beg of month)</strong>) :
                            name === "cus8b" ? (<strong>Bottom 5 Zones (Highest % of Pending  6 month/total pending)</strong>) : 
                            name === "cus11a" ?(<strong>Bottom 5 Zones (Highest % of No action on expired bonds/total expired wh bonds)</strong>) :
                            name === "cus11b" ?(<strong>Bottom 5 Zones (Least % of Duty recovered/duty involved)</strong>) :  
                            name === "cus10a" ?(<strong>Bottom 5 Zones (Least % of Duty Recovered/target upto the month)</strong>) : 
                            name === "cus10b" ?(<strong>Bottom 5 Zones (Highest % of Pending &gt; 1 yr /total pending)</strong>) :      
                            (
                              <strong>Bottom 5 Zones</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allcustomsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        ) : (
                          <div className="card-header">
                            {name === "cus9a" ? (
                              <strong>
                                Bottom 5 Commissionerates(Least % of Gold disposed/Gold
                                ripe for disposal)
                              </strong>
                            ) :
                            name === "cus9b" ? (<strong>Bottom 5 Commissionerates (Least % of Confiscated narcotics disposed/Pending for disposal)</strong>) :
                             name === "cus1" ? (<strong> Bottom 5 Commissionerates (Highest % of refund Pending for &gt; 90 days)</strong>) :
                             name === "cus5a" ? (<strong>Bottom 5 Commissionerates (Least % of adjudication cases Disposed)</strong>) : 
                             name === "cus5b" ? (<strong>Bottom 5 Commissionerates (Highest % of ADJ Cases pending &gt; 1 year)</strong>) : 
                             name === "cus5c" ? (<strong>Bottom 5 Commissionerates (Highest % of ADJ Cases pending &gt; 1 year(duty involved &gt; 1 crore) )</strong>) :
                             name === "cus6a" ? (<strong>Bottom 5 Commissionerates (Least % of Investigation Completed)</strong>) :
                             name === "cus6b" ? (<strong>Bottom 5 Commissionerates (Highest % of Cases pending &gt; 2 years)</strong>) :
                             name === "cus6c" ? (<strong>Bottom 5 Commissionerates (Least % of Detection/Revenue collected)</strong>) : 
                             name === "cus6d" ? (<strong>Bottom 5 Commissionerates (Least % of Recovery/Detection(In Lakh))</strong>) :
                             name === "cus6e" ? (<strong>Bottom 5 Commissionerates (Least % of Disposal of cases of outright smuggling)</strong>) :
                             name === "cus6f" ? (<strong>Bottom 5 Commissionerates (Least % of Disposal of cases of Commercial fraud)</strong>) : 
                             name === "cus12a" ?(<strong>Bottom 5 Commissionerates (Least % of Appeal Cases disposed/pending at start of month)</strong>) :
                             name === "cus12b" ?(<strong>Bottom 5 Commissionerates (Highest % of Cases pending &gt; 1 year/total pending)</strong>) :
                             name === "cus2a" ? (<strong>Bottom 5 Commissionerates (Least % of Notices issued/EO fulfilment time is over)</strong>) : 
                             name === "cus2b" ? (<strong>Bottom 5 Commissionerates (Highest % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                             name === "cus2c" ? (<strong>Bottom 5 Commissionerates (Least % of Duty recovered/duty involved in expired licenses)</strong>) :
                             name === "cus3a" ? (<strong>Bottom 5 Commissionerates (Least % of Notices issued/EO time is over)</strong>) :
                             name === "cus3b" ? (<strong>Bottom 5 Commissionerates (Highest % of No revenue protective measures/EO fulfillment time is over)</strong>) :
                             name === "cus3c" ? (<strong>Bottom 5 Commissionerates (Least % of Duty recover/duty involved in expired licenses)</strong>) :
                             name === "cus4a" ? (<strong>Bottom 5 Commissionerates (Highest % of (Non SVB) &gt; 6 months PA/total PA)</strong>) : 
                             name === "cus4b" ? (<strong>Bottom 5 Commissionerates (Highest % of (Non SVB) &gt; 6 months PD bonds/total PD bonds)</strong>) : 
                             name === "cus4c" ? (<strong>Bottom 5 Commissionerates (Least % of SVB finalised/Pending beginning of month)</strong>) : 
                             name === "cus4d" ? (<strong>Bottom 5 Commissionerates (Highest % of SVB pending &gt; 1 year/total pending)</strong>) :
                             name === "cus7a" ? (<strong>Bottom 5 Commissionerates (Highest % of Not launched in 2 months of sanction/total sanction)</strong>) :
                             name === "cus7b" ? (<strong>Bottom 5 Commissionerates (Least % of Prosecution launched/arrests)</strong>) :
                             name === "cus8a" ? (<strong>Bottom 5 Commissionerates (Least % of Disposal of packages/pending beg of month)</strong>) :
                             name === "cus8b" ? (<strong>Bottom 5 Commissionerates (Highest % of Pending &gt; 6 month/total pending)</strong>) :
                             name === "cus11a" ? (<strong>Bottom 5 Commissionerates (Highest % of No action on expired bonds/total expired W/H bonds)</strong>) : 
                             name === "cus11b" ? (<strong>Bottom 5 Commissionerates (Least % of Duty recovered/duty involved in W/H bonds)</strong>) :
                             name === "cus10a" ?(<strong>Bottom 5 Commissionerates (Least % of Arrears recovered/target upto the month)</strong>) : 
                             name === "cus10b" ?(<strong>Bottom 5 Commissionerates (Highest % of Arrears pending &gt; 1 yr /total pending)</strong>) :      
                             (
                              <strong>Bottom 5 Commissionerates</strong>
                            )}
                            <span className="small ms-1">
                              <Link to={`/allcustomsubparameters?name=${name}`}>
                                View Details
                              </Link>
                            </span>
                          </div>
                        )}
                        <div className="card-body">
                          <div id="chart">
                            <div className="responsive-chart main-chart">
                              <ReactFusioncharts
                                type="column3d"
                                width="100%"
                                height="500"
                                dataFormat="JSON"
                                dataSource={bottom5}
                              />

                              {selectedOption1 === "Zones" ? (
                                <Link
                                  to={`/allcustomsubparameters?name=${name}`}
                                >
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              ) : (
                                <Link to={`/allsubparameters?name=${name}`}>
                                  <Button className="openbtn">
                                    <KeyboardArrowRightIcon />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="export-btn">
                    <button
                      onClick={exportToXLS}
                      className="btn btn-primary m-3"
                    >
                      Export XLS
                    </button>
                  </div>

                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows={false}
                    columns={
                      selectedOption1 === "Zones" ? columns : columnscomm
                    }
                    columnSorter
                    items={data}
                    itemsPerPageSelect
                    itemsPerPage={itemsSelect}
                    onItemsPerPageChange={handleItemsChange}
                    pagination
                    onRowClick={onRowClick}
                    onFilteredItemsChange={(items) => {
                      console.log(items);
                    }}
                    onSelectedItemsChange={(items) => {
                      console.log(items);
                    }}
                    scopedColumns={
                      selectedOption1 === "Zones"
                        ? scopedColumns
                        : scopedColumnscomm
                    }
                    sorterValue={{ column: "status", state: "asc" }}
                    tableFilter
                    tableProps={{
                      className: "add-this-class",
                      responsive: true,
                      // striped: true,
                      hover: true,
                      // bordered:true,
                      align: "middle",
                      // borderColor:'info',
                      border: "primary",
                    }}
                    onKeyDown={(e)=>checkSpecialChar(e)}
                    // tableBodyProps={{
                    //   className: "align-middle border-info",
                    //   color:'primary',
                    // }}
                    // tableHeadProps={{
                    //   className:"border-info alert-dark",
                    // }}
                  />
                </div>
              ) : (
                <div className="row custom-tb mb col ">
                  <div className="export-btn">
                    <button
                      onClick={exportToXLS}
                      className="btn btn-primary m-3"
                    >
                      Export XLS
                    </button>
                  </div>

                  <CSmartTable
                    activePage={1}
                    cleaner
                    clickableRows={false}
                    columns={
                      selectedOption1 === "Zones" ? columns : columnscomm
                    }
                    columnSorter
                    items={data}
                    itemsPerPageSelect
                    itemsPerPage={itemsSelect}
                    onItemsPerPageChange={handleItemsChange}
                    pagination
                    onRowClick={onRowClick}
                    onFilteredItemsChange={(items) => {
                      console.log(items);
                    }}
                    onSelectedItemsChange={(items) => {
                      console.log(items);
                    }}
                    scopedColumns={
                      selectedOption1 === "Zones"
                        ? scopedColumns
                        : scopedColumnscomm
                    }
                    sorterValue={{ column: "status", state: "asc" }}
                    tableFilter
                    tableProps={{
                      className: "add-this-class",
                      responsive: true,
                      // striped: true,
                      hover: true,
                      // bordered:true,
                      align: "middle",
                      // borderColor:'info',
                      border: "primary",
                    }}
                    onKeyDown={(e)=>checkSpecialChar(e)}
                    // tableBodyProps={{
                    //   className: "align-middle border-info",
                    //   color:'primary',
                    // }}
                    // tableHeadProps={{
                    //   className:"border-info alert-dark",
                    // }}
                  />
                </div>
              )}
            </div>
            <div className="row"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomSubpara;
