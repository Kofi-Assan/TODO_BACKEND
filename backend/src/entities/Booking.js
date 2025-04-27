const { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } = require('typeorm');
const User = require('./User');
const Resource = require('./Resource');

class Booking {
  constructor() {
    this.id = null;
    this.user = null;
    this.resource = null;
    this.startTime = null;
    this.endTime = null;
    this.status = 'active';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

Entity()(Booking);
PrimaryGeneratedColumn('uuid')(Booking.prototype, 'id');
ManyToOne(() => User, user => user.bookings)(Booking.prototype, 'user');
ManyToOne(() => Resource, resource => resource.bookings)(Booking.prototype, 'resource');
Column({ type: 'timestamp' })(Booking.prototype, 'startTime');
Column({ type: 'timestamp' })(Booking.prototype, 'endTime');
Column({
  type: 'enum',
  enum: ['active', 'cancelled'],
  default: 'active'
})(Booking.prototype, 'status');
CreateDateColumn()(Booking.prototype, 'createdAt');
UpdateDateColumn()(Booking.prototype, 'updatedAt');

module.exports = Booking; 