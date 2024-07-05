import sign from "jwt-encode";
import { CLIENT_ID } from "../../src/constants/common";
import browser from "../../src/services/browserExtension";
import { handleAuthProfile } from "../../src/services/user";

console.log("loaded");

browser?.contextMenus.remove("authProfile");

browser?.contextMenus.create({
  id: "authProfile",
  title: "Auth as: %s",
  contexts: ["link"],
  targetUrlPatterns: ["https://*.vyaguta.lftechnology.com.np/leapfroggers/*"],
});

browser?.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId === "authProfile") {
    handleAuthProfile(event.linkUrl);
  }
});

browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get(
    "vyagutaDevAuthSecret",
    async ({ vyagutaDevAuthSecret }) => {
      const urls = [
        "http://localhost:3000",
        "https://dev.vyaguta.lftechnology.com.np",
        "https://qa.vyaguta.lftechnology.com.np",
        "https://uat.vyaguta.lftechnology.com.np",
      ];
      const refreshToken = sign(
        { data: { id: 400 }, iat: Date.now() },
        vyagutaDevAuthSecret
      );

      console.log(refreshToken);

      fetch(
        `https://dev.vyaguta.lftechnology.com.np/api/auth/authorize?clientId=${CLIENT_ID}&token=${refreshToken}`
      )
        .then((res) => res.json())
        .then(({ data }) => {
          urls.forEach((url) => {
            const { origin: currentOrigin } = new URL(url);

            chrome.cookies.set({
              url: currentOrigin,
              name: "refreshToken",
              value: refreshToken,
            });

            chrome.cookies.set({
              url: currentOrigin,
              name: "accessToken",
              value: data.accessToken,
            });
          });
        });
    }
  );
});
