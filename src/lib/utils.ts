import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function secureCompare(a: string, b: string) {
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < a.length; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function sleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getDateInReadableFormat(date: Date) {
  const _date = new Date(date);

  return `${_date.toLocaleDateString("en-US", {
    month: "short",
  })} ${_date.getDay()}, ${_date.getFullYear()}`;
}
