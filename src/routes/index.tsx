import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import {
  Speak,
  useTranslate
} from 'qwik-speak';
import { D3 } from '~/integrations/D3';
import MotionOne from '~/integrations/motionOne';
import { TypedComponent } from '../components/TypedComponent';
import { usePageContext } from '../root';

export const Home = component$(() => {
  usePageContext('Home')

  const t = useTranslate();

  const strings = [
    t('home.typed_1@@I go to school by bus.'),
    t('home.typed_2@@I go to school on train.'),
  ]

  return (
    <div>
      <h1 class="text-[2em]">
        {t('home.greetings@@Welcome to Qwik')}{' '}
        <span class="lightning">⚡️</span>
      </h1>

      <TypedComponent
        strings={strings}
      />
      <D3 />

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
