CREATE TABLE IF NOT EXISTS form_quota_global (
  id integer PRIMARY KEY,
  hour_start bigint NOT NULL,
  hour_count integer NOT NULL,
  day_start bigint NOT NULL,
  day_count integer NOT NULL,
  day_bytes integer NOT NULL
);

INSERT INTO form_quota_global (id, hour_start, hour_count, day_start, day_count, day_bytes)
VALUES (1, 0, 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS form_quota_clients (
  client_hash text PRIMARY KEY,
  window_start bigint NOT NULL,
  hits integer NOT NULL
);
