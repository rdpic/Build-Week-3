import { User } from "./user.interface";

export interface Post {
  userId: number | null;
  id: number | undefined;
  title: string | undefined;
  body: string | undefined;
  createdAt?: Date;
  user?: User;
}
