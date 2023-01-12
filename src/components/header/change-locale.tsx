import { component$, useClientEffect$, useSignal } from '@builder.io/qwik'
import { changeLocale, useSpeakContext } from 'qwik-speak'
import { SelectField } from '../Fields'

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext()
  const {
    config: { supportedLocales },
    locale: { lang },
  } = ctx

  const currentLocale = useSignal(lang)
  useClientEffect$(({ track }) => {
    track(() => currentLocale)
    currentLocale.value = lang
  })

  return (
    <SelectField
      value={currentLocale.value}
      onChange$={async ({ target: { value } }) =>
        await changeLocale(
          supportedLocales.find(({ lang }) => lang === value)!,
          ctx
        )
      }
    >
      {ctx.config.supportedLocales.map(({ lang }) => (
        <option value={lang} selected={currentLocale.value === lang}>
          {lang}
        </option>
      ))}
    </SelectField>
  )
})
