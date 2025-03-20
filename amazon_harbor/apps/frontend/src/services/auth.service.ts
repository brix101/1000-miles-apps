import api from "@/lib/api";
import { SignInDTO } from "@repo/schema";

export const signInMutation = (data: SignInDTO) => {
  return api.post("/auth", data);
};
