import { component$ } from "@builder.io/qwik";
import { changeLocale, useSpeakContext } from "qwik-speak";

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();

  return (
    <div class="flex items-center">
      {ctx.config.supportedLocales.map((locale) => (
        <button
          class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick$={async () => await changeLocale(locale, ctx)}
          key={locale.lang}
        >
          {locale.lang}
        </button>
      ))}
    </div>
  );
});
