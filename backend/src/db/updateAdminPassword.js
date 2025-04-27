import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';
import sequelize from '../config/database.js';

const updateAdminPassword = async () => {
  try {
    // Husesh the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Update the admin user's password
    await UserModel.update(
      { password: hashedPassword },
      { where: { email: 'admin@example.com' } }
    );
    
    console.log('Admin password updated successfully');
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await sequelize.close();
  }
};

updateAdminPassword(); 