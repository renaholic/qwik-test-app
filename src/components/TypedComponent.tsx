import { component$, useSignal, useClientEffect$ } from '@builder.io/qwik'
import Typed from 'typed.js'

export const TypedComponent = component$(({ strings = [] }: { strings?: string[] }) => {
  const ref = useSignal<HTMLSpanElement | undefined>()
  useClientEffect$(
    () => {
      if (!ref.value) return
      const typed = new Typed(ref.value, {
        strings,
        typeSpeed: 80,
        backDelay: 1000,
        backSpeed: 100,
        loop: true,
        smartBackspace: true,
      })
      return () => typed.destroy()
    },
    {
      eagerness: 'visible',
    }
  )
  return <span ref={ref} />
})
