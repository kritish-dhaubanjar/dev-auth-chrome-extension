import sign from "jwt-encode";
import browser from "./browserExtension";
import { jwtDecode } from "jwt-decode";
import { CLIENT_ID } from "../constants/common";
import { auth, getAuthTokenAPI } from "./auth";
import {
  setSecretInLocalStorage,
  setTokenInLocalStorage,
} from "./localStorage";
import type { Token } from "src/types/common";

export const getUserData = async (data: any, callback: any) => {
  if (data.secret) {
    setSecretInLocalStorage(data.secret);
  }

  browser.storage.local.get(
    "vyagutaDevAuthSecret",
    ({ vyagutaDevAuthSecret }: any) => {
      browser.tabs.query(
        { currentWindow: true, active: true },
        async (tabs) => {
          const returnData = {
            token: data.token,
            userId: data.userId,
            username: data.name,
          };

          if (!data.token && data.userId) {
            returnData.token = await sign(
              { data: { id: data.userId }, iat: Date.now() },
              vyagutaDevAuthSecret
            );
          }

          if (data.token && !data.userId) {
            returnData.userId = jwtDecode<any>(data.token)?.data?.id || "";
          }

          const currentTab = tabs[0];
          const currentUrl = currentTab.url || "";

          const { env, api } = getAuthTokenAPI(currentUrl);

          fetch(`${api}?clientId=${CLIENT_ID}&token=${returnData.token}`)
            .then((res) => res.json())
            .then(({ data }) => {
              if (data) {
                if (!returnData.username) {
                  returnData.username = `${data.data.firstName} ${
                    data.data.lastName
                  } - ${env[0].toUpperCase()}`;
                }
              }

              callback(returnData);
            });
        }
      );
    }
  );
};

export const handleAuthProfile = (url: string) => {
  browser.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
    const currentTab = tabs[0];

    const currentUrl = url || currentTab.url || "";

    const { env, api } = getAuthTokenAPI(currentUrl);

    const leapfroggerProfileUrl = currentUrl.match(/leapfroggers\/(\d+)/g)?.[0];

    if (!leapfroggerProfileUrl) {
      return;
    }

    const returnData = {
      token: "",
      userId: "",
      username: "",
    };

    returnData.userId = leapfroggerProfileUrl.split("/")[1];

    browser.storage.local.get(
      "vyagutaDevAuthSecret",
      async ({ vyagutaDevAuthSecret }: any) => {
        returnData.token = await sign(
          { data: { id: returnData.userId }, iat: Date.now() },
          vyagutaDevAuthSecret
        );

        fetch(`${api}?clientId=${CLIENT_ID}&token=${returnData.token}`)
          .then((res) => res.json())
          .then(({ data }) => {
            if (!returnData.username) {
              returnData.username = `${data.data.firstName} ${
                data.data.lastName
              } - ${env[0].toUpperCase()}`;
            }

            browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
              const currentValue: Array<Token> =
                result?.vyagutaDevAuthToken ?? [];

              const alreadyExists = currentValue.filter(
                ({ userId }) => userId && +userId === +returnData.userId
              ).length;

              if (alreadyExists) {
                auth({
                  refreshToken: returnData.token,
                  accessToken: returnData.token,
                  shouldRefresh: false,
                });

                return;
              }

              setTokenInLocalStorage([
                ...currentValue,
                {
                  username: returnData.username,
                  accessToken: returnData.token,
                  refreshToken: returnData.token,
                  isActive: true,
                  id: currentValue.length + 1,
                  shouldRefresh: false,
                  userId: returnData.userId,
                },
              ]);
            });

            auth({
              refreshToken: returnData.token,
              accessToken: returnData.token,
              shouldRefresh: false,
            });
          });
      }
    );
  });
};
