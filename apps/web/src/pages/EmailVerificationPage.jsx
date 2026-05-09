import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EmailVerificationPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, verifyOTP, requestOTP } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyOTP(currentUser?.email, code);
      toast.success('Email verified successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestOTP(currentUser?.email);
      toast.success('New verification code sent');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Email - UselessAI</title>
        <meta name="description" content="Verify your email address." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary"></div>
              <span className="text-2xl font-bold">UselessAI</span>
            </div>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>Enter the 8-digit code sent to your email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="00000000"
                  maxLength={8}
                  required
                  className="text-foreground text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200 active:scale-[0.98]"
                disabled={loading || code.length !== 8}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleResend}
              >
                Resend Code
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailVerificationPage;
