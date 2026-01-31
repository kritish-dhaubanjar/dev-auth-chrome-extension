# Dev Auth Chrome Extension

A Chrome Extension to set new `accessToken` and `refreshToken` during local development of **lms-module**.

![Firefox Addon](https://img.shields.io/amo/d/dev-auth-extension?style=flat&logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/dev-auth-extension)

## 📸 What This Extension Does

Simplifies local development by automating authentication token management:
- ✅ **Set accessToken** — Updates your active session token
- 🔄 **Refresh tokens** — Keeps your session alive with new tokens
- 🚀 **Quick access** — Skip manual token entry in forms
- 🎯 **Local development only** — Works seamlessly with local LMS builds

---

## 📦 Installation

### Firefox
1. Download [dev_auth_extension-1.2.2-fx.xpi](https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/releases/download/v1.2.2/dev_auth_extension-1.2.2-fx.xpi)
2. Open **Add-ons Manager** → Click "This Firefox" (in newer versions) → Load Temporary Add-on
3. Select any file in the extension directory → Click **Load Temporary Add-on**

### Chrome
1. Download [dev_auth_extension-1.2.2.zip](https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/releases/download/v1.2.2/dev_auth_extension-1.2.2.zip)
2. Open **Extensions** → Click Developer Mode toggle (top right)
3. Drag and drop `dev_auth_extension-1.2.2.zip` into Extensions page
4. Enable Developer Mode → Click **Load unpacked** extension

---

## 🎨 Screenshots

### Authentication Interface
The extension provides a simple interface to set new access tokens:

| Action | Description |
|---------|-------------|
| 🔑 Set New Token | Updates your current session token |
| 🔄 Refresh Token | Generates a new token for your session |
| 🗑 Clear Expired | Removes tokens past their expiration time |

### Token Status
See active and expired tokens at a glance with visual indicators.

---

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension.git

cd dev-auth-chrome-extension

# Install dependencies
yarn install

# Watch for changes during development
yarn watch
```

**Requirements:**
- Node.js 16+
- Yarn 1.22+
- Chrome DevTools or Firefox Developer Tools for loading unpacked extensions

---

## 🔧 Configuration

The extension reads configuration from `lms-module`:

| Config Key | Description | Default |
|------------|-------------|---------|
| `LMS_API_URL` | LMS module API endpoint | (from module) |
| `LMS_BASE_URL` | LMS module base URL | (from module) |
| `TOKEN_EXPIRY_MS` | Token expiration buffer in milliseconds | `300000` (5 min) |

These settings are automatically detected during development — no manual configuration needed.

---

## 📝 Troubleshooting

### Extension not loading?
**Firefox:** Make sure you're using Firefox 68+ and clicked "Load Temporary Add-on"
**Chrome:** Enable Developer Mode before loading the unpacked extension
**Symbols not loading?** Open DevTools → Sources tab → Reload the extension

### Token not updating?
- Check if LMS module is running locally
- Verify API URLs in DevTools Console
- Check network connectivity to LMS server

### Extension showing as corrupted?
- Try reloading the extension from Extensions/Add-ons Manager
- Clear browser cache and reload
- Reinstall the extension

---

## 🎯 Use Cases

### For LMS Module Developers
Automate authentication during local development without manually copying tokens:
- Run local LMS builds without constant login interruptions
- Test different user roles by quickly switching tokens
- Debug API requests through DevTools console logs

### For QA Engineers
Validate token management behavior:
- Verify tokens are being refreshed at appropriate intervals
- Test token expiration handling across sessions
- Simulate expired token scenarios

### For Production Support
Simplify troubleshooting:
- Guide users to enable Developer Mode
- Identify when extension is loaded vs unloaded
- Check console for token-related errors

---

## 🚀 Key Features

- ✨ **Simple interface** — One-click token management
- 🔄 **Auto-refresh** — Keeps sessions alive seamlessly
- 🎯 **Local-first** — Designed for development environments
- 🔐 **Secure** — Tokens only accessible within your LMS session
- 🌐 **Cross-platform** — Firefox and Chrome support

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details

---

## 👥 Contributors

Thanks to everyone who has contributed to making this extension better!

<a href="https://github.com/maskeynihal"><img src="https://avatars.githubusercontent.com/u/26411488?v=4" width="50px;" alt=""/></a> — README improvements and documentation
<a href="https://github.com/kritish-dhaubanjar"><img src="https://avatars.githubusercontent.com/u/25634165?v=4" width="50px;" alt=""/></a> — Original creator

---

**Built for:** LMS Module Local Development | Firefox & Chrome | QA Teams
