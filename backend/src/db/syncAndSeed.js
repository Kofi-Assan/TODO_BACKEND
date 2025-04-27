import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';
import sequelize from '../config/database.js';

const syncAndSeed = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

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
    console.error('Error syncing database and creating admin:', error);
  } finally {
    await sequelize.close();
  }
};

syncAndSeed(); 