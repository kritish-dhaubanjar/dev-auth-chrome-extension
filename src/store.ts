import { writable } from "svelte/store";
import { INITIAL_TOKENS } from "./constants/common";

export const savedTokens = writable(INITIAL_TOKENS);

export const currentToken = writable("");

export const tokenIssued = writable(0);

export const secretKey = writable("");
