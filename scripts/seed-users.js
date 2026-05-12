const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
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
  membershipNumber: { type: String, default: 'NA' },
  goals: [{ type: String }],
  goalOther: { type: String },
  medicalHistory: [{ type: String }],
  medicalHistoryOther: { type: String },
  newToYoga: { type: Boolean },
  consent: { type: Boolean, default: false },
  paymentDueDate: { type: Date },
  recordingVisible: { type: Boolean, default: true },
  leaveExtensionDays: { type: Number, default: 0 },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    const users = [];
    for (let i = 1; i <= 25; i++) {
      const daysOffset = Math.floor(Math.random() * 30) - 15; // Past or future dates within 15 days
      const joiningDate = new Date(now);
      joiningDate.setDate(joiningDate.getDate() - 30 + (i % 10));

      const yogaPlanOptions = [1, 3, 6, 12];
      const yogaPlan = yogaPlanOptions[Math.floor(Math.random() * yogaPlanOptions.length)];

      const paymentDue = new Date(joiningDate);
      paymentDue.setMonth(paymentDue.getMonth() + yogaPlan);

      users.push({
        name: `Yoga Member ${i}`,
        email: `member${i}@yoga.com`,
        phone: `9876543${String(i).padStart(3, '0')}`,
        password: hashedPassword,
        role: 'user',
        approved: true,
        dob: new Date(1990 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
        dateOfJoining: joiningDate,
        yogaPlan,
        feesPaid: Math.random() > 0.5 ? 'cash' : 'online',
        platform: Math.random() > 0.5 ? 'online' : 'offline',
        membershipNumber: Math.random() > 0.5 ? `NGV${1000 + i}` : 'NA',
        goals: ['Overall fitness', 'Flexibility'],
        medicalHistory: ['None'],
        newToYoga: Math.random() > 0.5,
        consent: true,
        paymentDueDate: paymentDue,
        recordingVisible: true,
        leaveExtensionDays: 0,
      });
    }

    // Delete existing test users
    await User.deleteMany({ email: { $regex: /^member\d+@yoga\.com$/ } });

    // Insert new users
    const result = await User.insertMany(users);
    console.log(`✓ Seeded ${result.length} approved users with payment dates`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
