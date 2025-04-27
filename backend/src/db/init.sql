-- Create Database
CREATE DATABASE resource_booking;

-- Connect to the database
\c resource_booking;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE "Users" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'user' CHECK ("role" IN ('user', 'admin')),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Resources Table
CREATE TABLE "Resources" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'available' CHECK ("status" IN ('available', 'booked')),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
CREATE TABLE "Bookings" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "resourceId" UUID NOT NULL REFERENCES "Resources"("id") ON DELETE CASCADE,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active' CHECK ("status" IN ('active', 'cancelled', 'completed')),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "valid_booking_period" CHECK ("endTime" > "startTime")
);

-- Create Index for faster email lookups
CREATE INDEX "users_email_idx" ON "Users"("email");

-- Create Index for resource status lookups
CREATE INDEX "resources_status_idx" ON "Resources"("status");

-- Create Index for booking queries
CREATE INDEX "bookings_date_range_idx" ON "Bookings"("resourceId", "startTime", "endTime");
CREATE INDEX "bookings_user_idx" ON "Bookings"("userId");
CREATE INDEX "bookings_status_idx" ON "Bookings"("status");

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_modtime
    BEFORE UPDATE ON "Resources"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_modtime
    BEFORE UPDATE ON "Bookings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO "Users" ("name", "email", "password", "role")
VALUES (
    'Admin User',
    'admin@example.com',
    '$2a$10$rQnqFR.Rx3YQoHEEhnQhyOYB0IMjkRZqpWQvXIo1lxZN59D2FJwl2',
    'admin'
);

-- Insert some sample resources
INSERT INTO "Resources" ("name", "description", "category")
VALUES 
    ('Conference Room A', 'Large conference room with projector and whiteboard', 'Room'),
    ('Conference Room B', 'Medium conference room with TV screen', 'Room'),
    ('Laptop Dell XPS', 'Dell XPS 15 laptop for temporary use', 'Equipment'),
    ('Projector P1000', 'Portable projector for presentations', 'Equipment');

-- Create view for available resources
CREATE VIEW available_resources AS
SELECT *
FROM "Resources"
WHERE "status" = 'available';

-- Create view for active bookings
CREATE VIEW active_bookings AS
SELECT 
    b."id",
    b."startTime",
    b."endTime",
    b."status",
    r."name" as "resourceName",
    u."name" as "userName",
    u."email" as "userEmail"
FROM "Bookings" b
JOIN "Resources" r ON b."resourceId" = r."id"
JOIN "Users" u ON b."userId" = u."id"
WHERE b."status" = 'active';

-- Grant permissions (adjust according to your application user)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres; 