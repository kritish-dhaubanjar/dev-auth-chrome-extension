const browser: typeof chrome = window.chrome || (window as any)["browser"];

export const getAppVersionFromManifest = () => {
  return browser.runtime.getManifest().version;
};

export default browser;
