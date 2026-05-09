import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is UselessAI?',
          answer: 'UselessAI is a productivity platform offering AI-powered tools for creating CVs, analyzing resumes, shortening URLs, and generating QR codes.',
        },
        {
          question: 'Is UselessAI really free?',
          answer: 'Yes! Our free plan includes all core tools with ads. Upgrade to Pro for an ad-free experience and unlimited exports.',
        },
        {
          question: 'Do I need to create an account?',
          answer: 'An account is required to save your work and access advanced features. Sign up is quick and free.',
        },
      ],
    },
    {
      category: 'CV Builder',
      questions: [
        {
          question: 'Can I export my CV as PDF?',
          answer: 'Yes! All users can export CVs to PDF. Pro users get unlimited exports with no watermarks.',
        },
        {
          question: 'How many CV templates are available?',
          answer: 'We offer three professional templates: Modern, Classic, and Creative. More templates are coming soon.',
        },
        {
          question: 'Can I edit my CV after saving?',
          answer: 'Absolutely. Your CVs are auto-saved and can be edited anytime from your dashboard.',
        },
      ],
    },
    {
      category: 'Resume Analyzer',
      questions: [
        {
          question: 'How does the resume analyzer work?',
          answer: 'Upload your resume and our AI analyzes it for ATS compatibility, keyword optimization, and provides actionable suggestions.',
        },
        {
          question: 'What file formats are supported?',
          answer: 'We support PDF and DOCX formats for resume uploads.',
        },
        {
          question: 'Is my resume data private?',
          answer: 'Yes. Your resume data is encrypted and never shared with third parties.',
        },
      ],
    },
    {
      category: 'URL Shortener',
      questions: [
        {
          question: 'Can I customize my short links?',
          answer: 'Yes! Pro users can create custom aliases for their short links.',
        },
        {
          question: 'Do short links expire?',
          answer: 'By default, links never expire. You can optionally set an expiration date.',
        },
        {
          question: 'Can I track link analytics?',
          answer: 'Yes! View detailed analytics including clicks, referrers, devices, and locations.',
        },
      ],
    },
    {
      category: 'Billing',
      questions: [
        {
          question: 'How do I upgrade to Pro?',
          answer: 'Visit the Pricing page and select the Pro plan. Payment is processed securely via Razorpay.',
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes. You can cancel anytime from your account settings. Your access continues until the end of the billing period.',
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 14-day money-back guarantee for all paid plans.',
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - UselessAI</title>
        <meta name="description" content="Frequently asked questions about UselessAI tools and services." />
      </Helmet>

      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Frequently asked questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about UselessAI.
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${section.category}-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default FAQPage;
