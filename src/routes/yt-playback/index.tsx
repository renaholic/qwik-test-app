import {
  component$,
  useClientEffect$,
  useSignal,
  useStore,
} from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'
import dayjs from 'dayjs'
import YouTubePlayer from 'youtube-player'
import duration from 'dayjs/plugin/duration'

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
  const location = useLocation()
  const { videoID, videoTimestamp, playAt } = location.query as {
    videoID: string
    videoTimestamp: string
    playAt: string
  }

  const store = useStore({
    videoID: videoID || '',
    videoTimestamp:
      (isNaN(parseInt(videoTimestamp)) ? 0 : parseInt(videoTimestamp)) || 0,
    playAt:
      playAt ||
      (isDev
        ? dayjs().add(45, 'seconds').format('YYYY-MM-DDTHH:mm:ss')
        : dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DDTHH:mm:ss')),
    prompt: '',
  })

  useClientEffect$(() => {
    const { videoID, videoTimestamp, playAt } = store

    if (!videoID || !videoTimestamp || !playAt) return

    const timeOffset = dayjs(new Date(store.playAt)).subtract(
      store.videoTimestamp,
      'seconds'
    )
    const timeDiff = timeOffset.diff(dayjs(), 'milliseconds')
    const player = YouTubePlayer('player', {
      videoId: videoID,

      playerVars: {
        start: timeDiff <= 0 ? Math.abs(Math.floor(timeDiff / 1000)) : 0,
        autoplay: timeDiff <= 0 ? 1 : 0,
        origin: isDev ? 'http://localhost:5173' : 'https://qwik.alepholic.dev',
        enablejsapi: 1,
      },
    })

    if (timeDiff < 0 && Math.abs(timeDiff / 1000) > store.videoTimestamp) {
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
    }, timeDiff)

    return () => {
      player && player.destroy()
      timer && clearTimeout(timer)
    }
  })

  return (
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-3xl flex-col gap-3">
        <form method="get" action="." class="flex flex-col gap-3">
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
              type="submit"
              class="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              GO
            </button>
          </div>
        </form>
        <p>{store.prompt}</p>
        <div id="player" class="self-center" />
      </div>
    </div>
  )
})
