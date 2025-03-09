import { atom } from "jotai";
import { EntryResponse, EntryResponseAdmin } from "../../types";

export const atomEntryMode = atom<"login" | "register">("login");

export const atomUser = atom<EntryResponse["success"] | null>(null);
export const atomUserAdmin = atom<EntryResponseAdmin["success"] | null>(null);

export const atomNewDocModalVisible = atom<boolean>(false); 
