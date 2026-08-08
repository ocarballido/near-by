-- Requiere que el secreto 'cron_secret_key' ya exista en Vault,
-- creado manualmente (fuera de control de versiones, mismo patrón
-- que 'anon_key'/'project_url'):
--   select vault.create_secret('<valor>', 'cron_secret_key', '...');

select cron.alter_job(
  job_id := (select jobid from cron.job where jobname = 'daily-email-sequence'),
  command := $$
    select
      net.http_post(
        url := (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'project_url'
        ) || '/functions/v1/email-job',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'cron_secret_key'
          )
        ),
        body := jsonb_build_object('time', now()),
        timeout_milliseconds := 30000
      ) as request_id;
  $$
);

select cron.alter_job(
  job_id := (select jobid from cron.job where jobname = 'weekly-digest-monday'),
  command := $$
    select
      net.http_post(
        url := (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'project_url'
        ) || '/functions/v1/weekly-digest',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'apikey', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'cron_secret_key'
          )
        ),
        body := jsonb_build_object('time', now()),
        timeout_milliseconds := 30000
      ) as request_id;
  $$
);