import { component$ } from '@builder.io/qwik'
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { QwikSpeak } from 'qwik-speak'
import { RouterHead } from './components/router-head/router-head'
import { QwikPartytown } from './components/partytown/partytown'
import './global.css'
import { config, translationFn } from './speak-config'

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
          <QwikPartytown forward={['dataLayer.push']} />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="description" content="Messing around qwik" />
          <link rel="icon" href="/favicon.ico" />
          <script src="/registerSW.js" />
          <link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
            sizes="180x180"
          />
          <link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF" />
          <meta name="theme-color" content="#ffffff" />
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <RouterHead />
        </head>
        <body lang="en">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeak>
  )
})
