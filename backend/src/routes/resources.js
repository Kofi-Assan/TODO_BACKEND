import express from 'express';
import { ResourceModel } from '../models/index.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all resources
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching resources...');
    const resources = await ResourceModel.findAll();
    console.log('Resources fetched:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ 
      message: 'Error fetching resources',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get resource by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await ResourceModel.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Error fetching resource' });
  }
});

// Create resource (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, category, imageUrl, status, capacity } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    if (!capacity || isNaN(capacity) || capacity < 1) {
      return res.status(400).json({ message: 'Capacity must be a positive integer' });
    }

    const resource = await ResourceModel.create({
      name,
      description,
      category,
      imageUrl,
      status: status || 'available',
      capacity,
      availableSlots: capacity
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Error creating resource' });
  }
});

// Update resource (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Update request received for ID:', req.params.id);
    console.log('Request body:', req.body);

    const { name, description, category, imageUrl, status } = req.body;
    
    // First try to find the resource
    const resource = await ResourceModel.findByPk(req.params.id);
    console.log('Resource found:', resource ? 'Yes' : 'No');
    
    if (!resource) {
      console.log('Resource not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Validate required fields
    if (!name || !category) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ message: 'Name and category are required' });
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      category,
      imageUrl,
      status: status || resource.status
    };
    console.log('Update data:', updateData);

    // Perform the update
    await resource.update(updateData);
    console.log('Resource updated successfully');

    // Fetch the updated resource to return
    const updatedResource = await ResourceModel.findByPk(req.params.id);
    res.json(updatedResource);

  } catch (error) {
    console.error('Error updating resource:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => e.message) 
      });
    }

    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ 
        message: 'Database error', 
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Error updating resource',
      error: error.message
    });
  }
});

// Delete resource (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log('Delete request received for ID:', req.params.id);
    
    const resource = await ResourceModel.findByPk(req.params.id);
    console.log('Resource found:', resource ? 'Yes' : 'No');
    
    if (!resource) {
      console.log('Resource not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.destroy();
    console.log('Resource deleted successfully');
    
    res.json({ 
      message: 'Resource deleted successfully',
      deletedResource: {
        id: resource.id,
        name: resource.name,
        category: resource.category
      }
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ 
        message: 'Database error', 
        error: error.message 
      });
    }

    res.status(500).json({ 
      message: 'Error deleting resource',
      error: error.message 
    });
  }
});

// Update resource capacity (admin only)
router.put('/:id/capacity', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { capacity } = req.body;
        
        if (!capacity || isNaN(capacity) || capacity < 1) {
            return res.status(400).json({ message: 'Capacity must be a positive integer' });
        }

        const resource = await ResourceModel.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resource.update({ capacity });
        res.json({ 
            message: 'Capacity updated successfully',
            resource: {
                id: resource.id,
                name: resource.name,
                capacity: resource.capacity
            }
        });
    } catch (error) {
        console.error('Error updating capacity:', error);
        res.status(500).json({ message: 'Error updating capacity' });
    }
});

// Update resource duration (admin only)
router.put('/:id/duration', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { duration } = req.body;
        
        if (!duration || isNaN(duration) || duration < 1) {
            return res.status(400).json({ message: 'Duration must be a positive integer' });
        }

        const resource = await ResourceModel.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resource.update({ duration });
        res.json({ 
            message: 'Duration updated successfully',
            resource: {
                id: resource.id,
                name: resource.name,
                duration: resource.duration
            }
        });
    } catch (error) {
        console.error('Error updating duration:', error);
        res.status(500).json({ message: 'Error updating duration' });
    }
});

// Update resource available slots (admin only)
router.put('/:id/available-slots', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { availableSlots } = req.body;
        
        if (availableSlots === undefined || isNaN(availableSlots) || availableSlots < 0) {
            return res.status(400).json({ message: 'Available slots must be a non-negative integer' });
        }

        const resource = await ResourceModel.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check that available slots don't exceed capacity
        if (availableSlots > resource.capacity) {
            return res.status(400).json({ 
                message: 'Available slots cannot exceed resource capacity',
                capacity: resource.capacity
            });
        }

        await resource.update({ availableSlots });
        res.json({ 
            message: 'Available slots updated successfully',
            resource: {
                id: resource.id,
                name: resource.name,
                capacity: resource.capacity,
                availableSlots: resource.availableSlots
            }
        });
    } catch (error) {
        console.error('Error updating available slots:', error);
        res.status(500).json({ message: 'Error updating available slots' });
    }
});

export default router; 