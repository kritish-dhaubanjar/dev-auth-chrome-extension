## Dev Auth Chrome Extension

A Chrome Extension to set new `accessToken` and `refreshToken` during local development of **lms-module**.

![shields.io](https://myunepal.com/shields.php?)

#### Preview
![dev_auth_extension_add_user](https://user-images.githubusercontent.com/25634165/173763743-6527b753-2cf6-45c7-9e9d-416066664b4c.png)

## Installation

#### Firefox
[![image](https://user-images.githubusercontent.com/25634165/182077604-b8314432-a679-4cfb-a9e7-b01534b796bd.png)](https://addons.mozilla.org/en-US/firefox/addon/dev-auth-extension/)

##### Or

1. Download [dev_auth_extension-1.2.2-fx.xpi](https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/releases/download/v1.2.2/dev_auth_extension-1.2.2-fx.xpi)
2. Open the Extension Management page by navigating to `about:addons`.
3. Drag and drop `dev_auth_extension-1.2.2-fx.xpi` into `about:addons` page.

#### Chrome
[![Install from Chrome Web Store](https://github.com/user-attachments/assets/309f49b2-6b93-4682-a701-443f51794913)](https://chrome.google.com/webstore/detail/dev-auth-extension/jppiemoeoecclmpmjieeofgejohnjapn/related?hl=en&authuser=1)

##### Or

1. Download [dev_auth_extension-1.2.2.zip](https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/releases/download/v1.2.2/dev_auth_extension-1.2.2.zip)
1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Drag and drop `dev_auth_extension-1.2.2.zip` into `chrome://extensions` page.

#### Usage

![vyaguta_dev_auth](https://user-images.githubusercontent.com/25634165/117668727-ef83d480-b1c5-11eb-9f92-f4cf018be4de.gif)

## Development setup

```shell
git clone https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension.git

cd dev-auth-chrome-extension

yarn install

yarn build:watch
```
#### Firefox
1. Open the `about:debugging` page, click "This Firefox" (in newer versions of Firefox).
2. Click `Load Temporary Add-on` and select any file in your extension's directory (`dev-auth-chrome-extension/build`). <sup>[Read More](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)</sup>

#### Chrome
1. Open the Extension Management page by navigating to `chrome://extensions`.
2. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.
3. Click the `Load unpacked` button and select the extension directory (`dev-auth-chrome-extension/build`). <sup>[Read More](https://developer.chrome.com/docs/extensions/mv3/getstarted/)</sup>

## Release History
* 1.2.2
   * ADD: Version Indicator
   * CHANGE: Auth Token API to `https://dev.vyaguta.lftechnology.com.np/api/auth/authorize`
* 1.2.1
   * ADD: Support for 
     * `vyaguta.lftechnology.com.np`
     * `intranet.lftechnology.com`
     * `intranet.lftechnology.com.np`
   * CHANGE: Snowpack Build Options
* 1.2.0
   * ADD: Option to Update Refresh Token
   * CHANGE: Position of Active Indicator
   * CHANGE: Position of Add User/Import/Export Form
* 1.1.3
   * ADD: Support for QA
* 1.1.2
   * Published to **Chrome Web Store**
* 1.1.1
    * ADD: Support for UAT
* 1.1.0
    * ADD: Quick JSON Import/Export for Tokens
* 1.0.2
    * REMOVE: Token Issued from the footer
* 1.0.1
    * FIX: Crash when symbols are added to name
    * ADD: Edit/delete individual users
    * ADD: Indicator for current & expired tokens
* 0.2.0
    * The first proper pre-release
    * ADD: Form to add multiple users
    * ADD: Clipboard to copy accessToken
* 0.1.0
    * Work in progress
 


## Contributors ✨

Thanks goes to these wonderful people:

<table>
  <tr>
    <td align="center"><a href="https://github.com/maskeynihal"><img src="https://avatars.githubusercontent.com/u/26411488?v=4" width="100px;" alt=""/><br /><sub><b>Nihal Maskey</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/commits?author=maskeynihal" title="Commits">📖</a><a href="https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/issues?q=author%3Amaskeynihal" title="Bug Reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RikLakhe"><img src="https://avatars.githubusercontent.com/u/25451595?v=4" width="100px;" alt=""/><br /><sub><b>Rikesh Lal Shrestha</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension/issues?q=author%3ARikLakhe" title="Bug Reports">🐛</a></td>
  </tr>
</table>
