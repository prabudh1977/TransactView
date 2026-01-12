import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch analytics from Java Backend
    axios.get('http://localhost:8080/api/transactions/stats')
      .then(res => {
        // Transform the dictionary {SUCCESS: 10, FAILED: 2} into array for charts
        const chartData = Object.keys(res.data).map(key => ({ 
          name: key, 
          value: res.data[key] 
        }));
        setData(chartData);
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Analytics Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>Transaction Status Rates</Typography>
            
            {/* Show chart only if data exists */}
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <Typography color="textSecondary">No transaction data available yet.</Typography>
                <Typography variant="caption">Start the backend and add data.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;