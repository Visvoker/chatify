import { UserDoc } from "./user";

declare module "socket.io" {
  interface Socket {
    user?: UserDoc;
  }
}
