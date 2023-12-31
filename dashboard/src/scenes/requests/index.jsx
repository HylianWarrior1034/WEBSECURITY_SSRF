import { useEffect, useState } from "react";
import axios from "axios";

import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "../../components/Header";

const Requests = () => {
  const [data, setData] = useState({
    id: "",
    sourceIp: "",
    url: "",
    accessLevel: "",
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/query");
        setData(response.data.request);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAllowClick = async (row) => {
    try {
      const response1 = await axios.post("http://localhost:3000/add/allow", {
        ...row,
      });
      console.log(response1);

      const response2 = await axios.get("http://localhost:3000/query");
      setData(response2.data.request);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBlockClick = async (row) => {
    try {
      const response1 = await axios.post("http://localhost:3000/add/block", {
        ...row,
      });
      console.log(response1);

      const response2 = await axios.get("http://localhost:3000/query");
      setData(response2.data.request);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerAlign: "center",
      align: "center",
      headerName: "ID",
    },
    {
      field: "sourceIp",
      headerName: "Source IP Address",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "url",
      headerName: "URL",
      flex: 2,
    },
    {
      field: "allow",
      headerName: "Allow",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[600]}
            borderRadius="4px"
            onClick={() => handleAllowClick(row)}
          >
            <AddCircleIcon />
          </Box>
        );
      },
    },
    {
      field: "block",
      headerName: "Block",
      headerAlign: "center",
      align: "center",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.redAccent[700]}
            borderRadius="4px"
            onClick={() => handleBlockClick(row)}
          >
            <RemoveCircleIcon />
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Requests" subtitle="Managing incoming requests" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={data} columns={columns} />
      </Box>
    </Box>
  );
};

export default Requests;
