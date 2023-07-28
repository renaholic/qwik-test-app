import { component$, $, useContext, useStyles$ } from '@builder.io/qwik'
import { SunAndMoon } from './sun-and-moon'
import themeToggle from './theme-toggle.css?inline'
import { GlobalStore } from '../../context'
import { themeStorageKey } from './theme-script'

export type ThemePreference = 'dark' | 'light'

export const colorSchemeChangeListener = (
  onColorSchemeChange: (isDark: boolean) => void
) => {
  const listener = ({ matches: isDark }: MediaQueryListEvent) => {
    onColorSchemeChange(isDark)
  }
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => listener(event))

  return () =>
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', listener)
}

export const setPreference = (theme: ThemePreference) => {
  localStorage.setItem(themeStorageKey, theme)
  reflectPreference(theme)
}

export const reflectPreference = (theme: ThemePreference) => {
  document.firstElementChild?.setAttribute('data-theme', theme)
}

export const getColorPreference = (): ThemePreference => {
  if (localStorage.getItem(themeStorageKey)) {
    return localStorage.getItem(themeStorageKey) as ThemePreference
  } else {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
}

export const ThemeToggle = component$(() => {
  useStyles$(themeToggle)
  const state = useContext(GlobalStore)

  const onClick$ = $(() => {
    console.log(state.theme)
    state.theme = state.theme === 'light' ? 'dark' : 'light'
    console.log(state.theme)

    setPreference(state.theme)
  })

  return (
    <>
      <button
        type="button"
        class="theme-toggle hidden lg:block"
        id="theme-toggle"
        title="Toggles light & dark"
        aria-label={state.theme}
        aria-live="polite"
        onClick$={onClick$}
      >
        <SunAndMoon />
      </button>
      <button onClick$={onClick$} class="lg:hidden">
        {state.theme === 'light' ? 'Dark' : 'Light'} theme
      </button>
    </>
  )
})
