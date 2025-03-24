import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to ZAOGA FIF Knowledge-Base Admin dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Contributions added"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Questions Asked"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Users"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="FAQs"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

       {/* ROW 2 */}
<Box
  gridColumn="span 6"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
>
  <Box
    mt="25px"
    p="0 30px"
    display="flex "
    justifyContent="space-between"
    alignItems="center"
  >
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        color={colors.grey[100]}
      >
        Contributions Overview
      </Typography>
      <Typography
        variant="h3"
        fontWeight="bold"
        color={colors.greenAccent[500]}
      >
        {/* Add any specific data or title */}
      </Typography>
    </Box>
    <Box>
      <IconButton>
        <DownloadOutlinedIcon
          sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
        />
      </IconButton>
    </Box>
  </Box>
  <Box height="250px" m="-20px 0 0 0">
    <BarChart isDashboard={true} />
  </Box>
</Box>
<Box
  gridColumn="span 6"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
  p="30px"
>
  <Typography variant="h5" fontWeight="600">
    Total Users
  </Typography>
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    mt="25px"
  >
    <ProgressCircle size="125" />
    <Typography
      variant="h5"
      color={colors.greenAccent[500]}
      sx={{ mt: "15px" }}
    >
      {/* Add any data */}
    </Typography>
    <Typography>Includes extra misc expenditures and costs</Typography>
  </Box>
</Box>

        {/* ROW 3 */}
<Box
  gridColumn="span 8"
  gridRow="span 2"
  backgroundColor={colors.primary[400]}
>
  <Box
    mt="25px"
    p="0 30px"
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Box>
      <Typography
        variant="h5"
        fontWeight="600"
        color={colors.grey[100]}
      >
        Recent Activities Overview
      </Typography>
      <Typography
        variant="h3"
        fontWeight="bold"
        color={colors.greenAccent[500]}
      >
        Activities by Day
      </Typography>
    </Box>
    <Box>
      <IconButton>
        <DownloadOutlinedIcon
          sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
        />
      </IconButton>
    </Box>
  </Box>
  <Box height="250px" m="-20px 0 0 0">
    <LineChart isDashboard={true} />
  </Box>
</Box>


       
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Active Users
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Analytics and Reporting
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
