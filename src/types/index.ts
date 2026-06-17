export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  //name: string;
  //avatar: string;
  image: string;
  role: "admin" | "customer";
}

export interface AuthSessionData {
  accessToken: string;
  refreshToken: string;
}

export interface SessionData {
  user: AuthUser;
  token: string;
}
