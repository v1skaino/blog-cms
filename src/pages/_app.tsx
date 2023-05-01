import { Header } from "@/components/header";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import "../styles/global.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Header />
      <Component {...pageProps} />
    </Fragment>
  );
}
