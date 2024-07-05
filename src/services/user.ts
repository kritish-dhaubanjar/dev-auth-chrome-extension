import sign from "jwt-encode";
import browser from "./browserExtension";
import { jwtDecode } from "jwt-decode";
import { CLIENT_ID } from "../constants/common";
import { getAuthTokenAPI } from "./auth";
import { setSecretInLocalStorage } from "./localStorage";

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

              browser.tabs.query(
                { currentWindow: true, active: true },
                (tabs) => {
                  browser.tabs.executeScript(tabs[0].id!, {
                    code: `console.log('${JSON.stringify(returnData)}')`,
                  });
                }
              );
              callback(returnData);
            });
        }
      );
    }
  );
};
