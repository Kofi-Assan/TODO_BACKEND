import sequelize from '../config/database.js';
import { UserModel, ResourceModel } from '../models/index.js';
import bcrypt from 'bcryptjs';

const initDatabase = async () => {
    try {
        
        await sequelize.authenticate();
        console.log('Database connection established successfully');

        // Check if admin user exists
        const adminExists = await UserModel.findOne({
            where: { email: 'admin@example.com' }
        });

        if (!adminExists) {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await UserModel.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        // Delete all existing resources
        await ResourceModel.destroy({ where: {} });
        console.log('Cleared existing resources');

        // Create sample resources
        const sampleResources = [
            {
                name: 'Conference Room A',
                description: 'Large conference room with projector',
                category: 'Room',
                status: 'Available',
                capacity: 20,
                availableSlots: 20
            },
            {
                name: 'Meeting Room B',
                description: 'Medium-sized meeting room with whiteboard',
                category: 'Room',
                status: 'Available',
                capacity: 10,
                availableSlots: 10
            },
            {
                name: 'Projector',
                description: 'High-quality projector for presentations',
                category: 'Equipment',
                status: 'Available',
                capacity: 1,
                availableSlots: 1
            },
            {
                name: 'Library',
                description: 'Get your books for studying',
                category: 'Facility',
                status: 'Available',
                capacity: 50,
                availableSlots: 50
            }
        ];

        await ResourceModel.bulkCreate(sampleResources);
        console.log('Sample resources created successfully');

        console.log('Database initialization completed successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initDatabase(); 