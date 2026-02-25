-- Create tickets table
CREATE TABLE public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_display_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'pending', 'resolved', 'closed')) DEFAULT 'open',
  category TEXT CHECK (category IN ('security', 'setup', 'optimization', 'recovery', 'other')) DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tags TEXT[],
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  internal_notes TEXT,
  client_email TEXT,
  client_phone TEXT,
  related_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  related_quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL
);

-- Enable Row Level Security (RLS) - CRITICAL FOR SECURITY
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "Users can view their own tickets" ON public.tickets
FOR SELECT TO authenticated USING (auth.uid() = owner_user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can insert their own tickets" ON public.tickets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update their own tickets" ON public.tickets
FOR UPDATE TO authenticated USING (auth.uid() = owner_user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own tickets" ON public.tickets
FOR DELETE TO authenticated USING (auth.uid() = owner_user_id);

-- Create index for better performance
CREATE INDEX idx_tickets_owner_user_id ON public.tickets(owner_user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to);