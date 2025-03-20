import { signJwt } from "@/utils/jwt.util";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { IModule } from "./module.model";

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  active?: boolean;
  allowedModules: IModule["_id"][];
}

export interface IUser extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getAccessToken(): string;
  getRefreshToken(): string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
    active: {
      type: Boolean,
      default: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    allowedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    image_url: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;

  if (!user.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as unknown as IUser;

  const isValid = await bcrypt
    .compare(candidatePassword, user.password)
    .catch(() => false);

  return isValid;
};

userSchema.methods.getAccessToken = function () {
  const user = this as unknown as IUser;
  const accessToken = signJwt(
    { sub: user._id, email: user.email, name: user.name },
    "ACCESS_TOKEN_PRIVATE_KEY",
    { expiresIn: "1h" } // 1 hour,
  );

  return accessToken;
};

userSchema.methods.getRefreshToken = function () {
  const user = this as unknown as IUser;
  // create a refresh token
  const refreshToken = signJwt(
    { sub: user._id },
    "REFRESH_PRIVATE_KEY",
    { expiresIn: "1y" } // 1 year
  );

  return refreshToken;
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
