-- Add duration column to Resources table (in hours)
ALTER TABLE "Resources" ADD COLUMN "duration" INTEGER;

-- Add check constraint to ensure duration is positive
ALTER TABLE "Resources" ADD CONSTRAINT "valid_duration" CHECK ("duration" > 0);
 
-- Make duration column NOT NULL after setting default values
ALTER TABLE "Resources" ALTER COLUMN "duration" SET NOT NULL; 