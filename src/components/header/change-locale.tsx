import { component$, useBrowserVisibleTask$, useSignal } from '@builder.io/qwik'
import { changeLocale, useSpeakContext } from 'qwik-speak'
import { twMerge } from 'tailwind-merge'

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext()
  const {
    config: { supportedLocales },
    locale: { lang },
  } = ctx

  const currentLocale = useSignal(lang)

  useBrowserVisibleTask$(({ track }) => {
    track(() => currentLocale)
    currentLocale.value = lang
  })

  return (
    <div class={twMerge('form-control')}>
      <select
        value={currentLocale.value}
        onChange$={async ({ target: { value } }) =>
          await changeLocale(
            supportedLocales.find(({ lang }) => lang === value)!,
            ctx
          )
        }
        class={twMerge('select w-full max-w-xs', 'pr-8')}
      >
        {ctx.config.supportedLocales.map(({ lang }) => (
          <option
            value={lang}
            selected={currentLocale.value === lang}
            key={lang}
          >
            {lang}
          </option>
        ))}
      </select>
    </div>
  )
})
