-- Add "Nexus Growth" to the user_role enum type
-- PostgreSQL requires recreating the enum or using ALTER TYPE

-- Option 1: Add the new value to the existing enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'Nexus Growth';

-- Note: If the above fails, you may need to:
-- 1. Create a new enum with all values
-- 2. Change the column to use the new enum
-- 3. Drop the old enum

-- Alternative approach if ALTER TYPE doesn't work:
-- This converts the role column to VARCHAR for more flexibility

-- Step 1: Remove the default constraint
-- ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Step 2: Change column type to VARCHAR
-- ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50) USING role::text;

-- Step 3: Set the default back (optional)
-- ALTER TABLE users ALTER COLUMN role SET DEFAULT 'CLIENTE';
