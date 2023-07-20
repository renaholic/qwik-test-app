import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { $translate as t, Speak } from 'qwik-speak'
import { TypedComponent } from '../components/TypedComponent'
import { usePageContext } from '../root'
import MotionOne from '~/integrations/motionOne'

export const Home = component$(() => {
  usePageContext('Home')

  return (
    <div>
      <h1 class="text-[2em]">
        {t('home.greetings@@Welcome to Qwik')}{' '}
        <span class="lightning">⚡️</span>
      </h1>

      <TypedComponent
        strings={[
          t('home.typed_1@@I go to school by bus.'),
          t('home.typed_2@@I go to school on train.'),
        ]}
      />

      <MotionOne />
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
