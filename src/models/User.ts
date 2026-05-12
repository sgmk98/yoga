import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  approved: { type: Boolean, default: false },
  dob: { type: Date },
  dateOfJoining: { type: Date },
  yogaPlan: { type: Number, enum: [1, 3, 6, 12] }, // months
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

export default mongoose.models.User || mongoose.model('User', UserSchema);