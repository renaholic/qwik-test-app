import {
  component$, useBrowserVisibleTask$, useSignal
} from '@builder.io/qwik'
import { DocumentHead } from '@builder.io/qwik-city'
import { DragGesture } from '@use-gesture/vanilla'
import anime from 'animejs'
import { Speak } from 'qwik-speak'
import { twMerge } from 'tailwind-merge'
import { usePageContext } from '../../root'

export const DraggableDiv = component$(() => {
  usePageContext('gesture and animejs')

  const eleRef = useSignal<Element>()

  const isActive = useSignal(false)

  const isGone = useSignal(false)
  // const store = useStore<{
  //   time: null | string
  //   cleanup: NoSerialize<() => void>
  //   animateInstance: NoSerialize<anime.AnimeInstance>
  // }>({
  //   time: null,
  //   cleanup: undefined,
  //   animateInstance: undefined,
  // })

  useBrowserVisibleTask$(async ({ track }) => {
    track(() => eleRef)

    if (!eleRef.value) return

    const gesture = new DragGesture(
      eleRef.value,
      ({
        active,
        movement: [mx, my],
        direction: [xDir],
        velocity: [vx],
      }) => {
        const isFlick = vx > 0.2 // If you flick hard enough it should trigger the card to fly out
        if (!active && isFlick) isGone.value = true // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

        const x = isGone.value
          ? (200 + window.innerWidth) * xDir
          : active
          ? mx
          : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
        const rotate = mx / 100 + (isGone ? xDir * 3 * vx : 0) // How much the card tilts, flicking it harder makes it rotate faster

        const scale = active ? 1.1 : 1 // Active cards lift up a bit

        anime({
          targets: eleRef.value,
          translateX: x,
          translateY: active ? my : 0,
          duration: active ? 0 : 1000,
          elasticity: 600,

          scale,
          rotate,
        })
      },
      {
        axis: 'x',
      }
    )

    return () => gesture.destroy()
  })

  return (
    <div
      ref={eleRef}
      class={twMerge(
        'touch-pan-y select-none',
        'h-9 bg-gray-800',
        'text-2xl text-gray-300',
        'flex items-center justify-center',
        'rounded-md shadow-md'
      )}
    >
      {isActive.value ? <p>I am moving! 🏎️</p> : <p>← Drag Me! →</p>}
    </div>
  )
})

export default component$(() => {
  return (
    <Speak assets={['home']}>
      <a href="https://use-gesture.netlify.app/" target="_blank">
        use-gesture
      </a>
      <a href="https://animejs.com/" target="_blank">
        animejs
      </a>
      <DraggableDiv />
    </Speak>
  )
})

export const head: DocumentHead = {
  title: 'use-gesture and animejs',
}
