import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface AuthJwtPayload extends JwtPayload {
  email: string;
  role: UserRole;
}