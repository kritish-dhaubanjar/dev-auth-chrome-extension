import browser from "./browserExtension";
import { currentToken } from "./../store";
import type { Token } from "src/types/common";
import { updateTokenIssued } from "./firebase";
import { setTokenInLocalStorage } from "./localStorage";
import { AUTH_TOKEN_API, CLIENT_ID } from "./../constants/common";

const VALID_URLS = ["http://localhost", "http://127.0.0.1", "lftechnology.com"];
const PRODUCTION_URL = "https://vyaguta.lftechnology.com";

interface OnlyToken {
  accessToken: string;
  refreshToken: string;
  shouldRefresh?: boolean;
}

const setAccessToken = ({ refreshToken, accessToken }: OnlyToken) => {
  browser.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentTabId = currentTab.id || chrome.tabs.TAB_ID_NONE;

    const currentUrl = currentTab.url || "";

    if (currentUrl.includes(PRODUCTION_URL)) {
      return;
    }

    const { origin: currentOrigin } = new URL(currentUrl);

    VALID_URLS.forEach((url) => {
      const regex = new RegExp(url);

      if (regex.test(currentUrl)) {
        browser.cookies.set({
          url: currentOrigin,
          name: "refreshToken",
          value: refreshToken,
        });

        browser.cookies.set(
          {
            url: currentOrigin,
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
  shouldRefresh,
}: OnlyToken): Promise<Object> => {
  return fetch(`${AUTH_TOKEN_API}?clientId=${CLIENT_ID}&token=${refreshToken}`)
    .then((res) => res.json())
    .then(({ data }) => {
      const rToken = shouldRefresh ? data.refreshToken : refreshToken;

      setAccessToken({ ...data, refreshToken: rToken });

      browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
        const savedTokens: Array<Token> = result?.vyagutaDevAuthToken ?? [];

        const activeTokens = savedTokens.map((token) => {
          return token.refreshToken === refreshToken
            ? {
                ...token,
                refreshToken: rToken,
                accessToken: data.accessToken,
              }
            : { ...token };
        });

        setTokenInLocalStorage(activeTokens);
      });

      currentToken.set(rToken);

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

    const currentUrl = currentTab.url || "";

    if (currentUrl.includes(PRODUCTION_URL)) {
      return;
    }

    const { origin: currentOrigin } = new URL(currentUrl);

    VALID_URLS.forEach((url) => {
      const regex = new RegExp(url);

      if (regex.test(currentUrl)) {
        browser.cookies.get(
          { url: currentOrigin, name: tokenName },
          (cookie) => {
            const value = cookie?.value || "";
            currentToken.set(value);
          }
        );
      }
    });
  });
};
