import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { Box, CircularProgress, Typography } from "@mui/material";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8081/articles/topic-counts');
        
        if (!response.ok) {
          // Enhanced error handling
          if (response.status === 404) {
            throw new Error('Resource not found (404). Please check the API endpoint.');
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        
        const result = await response.json();
        
        if (!Array.isArray(result)) {
          throw new Error('Invalid data format received from API');
        }
        
        // Transform and validate data
        const formattedData = result.map(item => ({
          topic: item.topic || 'Other',
          count: Number(item.count) || 0
        })).sort((a, b) => b.count - a.count);
        
        setData(formattedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        // Fallback demo data
        setData([
          { topic: 'Printer', count: 8 },
          { topic: 'Hardware', count: 4 },
          { topic: 'Network', count: 3 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <CircularProgress color="secondary" />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" color="error.main">
      <Typography variant="body1">Error: {error}</Typography>
    </Box>
  );

  return (
    <ResponsiveBar
      data={data}
      keys={['count']}
      indexBy="topic"
      margin={{
        top: 20,
        right: isDashboard ? 20 : 60,
        bottom: isDashboard ? 80 : 100,
        left: isDashboard ? 50 : 70
      }}
      padding={0.6}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: isDashboard ? undefined : 'Article Topics',
        legendPosition: 'middle',
        legendOffset: 60
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Number of Articles',
        legendPosition: 'middle',
        legendOffset: -50,
        format: (value) => Number.isInteger(value) ? value : ''
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: colors.grey[100],
              fontSize: 12
            }
          },
          legend: {
            text: {
              fill: colors.grey[100],
              fontSize: 14
            }
          }
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
            fontSize: 12
          }
        }
      }}
    />
  );
};

export default BarChart;