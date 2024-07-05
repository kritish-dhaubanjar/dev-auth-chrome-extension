<!-- App.svelte -->
<script lang="typescript">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  
  import type { Token, User } from "./types/common";

  import { getUserData, handleAuthProfile } from "./services/user";
  import { auth, getCurrentToken } from "./services/auth";
  import CopyClipBoard from "./components/common/Clipboard.svelte";
  import { currentToken, savedTokens, tokenIssued, secretKey } from "./store";
  import {
    INITIAL_USER_STATE,
    FORM_VIEW,
    JSON_PLACEHOLDER,
  } from "./constants/common";

  import {
    getTokens,
    saveToken,
    saveTokens,
    deleteAllSavedTokens,
    editToken,
    deleteToken,
    updateToken,
  } from "./services/localStorage";
  import { getAppVersionFromManifest } from "./services/browserExtension";


  let storedTokens: Array<Token>;
  let currentActiveToken: string = "";
  let isCopied: boolean = false;
  let isFormShown: boolean = false;
  let editId: number | null;
  let clickedId: number | null = null;
  let totalTokenIssued: number = 0;
  let secret: string = '';

  let formView: string = FORM_VIEW.ADD_USER;
  let json: string = "";

  savedTokens.subscribe((tokens) => (storedTokens = tokens));
  currentToken.subscribe((token) => (currentActiveToken = token));
  tokenIssued.subscribe((count) => (totalTokenIssued = count));
  
  const form = writable({ ...INITIAL_USER_STATE, secret });
  
  secretKey.subscribe((key) => {
    secret = key;

    form.set({ ...INITIAL_USER_STATE, secret: key })
  });

  const toggleForm = () => {
    isFormShown = !isFormShown;

    if (!isFormShown) {
      resetForm();
      setEditId(null);
    }
  };

  const setEditId = (id: number | null) => (editId = id);

  const resetForm = () => {
    form.set({ ...INITIAL_USER_STATE, secret });
   
    json = "";
  };

  const reset = () => {
    toggleForm();

    resetForm();

    setEditId(null);
  };

  const handleFormSubmit = async () => {
    await getUserData($form, (data: any) => {
      saveToken({
        username: data.username,
        accessToken: data.token,
        refreshToken: data.token,
        userId: data.userId,
        isActive: true,
        id: storedTokens.length + 1,
      });
    });

    reset();
  };

  onMount(() => {
    getTokens();

    getCurrentToken();
  });

  const handleAuth = ({
    accessToken,
    refreshToken,
    id,
    shouldRefresh,
  }: Token) => {
    clickedId = id;
    auth({ refreshToken, accessToken, shouldRefresh });
    clickedId = null;
  };

  const toggleShouldRefreshToken = (token: Token) => {
    updateToken(token.id, { ...token, shouldRefresh: !token.shouldRefresh });
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

  const handleEditToken = (token: Token) => {
    formView = FORM_VIEW.ADD_USER;

    form.set({ 
      name: token.username,
      secret, 
      token: token.refreshToken, 
      userId: token.userId, 
    });

    if (!isFormShown) {
      toggleForm();
    }

    setEditId(token.id);
  };

  const handleFormEdit = (id: number) => {
    editToken(id, $form.token, $form.name);

    reset();
  };

  const handleTokenDelete = (id: number) => {
    deleteToken(id);

    reset();
  };

  const toggleFormView = (view: string) => {
    formView = view;
  };

  let cursorLeft = 0;
  let cursorRight = 0;

  const handleMouseMove = (event: MouseEvent) => {
    cursorLeft = event.clientX + 10;
    cursorRight = event.clientY;
  };

  $: showComment = false;

  const handleMouseEnter = () => {
    showComment = true;
  };

  const handleMouseLeave = () => {
    showComment = false;
  };

  const handleImport = async () => {
    try {
      const users: Array<User> = JSON.parse(json);
      const tokens: Array<Token> = [];

      let id = storedTokens.length + 1;

      const callback = (id: number) => {
        return (data: any) => {
          tokens.push({
            username: data.username,
            accessToken: data.token,
            refreshToken: data.token,
            isActive: true,
            shouldRefresh: false,
            id: id,
            userId: data.userId,
          });

          if (tokens.length === users.length) {
            saveTokens(tokens);
          }
        };
      };

      await Promise.all(
        users.map(async (user) => {
          await getUserData(user, callback(id));
          id++;
        }),
      );

      reset();
    } catch (error) {}
  };

  const handleExport = () => {
    const users = storedTokens.map((token) => ({
      name: token.username,
      token: token.accessToken,
      userId: token.userId,
    }));

    const data =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(users));

    const a: HTMLElement = document.createElement("a");

    a.setAttribute("href", data);
    a.setAttribute("download", "vyagutadevauth.json");
    a.click();
  };

  $: cursorHelperText = `
    left: ${cursorLeft}px;
    top: ${cursorRight}px;
  `;
</script>

<div class="App">
  <main>
    <span
      class="p-absolute z-100 ui purple horizontal label"
      class:d-none={!showComment}
      on:mouseenter
      style={cursorHelperText}>Double click to edit</span
    >
    <h4 class="ui header middle aligned list mt-0">
      <img
        src="./assets/ribbyShield.png"
        class="ui circular image small"
        alt="User"
      />
      <div class="content">
        Vyaguta Dev Auth <small>v{getAppVersionFromManifest()}</small>
      </div>
      <button
        class="right floated mini ui button"
        class:teal={!isFormShown}
        id="addUser"
        on:click={toggleForm}
      >
        {!isFormShown ? "Add User" : "Cancel"}
      </button>
    </h4>

    <button
      class="ui button large mb-12 w-100"
      type="button"
      on:click={() => {handleAuthProfile('')}}
    >
      Auth Profile</button
    >

    {#if isFormShown}
      <div class="ui secondary pointing menu">
        <a
          class="item"
          href="#"
          on:click={() => toggleFormView(FORM_VIEW.ADD_USER)}
          class:active={formView === FORM_VIEW.ADD_USER}
        >
          Add User
        </a>
        <a
          class="item"
          href="#"
          on:click={() => toggleFormView(FORM_VIEW.IMPORT)}
          class:active={formView === FORM_VIEW.IMPORT}
        >
          Import
        </a>
      </div>
      <div class="item pb-8" id="tokenFormContainer">
        {#if formView === FORM_VIEW.ADD_USER}
          <form class="ui form" id="tokenForm">
            <div class="field">
              <label for="User Id">User Id</label>
              <input
                name="userId"
                type="text"
                id="userId"
                bind:value={$form.userId}
              />
            </div>
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
            <div class="field">
              <label for="Secret Key">Secret Key</label>
              <input
                name="secret"
                type="text"
                id="secret"
                bind:value={$form.secret}
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
            {#if editId}
              <button
                class="ui red button"
                type="button"
                on:click={() => handleTokenDelete(editId)}>Delete</button
              >
              <button
                class="ui primary button"
                type="button"
                on:click={() => handleFormEdit(editId)}>Save</button
              >
            {:else}
              <button
                class="ui primary button"
                type="button"
                on:click={handleFormSubmit}>Add</button
              >
            {/if}
          </form>

          <!--  -->
        {:else}
          <form class="ui form" id="importForm">
            <div class="field">
              <label for="json">JSON</label>
              <textarea
                name="json"
                rows="6"
                id="json"
                bind:value={json}
                placeholder={JSON_PLACEHOLDER}
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
              on:click={handleImport}>Import</button
            >

            <button
              class="ui teal button right floated"
              type="button"
              on:click={handleExport}>Export</button
            >
          </form>
        {/if}
        <div class="ui divider" />
      </div>
    {/if}

    <div class="ui middle aligned divided list" id="userList">
      {#each storedTokens as token}
        <div class="item" on:dblclick={() => handleEditToken(token)}>
          <div class="right floated content d-flex align-items-center">
            {#if clickedId == token.id}
              <button class="ui loading button small m-0">Loading</button>
            {:else}
              <div
                class="ui slider checkbox"
                data-tooltip={`${
                  token.shouldRefresh ? "Don't Refresh" : "Refresh"
                } the token`}
              >
                <input
                  type="checkbox"
                  name="public"
                  on:click={() => toggleShouldRefreshToken(token)}
                  checked={token.shouldRefresh}
                />
                <label class="slider-tooltip" for="public" />
              </div>
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
          <div
            class="d-flex align-items-center pt-4"
            on:mousemove={handleMouseMove}
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
          >
            <img
              class="ui avatar image"
              src="https://ui-avatars.com/api/?name={token.username}&background=random&size=256"
              alt={token.username}
            />
            {#if token.refreshToken === currentActiveToken}
              <span class="ui green empty circular label me-2 indicator" />
            {:else}
              <span class="ui empty circular label me-2 indicator" />
            {/if}
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

    <div class="ui labels flex-space-between">
      <a
        class="ui label black"
        href="https://github.com/kritish-dhaubanjar/dev-auth-chrome-extension"
        target="_blank"
      >
        <img src="./assets/github-32px.png" alt="Github" />
        Github
      </a>

      <a
        class="ui blue label"
        href="https://kritish-dhaubanjar.github.io/dev-auth-chrome-extension/"
        target="_blank"
      >
        <img src="./assets/link.png" alt="link" />Visit Website
      </a>

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
  .p-absolute {
    position: absolute;
  }
</style>
