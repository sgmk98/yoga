const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local or environment variables.');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  approved: { type: Boolean, default: false },
  dob: { type: Date },
  dateOfJoining: { type: Date },
  yogaPlan: { type: Number, enum: [1, 3, 6, 12] },
  feesPaid: { type: String, enum: ['cash', 'online'] },
  platform: { type: String, enum: ['online', 'offline'] },
});

const User = mongoose.models?.User || mongoose.model('User', userSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yoga-app.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
    const adminName = process.env.ADMIN_NAME || 'Yoga Admin';
    const adminPhone = process.env.ADMIN_PHONE || '0000000000';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user already exists with email ${adminEmail}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = new User({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: 'admin',
      approved: true,
    });

    await admin.save();
    console.log('Admin user created successfully:');
    console.log(`  email: ${adminEmail}`);
    console.log(`  password: ${adminPassword}`);
    console.log('Change the password after first login for security.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

main();