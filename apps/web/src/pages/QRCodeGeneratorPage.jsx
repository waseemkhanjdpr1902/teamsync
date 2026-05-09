import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';

const QRCodeGeneratorPage = () => {
  const [content, setContent] = useState('');
  const [size, setSize] = useState('medium');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrCode, setQrCode] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const records = await pb.collection('qr_codes').getFullList({ 
        sort: '-created',
        $autoCancel: false 
      });
      setHistory(records);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleGenerate = async () => {
    if (!content) {
      toast.error('Please enter content for the QR code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiServerClient.fetch('/qrcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          colors: { dark: foregroundColor, light: backgroundColor },
          size,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate QR code');
      }

      const data = await response.json();
      setQrCode(data.dataUrl);
      toast.success('QR code generated');
      fetchHistory();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>QR Code Generator - UselessAI</title>
        <meta name="description" content="Generate custom QR codes." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">QR Code Generator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter URL or text"
                    className="text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Foreground Color</label>
                    <Input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {qrCode ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img src={qrCode} alt="QR Code" className="max-w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">Download PNG</Button>
                      <Button variant="outline" className="flex-1">Download SVG</Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-12 text-center">
                    <p className="text-muted-foreground">QR code will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No QR codes yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {history.slice(0, 8).map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground truncate">{item.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.created).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default QRCodeGeneratorPage;
