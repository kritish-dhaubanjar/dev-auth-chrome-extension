import { writable } from "svelte/store";
import { INITIAL_TOKENS } from "./constants/common";

export const savedTokens = writable(INITIAL_TOKENS);

export const currentToken = writable("");
