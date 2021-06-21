import browser from "./browserExtension";
import { currentToken } from "./../store";
import type { Token } from "src/types/common";
import { updateTokenIssued } from "./firebase";
import { setTokenInLocalStorage } from "./localStorage";

const VALID_URLS = [
  "http://localhost",
  "http://127.0.0.1",
  "https://dev.vyaguta.lftechnology.com",
  "https://uat.vyaguta.lftechnology.com",
];

interface OnlyToken {
  accessToken: string;
  refreshToken: string;
}

const setAccessToken = ({ refreshToken, accessToken }: OnlyToken) => {
  browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentTabId = currentTab.id || chrome.tabs.TAB_ID_NONE;

    const currentUrl = currentTab.url;

    VALID_URLS.forEach((url) => {
      if (currentUrl?.includes(url)) {
        browser.cookies.set({
          url,
          name: "refreshToken",
          value: refreshToken,
        });

        browser.cookies.set(
          {
            url,
            name: "accessToken",
            value: accessToken,
          },
          () => {
            updateTokenIssued();

            browser.tabs.executeScript(currentTabId, {
              code: `window.location.reload()`,
            });

            window.close();
          }
        );
      }
    });
  });
};

export const auth = ({
  accessToken,
  refreshToken,
}: OnlyToken): Promise<Object> => {
  return fetch(
    `https://dev.vyaguta.lftechnology.com/api/auth/authorize?clientId=lms&token=${refreshToken}`
  )
    .then((res) => res.json())
    .then(({ data }) => {
      setAccessToken(data);

      browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
        const savedTokens: Array<Token> = result?.vyagutaDevAuthToken ?? [];

        const activeTokens = savedTokens.map((token) => {
          return token.refreshToken === refreshToken
            ? {
                ...token,
                refreshToken: data.refreshToken,
                accessToken: data.accessToken,
              }
            : { ...token };
        });

        setTokenInLocalStorage(activeTokens);
      });

      currentToken.set(data.refreshToken);

      return data;
    })
    .catch((err) => {
      browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
        const savedTokens: Array<Token> = result?.vyagutaDevAuthToken ?? [];

        const activeTokens = savedTokens.map((token) =>
          token.refreshToken === refreshToken
            ? { ...token, isActive: false }
            : { ...token }
        );

        setTokenInLocalStorage(activeTokens);
      });
    });
};

export const getCurrentToken = (tokenName = "refreshToken") => {
  browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const currentTab = tabs[0];

    const currentUrl = currentTab.url;

    VALID_URLS.forEach((url) => {
      if (currentUrl?.includes(url)) {
        browser.cookies.get({ url, name: tokenName }, (cookie) => {
          const value = cookie?.value || "";
          currentToken.set(value);
        });
      }
    });
  });
};
