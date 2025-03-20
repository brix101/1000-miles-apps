import type { IUser, UserInput } from "@/models/user.model";
import UserModel from "@/models/user.model";
import type { SignInDTO } from "@repo/schema";
import { omit } from "lodash";
import type {
  FilterQuery,
  MongooseError,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export async function getUsers() {
  return UserModel.find({
    active: true,
  })
    .collation({ locale: "en_US", strength: 1 })
    .sort({ name: 1 })
    .select({
      password: 0,
      permission_id: 0,
      role_id: 0,
    })
    .populate("allowedModules");
}

export async function findUser(query: FilterQuery<IUser>) {
  return UserModel.findOne(query).populate("allowedModules");
}

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    await user.populate("allowedModules");

    return omit(user.toJSON(), "password", "permission_id", "role_id");
  } catch (e) {
    throw e as MongooseError;
  }
}

export async function updateUser(
  query: FilterQuery<IUser>,
  update: UpdateQuery<IUser>,
  options: QueryOptions
) {
  // Find the user first
  const user = await UserModel.findOne(query);

  if (!user) {
    // Handle the case where the user is not found
    return null; // or throw an error, or handle it as needed
  }

  // Apply the updates to the user object
  Object.assign(user, update);

  // Trigger the pre-save middleware by calling save
  await user.save(options);

  return user;
}

export async function deleteUser(query: FilterQuery<IUser>) {
  const update: UpdateQuery<IUser> = { active: false };
  await UserModel.updateOne(query, update);
}

export async function validatePassword({ email, password }: SignInDTO) {
  const user = await UserModel.findOne(
    {
      email: { $regex: new RegExp(email, "i") },
    },
    { permission_id: 0, role_id: 0 }
  ).populate("allowedModules");

  if (!user) return false;

  const isValid = await user.comparePassword(password);
  if (!isValid) return false;

  return user;
}
