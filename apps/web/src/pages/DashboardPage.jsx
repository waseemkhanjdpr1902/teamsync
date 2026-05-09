import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Link2, QrCode, TrendingUp, Clock, Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    cvs: 0,
    urls: 0,
    qrCodes: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [cvs, urls, qrCodes] = await Promise.all([
        pb.collection('cvs').getList(1, 1, { $autoCancel: false }),
        pb.collection('shortened_urls').getList(1, 1, { $autoCancel: false }),
        pb.collection('qr_codes').getList(1, 1, { $autoCancel: false }),
      ]);

      setStats({
        cvs: cvs.totalItems,
        urls: urls.totalItems,
        qrCodes: qrCodes.totalItems,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tools = [
    {
      name: 'CV Builder',
      description: 'Create professional CVs',
      icon: FileText,
      path: '/dashboard/cv-builder',
      color: 'bg-blue-500',
    },
    {
      name: 'Resume Analyzer',
      description: 'Get AI-powered insights',
      icon: TrendingUp,
      path: '/dashboard/resume-analyzer',
      color: 'bg-green-500',
    },
    {
      name: 'URL Shortener',
      description: 'Shorten and track links',
      icon: Link2,
      path: '/dashboard/url-shortener',
      color: 'bg-purple-500',
    },
    {
      name: 'QR Code Generator',
      description: 'Generate custom QR codes',
      icon: QrCode,
      path: '/dashboard/qr-code-generator',
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - UselessAI</title>
        <meta name="description" content="Your UselessAI dashboard." />
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name || 'User'}</h1>
            <p className="text-muted-foreground">Here's what's happening with your account today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">CVs Created</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cvs}</div>
                <p className="text-xs text-muted-foreground">Total CVs in your library</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Short URLs</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.urls}</div>
                <p className="text-xs text-muted-foreground">Active short links</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.qrCodes}</div>
                <p className="text-xs text-muted-foreground">Generated QR codes</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Quick access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.path} to={tool.path}>
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                {currentUser?.subscription_plan === 'pro' || currentUser?.subscription_plan === 'business'
                  ? `You're on the ${currentUser.subscription_plan} plan`
                  : "You're on the free plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.subscription_plan === 'free' && (
                <Button asChild>
                  <Link to="/pricing">Upgrade to Pro</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
