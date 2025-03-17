import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/articles')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Debugging: Log the fetched data
        const formattedData = data.map(item => ({
          topic: item.topic,
          count: item.count,
        }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Create a color mapping for each topic
  const topicColorMap = {};
  const colorPalette = [
    colors.blueAccent?.[500] || "#1a73e8", // Fallback to a default blue
    colors.greenAccent?.[500] || "#10b981", // Fallback to a default green
    colors.redAccent?.[500] || "#e53935", // Fallback to a default red
    colors.yellowAccent?.[500] || "#fdd835", // Fallback to a default yellow
    colors.purpleAccent?.[500] || "#8e24aa", // Fallback to a default purple
    colors.orangeAccent?.[500] || "#fb8c00", // Fallback to a default orange
  ];

  // Assign a color to each topic dynamically
  data.forEach((item, index) => {
    if (!topicColorMap[item.topic]) {
      topicColorMap[item.topic] = colorPalette[index % colorPalette.length];
    }
  });

  // Custom color function
  const getBarColor = (bar) => {
    if (bar.id === "count") {
      return topicColorMap[bar.indexValue] || "#cccccc"; // Fallback to grey
    }
    return "#cccccc"; // Fallback color
  };

  return (
    <ResponsiveBar
      data={data}
      keys={['count']}
      indexBy="topic"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={getBarColor}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Topic",
        legendPosition: "middle",
        legendOffset: 32,
        tickValues: 5, // Adjust the number of ticks if needed
        tickTextColor: "#ffffff", // Set x-axis text color to white
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Count",
        legendPosition: "middle",
        legendOffset: -40,
        tickValues: 5, // Adjust the number of ticks if needed
        tickTextColor: "#ffffff", // Set y-axis text color to white
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " on topic: " + e.indexValue;
      }}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: "#ffffff", // Set axis text color to white
            },
          },
          legend: {
            text: {
              fill: "#ffffff", // Set axis legend text color to white
            },
          },
        },
      }}
    />
  );
};

export default BarChart;