import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';
import sequelize from '../config/database.js';

const createAdmin = async () => {
  try {
    
    const existingAdmin = await UserModel.findOne({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      // Update the password to make sure it's correct
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await existingAdmin.update({ password: hashedPassword });
      console.log('Admin password updated');
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await UserModel.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error managing admin user:', error);
  } finally {
    await sequelize.close();
  }
};

createAdmin(); 