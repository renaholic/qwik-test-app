import {
  $,
  component$,
  noSerialize,
  NoSerialize,
  QRL,
  useBrowserVisibleTask$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { DocumentHead } from '@builder.io/qwik-city'
import { Gesture } from '@use-gesture/vanilla'
import anime from 'animejs'
import { Speak } from 'qwik-speak'
import { twMerge } from 'tailwind-merge'
import Toastify from 'toastify-js'
import { usePageContext } from '../../root'

export const DraggableDiv = component$(() => {
  const eleRef = useSignal<Element>()

  const isActive = useSignal(false)

  const isGone = useSignal(false)

  const store = useStore<{
    gesture: NoSerialize<Gesture>
  }>({
    gesture: undefined,
  })

  useBrowserVisibleTask$(async ({ track }) => {
    track(() => eleRef)

    const ele = eleRef.value

    if (!ele) return

    store.gesture = noSerialize(
      new Gesture(ele, {
        onDrag: ({
          active: isActive,
          movement: [mx, my],
          direction: [xDir],
          velocity: [vx],
          last: isLast,
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

          if (isGone.value && isLast) {
            Toastify({
              text: 'Bye',
              duration: 3000,
              close: true,
              gravity: 'top', // `top` or `bottom`
              position: 'left', // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
            }).showToast()
          }
          anime({
            targets: ele,
            translateX: newX,
            translateY: isActive ? my : 0,
            duration: isActive ? 0 : 1000,
            elasticity: 600,

            scale,
            rotate,

            complete: ({ completed }) => {
              if (isGone && completed && isLast) {
                setTimeout(() => {
                  anime({
                    targets: ele,
                    translateX: 0,
                    translateY: 0,
                    duration: 1000,
                    elasticity: 600,
                    easing: 'spring(1, 80, 10, 0)',
                    rotate: 0,
                    scale,
                  })
                  isGone.value = false
                  Toastify({
                    text: 'I am back!',
                    duration: 3000,
                    close: true,
                    gravity: 'top', // `top` or `bottom`
                    position: 'left', // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                  }).showToast()
                }, 1000)
              }
            },
          })
        },
      })
    )

    return () => store.gesture?.destroy()
  })

  return (
    <div
      ref={eleRef}
      class={twMerge(
        'touch-pan-y select-none',
        'bg-gray-800 py-9',
        'text-2xl text-gray-300',
        'flex items-center justify-center',
        'rounded-md shadow-md'
      )}
    >
      {isActive.value ? <p>I am moving! 🏎️</p> : <p>← Drag Me! →</p>}
    </div>
  )
})

export const SwipeableComponent = component$<{
  onSwipeLeft?: QRL<(ev: Event) => void>
  onSwipeRight?: QRL<(ev: Event) => void>
  onSwipeUp?: QRL<(ev: Event) => void>
  onSwipeDown?: QRL<(ev: Event) => void>
  url: string
}>(({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, url }) => {
  const imgElement = useSignal<HTMLImageElement>()

  const isGone = useSignal(false)

  useBrowserVisibleTask$(async ({ track }) => {
    track(() => imgElement.value)

    if (!imgElement.value) return

    const gesture = new Gesture(imgElement.value, {
      onDrag: ({
        active: isActive,
        movement: [mx, my],
        direction: [xDir],
        velocity: [vx, vy],
        last: isLast,
        event,
      }) => {
        const isFlick = vx > 0.5 // If you flick hard enough it should trigger the card to fly out
        if (!isActive && isFlick) isGone.value = true // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

        const newX = isGone.value ? window.innerWidth * xDir : isActive ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
        const rotate = isActive ? mx / 100 + (isGone ? xDir * 3 * vx : 0) : 0 // How much the card tilts, flicking it harder makes it rotate faster

        if (vx > 0 && isLast) onSwipeLeft && onSwipeLeft(event)
        if (vx < 0 && isLast) onSwipeRight && onSwipeRight(event)

        const scale = isActive ? 1.1 : 1 // Active cards lift up a bit

        anime({
          targets: imgElement.value,
          translateX: newX,
          translateY: isActive ? my : 0,
          duration: isActive ? 0 : 1000,
          elasticity: 600,

          scale,
          rotate,

          complete: ({ completed }) => {
            if (isGone && completed && isLast) {
              setTimeout(() => {
                anime({
                  targets: imgElement.value,
                  translateX: 0,
                  translateY: 0,
                  duration: 1000,
                  elasticity: 600,
                  easing: 'spring(1, 80, 10, 0)',
                  rotate: 0,
                  scale,
                })
                isGone.value = false
                Toastify({
                  text: 'I am back!',
                  duration: 3000,
                  close: true,
                  gravity: 'top', // `top` or `bottom`
                  position: 'left', // `left`, `center` or `right`
                  stopOnFocus: true, // Prevents dismissing of toast on hover
                }).showToast()
              }, 1000)
            }
          },
        })
      },
    })

    return () => gesture?.destroy()
  })

  return (
    <>
      <img
        ref={imgElement}
        src={url}
        alt={url}
        class="touch-none select-none object-cover"
      />
    </>
  )
})

export default component$(() => {
  usePageContext('gesture and animejs')

  const images = useStore({ imagesURL: [] as string[], counter: 0 })

  useBrowserVisibleTask$(async ({ track }) => {
    track(() => images.imagesURL)

    if (images.imagesURL.length < 5) {
      Toastify({
        text: 'image inventory low',
      })
    }
  })

  const handleSwipeLeft = $((ev: Event) => {
    Toastify({
      text: 'swipe left',
      position: 'left',
    }).showToast()
  })

  const handleSwipeRight = $((ev: Event) => {
    Toastify({
      text: 'swipe right',
      position: 'right',
    }).showToast()
  })

  return (
    <Speak assets={['swipe']}>
      <div class={'mb-3 flex gap-3'}>
        <a href="https://use-gesture.netlify.app/" class="btn rounded-full">
          use-gesture
        </a>

        <a href="https://animejs.com/" target="_blank" class="btn rounded-full">
          animejs
        </a>
      </div>
      <div class="stack">
        {images.imagesURL.map((url) => (
          // <img src={ url } alt={ url } class="object-cover" />
          <SwipeableComponent
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            url={url}
          />
        ))}

        {/* <DraggableDiv />
        <DraggableDiv />
        <DraggableDiv />
        <DraggableDiv /> */}
        {/* <div class="card w-36 border border-base-content bg-base-100 text-center">
          <div class="card-body">A</div>
        </div>
        <div class="card w-36 border border-base-content bg-base-100 text-center">
          <div class="card-body">B</div>
        </div>
        <div class="card w-36 border border-base-content bg-base-100 text-center">
          <div class="card-body">C</div>
        </div> */}
      </div>
    </Speak>
  )
})

export const head: DocumentHead = {
  title: 'use-gesture and animejs',
}
