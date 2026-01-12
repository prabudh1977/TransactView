import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Button, MenuItem, Select, FormControl, Radio, RadioGroup, FormControlLabel 
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import PieChartIcon from '@mui/icons-material/PieChart';
import ErrorIcon from '@mui/icons-material/Error';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // Default to 7 Days
  const [exportType, setExportType] = useState('csv');

  // --- 1. LOGIC FIX: FETCH DATA BASED ON TIME RANGE ---
  useEffect(() => {
    axios.get(`http://localhost:8080/api/analytics/dashboard?range=${timeRange}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching analytics:", err));
  }, [timeRange]); // Re-runs whenever 'timeRange' changes

  if (!data) return <Typography sx={{ p: 4, color: 'white' }}>Loading System...</Typography>;

  // --- DATA PREPARATION ---
  const total = data.total_volume || 1;
  const successCount = Math.round((parseFloat(data.success_rate) / 100) * total);
  const pendingCount = data.pending_actions || 0;
  const failedCount = total - successCount - pendingCount;

  const pieData = [
    { name: 'Success', value: successCount, color: '#00E676' },
    { name: 'Pending', value: pendingCount, color: '#FFD740' },
    { name: 'Failed', value: failedCount > 0 ? failedCount : 0, color: '#FF1744' }
  ];

  const failureData = data.failure_reasons && data.failure_reasons.length > 0 
    ? data.failure_reasons 
    : [{ reason: "No Failures", count: 0 }];

  const handleDownload = () => {
    const headers = ["Date,Volume"];
    const rows = data.daily_trend.map(row => `${row.date},${row.count}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const KpiCard = ({ title, value, icon, gradient }) => (
    <Card sx={{ 
        height: '100%', bgcolor: '#121212', border: '1px solid #333', borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: gradient }} />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="overline" sx={{ color: '#888', letterSpacing: 1, fontWeight: 'bold' }}>{title}</Typography>
          <Box p={1} borderRadius="50%" bgcolor="rgba(255,255,255,0.05)">{icon}</Box>
        </Box>
        <Typography variant="h4" fontWeight="800" sx={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 4, bgcolor: '#000000', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER WITH DATE PICKER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
            ANALYTICS DASHBOARD
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>Real-time Insights & Reporting</Typography>
        </Box>
        
        {/* --- 2. APPEARANCE FIX: STYLED DROPDOWN --- */}
        <Box display="flex" alignItems="center" gap={1} bgcolor="#121212" p={0.5} borderRadius={2} border="1px solid #333">
            <CalendarMonthIcon sx={{ color: '#00E5FF', ml: 1 }} />
            <FormControl size="small">
                <Select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{ 
                    color: 'white', 
                    '& .MuiSvgIcon-root': { color: '#00E5FF' },
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    minWidth: 150
                  }}
                  MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: '#121212', // Dark Background for list
                            border: '1px solid #333',
                            color: 'white',
                            marginTop: 1,
                            '& .MuiMenuItem-root': {
                                '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF' },
                                '&.Mui-selected': { bgcolor: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF' }
                            }
                        }
                    }
                  }}
                >
                  <MenuItem value="24h">Last 24 Hours</MenuItem>
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                </Select>
            </FormControl>
        </Box>
      </Box>

      {/* --- ROW 1: KPI CARDS --- */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="TOTAL REVENUE" value={`$${data.total_revenue.toLocaleString()}`} icon={<AttachMoneyIcon sx={{ color: '#00E5FF' }} />} gradient="linear-gradient(90deg, #00E5FF, #2979FF)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="TOTAL VOLUME" value={data.total_volume} icon={<TrendingUpIcon sx={{ color: '#00E676' }} />} gradient="linear-gradient(90deg, #00E676, #00C853)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="SUCCESS RATE" value={`${data.success_rate}%`} icon={<PieChartIcon sx={{ color: '#FFD740' }} />} gradient="linear-gradient(90deg, #FFD740, #FFAB00)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="PENDING ACTIONS" value={data.pending_actions} icon={<WarningIcon sx={{ color: '#FF1744' }} />} gradient="linear-gradient(90deg, #FF1744, #D50000)" />
        </Grid>
      </Grid>

      {/* --- ROW 2: TRAFFIC & STATUS --- */}
      <Grid container spacing={3} mb={4}>
        
        {/* LINE CHART (TRAFFIC) */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#121212', border: '1px solid #333', height: '450px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="#ccc">TRAFFIC TREND</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily_trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2979FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#555" tick={{fill: '#888', fontSize: 12}} tickFormatter={(str) => str ? str.substring(5) : ''} />
                <YAxis stroke="#555" tick={{fill: '#888', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: 'white' }} />
                <Area type="monotone" dataKey="count" stroke="#2979FF" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* DONUT CHART (STATUS) */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#121212', border: '1px solid #333', height: '450px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="#ccc">STATUS BREAKDOWN</Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    {/* --- 3. FIX: READABLE TOOLTIP --- */}
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: 'white' }}
                        cursor={false}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#ccc' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center Text */}
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>{data.success_rate}%</Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>HEALTH</Typography>
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* --- ROW 3: FAILURE ANALYSIS & EXPORT --- */}
      <Grid container spacing={3}>
        
        {/* BAR CHART (TOP FAILURE REASONS) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#121212', border: '1px solid #333', height: '350px' }}>
            <Box display="flex" alignItems="center" mb={2}>
                <ErrorIcon sx={{ color: '#FF1744', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="#ccc">TOP FAILURE REASONS</Typography>
            </Box>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart layout="vertical" data={failureData} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#555" tick={{fill: '#888'}} />
                    <YAxis dataKey="reason" type="category" width={120} stroke="#555" tick={{fill: '#ccc', fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: 'white' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="count" fill="#FF1744" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* EXPORT CONTROL SECTION */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#121212', border: '1px solid #333', height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h6" fontWeight="bold" mb={1} color="#ccc">DATA EXTRACTION</Typography>
                <Typography variant="body2" color="#666" mb={3}>Select format and range to download reports.</Typography>
                
                <FormControl component="fieldset">
                    <RadioGroup value={exportType} onChange={(e) => setExportType(e.target.value)}>
                        <FormControlLabel value="pdf" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#00E5FF' } }} />} label={<Typography color="#ccc">PDF (Executive Summary)</Typography>} />
                        <FormControlLabel value="csv" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#00E5FF' } }} />} label={<Typography color="#ccc">CSV (Raw Data)</Typography>} />
                    </RadioGroup>
                </FormControl>
            </Box>

            <Button 
                variant="contained" 
                fullWidth 
                startIcon={<DownloadIcon />} 
                onClick={handleDownload}
                sx={{ 
                    background: 'linear-gradient(45deg, #00E5FF, #2979FF)', 
                    fontWeight: 'bold', 
                    py: 1.5,
                    boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
                }}
            >
                DOWNLOAD REPORT
            </Button>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};
export default AnalyticsDashboard;