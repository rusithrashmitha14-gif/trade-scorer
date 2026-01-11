-- Create strategies table
create table strategies (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  grade_thresholds jsonb not null default '{"A+": 90, "A": 80, "B": 70, "C": 60}'::jsonb,
  grade_messages jsonb not null default '{"A+": "Perfect set up!", "A": "Great trade", "B": "Good but be careful", "C": "Risky", "NO TRADE": "Stay away"}'::jsonb
);

-- Create strategy_sections table
create table strategy_sections (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  strategy_id uuid references strategies(id) on delete cascade not null,
  title text not null,
  "order" integer not null
);

-- Create strategy_items table
create table strategy_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  section_id uuid references strategy_sections(id) on delete cascade not null,
  type text not null check (type in ('checkbox', 'radio')),
  label text not null,
  points integer not null default 0,
  options jsonb, -- For radio items: [{"label": "Opt1", "points": 10}, ...]
  "order" integer not null
);

-- Enable Row Level Security (RLS) - Optional for now but good practice
alter table strategies enable row level security;
alter table strategy_sections enable row level security;
alter table strategy_items enable row level security;

-- Create policies (modify if you add authentication)
-- For now, allow public access if no auth is implemented, or authenticated only
create policy "Enable read access for all users" on strategies for select using (true);
create policy "Enable insert access for all users" on strategies for insert with check (true);
create policy "Enable update access for all users" on strategies for update using (true);
create policy "Enable delete access for all users" on strategies for delete using (true);

create policy "Enable read access for all users" on strategy_sections for select using (true);
create policy "Enable insert access for all users" on strategy_sections for insert with check (true);
create policy "Enable update access for all users" on strategy_sections for update using (true);
create policy "Enable delete access for all users" on strategy_sections for delete using (true);

create policy "Enable read access for all users" on strategy_items for select using (true);
create policy "Enable insert access for all users" on strategy_items for insert with check (true);
create policy "Enable update access for all users" on strategy_items for update using (true);
create policy "Enable delete access for all users" on strategy_items for delete using (true);
