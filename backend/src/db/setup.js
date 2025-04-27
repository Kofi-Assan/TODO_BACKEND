import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Lalilulelo1',
  database: process.env.DB_DATABASE || 'resource_booking',
  logging: console.log
});

const setupDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created successfully');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await sequelize.close();
  }
};

setupDatabase(); 