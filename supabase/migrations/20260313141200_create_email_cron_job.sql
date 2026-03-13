-- Create email sequence cron job
-- TEMPORAL: every minute for testing purposes
-- Change to '0 10 * * *' once verified

select cron.schedule(
  'daily-email-sequence',
  '* * * * *',
  $$
  select
    net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'project_url'
      ) || '/functions/v1/email-job',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'anon_key'
        )
      ),
      body := jsonb_build_object('time', now()),
      timeout_milliseconds := 30000
    ) as request_id;
  $$
);