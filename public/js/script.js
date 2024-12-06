const count = document.querySelector("#count");
let requests = 0;

const log = chrome.extension.getBackgroundPage().console.log;

const addUser = document.getElementById("addUser");
const tokenFormContainer = document.getElementById("tokenFormContainer");
const tokenForm = document.getElementById("tokenForm");
const removeForm = document.getElementById("removeForm");
const usersList = document.getElementById("userList");
const deleteAllToken = document.getElementById("deleteAllToken");
const clipboard = document.querySelector("#clipboard");

const token = clipboard.querySelector("input");
const copy = clipboard.querySelector("button");

const urls = [
  "http://localhost",
  "http://127.0.0.1",
  "https://dev.vyaguta.lftechnology.com",
];

let CURRENT_ACCESS_TOKEN = "";

deleteAllToken.addEventListener("click", function () {
  chrome.storage.local.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      log(error);
      return;
    }

    updateList();
  });
});

function createListWithInnerHTML(users, parentContainer) {
  const rows = users.map(({ username }) => {
    const id = username.replaceAll(/\s/g, "");
    return `
    <div class="item">
      <div class="right floated content" id="${id}">
        <button class="ui button small m-0">Auth</button>
        <button class="ui loading button small d-none m-0">Loading</button>
      </div>
      <div class="d-flex align-items-center pt-4">
        <img class="ui avatar image" src="https://ui-avatars.com/api/?name=${username}&background=random&size=256" />
        <div class="content">${username}</div>
      </div>
    </div>`;
  });

  parentContainer.innerHTML = rows.join("");

  users.forEach(setupEventListener);
}

function updateList() {
  chrome.storage.local.get("vyagutaDevAuthToken", function (result) {
    const users = result?.vyagutaDevAuthToken ?? [];

    createListWithInnerHTML(users, usersList);
  });
}

tokenForm.addEventListener("submit", (e) => {
  const formData = new FormData(tokenForm);
  const username = formData.get("username").trim();
  const token = formData.get("token").trim();

  if (!username || !token) {
    log("Please enter both username and token");
    return;
  }

  chrome.storage.local.get("vyagutaDevAuthToken", function (result) {
    const currentValue = result?.vyagutaDevAuthToken ?? [];
    const setValue = [...currentValue, { username, token }];

    chrome.storage.local.set({ vyagutaDevAuthToken: setValue }, function () {
      log(`New user ${username} added.`);
    });
  });
});

removeForm.addEventListener("click", () => {
  tokenFormContainer.classList.add("d-none");
});

addUser.addEventListener("click", () => {
  tokenFormContainer.classList.remove("d-none");
});

const setToken = ({ accessToken, refreshToken }) => {
  urls.forEach((url) => {
    chrome.cookies.set(
      {
        url,
        name: "accessToken",
        value: accessToken,
      },
      null
    );
    chrome.cookies.set(
      {
        url,
        name: "refreshToken",
        value: refreshToken,
      },
      null
    );
  });

  chrome.tabs.reload();
  // window.close();
};

const addEventListener = (button, loading, token) => {
  button.addEventListener("click", () => {
    log("Clicked");
    button.classList = "ui button small d-none";
    loading.classList = "ui loading button small";

    log((button.innerHTML = "Authed"));

    fetch(
      `https://dev.vyaguta.lftechnology.com/api/auth/authorize?clientId=lms&token=${token}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then(({ data }) => {
        fetch(
          "https://vyaguta-extension-default-rtdb.firebaseio.com/requests.json",
          {
            method: "POST",
            body: JSON.stringify({
              at: new Date().toString(),
            }),
          }
        );

        console.log(data);

        setToken(data);
      })
      .finally(() => {
        button.classList = "ui button small";
        loading.classList = "ui loading button small d-none";
      });
  });
};

function setupEventListener({ username, token }) {
  const id = username.replaceAll(/\s/g, "");
  const user = document.querySelector("#" + id);

  const [user_auth, user_loading] = user.querySelectorAll("button");

  addEventListener(user_auth, user_loading, token);
}

urls.forEach((url) => {
  chrome.cookies.get({ url, name: "accessToken" }, ({ value }) => {
    token.setAttribute("value", value);
  });
});

copy.addEventListener("click", () => {
  if (token.getAttribute("value").length > 0) {
    token.select();
    document.execCommand("copy");
    copy.innerHTML = "Copied";
  }
});

fetch("https://vyaguta-extension-default-rtdb.firebaseio.com/requests.json")
  .then((res) => res.json())
  .then((data) => {
    requests = Object.keys(data).length;
    count.innerHTML = requests;
  });

(function currentAccessToken() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;

    urls.forEach((url) => {
      currentUrl.includes(url) &&
        chrome.cookies.get({ url, name: "accessToken" }, ({ value }) => {
          CURRENT_ACCESS_TOKEN = value;
        });
    });
  });
})();

updateList();
