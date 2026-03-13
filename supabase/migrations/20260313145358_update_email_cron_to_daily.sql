-- Update email sequence cron job to daily schedule
-- Remove temporary every-minute job and replace with daily at 10:00 AM UTC

select cron.unschedule('daily-email-sequence');

select cron.schedule(
  'daily-email-sequence',
  '0 10 * * *',
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