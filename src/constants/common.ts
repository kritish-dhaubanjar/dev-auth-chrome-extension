import type { Token, User } from "./../types/common.d";

export const INITIAL_TOKENS: Array<Token> = [];

export const INITIAL_USER_STATE: User = {
  name: "",
  token: "",
};

export const FORM_VIEW = {
  ADD_USER: 'ADD_USER',
  IMPORT: 'IMPORT',
}

export const JSON_PLACEHOLDER = `[
  {
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1N..."
  }
]
`