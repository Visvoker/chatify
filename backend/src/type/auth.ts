import { UserDoc } from "./user.js";

export type AuthUser = Omit<UserDoc, "password">;
