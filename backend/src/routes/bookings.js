import express from 'express';
import { BookingModel, ResourceModel, UserModel } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await BookingModel.findAll({
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: UserModel, as: 'user' }
      ]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id, {
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: UserModel, as: 'user' }
      ]
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { userId, resourceId, startTime, endTime } = req.body;
    
    console.log('Received booking request:', {
      userId,
      resourceId,
      startTime,
      endTime
    });

    // Validate required fields
    if (!userId || !resourceId || !startTime || !endTime) {
      await t.rollback();
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { userId, resourceId, startTime, endTime }
      });
    }

    // Check if resource exists
    const resource = await ResourceModel.findByPk(resourceId, { transaction: t });
    if (!resource) {
      await t.rollback();
      return res.status(404).json({ message: 'Resource not found' });
    }

    console.log('Found resource:', resource.toJSON());

    // Check if resource has available slots
    if (resource.availableSlots <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No available slots for this resource' });
    }

    // Check for booking conflicts
    const conflictingBookingsCount = await BookingModel.count({
      where: {
        resourceId,
        status: 'active',
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime]
            }
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime]
            }
          }
        ]
      },
      transaction: t
    });

    console.log('Conflicting bookings count:', conflictingBookingsCount);

    // Calculate remaining slots for the time period
    const remainingSlots = resource.capacity - conflictingBookingsCount;
    
    console.log('Remaining slots:', remainingSlots);
    
    if (remainingSlots <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'No available slots for the selected time period' });
    }

    // Create booking
    const booking = await BookingModel.create({
      userId,
      resourceId,
      startTime,
      endTime,
      status: 'active' // Explicitly set status
    }, { transaction: t });

    console.log('Created booking:', booking.toJSON());

    // Update resource availableSlots and status
    const newAvailableSlots = resource.availableSlots - 1;
    const newStatus = newAvailableSlots === 0 ? 'booked' : 
                     newAvailableSlots < resource.capacity ? 'partially_booked' : 
                     'available';

    // Calculate duration in hours
    const durationInHours = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));

    await resource.update({ 
      availableSlots: newAvailableSlots,
      status: newStatus,
      duration: durationInHours
    }, { transaction: t });

    console.log('Updated resource:', {
      id: resource.id,
      newAvailableSlots,
      newStatus,
      duration: durationInHours
    });

    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    console.error('Detailed error creating booking:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// Cancel booking
router.put('/:id/cancel', async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const booking = await BookingModel.findByPk(req.params.id, { transaction: t });
    
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    await booking.update({ status: 'cancelled' }, { transaction: t });

    // Update resource availableSlots and status
    const resource = await ResourceModel.findByPk(booking.resourceId, { transaction: t });
    const newAvailableSlots = resource.availableSlots + 1;
    const newStatus = newAvailableSlots === resource.capacity ? 'available' : 
                     newAvailableSlots > 0 ? 'partially_booked' : 
                     'booked';

    await resource.update({ 
      availableSlots: newAvailableSlots,
      status: newStatus
    }, { transaction: t });

    await t.commit();
    res.json(booking);
  } catch (error) {
    await t.rollback();
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router; 