import mongoose from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhoto?: string;
  bio?: string;
  college?: string;
  year?: number;
  department?: string;
  interests?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  isVerified?: boolean;
  password: string;
}

export interface IUserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    profilePhoto: { type: String, default: "/User-Prof.png" },
    bio: { type: String, maxlength: 200 },
    college: { type: String, trim: true },
    year: { type: Number },
    department: { type: String },
    interests: [String],
    socialLinks: { linkedin: String, github: String, twitter: String, instagram: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true,
    collection:"User"
  }
);

export const User = mongoose.models?.User as mongoose.Model<IUserDocument> || mongoose.model<IUserDocument>("User", userSchema, "User"); // third param controls collection name


