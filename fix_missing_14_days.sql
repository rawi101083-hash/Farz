UPDATE public.companies SET subscription_end_date = now() + interval '14 days' WHERE subscription_end_date IS NULL;
