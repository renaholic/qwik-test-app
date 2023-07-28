import {
  $,
  component$,
  QRL,
  useVisibleTask$,
  useOnDocument,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { DocumentHead } from '@builder.io/qwik-city'
import { Gesture } from '@use-gesture/vanilla'
import anime from 'animejs'
import _ from 'lodash'
import { Speak } from 'qwik-speak'
import Toastify from 'toastify-js'
import { usePageContext } from '../../root'

export const SwipeableComponent = component$<{
  onSwipeLeft?: QRL<(ev: Event) => void>
  onSwipeRight?: QRL<(ev: Event) => void>
  onSwipeUp?: QRL<(ev: Event) => void>
  onSwipeDown?: QRL<(ev: Event) => void>
  url: string
}>(({ onSwipeLeft, onSwipeRight, url }) => {
  const imgElement = useSignal<HTMLImageElement>()

  const isGone = useSignal(false)

  useVisibleTask$(async ({ track }) => {
    track(() => imgElement.value)

    if (!imgElement.value) return

    const gesture = new Gesture(
      imgElement.value,
      {
        onDrag: ({
          active: isActive,
          movement: [mx, my],
          direction: [xDir],
          velocity: [vx],
          last: isLast,
          event,
        }) => {
          const isFlick = vx > 0.5 // If you flick hard enough it should trigger the card to fly out
          if (!isActive && isFlick) isGone.value = true // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

          const newX = isGone.value
            ? window.innerWidth * xDir
            : isActive
            ? mx
            : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
          const rotate = isActive ? mx / 100 + (isGone ? xDir * 3 * vx : 0) : 0 // How much the card tilts, flicking it harder makes it rotate faster

          const scale = isActive ? 1.1 : 1 // Active cards lift up a bit
          if (vx > 0 && xDir < 0 && isLast) onSwipeLeft && onSwipeLeft(event)
          if (vx > 0 && xDir > 0 && isLast) onSwipeRight && onSwipeRight(event)

          anime({
            targets: imgElement.value,
            translateX: newX,
            translateY: isActive ? my : 0,
            duration: isActive ? 0 : 1000,
            elasticity: 600,

            scale,
            rotate,

            // complete: ({ completed }) => {},
          })
        },
      },
      {
        drag: {
          eventOptions: {
            passive: true,
          },
        },
      }
    )

    return () => gesture?.destroy()
  })

  return (
    <img
      src={url}
      alt={url}
      class="touch-none select-none rounded-lg object-cover"
      ref={imgElement}
    />
  )
})

export default component$(() => {
  usePageContext('gesture and animejs')

  const images = useStore(
    {
      imagesURL: [] as string[],
      maxLength: 10,
    },
    { deep: true }
  )

  useVisibleTask$(async ({ track }) => {
    track(() => images.imagesURL.length)

    if (images.imagesURL.length < images.maxLength) {
      images.imagesURL.push(`https://picsum.photos/600/500?t=${Math.random()}`)
    }
  })

  const handleSwipeLeft = $(() => {
    Toastify({
      text: 'swipe left',
      position: 'left',
    }).showToast()
    images.imagesURL = _.drop(images.imagesURL)
  })

  const handleSwipeRight = $(() => {
    Toastify({
      text: 'swipe right',
      position: 'right',
    }).showToast()
    images.imagesURL = _.drop(images.imagesURL)
  })

  useOnDocument(
    'keydown',
    $((ev) => {
      const event = ev as KeyboardEvent
      if (event.key === 'ArrowLeft') {
        handleSwipeLeft()
      }
      if (event.key === 'ArrowRight') {
        handleSwipeRight()
      }
    })
  )

  return (
    <Speak assets={['swipe']}>
      <div class="flex h-full flex-col items-center">
        <div class={'mb-3 flex gap-3'}>
          <a href="https://use-gesture.netlify.app/" class="btn rounded-full">
            use-gesture
          </a>

          <a
            href="https://animejs.com/"
            target="_blank"
            class="btn rounded-full"
          >
            animejs
          </a>
        </div>
        <div class="stack mx-auto transition-transform">
          {images.imagesURL.map((url) => (
            <SwipeableComponent
              key={url}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              url={url}
            />
          ))}
        </div>
        <div class="flex w-full justify-center gap-12 py-12">
          <kbd class="kbd" onClick$={handleSwipeLeft}>
            ◀︎
          </kbd>
          <kbd class="kbd" onClick$={handleSwipeRight}>
            ▶︎
          </kbd>
        </div>
      </div>
    </Speak>
  )
})

export const head: DocumentHead = {
  title: 'use-gesture and animejs',
}
