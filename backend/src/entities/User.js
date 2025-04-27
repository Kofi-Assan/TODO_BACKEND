const { Entity, PrimaryGeneratedColumn, Column, OneToMany } = require('typeorm');
const Booking = require('./Booking');

class User {
  constructor() {
    this.id = null;
    this.email = '';
    this.password = '';
    this.role = 'user';
    this.bookings = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

Entity()(User);
PrimaryGeneratedColumn('uuid')(User.prototype, 'id');
Column({ unique: true })(User.prototype, 'email');
Column()(User.prototype, 'password');
Column({
  type: 'enum',
  enum: ['user', 'admin'],
  default: 'user'
})(User.prototype, 'role');
OneToMany(() => Booking, booking => booking.user)(User.prototype, 'bookings');
Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })(User.prototype, 'createdAt');
Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })(User.prototype, 'updatedAt');

module.exports = User; 