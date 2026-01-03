export type AuthUser = {
  _id: string;
  email: string;
  fullName: string;
  profilePic?: string;
};

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
