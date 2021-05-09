const browser: typeof chrome = window.chrome || (window as any)["browser"];

export default browser;
