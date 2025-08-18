import React from 'react';
import dynamic from "next/dynamic";
import moment from "moment";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';

const RevenueUpdates = () => {
  const [month, setMonth] = React.useState('1');

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Sample dataset with timestamps (e.g., daily data for one month)
  const dataSet = [
    [1000000, 1200000, 1500000, 1400000, 1300000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000], // Teachers
    [2000000, 2200000, 2300000, 2400000, 2500000, 2600000, 2700000, 2800000, 2900000, 3000000, 3100000, 3200000], // Students
    [1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2600000]  // Parents
  ];

  // Generating dummy timestamps for the x-axis
  const dateStart = new Date("2023-01-01").getTime();
  const dateEnd = new Date("2023-01-12").getTime();
  const timestamps = [];
  
  for (let i = 0; i < 12; i++) {
    timestamps.push(dateStart + i * (dateEnd - dateStart) / 11); // 11 intervals for 12 points
  }

  // chart options for the area chart
  const options = {
    series: [
      {
        name: 'Teachers',
        data: dataSet[0],
      },
      {
        name: 'Students',
        data: dataSet[1],
      },
      {
        name: 'Parents',
        data: dataSet[2],
      },
    ],
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8da4',
        },
        offsetX: 0,
        formatter: function(val: any) {
          return (val / 1000000).toFixed(2); // Display in millions
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: timestamps.map((timestamp) => moment(timestamp).format("YYYY-MM-DD")), // Format for x-axis labels
      tickAmount: 12,
      labels: {
        rotate: -10,
        rotateAlways: true,
        formatter: function(val: any, timestamp: any) {
          return moment(new Date(timestamp)).format("DD MMM YYYY"); // Format for the tooltip
        },
      },
    },
    title: {
      text: 'Users Update',
      align: 'left',
      offsetX: 14,
    },
    tooltip: {
      shared: true,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetX: -10,
    },
  };

  return (
    <DashboardCard title="Overview">
      <Grid container spacing={3}>
        {/* area chart */}
        <Grid item xs={12}>
          <Chart
            options={options as any}
            series={options.series}
            type="area"
            height={350}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
