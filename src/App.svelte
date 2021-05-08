<!-- App.svelte -->
<script lang="typescript">
  import CopyClipBoard from "./components/common/Clipboard.svelte";

  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import type { Token, User } from "./types/common";

  import { auth, getCurrentToken } from "./services/auth";
  import {
    getTokens,
    saveToken,
    deleteAllSavedTokens,
  } from "./services/localStorage";
  import { currentToken, savedTokens } from "./store";

  let storedTokens: Array<Token>;
  let currentActiveToken: string = "";
  let isCopied: boolean = false;

  savedTokens.subscribe((tokens) => (storedTokens = tokens));
  currentToken.subscribe((token) => (currentActiveToken = token));

  let isFormShown: boolean = false;

  const INITIAL_USER_STATE: User = {
    name: "",
    token: "",
  };

  const form = writable(INITIAL_USER_STATE);

  const toggleForm = () => {
    isFormShown = !isFormShown;
  };

  const resetForm = () => {
    form.set(INITIAL_USER_STATE);
  };

  const handleFormSubmit = () => {
    saveToken({
      username: $form.name,
      accessToken: $form.token,
      refreshToken: $form.token,
      isActive: true,
      id: storedTokens.length + 1,
    });

    toggleForm();

    resetForm();
  };

  onMount(() => {
    getTokens();

    getCurrentToken();
  });

  let clickedId: number | null = null;

  const handleAuth = ({ accessToken, refreshToken, id }: Token) => {
    clickedId = id;
    auth({ refreshToken, accessToken }).finally(() => (clickedId = null));
  };

  const handleDeleteAllTokens = () => {
    deleteAllSavedTokens();
  };

  const handleTokenCopy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: currentActiveToken },
    });
    app.$destroy();

    isCopied = true;

    setTimeout(() => {
      isCopied = false;
    }, 1000);
  };
</script>

<div class="App">
  <main>
    <h4 class="ui header middle aligned list">
      <img
        src="./assets/patrick.png"
        class="ui circular image small"
        alt="User"
      />
      <div class="content">Vyaguta Dev Auth</div>
      <button
        class="right floated mini ui button"
        class:teal={!isFormShown}
        id="addUser"
        on:click={toggleForm}
      >
        {!isFormShown ? "Add User" : "Cancel"}
      </button>
    </h4>

    <div class="ui middle aligned divided list" id="userList">
      {#each storedTokens as token}
        <div class="item">
          <div class="right floated content">
            {#if clickedId == token.id}
              <button class="ui loading button small m-0">Loading</button>
            {:else}
              {#if token.refreshToken === currentActiveToken}
                <div class="ui green empty circular label" />
              {/if}
              <button
                class="ui button small m-0"
                type="button"
                disabled={!token.isActive}
                class:red={!token.isActive}
                on:click={() => handleAuth(token)}
                >{token.isActive ? "Auth" : "Expired"}</button
              >
            {/if}
          </div>
          <div class="d-flex align-items-center pt-4">
            <img
              class="ui avatar image"
              src="https://ui-avatars.com/api/?name={token.username}&background=random&size=256"
              alt={token.username}
            />
            <div class="content">{token.username}</div>
          </div>
        </div>
      {/each}
    </div>
    <div class="ui fluid mini action input mb-12" id="clipboard">
      <input
        type="text"
        value={currentActiveToken}
        placeholder="Token appears here"
      />
      <button class="ui mini teal button" on:click={handleTokenCopy}
        >{isCopied ? "Copied" : "Copy"}</button
      >
    </div>

    {#if isFormShown}
      <div class="item pb-8" id="tokenFormContainer">
        <form class="ui form" id="tokenForm">
          <div class="field">
            <label for="username">Username</label>
            <input
              name="username"
              type="text"
              id="username"
              bind:value={$form.name}
            />
          </div>
          <div class="field">
            <label for="token">Token</label>
            <textarea
              name="token"
              rows="2"
              id="token"
              bind:value={$form.token}
            />
          </div>
          <button
            class="ui button"
            type="button"
            id="removeForm"
            on:click={toggleForm}
          >
            Cancel
          </button>
          <button
            class="ui primary button"
            type="button"
            on:click={handleFormSubmit}>Add</button
          >
        </form>
        <div class="ui divider" />
      </div>
    {/if}

    <div class="ui labels">
      <a
        class="ui label pink"
        href="https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension"
        target="_blank"
      >
        Github
      </a>

      <div class="ui blue label">
        Token Issued
        <div class="detail" id="count">N/A</div>
      </div>

      <button
        class="ui label red button mini"
        id="deleteAllToken"
        type="button"
        on:click={handleDeleteAllTokens}
      >
        Delete All
      </button>
    </div>
  </main>

  <div id="clipboard" />
</div>

<style>
  /* css will go here */
</style>
