import {
  Component,
  component$,
  useVisibleTask$,
  useSignal,
} from '@builder.io/qwik'
import Typed from 'typed.js'

export const TypedComponent: Component<{
  strings?: string[]
}> = component$(({ strings = [] }) => {
  const ref = useSignal<HTMLSpanElement>()

  useVisibleTask$(() => {
    if (!ref.value) return
    const typed = new Typed(ref.value, {
      strings,
      // stringsElement: '#typed-strings',
      typeSpeed: 80,
      backDelay: 1000,
      backSpeed: 100,
      loop: true,
      smartBackspace: true,
    })
    return () => typed.destroy()
  })

  return (
    <div>
      {/* <div id="typed-strings">
          <p>
            Typed.js is a <strong>JavaScript</strong> library.
          </p>
          <p>
            It <em>types</em> out sentences.
          </p>
        </div> */}
      <span ref={ref} class={'whitespace-pre'} />
    </div>
  )
})
