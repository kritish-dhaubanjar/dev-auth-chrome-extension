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
