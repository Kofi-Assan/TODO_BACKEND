import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export default (sequelize) => {
  class Resource extends Model {
    static associate(models) {
      Resource.hasMany(models.Booking, {
        foreignKey: 'resourceId',
        as: 'bookings'
      });
    }
  }

  Resource.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Please enter a valid URL for the image"
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Category cannot be empty"
        },
        isIn: {
          args: [['Room', 'Equipment', 'Facility']],
          msg: "Category must be one of: Room, Equipment, Facility"
        }
      },
      set(value) {
        if (value) {
          this.setDataValue('category', value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [1],
          msg: "Capacity must be at least 1"
        }
      }
    },
    availableSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: {
          args: [0],
          msg: "Available slots cannot be negative"
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
      validate: {
        isIn: {
          args: [['available', 'booked', 'partially_booked']],
          msg: "Status must be either available, partially_booked, or booked"
        }
      },
      set(value) {
        if (value) {
          this.setDataValue('status', value.toLowerCase());
        }
      },
      get() {
        // Capitalize first letter for display
        const rawValue = this.getDataValue('status');
        return rawValue ? rawValue.charAt(0).toUpperCase() + rawValue.slice(1) : null;
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "Duration must be at least 1 hour"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Resource',
    timestamps: true,
    indexes: [
      {
        fields: ['status'],
        name: 'resources_status_idx'
      },
      {
        fields: ['category'],
        name: 'resources_category_idx'
      }
    ]
  });

  return Resource;
}; 