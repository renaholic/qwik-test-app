import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister
} from "@builder.io/qwik-city";
import { QwikSpeak } from "qwik-speak";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { config, translationFn } from "./speak-config";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    // <QwikCity>
    //   <head>
    //     <meta charSet="utf-8" />
    //     <RouterHead />
    //   </head>
    //   <body lang="en">
    //     <RouterOutlet />
    //     <ServiceWorkerRegister />
    //   </body>
    // </QwikCity>

    <QwikSpeak config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          {/* <link rel='manifest' href='/manifest.json' /> */}
          <RouterHead />
        </head>
        <body lang="en">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeak>
  );
});
