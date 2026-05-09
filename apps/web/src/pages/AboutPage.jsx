import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Users, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Zap,
      title: 'Speed',
      description: 'Build CVs, analyze resumes, and create short links in seconds.',
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Your data is encrypted and never shared with third parties.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of professionals who trust UselessAI.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Powered by AI to deliver the best productivity tools.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - UselessAI</title>
        <meta name="description" content="Learn about UselessAI and our mission to unlock productivity." />
      </Helmet>

      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              About UselessAI
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to unlock productivity for modern professionals.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed">
              UselessAI was founded in 2024 with a simple goal: make professional tools accessible to everyone. We believe that creating a CV, analyzing a resume, or shortening a URL shouldn't require expensive software or technical expertise.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform combines AI-powered tools with an intuitive interface to help you work faster and smarter. Whether you're a job seeker, marketer, or developer, UselessAI has the tools you need to succeed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve thousands of users worldwide, helping them create professional CVs, optimize resumes for ATS systems, track marketing campaigns, and generate QR codes for events and products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-muted/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join our community</h2>
            <p className="text-muted-foreground mb-6">
              Start using UselessAI today and unlock your productivity potential.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutPage;
