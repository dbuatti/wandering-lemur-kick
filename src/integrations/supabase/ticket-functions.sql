-- Function to create a ticket from an enquiry
CREATE OR REPLACE FUNCTION public.create_ticket_from_enquiry(
  p_client_id UUID,
  p_client_display_name TEXT,
  p_client_email TEXT,
  p_client_phone TEXT,
  p_title TEXT,
  p_description TEXT,
  p_category TEXT,
  p_priority TEXT
)
RETURNS UUID AS $$
DECLARE
  v_ticket_id UUID;
BEGIN
  INSERT INTO public.tickets (
    client_id,
    client_display_name,
    client_email,
    client_phone,
    title,
    description,
    category,
    priority,
    owner_user_id
  )
  VALUES (
    p_client_id,
    p_client_display_name,
    p_client_email,
    p_client_phone,
    p_title,
    p_description,
    p_category,
    p_priority,
    auth.uid()
  )
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update ticket status and set resolved date
CREATE OR REPLACE FUNCTION public.update_ticket_status(
  p_ticket_id UUID,
  p_status TEXT,
  p_actual_hours NUMERIC DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.tickets
  SET 
    status = p_status,
    actual_hours = COALESCE(p_actual_hours, actual_hours),
    resolved_at = CASE 
      WHEN p_status IN ('resolved', 'closed') THEN NOW()
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = p_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a comment to a ticket
CREATE OR REPLACE FUNCTION public.add_ticket_comment(
  p_ticket_id UUID,
  p_content TEXT,
  p_is_internal BOOLEAN DEFAULT FALSE
)
RETURNS UUID AS $$
DECLARE
  v_comment_id UUID;
BEGIN
  INSERT INTO public.ticket_comments (
    ticket_id,
    user_id,
    content,
    is_internal
  )
  VALUES (
    p_ticket_id,
    auth.uid(),
    p_content,
    p_is_internal
  )
  RETURNING id INTO v_comment_id;

  RETURN v_comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;