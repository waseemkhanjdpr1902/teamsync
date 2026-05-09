import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/components/DashboardLayout.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const SubscriptionPage = () => {
  const { currentUser } = useAuth();

  const plans = [
    { name: 'Free', price: '$0', features: ['All tools', 'With ads', 'Limited exports'] },
    { name: 'Pro', price: '$9.99', features: ['Ad-free', 'Unlimited exports', 'Priority support'] },
    { name: 'Business', price: '$29.99', features: ['API access', 'Custom integrations', 'Dedicated support'] },
  ];

  return (
    <>
      <Helmet>
        <title>Subscription - UselessAI</title>
        <meta name="description" content="Manage your subscription." />
      </Helmet>

      <DashboardLayout>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Subscription</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the{' '}
                <Badge variant="secondary">{currentUser?.subscription_plan || 'free'}</Badge> plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.subscription_expires_at && (
                <p className="text-sm text-muted-foreground">
                  Expires on {new Date(currentUser.subscription_expires_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'} asChild>
                    <Link to="/pricing">
                      {plan.name === currentUser?.subscription_plan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SubscriptionPage;
