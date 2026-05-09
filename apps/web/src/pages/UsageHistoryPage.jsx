import React from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UsageHistoryPage = () => {
  const usageData = [
    { tool: 'CV Builder', count: 12, date: '2026-05-08' },
    { tool: 'URL Shortener', count: 47, date: '2026-05-07' },
    { tool: 'QR Code Generator', count: 23, date: '2026-05-06' },
  ];

  return (
    <>
      <Helmet>
        <title>Usage History - UselessAI</title>
        <meta name="description" content="View your usage history." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Usage History</h1>

          <Card>
            <CardHeader>
              <CardTitle>Tool Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Last Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.tool}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default UsageHistoryPage;
