-- Add attachments column to tickets table if it doesn't exist
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}';

-- Ensure RLS is still correct (it should be as it's table-level)
-- But let's make sure the column is accessible
COMMENT ON COLUMN public.tickets.attachments IS 'Array of URLs for files attached to the ticket';