import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const AuditLogView = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/audit')
      .then(res => setLogs(res.data.reverse())) // Show newest first
      .catch(err => console.error(err));
  }, []);

  // Helper to color-code actions
  const getActionColor = (action) => {
    if (action.includes("FRAUD")) return "#FF1744"; // Red for Fraud
    if (action.includes("REFUND")) return "#2979FF"; // Blue for Refund
    if (action.includes("EXPORT")) return "#00E676"; // Green for Export
    return "#ccc"; // Grey for others
  };

  return (
    <Box sx={{ padding: 4, bgcolor: '#000000', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER */}
      <Box display="flex" alignItems="center" mb={4}>
        <Box p={1.5} borderRadius="12px" bgcolor="rgba(255, 23, 68, 0.1)" mr={2}>
            <SecurityIcon sx={{ color: '#FF1744', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', textShadow: '0 0 20px rgba(255,23,68,0.2)' }}>
            SECURITY LOGS
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575' }}>
            Immutable record of all agent actions and system events.
          </Typography>
        </Box>
      </Box>

      {/* DARK TABLE */}
      <TableContainer component={Paper} sx={{ bgcolor: '#121212', border: '1px solid #333', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1e1e1e' }}>
            <TableRow>
              <TableCell sx={{ color: '#777', fontWeight: 'bold', borderBottom: '1px solid #333' }}>LOG ID</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 'bold', borderBottom: '1px solid #333' }}>AGENT</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 'bold', borderBottom: '1px solid #333' }}>ACTION PERFORMED</TableCell>
              <TableCell sx={{ color: '#777', fontWeight: 'bold', borderBottom: '1px solid #333' }}>TIMESTAMP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' } }}>
                <TableCell sx={{ color: '#555', borderBottom: '1px solid #333', fontFamily: 'monospace' }}>
                    #{log.id}
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid #333' }}>
                    {log.username}
                </TableCell>
                <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #333' }}>
                    <span style={{ color: getActionColor(log.action), fontWeight: 'bold', marginRight: '8px' }}>
                        {log.action.split(':')[0]}
                    </span>
                    {log.action.split(':')[1] || ''}
                </TableCell>
                <TableCell sx={{ color: '#777', borderBottom: '1px solid #333', fontFamily: 'monospace' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            
            {logs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: '#555', py: 5 }}>
                        <Typography variant="h6">No security events recorded yet.</Typography>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default AuditLogView;