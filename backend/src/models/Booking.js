import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Booking.belongsTo(models.Resource, {
        foreignKey: 'resourceId',
        as: 'resource'
      });
    }
  }

  Booking.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    resourceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Resources',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Booking',
    timestamps: true
  });

  return Booking;
}; 