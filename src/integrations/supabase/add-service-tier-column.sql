-- Add service_tier column to tickets table
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS service_tier TEXT DEFAULT 'optimization';

-- Update existing tickets to have a default tier if needed
UPDATE public.tickets SET service_tier = 'optimization' WHERE service_tier IS NULL;