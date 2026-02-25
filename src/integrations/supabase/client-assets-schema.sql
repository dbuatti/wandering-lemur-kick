-- Create client_assets table
CREATE TABLE IF NOT EXISTS public.client_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'device', 'login', 'software', 'other'
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_assets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own client assets" ON public.client_assets
FOR SELECT TO authenticated USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can only insert their own client assets" ON public.client_assets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can only update their own client assets" ON public.client_assets
FOR UPDATE TO authenticated USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can only delete their own client assets" ON public.client_assets
FOR DELETE TO authenticated USING (auth.uid() = owner_user_id);