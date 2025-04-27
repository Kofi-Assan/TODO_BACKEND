import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';
import sequelize from '../config/database.js';

const checkAdmin = async () => {
  try {
    
    const admin = await UserModel.findOne({ 
      where: { email: 'admin@example.com' }
    });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      password: admin.password
    });

    
    const isValid = await bcrypt.compare('admin123', admin.password);
    console.log('Password verification:', isValid ? 'Valid' : 'Invalid');

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await sequelize.close();
  }
};

checkAdmin(); 