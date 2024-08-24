'use client';

import "./globals.css";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    import("@line/liff").then((liff) => {
      console.log("LIFF init...");
      liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
        .then(() => {
          console.log("LIFF init succeeded.");
          setLiffObject(liff);
        })
        .catch((error) => {
          console.log("LIFF init failed.");
          setLiffError(error.toString());
        });
    }).catch((error) => {
      console.error("Failed to import LIFF SDK:", error);
    });
  }, []);

  const pageProps = {
    liff: liffObject,
    liffError: liffError,
  };

  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>辞書</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}