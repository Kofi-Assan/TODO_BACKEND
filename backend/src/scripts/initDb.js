import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import User from '../models/User.js';

async function initializeDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Create admin user
    const adminPassword = 'admin123'; // You should change this in production
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Database initialized successfully');
    console.log('Admin user created:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 