export interface Token {
  accessToken: string;
  refreshToken: string;
  username: string;
  id: number;
  isActive: bool;
  shouldRefresh?: boolean;
  userId?: string;
}

interface User {
  name: string;
  token: string;
  userId: string;
}
