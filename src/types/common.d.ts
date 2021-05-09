export interface Token {
  accessToken: string;
  refreshToken: string;
  username: string;
  id: number;
  isActive: bool;
}

interface User {
  name: string;
  token: string;
}
