-- First, drop the existing check constraint
ALTER TABLE "Resources" DROP CONSTRAINT IF EXISTS "Resources_status_check";

-- Add the new check constraint with capitalized values
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_status_check" 
    CHECK (status IN ('Available', 'Booked'));

-- Update existing records to use capitalized values
UPDATE "Resources" SET status = 'Available' WHERE status = 'available';
UPDATE "Resources" SET status = 'Booked' WHERE status = 'booked';

-- Set the default value to capitalized
ALTER TABLE "Resources" ALTER COLUMN status SET DEFAULT 'Available'; 