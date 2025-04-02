import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";

const UserStatsCircle = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('http://localhost:8081/users/count');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user count: ${response.status}`);
        }
        
        const data = await response.json();
        setUserCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching user count:', err);
        setError(err.message);
        setUserCount(32441); // Fallback to your dashboard number
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      {/* User Count Display */}
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(${colors.blueAccent[500]} 0deg 270deg, ${colors.primary[400]} 270deg 360deg)`,
          borderRadius: "50%",
          width: "180px",
          height: "180px",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${colors.greenAccent[500]}`,
          mb: 2
        }}
      >
        {loading ? (
          <CircularProgress color="secondary" size={60} />
        ) : error ? (
          <Typography color="error" variant="h6">
            Error
          </Typography>
        ) : (
          <Typography
            variant="h2"
            fontWeight="bold"
            color={colors.grey[100]}
          >
            {userCount.toLocaleString()}
          </Typography>
        )}
      </Box>
      
      {/* Label and Additional Stats */}
      <Typography
        variant="h4"
        color={colors.greenAccent[500]}
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        User Statistics
      </Typography>
      
      <Typography variant="h6" color={colors.grey[100]}>
        Total Users
      </Typography>
      
      <Typography 
        variant="body1" 
        color={colors.greenAccent[500]}
        sx={{ mt: 1 }}
      >
        +5% from last month
      </Typography>
    </Box>
  );
};

export default UserStatsCircle;