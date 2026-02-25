-- Function to update updated_at timestamp on ticket update
CREATE OR REPLACE FUNCTION public.update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on ticket update
DROP TRIGGER IF EXISTS update_tickets_updated_at_trigger ON public.tickets;
CREATE TRIGGER update_tickets_updated_at_trigger
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION update_tickets_updated_at();

-- Function to automatically set client info when ticket is created from client
CREATE OR REPLACE FUNCTION public.set_ticket_client_info()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_id IS NOT NULL THEN
    SELECT display_name, email, phone INTO NEW.client_display_name, NEW.client_email, NEW.client_phone
    FROM public.clients WHERE id = NEW.client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set client info on ticket creation
DROP TRIGGER IF EXISTS set_ticket_client_info_trigger ON public.tickets;
CREATE TRIGGER set_ticket_client_info_trigger
  BEFORE INSERT ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION set_ticket_client_info();