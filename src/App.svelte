<!-- App.svelte -->
<script lang="typescript">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let isFormShown: boolean = false;

  interface User {
    name: string;
    token: string;
  }

  let name = "";

  const user: User = {
    name: "",
    token: "",
  };

  const form = writable(user);

  const toggleForm = () => {
    console.log(isFormShown);
    isFormShown = !isFormShown;
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

    <div class="ui middle aligned divided list" id="userList" />

    <div class="ui fluid mini action input mb-12" id="clipboard">
      <input type="text" value="" placeholder="accessToken appears here" />
      <button class="ui mini teal button">Copy</button>
    </div>

    {#if isFormShown}
      <div class="item pb-8" id="tokenFormContainer">
        <form class="ui form" id="tokenForm">
          <div class="field">
            <label>Username</label>
            <input
              name="username"
              type="text"
              id="username"
              bind:value={$form.name}
            />
          </div>
          <div class="field">
            <label>Token</label>
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
            on:click={() => console.log(user.name)}>Add</button
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
      <!--  -->

      <a class="ui blue label">
        Token Issued
        <div class="detail" id="count">N/A</div>
      </a>

      <button class="ui label red button mini" id="deleteAllToken">
        Delete All
      </button>
    </div>
  </main>
</div>

<style>
  /* css will go here */
</style>
