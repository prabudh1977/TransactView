import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, GlobalStyles } from '@mui/material';
import Sidebar from './components/Sidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TransactionList from './components/TransactionList';
import AuditLogView from './components/AuditLogView';

const drawerWidth = 240;

function App() {
  const [view, setView] = useState('dashboard');

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000000', minHeight: '100vh', overflowX: 'hidden' }}>
      <CssBaseline />
      
      {/* GLOBAL STYLES: Remove margins, custom scrollbars */}
      <GlobalStyles styles={{
        body: { margin: 0, padding: 0, backgroundColor: '#000000', overflowX: 'hidden' },
        '#root': { width: '100%', height: '100%' },
        '*::-webkit-scrollbar': { width: '8px' },
        '*::-webkit-scrollbar-track': { background: '#111' },
        '*::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '4px' },
        '*::-webkit-scrollbar-thumb:hover': { background: '#ff1744' }
      }} />

      {/* HEADER */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#000000', borderBottom: '1px solid #333' }}>
        <Toolbar>
          {/* UPDATED: Removed Brand Name, kept functional title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 2, color: '#ccc' }}>
            ADMIN CONSOLE
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar onSelect={setView} />

      {/* MAIN CONTENT AREA */}
      <Box component="main" sx={{ flexGrow: 1, p: 0, marginTop: 8, bgcolor: '#000000', width: '100%', minHeight: '100vh' }}>
        {view === 'dashboard' && <AnalyticsDashboard />}
        {view === 'transactions' && <TransactionList />}
        {view === 'audit' && <AuditLogView />} 
      </Box>
    </Box>
  );
}
export default App;