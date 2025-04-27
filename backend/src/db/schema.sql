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
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "availableSlots" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) DEFAULT 'available' CHECK ("status" IN ('available', 'partially_booked', 'booked')),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "valid_capacity" CHECK ("capacity" >= 1),
    CONSTRAINT "valid_slots" CHECK ("availableSlots" >= 0 AND "availableSlots" <= "capacity")
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

-- Create Indexes
CREATE INDEX "users_email_idx" ON "Users"("email");
CREATE INDEX "resources_status_idx" ON "Resources"("status");
CREATE INDEX "resources_category_idx" ON "Resources"("category");
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

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "Bookings"
        WHERE "resourceId" = NEW."resourceId"
        AND "status" = 'active'
        AND "id" != NEW."id"
        AND (
            (NEW."startTime" BETWEEN "startTime" AND "endTime")
            OR (NEW."endTime" BETWEEN "startTime" AND "endTime")
            OR ("startTime" BETWEEN NEW."startTime" AND NEW."endTime")
        )
    ) THEN
        RAISE EXCEPTION 'Booking conflict detected';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for booking conflict check
CREATE TRIGGER check_booking_conflict_trigger
    BEFORE INSERT OR UPDATE ON "Bookings"
    FOR EACH ROW
    EXECUTE FUNCTION check_booking_conflict();

-- Insert default admin user (password: admin123)
INSERT INTO "Users" ("name", "email", "password", "role")
VALUES (
    'Admin User',
    'admin@example.com',
    '$2a$10$rQnqFR.Rx3YQoHEEhnQhyOYB0IMjkRZqpWQvXIo1lxZN59D2FJwl2',
    'admin'
);

-- Insert sample resources
INSERT INTO "Resources" ("name", "description", "category")
VALUES 
    ('Conference Room A', 'Large conference room with projector and whiteboard', 'Room'),
    ('Conference Room B', 'Medium conference room with TV screen', 'Room'),
    ('Laptop Dell XPS', 'Dell XPS 15 laptop for temporary use', 'Equipment'),
    ('Projector P1000', 'Portable projector for presentations', 'Equipment'),
    ('Meeting Room 1', 'Small meeting room for 4-6 people', 'Room'),
    ('Meeting Room 2', 'Medium meeting room for 8-10 people', 'Room'),
    ('MacBook Pro', 'Apple MacBook Pro for design work', 'Equipment'),
    ('Video Conference System', 'High-end video conferencing equipment', 'Equipment');

-- Create Views

-- Available Resources View
CREATE VIEW available_resources AS
SELECT *
FROM "Resources"
WHERE "status" = 'available';

-- Active Bookings View
CREATE VIEW active_bookings AS
SELECT 
    b."id",
    b."startTime",
    b."endTime",
    b."status",
    r."name" as "resourceName",
    r."category" as "resourceCategory",
    u."name" as "userName",
    u."email" as "userEmail"
FROM "Bookings" b
JOIN "Resources" r ON b."resourceId" = r."id"
JOIN "Users" u ON b."userId" = u."id"
WHERE b."status" = 'active';

-- Resource Usage Statistics View
CREATE VIEW resource_usage_stats AS
SELECT 
    r."id",
    r."name",
    r."category",
    COUNT(b."id") as "totalBookings",
    SUM(CASE WHEN b."status" = 'active' THEN 1 ELSE 0 END) as "activeBookings",
    SUM(CASE WHEN b."status" = 'completed' THEN 1 ELSE 0 END) as "completedBookings",
    SUM(CASE WHEN b."status" = 'cancelled' THEN 1 ELSE 0 END) as "cancelledBookings"
FROM "Resources" r
LEFT JOIN "Bookings" b ON r."id" = b."resourceId"
GROUP BY r."id", r."name", r."category";

-- User Booking History View
CREATE VIEW user_booking_history AS
SELECT 
    u."id" as "userId",
    u."name" as "userName",
    u."email" as "userEmail",
    b."id" as "bookingId",
    b."startTime",
    b."endTime",
    b."status",
    r."name" as "resourceName",
    r."category" as "resourceCategory"
FROM "Users" u
JOIN "Bookings" b ON u."id" = b."userId"
JOIN "Resources" r ON b."resourceId" = r."id"
ORDER BY b."startTime" DESC;

-- Daily Resource Availability View
CREATE VIEW daily_resource_availability AS
SELECT 
    r."id" as "resourceId",
    r."name" as "resourceName",
    r."category",
    r."status",
    b."startTime",
    b."endTime"
FROM "Resources" r
LEFT JOIN "Bookings" b ON r."id" = b."resourceId" AND b."status" = 'active'
ORDER BY r."name", b."startTime";

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO postgres; 