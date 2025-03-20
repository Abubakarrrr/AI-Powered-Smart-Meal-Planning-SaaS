import mongoose, { Schema, Document } from 'mongoose';

enum Sex {
  Male = 'male',
  Female = 'female',
}

export interface UserProfile extends Document {
  activityLevel: string;
  age: number;
  bodyFat: string;
  foodExclusions: string[]; 
  goal: string;
  heightFeet: number;
  heightInches: number;
  sex: Sex;
  weight: number;
}

const UserProfileSchema = new Schema<UserProfile>({
  activityLevel: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  bodyFat: {
    type: String,
    required: true,
  },
  foodExclusions: {
    type: [String],
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  heightFeet: {
    type: Number,
    required: true,
  },
  heightInches: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: Object.values(Sex), 
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const UserProfile = mongoose.model<UserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;
