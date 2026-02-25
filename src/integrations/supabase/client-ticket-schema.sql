-- Create ticket_comments table for internal and client communications
CREATE TABLE public.ticket_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket comments
CREATE POLICY "Users can view comments on their tickets" ON public.ticket_comments
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.tickets WHERE id = ticket_id AND (auth.uid() = owner_user_id OR auth.uid() = assigned_to)
  )
);

CREATE POLICY "Users can insert comments on their tickets" ON public.ticket_comments
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tickets WHERE id = ticket_id AND (auth.uid() = owner_user_id OR auth.uid() = assigned_to)
  )
);

CREATE POLICY "Users can update their own comments" ON public.ticket_comments
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.ticket_comments
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_created_at ON public.ticket_comments(created_at);

-- Function to update updated_at timestamp on comment update
CREATE OR REPLACE FUNCTION public.update_ticket_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on comment update
DROP TRIGGER IF EXISTS update_ticket_comments_updated_at_trigger ON public.ticket_comments;
CREATE TRIGGER update_ticket_comments_updated_at_trigger
  BEFORE UPDATE ON public.ticket_comments
  FOR EACH ROW EXECUTE FUNCTION update_ticket_comments_updated_at();