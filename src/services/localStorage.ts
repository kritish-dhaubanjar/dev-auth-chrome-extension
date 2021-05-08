import type { Token } from "./../types/common.d";
import { writable } from "svelte/store";
import browser from "./browserExtension";

const INITIAL_TOKENS: Array<Token> = [];

export const savedTokens = writable(INITIAL_TOKENS);

interface LocalStorageToken {
  vyagutaDevAuthToken: Array<Token>;
}

export const setTokenInLocalStorage = (tokens: Array<Token>) => {
  browser.storage.local.set({ vyagutaDevAuthToken: tokens }, function () {
    savedTokens.set(tokens);
  });
};

export const saveToken = (token: Token) => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    setTokenInLocalStorage([
      ...currentValue,
      {
        username: token.username,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isActive: true,
        id: token.id,
      },
    ]);
  });
};

export const getTokens = () => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    savedTokens.set(currentValue);
  });
};

export const deleteAllSavedTokens = () => {
  browser.storage.local.clear(() => {
    const error = chrome.runtime.lastError;

    if (error) {
      console.log(error);

      return;
    }

    savedTokens.set(INITIAL_TOKENS);
  });
};
