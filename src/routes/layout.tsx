import { component$, Slot } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import Header from "../components/header/header";
import { config } from "../speak-config";

export const onRequest: RequestHandler = ({ request, response }) => {
  const acceptLanguage = request.headers?.get("accept-language");

  let lang: string | null = null;
  // Try to use user language
  if (acceptLanguage) {
    lang = acceptLanguage.split(";")[0]?.split(",")[0];
  }

  // Set locale in response
  response.locale = lang || config.defaultLocale.lang;
};

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
