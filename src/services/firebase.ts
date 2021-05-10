import { tokenIssued } from "./../store";

export const updateTokenIssued = () => {
  fetch("https://vyaguta-extension-default-rtdb.firebaseio.com/requests.json", {
    method: "POST",
    body: JSON.stringify({
      at: new Date().toString(),
    }),
  })
    .then(() => {
      tokenIssued.update((count) => count + 1);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const getTotalTokenIssued = () => {
  fetch("https://vyaguta-extension-default-rtdb.firebaseio.com/requests.json")
    .then((res) => res.json())
    .then((data) => {
      const count = Object.keys(data).length;

      tokenIssued.set(count);
    })
    .catch((err) => {
      console.error(err);
    });
};
