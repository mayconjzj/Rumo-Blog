-- Keeps the Neon Auth identity separate from the optional community profile.
-- Disabling a community profile never deletes the login or admin identity.
CREATE TABLE IF NOT EXISTS public.community_user_profiles (
  auth_user_id UUID PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  community_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disabled_at TIMESTAMPTZ,
  disabled_by TEXT
);
