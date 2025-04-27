import { Sequelize } from 'sequelize';
import User from './User.js';
import Resource from './Resource.js';
import Booking from './Booking.js';
import sequelize from '../config/database.js';

// Initialize models
const models = {
  User: User(sequelize),
  Resource: Resource(sequelize),
  Booking: Booking(sequelize)
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sync database without force or alter to preserve data
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully - Data will be preserved');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });

export { sequelize, models };
// Export models individually
export const UserModel = models.User;
export const ResourceModel = models.Resource;
export const BookingModel = models.Booking; 