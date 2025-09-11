import mongoose from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  userId: string;
  clerkId?: string;
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
  password?: string;
  connections?:string[];
  sentRequests?:string[];
  receivedRequests?:string[];
}

export interface IUserDocument extends IUser, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    userId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clerkId: { type: String, unique: true, sparse: true }, // unique for Clerk users
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: function() { return !this.clerkId; }, minlength: 6 },
    profilePhoto: { type: String, default: "/default-avatar.png" },
    bio: { type: String, maxlength: 200 },
    college: { type: String, trim: true },
    year: { type: Number },
    department: { type: String },
    interests: [String],
    socialLinks: { linkedin: String, github: String, twitter: String, instagram: String },
    isVerified: { type: Boolean, default: false },
    connections:[{ type:mongoose.Schema.Types.ObjectId , ref:"User"}],
    sentRequests:[{ type:mongoose.Schema.Types.ObjectId , ref:"User" }],
    receivedRequests:[{ type:mongoose.Schema.Types.ObjectId , ref:"User"}]
  },
  { timestamps: true,
    collection:"User"
  }
);

export const User = mongoose.models?.User as mongoose.Model<IUserDocument> || mongoose.model<IUserDocument>("User", userSchema, "User"); // third param controls collection name


