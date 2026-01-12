import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Typography, Box, TextField, Grid, InputAdornment, 
  Button, Drawer, Stack, Avatar, Alert, Snackbar, Toolbar, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import WarningIcon from '@mui/icons-material/Warning';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = (query = '') => {
    let url = 'http://localhost:8080/api/transactions';
    if (query) url = `http://localhost:8080/api/transactions/search?keyword=${query}`;
    axios.get(url).then(res => setTransactions(res.data));
  };

  const handleExport = () => {
    axios.post('http://localhost:8080/api/transactions/log?action=EXPORT_REPORT');
    const headers = ["ID,Merchant,Email,Amount,Status,Date"];
    const rows = transactions.map(t => `${t.transactionId},${t.merchant},${t.customerEmail},${t.amount},${t.status},${t.timestamp}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_report.csv");
    document.body.appendChild(link);
    link.click();
    setNotification({ open: true, message: "Report Generated Successfully", severity: 'success' });
  };

  const handleRefund = (id) => {
    if (!window.confirm("Are you sure you want to refund this transaction?")) return;
    axios.post(`http://localhost:8080/api/transactions/${id}/refund`)
      .then(() => {
        setNotification({ open: true, message: "Refund Processed Successfully!", severity: 'success' });
        fetchTransactions(searchQuery); 
        setSelectedTxn(null); 
      })
      .catch(err => setNotification({ open: true, message: "Refund Failed", severity: 'error' }));
  };

  const handleFraud = (id) => {
    if (!window.confirm("WARNING: Mark this as FRAUD?")) return;
    axios.post(`http://localhost:8080/api/transactions/${id}/fraud`)
      .then(() => {
        setNotification({ open: true, message: "Flagged as FRAUD", severity: 'warning' });
        fetchTransactions(searchQuery); 
        setSelectedTxn(null); 
      })
      .catch(err => setNotification({ open: true, message: "Action Failed", severity: 'error' }));
  };

  return (
    <Box sx={{ padding: 4, bgcolor: '#000000', minHeight: '100vh', color: 'white', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 3 }}>
        TRANSACTION LOGS
      </Typography>

      {/* SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 4, bgcolor: '#121212', border: '1px solid #333', borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField fullWidth placeholder="Search Database..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); fetchTransactions(e.target.value); }}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#757575' }}/></InputAdornment>,
                style: { color: 'white' }
              }}
              sx={{ bgcolor: '#000', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
                fullWidth 
                variant="contained"
                startIcon={<DownloadIcon />} 
                onClick={handleExport}
                sx={{
                    background: 'linear-gradient(45deg, #2979FF, #00E5FF)',
                    boxShadow: '0 0 10px rgba(41, 121, 255, 0.5)',
                    fontWeight: 'bold', color: 'white', height: '100%'
                }}
            >
              EXPORT CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* DARK TABLE */}
      <TableContainer component={Paper} sx={{ bgcolor: '#121212', borderRadius: 2, border: '1px solid #333' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1e1e1e' }}>
            <TableRow>
              {['ID', 'MERCHANT', 'EMAIL', 'AMOUNT', 'STATUS', 'ACTION'].map((head) => (
                <TableCell key={head} sx={{ color: '#999', fontWeight: 'bold', borderBottom: '1px solid #333' }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: '#1e1e1e' } }}>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid #333' }}>{row.transactionId}</TableCell>
                <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #333' }}>{row.merchant}</TableCell>
                <TableCell sx={{ color: '#ccc', borderBottom: '1px solid #333' }}>{row.customerEmail}</TableCell>
                <TableCell sx={{ color: '#00E5FF', fontWeight: 'bold', borderBottom: '1px solid #333' }}>${row.amount}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Chip 
                    label={row.status} 
                    sx={{ 
                      bgcolor: row.status === 'SUCCESS' ? 'rgba(0, 230, 118, 0.1)' : row.status === 'FAILED' ? 'rgba(255, 23, 68, 0.1)' : 'rgba(255, 145, 0, 0.1)',
                      color: row.status === 'SUCCESS' ? '#00e676' : row.status === 'FAILED' ? '#ff1744' : '#ff9100',
                      fontWeight: 'bold', border: '1px solid'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #333' }}>
                  <Button size="small" variant="outlined" startIcon={<VisibilityIcon/>} 
                    onClick={() => setSelectedTxn(row)}
                    sx={{ color: '#ccc', borderColor: '#555', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    VIEW
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- RESTORED DETAILS DRAWER --- */}
      <Drawer anchor="right" open={Boolean(selectedTxn)} onClose={() => setSelectedTxn(null)}>
        <Toolbar /> {/* Push content down below header */}
        
        <Box sx={{ width: 450, p: 4, bgcolor: '#121212', height: '100%', color: 'white', borderLeft: '1px solid #333' }}>
          
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: '#2979FF', width: 50, height: 50 }}><ReceiptLongIcon /></Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">DETAILS</Typography>
                <Typography variant="body2" color="gray">{selectedTxn?.transactionId}</Typography>
              </Box>
            </Stack>
            <Button onClick={() => setSelectedTxn(null)} sx={{ color: 'gray' }}><CloseIcon /></Button>
          </Stack>
          
          <Divider sx={{ bgcolor: '#333', mb: 3 }} />

          {selectedTxn && (
            <Stack spacing={3}>
              
              {/* 1. Customer Info */}
              <Paper sx={{ p: 2, bgcolor: '#1e1e1e', borderLeft: '4px solid #2979FF', borderRadius: 2 }}>
                <Stack direction="row" gap={2} alignItems="center">
                  <PersonIcon sx={{ color: '#2979FF' }} />
                  <Box>
                    <Typography variant="caption" color="gray">CUSTOMER</Typography>
                    <Typography variant="body1" color="white">{selectedTxn.customerEmail}</Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 2. Payment Info */}
              <Paper sx={{ p: 2, bgcolor: '#1e1e1e', borderLeft: '4px solid #00E676', borderRadius: 2 }}>
                <Stack direction="row" gap={2} alignItems="center">
                  <CreditCardIcon sx={{ color: '#00E676' }} />
                  <Box>
                    <Typography variant="caption" color="gray">PAYMENT METHOD</Typography>
                    <Typography variant="body1" color="white">{selectedTxn.paymentMethod} • <span style={{color: '#00E676', fontWeight: 'bold'}}>${selectedTxn.amount}</span></Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 3. Status Info */}
              <Box sx={{ p: 2, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="caption" color="gray">CURRENT STATUS</Typography>
                <Stack direction="row" spacing={1} mt={1}>
                   <Chip label={selectedTxn.status} 
                         sx={{ 
                           bgcolor: selectedTxn.status === 'SUCCESS' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 23, 68, 0.2)',
                           color: selectedTxn.status === 'SUCCESS' ? '#00E676' : '#FF1744', 
                           fontWeight: 'bold' 
                         }} 
                   />
                   {selectedTxn.refundStatus && selectedTxn.refundStatus !== 'NONE' && (
                     <Chip label={selectedTxn.refundStatus} variant="outlined" sx={{ color: '#2979FF', borderColor: '#2979FF' }} />
                   )}
                </Stack>
              </Box>

              <Divider sx={{ bgcolor: '#333', my: 2 }} />
              
              {/* 4. Actions (Refund & Fraud) */}
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Actions</Typography>
              
              <Stack direction="row" spacing={2}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="info"
                  startIcon={<ReplayIcon />}
                  onClick={() => handleRefund(selectedTxn.id)}
                  disabled={selectedTxn.status !== 'SUCCESS' || selectedTxn.refundStatus === 'REFUNDED'}
                  sx={{ bgcolor: '#2979FF', '&:hover': { bgcolor: '#1565C0' } }}
                >
                  REFUND
                </Button>
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="error"
                  startIcon={<WarningIcon />}
                  onClick={() => handleFraud(selectedTxn.id)}
                  disabled={selectedTxn.status === 'FAILED'}
                  sx={{ bgcolor: '#D50000', '&:hover': { bgcolor: '#B71C1C' } }}
                >
                  FLAG FRAUD
                </Button>
              </Stack>

              {selectedTxn.status === 'SUCCESS' && (
                <Typography variant="caption" color="gray" align="center">
                  Refunds can only be initiated for successful transactions.
                </Typography>
              )}

            </Stack>
          )}
        </Box>
      </Drawer>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};
export default TransactionList;