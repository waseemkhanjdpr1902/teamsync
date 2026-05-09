import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';

const URLShortenerPage = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const records = await pb.collection('shortened_urls').getFullList({ 
        sort: '-created',
        $autoCancel: false 
      });
      setUrls(records);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleShorten = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const response = await apiServerClient.fetch('/urls/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_url: url,
          custom_alias: customAlias || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to shorten URL');
      }

      toast.success('URL shortened successfully');
      setUrl('');
      setCustomAlias('');
      fetchUrls();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (shortCode) => {
    const shortUrl = `${window.location.origin}/s/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success('Short URL copied to clipboard');
  };

  const deleteUrl = async (id) => {
    try {
      await apiServerClient.fetch(`/urls/${id}`, { method: 'DELETE' });
      toast.success('URL deleted');
      fetchUrls();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  return (
    <>
      <Helmet>
        <title>URL Shortener - UselessAI</title>
        <meta name="description" content="Shorten and track your URLs." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">URL Shortener</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Shorten URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Long URL</label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Alias (Optional)</label>
                <Input
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-link"
                  className="text-foreground"
                />
              </div>

              <Button onClick={handleShorten} disabled={loading} className="w-full">
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Short URLs</CardTitle>
            </CardHeader>
            <CardContent>
              {urls.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No URLs yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short Code</TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.short_code}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.original_url}</TableCell>
                        <TableCell>{item.clicks || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => copyUrl(item.short_code)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <a href={item.original_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteUrl(item.id)}>
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

export default URLShortenerPage;
