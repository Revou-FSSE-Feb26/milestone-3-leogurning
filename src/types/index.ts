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

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
