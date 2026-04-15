-- Create the formulas table
CREATE TABLE IF NOT EXISTS public.formulas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    problem TEXT NOT NULL,
    context_mapping JSONB DEFAULT '[]'::jsonb,
    formula TEXT NOT NULL,
    explanation TEXT NOT NULL,
    user_id UUID DEFAULT auth.uid() -- Optional: for when you add auth later
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.formulas ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read formulas (for global history)
CREATE POLICY "Allow public read access"
ON public.formulas
FOR SELECT
TO anon
USING (true);

-- Create a policy that allows anyone to insert formulas
CREATE POLICY "Allow public insert access"
ON public.formulas
FOR INSERT
TO anon
WITH CHECK (true);

-- Optional: Create a policy for authenticated users to manage their own data
-- CREATE POLICY "Users can manage their own formulas"
-- ON public.formulas
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);
