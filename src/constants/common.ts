import type { Token, User } from "./../types/common.d";

export const INITIAL_TOKENS: Array<Token> = [];

export const INITIAL_USER_STATE: User = {
  name: "",
  token: "",
  userId: "",
};

export const FORM_VIEW = {
  ADD_USER: "ADD_USER",
  IMPORT: "IMPORT",
};

export const JSON_PLACEHOLDER = `[
  {
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1N...",
    "userId": "123",
  }
]
`;

export const AUTH_TOKEN_API = {
  dev: "https://dev.vyaguta.lftechnology.com.np/api/auth/authorize",
  qa: "https://qa.vyaguta.lftechnology.com.np/api/auth/authorize",
  uat: "https://uat.vyaguta.lftechnology.com.np/api/auth/authorize",
};

export const CLIENT_ID = "lms";
