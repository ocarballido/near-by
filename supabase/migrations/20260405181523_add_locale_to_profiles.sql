-- Add locale column to profiles
-- Stores the user's preferred language for email communications
-- Defaults to 'en' for existing users

ALTER TABLE public.profiles
ADD COLUMN locale text not null default 'en';