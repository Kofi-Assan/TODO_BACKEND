const { Entity, PrimaryGeneratedColumn, Column, OneToMany } = require('typeorm');
const Booking = require('./Booking');

class Resource {
  constructor() {
    this.id = null;
    this.name = '';
    this.description = '';
    this.category = '';
    this.status = 'available';
    this.bookings = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

Entity()(Resource);
PrimaryGeneratedColumn('uuid')(Resource.prototype, 'id');
Column()(Resource.prototype, 'name');
Column('text')(Resource.prototype, 'description');
Column()(Resource.prototype, 'category');
Column({
  type: 'enum',
  enum: ['available', 'booked'],
  default: 'available'
})(Resource.prototype, 'status');
OneToMany(() => Booking, booking => booking.resource)(Resource.prototype, 'bookings');
Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })(Resource.prototype, 'createdAt');
Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })(Resource.prototype, 'updatedAt');

module.exports = Resource; 