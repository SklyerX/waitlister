"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider() {
  return (
    <ProgressBar
      height="2px"
      color="#0AAEEB"
      options={{ showSpinner: true }}
      shallowRouting
    />
  );
}
