import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - UselessAI</title>
        <meta name="description" content="Terms of Service for UselessAI platform." />
      </Helmet>

      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ letterSpacing: '-0.02em' }}>
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using UselessAI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily use UselessAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Prohibited Uses</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may not use UselessAI for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction when using our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The service and its original content, features, and functionality are owned by UselessAI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall UselessAI be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these terms at any time. It is your responsibility to check these terms periodically for changes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at support@uselessai.com.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TermsPage;
