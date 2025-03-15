import "@/styles/globals.css";
import Layout from "@/components/layout/layout";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return <SessionProvider><Layout><Component {...pageProps} /></Layout></SessionProvider>;
}
