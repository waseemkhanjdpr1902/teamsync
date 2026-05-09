import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out',
      features: [
        { name: 'All tools included', included: true },
        { name: 'With ads', included: true },
        { name: 'Limited exports', included: true },
        { name: 'Ad-free experience', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      ctaLink: '/signup',
      variant: 'outline',
    },
    {
      name: 'Pro',
      price: '$9.99',
      description: 'Most popular',
      features: [
        { name: 'All tools included', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Unlimited exports', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: false },
      ],
      cta: 'Upgrade to Pro',
      ctaLink: '/signup',
      variant: 'default',
      popular: true,
    },
    {
      name: 'Business',
      price: '$29.99',
      description: 'For teams',
      features: [
        { name: 'All tools included', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Unlimited exports', included: true },
        { name: 'API access', included: true },
        { name: 'Custom integrations', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      variant: 'outline',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - UselessAI</title>
        <meta name="description" content="Choose the perfect plan for your needs. Free, Pro, and Business plans available." />
      </Helmet>

      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                <CardHeader>
                  {plan.popular && (
                    <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-auto transition-all duration-200 active:scale-[0.98]"
                    variant={plan.variant}
                    asChild
                  >
                    <Link to={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Feature comparison</h2>
          </div>

          <div className="bg-card rounded-2xl p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4">Pro</th>
                  <th className="text-center py-4 px-4">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">CV Builder</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Resume Analyzer</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">URL Shortener</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">QR Code Generator</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Ad-free experience</td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Unlimited exports</td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4">API access</td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PricingPage;
