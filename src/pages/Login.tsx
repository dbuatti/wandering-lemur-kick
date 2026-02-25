"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/tickets');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">
            DANIELE <span className="text-primary">BUATTI</span>
          </h1>
          <p className="text-muted-foreground">Support Portal Login</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(217, 91%, 60%)',
                  brandAccent: 'hsl(217, 91%, 50%)',
                },
              },
            },
          }}
          theme="dark"
          providers={['google']}
          redirectTo={window.location.origin + '/tickets'}
        />
      </div>
    </div>
  );
};

export default Login;