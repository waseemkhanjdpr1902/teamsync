import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Link2, QrCode, Zap, Shield, Sparkles, ArrowRight, Check } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'CV Builder',
      description: 'Create professional CVs with multiple templates and export to PDF instantly.',
    },
    {
      icon: FileText,
      title: 'Resume Analyzer',
      description: 'Get AI-powered insights on your resume with ATS compatibility scores and suggestions.',
    },
    {
      icon: Link2,
      title: 'URL Shortener',
      description: 'Shorten links, track analytics, and generate QR codes with custom aliases.',
    },
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Generate customizable QR codes with color options and multiple export formats.',
    },
  ];

  const testimonials = [
    {
      name: 'Maya Chen',
      role: 'Product Designer',
      content: 'The CV builder saved me hours. I created a professional resume in minutes and landed my dream job.',
      avatar: 'MC',
    },
    {
      name: 'Raj Patel',
      role: 'Marketing Manager',
      content: 'URL shortener with analytics is a game-changer. I track every campaign link effortlessly.',
      avatar: 'RP',
    },
    {
      name: 'Lucia Torres',
      role: 'Freelance Developer',
      content: 'Resume analyzer gave me actionable feedback. My interview rate doubled after implementing the suggestions.',
      avatar: 'LT',
    },
  ];

  const faqs = [
    {
      question: 'Is UselessAI really free?',
      answer: 'Yes! Our free plan includes all core tools with ads. Upgrade to Pro for an ad-free experience and unlimited exports.',
    },
    {
      question: 'Can I export my CVs and resumes?',
      answer: 'Absolutely. Export to PDF with one click. Pro users get unlimited exports and custom templates.',
    },
    {
      question: 'How does the URL shortener work?',
      answer: 'Create short links, customize aliases, track clicks, and view detailed analytics. All links include QR codes automatically.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>UselessAI - Unlock Productivity with AI-Powered Tools</title>
        <meta name="description" content="Create professional CVs, analyze resumes, shorten URLs, and generate QR codes with UselessAI. Free tools powered by AI." />
      </Helmet>

      <Header />

      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1648134859182-98df6e93ef58)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>
              Unlock Productivity with UselessAI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create professional CVs, analyze resumes, shorten URLs, and generate QR codes — all in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="transition-all duration-200 active:scale-[0.98]">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="transition-all duration-200 active:scale-[0.98]">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Powerful tools for modern professionals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to boost productivity and streamline your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">What our users say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who trust UselessAI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">All tools included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">With ads</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg scale-105">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Most popular</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Ad-free experience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Unlimited exports</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link to="/pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>For teams</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/pricing">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Frequently asked questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
