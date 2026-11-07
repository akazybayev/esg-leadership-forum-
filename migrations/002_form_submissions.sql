CREATE TABLE IF NOT EXISTS form_submissions (
  id text PRIMARY KEY,
  form_type text NOT NULL,
  created_at timestamptz NOT NULL,
  stored text NOT NULL,
  box text
);
