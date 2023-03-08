import { component$, useBrowserVisibleTask$, useSignal } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { isBrowser } from '@builder.io/qwik/build'
import { DragGesture } from '@use-gesture/vanilla'
import { $translate as t, Speak } from 'qwik-speak'
import { TypedComponent } from '../components/TypedComponent'
import { usePageContext } from '../root'
import anime from 'animejs'

export const Home = component$(() => {
  usePageContext('Home')

  const header = useSignal<Element>()

  const isActive = useSignal(false)

  useBrowserVisibleTask$(async () => {
    if (isBrowser && header.value) {
      const gesture = new DragGesture(
        header.value,
        ({ active, movement: [mx, my] }) => {
          isActive.value = active
          anime({
            targets: header.value,
            translateX: active ? mx : 0,
            translateY: active ? my : 0,
            duration: active ? 0 : 1000,
          })
        },
        {
          axis: 'x',
        }
      )
      return () => gesture.destroy()
    }
  })

  return (
    <div>
      <h1 class="touch-pan-y select-none text-[2em]" ref={header}>
        {isActive.value ? (
          <>Thanks animejs and @use-gesture!</>
        ) : (
          <>
            {t('home.greetings@@Welcome to Qwik')}{' '}
            <span class="lightning">⚡️</span>
          </>
        )}
      </h1>
      <img src="https://http.cat/200" alt="200" />

      <TypedComponent
        strings={[
          t('home.typed_1@@I go to school by bus.'),
          t('home.typed_2@@I go to school on train.'),
        ]}
      />

      {/* <div class="flex flex-col gap-3">
        <Link class="mindblow" href="/flower">
          Blow my mind 🤯
        </Link>

        <Link class="mindblow" href="/yt-playback">
          Youtube Playback Calculator
        </Link>

        <Link class="mindblow" href="/login">
          Login
        </Link>
      </div> */}
    </div>
  )
})

export default component$(() => {
  return (
    <Speak assets={['home']}>
      <Home />
    </Speak>
  )
})

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
}
