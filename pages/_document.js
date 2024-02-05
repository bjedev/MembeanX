import {Head, Html, Main, NextScript} from "next/document";
import {useEffect, useState} from "react";

export default function Document() {
    const theme = useState();

    useEffect(() => {
        const theme = localStorage.getItem('theme');
    }, []);

    return (
        <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
