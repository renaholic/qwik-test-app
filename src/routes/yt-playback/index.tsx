import {
  component$,
  useClientEffect$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import YouTubePlayer from 'youtube-player'
import type { DocumentHead } from '@builder.io/qwik-city'

export const isDev = import.meta.env.DEV

export const presets = [
  { videoID: 'hAqqAwhfet8', videoTimestamp: 40, label: 'Unicorn' },
  { videoID: 'M2cckDmNLMI', videoTimestamp: 130, label: 'Kick Back' },
]

dayjs.extend(duration)

export const Clock = component$(() => {
  const date = useSignal(new Date())

  useClientEffect$(
    () => {
      const timeout = () =>
        setTimeout(() => {
          date.value = new Date()
          timeout()
        }, Math.floor(Date.now() / 1000) * 1000 + 1000 - Date.now())
      const timer = timeout()
      return () => clearTimeout(timer)
    },
    { eagerness: 'load' }
  )

  return <>{dayjs(date.value).format('YYYY-MM-DD HH:mm:ss')}</>
})

export default component$(() => {
  const store = useStore({
    videoID: '',
    videoTimestamp: 0,
    playAt: isDev
      ? dayjs().add(45, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
      : dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DDTHH:mm:ss'),
    prompt: '',
  })

  return (
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-3xl flex-col gap-3">
        <div class="mt-4 rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Attention needed
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>Please reload when there are existing video player</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            Now is <Clock />
          </div>
          <div class="flex flex-row gap-3">
            {presets.map(({ videoID, videoTimestamp, label }, index) => (
              <button
                key={index}
                type="button"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick$={() => {
                  store.videoID = videoID
                  store.videoTimestamp = videoTimestamp
                }}
              >
                {`Preset: ${label}@${dayjs
                  .duration(videoTimestamp, 'seconds')
                  .format('mm:ss')}`}
              </button>
            ))}
          </div>
          <div>
            Video{' '}
            <input
              type="text"
              name="videoID"
              placeholder="Video ID"
              value={store.videoID}
              onInput$={(ev) =>
                (store.videoID = (ev.target as HTMLInputElement).value)
              }
              class="w-min"
            />
            's{' '}
            <input
              type="number"
              name="videoTimestamp"
              value={store.videoTimestamp}
              onInput$={(ev) =>
                (store.videoTimestamp = (ev.target as HTMLInputElement)
                  .value as unknown as number)
              }
            />{' '}
            second played at
            <input
              type="datetime-local"
              name="playAt"
              value={store.playAt}
              onInput$={(ev) =>
                (store.playAt = (ev.target as HTMLInputElement).value)
              }
            />
            <button
              type="button"
              class="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick$={() => {
                const { videoID, videoTimestamp, playAt } = store
                console.log({ videoID, videoTimestamp, playAt })
                if (!videoID || !videoTimestamp || !playAt) return
                const timeOffset = dayjs(new Date(store.playAt)).subtract(
                  store.videoTimestamp,
                  'seconds'
                )
                const timeDiff = timeOffset.diff(dayjs(), 'milliseconds')
                const player = YouTubePlayer('player', {
                  videoId: videoID,
                  playerVars: {
                    start:
                      timeDiff <= 0 ? Math.abs(Math.floor(timeDiff / 1000)) : 0,
                    autoplay: timeDiff <= 0 ? 1 : 0,
                    origin: isDev
                      ? 'http://localhost:5173'
                      : 'https://qwik.alepholic.dev',
                    enablejsapi: 1,
                  },
                })
                if (
                  timeDiff < 0 &&
                  Math.abs(timeDiff / 1000) > store.videoTimestamp
                ) {
                  store.prompt = `The ship has completely sailed`
                  return
                }
                if (timeDiff < 0) {
                  store.prompt = `The 00:00 ship has sailed, starting at ${dayjs
                    .duration(Math.floor(Math.abs(timeDiff / 1000)), 'seconds')
                    .format('mm:ss')} seconds ahead instead`
                } else {
                  store.prompt = `Video will start at ${timeOffset.format(
                    'YYYY-MM-DDTHH:mm:ss'
                  )}`
                }
                const timer = setTimeout(async () => {
                  await player.playVideo()
                  clearTimeout(timer)
                }, timeDiff)
              }}
            >
              GO
            </button>
          </div>
        </div>
        <p>{store.prompt}</p>
        <div id="player" class="self-center" />
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Youtube Playback Calculator',
  meta: [
    { name: 'description', content: 'Calculate when to play a youtube video' },
  ],
}
