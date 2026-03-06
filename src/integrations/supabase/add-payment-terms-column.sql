-- Add payment_terms column to settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS payment_terms TEXT;