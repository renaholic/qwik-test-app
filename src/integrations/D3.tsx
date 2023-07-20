function createGraph(container: HTMLDivElement | undefined, symbols: any[]) {
  if (!container) {
    return {
      destroy: () => {},
    }
  }

  const width = 640
  const height = 400
  const marginTop = 20
  const marginRight = 20
  const marginBottom = 30
  const marginLeft = 40
  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleUtc()
    .domain([new Date('2023-01-01'), new Date('2024-01-01')])
    .range([marginLeft, width - marginRight])
  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop])

  // Create the SVG container.
  // const svg = d3.create('svg').attr('width', width).attr('height', height)
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Add the x-axis.
  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x))
  // Add the y-axis.
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
  // Return the SVG element.
  // return svg.node()

  return {
    destroy: () => {
      console.log('clean up!')
    },
    node: svg.node(),
  }
}

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import * as d3 from 'd3'

export const D3 = component$(() => {
  const containerRef = useSignal<HTMLDivElement>()

  useVisibleTask$(({ cleanup }) => {
    const { destroy } = createGraph(containerRef.value, [])
    cleanup(() => destroy())
  })

  return <div ref={containerRef} />
})
