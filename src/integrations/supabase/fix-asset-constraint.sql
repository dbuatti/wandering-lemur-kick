-- Drop the overly restrictive constraint
ALTER TABLE public.client_assets DROP CONSTRAINT IF EXISTS client_assets_client_id_asset_type_key;

-- Add a more sensible constraint that includes the name, 
-- allowing multiple devices or logins as long as they have different names.
ALTER TABLE public.client_assets ADD CONSTRAINT client_assets_client_id_type_name_key UNIQUE (client_id, asset_type, name);