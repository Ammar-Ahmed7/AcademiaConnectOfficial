import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import PublishNotice from './PublishNotice';
import AllNotice from './Notice-All';
import NoticeUpdate from './Notice-Update'

export default function Notice() {
  const [view, setView] = useState('all');

  return (
    <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <Card sx={{ maxWidth: 1200, mx: 'auto', boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          {/* ─── Header ──────────────────────────────────────────────────────── */}
          <Typography variant="h4" gutterBottom color="primary">
            Notice Management
          </Typography>

          {/* ─── Tabs as Buttons ────────────────────────────────────────────── */}
          <Box mb={3} display="flex" gap={2}>
            <Button
              variant={view === 'all' ? 'contained' : 'outlined'}
              onClick={() => setView('all')}
            >
              All Notices
              
            </Button>
            <Button
              variant={view === 'publish' ? 'contained' : 'outlined'}
              onClick={() => setView('publish')}
            >
              Publish Notice
            </Button>
            <Button
              variant={view === 'update' ? 'contained' : 'outlined'}
              onClick={() => setView('update')}
            >
              Update Notices
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ─── Content Rendering ───────────────────────────────────────────── */}
          <Box>
            {view === 'all' && (
              <Typography variant="body1">
                {/* Replace this with actual All Notices list */}
                <AllNotice/>              </Typography>
            )}

            {view === 'publish' && (
              <Typography variant="body1">
                <PublishNotice/>
              </Typography>
            )}

            {view === 'update' && (
              <Typography variant="body1">
                {/* Replace this with your update/edit notice UI */}
                <NoticeUpdate/>
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
