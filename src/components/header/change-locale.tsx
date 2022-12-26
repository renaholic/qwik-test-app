import { component$ } from "@builder.io/qwik";
import { changeLocale, $translate as t, useSpeakContext } from "qwik-speak";

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();

  return (
    <div>
      <div>{t("app.changeLocale@@Change locale")}</div>
      {ctx.config.supportedLocales.map((locale) => (
        <button
          onClick$={async () => await changeLocale(locale, ctx)}
          key={locale.lang}
        >
          {locale.lang}
        </button>
      ))}
    </div>
  );
});
