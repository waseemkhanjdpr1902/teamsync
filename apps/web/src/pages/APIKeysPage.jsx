import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const APIKeysPage = () => {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const records = await pb.collection('api_keys').getFullList({ $autoCancel: false });
      setKeys(records);
    } catch (error) {
      console.error('Error fetching keys:', error);
    }
  };

  const generateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setLoading(true);
    try {
      const key = crypto.randomUUID();
      await pb.collection('api_keys').create({
        key,
        name: newKeyName,
      }, { $autoCancel: false });
      toast.success('API key generated');
      setNewKeyName('');
      fetchKeys();
    } catch (error) {
      toast.error('Failed to generate key');
    } finally {
      setLoading(false);
    }
  };

  const deleteKey = async (id) => {
    try {
      await pb.collection('api_keys').delete(id, { $autoCancel: false });
      toast.success('API key deleted');
      fetchKeys();
    } catch (error) {
      toast.error('Failed to delete key');
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  return (
    <>
      <Helmet>
        <title>API Keys - UselessAI</title>
        <meta name="description" content="Manage your API keys." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">API Keys</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>Create a new API key for integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Key name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="text-foreground"
                />
                <Button onClick={generateKey} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              {keys.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No API keys yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>{key.name}</TableCell>
                        <TableCell className="font-mono text-sm">{key.key.substring(0, 20)}...</TableCell>
                        <TableCell>{new Date(key.created).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => copyKey(key.key)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default APIKeysPage;
