const lizzie = document.querySelector("#auth517");
const cal = document.querySelector("#auth512");
const count = document.querySelector("#count");
let requests = 0;

const [lizzie_auth, lizzie_loading] = lizzie.querySelectorAll("button");
const [cal_auth, cal_loading] = cal.querySelectorAll("button");

const urls = ["http://localhost", "http://127.0.0.1"];

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

  const code = `window.location.reload();`;
  chrome.tabs.executeScript(null, { code: code });
  window.close();
};

const addEventListener = (button, loading, token) => {
  button.addEventListener("click", () => {
    button.classList = "ui button small d-none";
    loading.classList = "ui loading button small";

    fetch(`<AUTH_URL>&token=${token}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ data }) => {
        fetch("<FIREBASE>", {
          method: "POST",
          body: JSON.stringify({
            at: new Date().toString(),
          }),
        });

        setToken(data);
      })
      .finally(() => {
        button.classList = "ui button small";
        loading.classList = "ui loading button small d-none";
      });
  });
};

addEventListener(lizzie_auth, lizzie_loading, "<ACCESS_TOKEN>");
addEventListener(cal_auth, cal_loading, "<ACCESS_TOKEN>");

fetch("<FIREBASE>")
  .then((res) => res.json())
  .then((data) => {
    requests = Object.keys(data).length;
    count.innerHTML = requests;
  });
