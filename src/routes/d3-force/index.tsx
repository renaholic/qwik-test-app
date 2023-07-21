import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import * as d3 from 'd3'
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3'

interface Node extends SimulationNodeDatum {
  id: number
  group: string
}

interface Link extends SimulationLinkDatum<Node> {
  value: number
}

const groups = ['A', 'B', 'C', 'D']

const numberOfNodes = 500

const nodes: Node[] = Array(numberOfNodes)
  .fill(1)
  .map((_, i) => ({
    id: i,
    group: groups[Math.floor(Math.random() * groups.length)],
  }))

const links: Link[] = Array(Math.floor(numberOfNodes))
  .fill(1)
  .map((_) => ({
    source: Math.floor(Math.random() * numberOfNodes),
    target: Math.floor(Math.random() * numberOfNodes),
    value: 2,
  }))

function createGraph(container: HTMLDivElement | undefined) {
  if (!container) {
    return {
      destroy: () => {},
    }
  }

  const width = container.clientWidth
  const height = container.clientHeight

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .alphaTarget(0.1) // stay hot
    .velocityDecay(0.1) // low friction
    .force(
      'link',
      d3.forceLink(links).id((d: any) => d.id)
    )
    // .force(
    //   'charge',
    //   d3.forceManyBody().strength((d, i) => (i ? 0 : (-width * 2) / 3))
    // )
    .force('charge', d3.forceManyBody())
    // .force(
    //   'collide',
    //   d3
    //     .forceCollide()
    //     .radius((d: any) => d.r + 1)
    //     .iterations(3)
    // )
    .force('x', d3.forceX())
    .force('y', d3.forceY())

  // Create the SVG container.
  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; max-height: 100%;')

  d3.select(window).on('resize', () => {
    const width = container.clientWidth
    const height = container.clientHeight

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
  })

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value))

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', (d) => color(d.group))

  node.append('title').text((d) => d.id)

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
  })

  // Add a drag behavior.
  node.call(
    d3
      .drag()
      // Reheat the simulation when drag starts, and fix the subject position.
      .on('start', (event) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      })
      // Update the subject (dragged node) position during drag.
      .on('drag', (event) => {
        event.subject.fx = event.x
        event.subject.fy = event.y
      })
      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      .on('end', (event) => {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }) as any
  )

  // d3
  //   .select(container)
  //   .on('touchmove', (event) => event.preventDefault())
  //   .on('pointermove', (event) => {
  //     const [x, y] = d3.pointer(event)
  //     nodes[0].fx = x - width / 2
  //     nodes[0].fy = y - height / 2
  //   }) as any

  //   // When this cell is re-run, stop the previous simulation. (This doesn’t
  //   // really matter since the target alpha is zero and the simulation will
  //   // stop naturally, but it’s a good practice.)
  //   invalidation.then(() => simulation.stop())

  return {
    destroy: () => {
      console.log('clean up!')
    },
    node: svg.node(),
  }
}

export default component$(() => {
  const containerRef = useSignal<HTMLDivElement>()

  useVisibleTask$(({ cleanup, track }) => {
    track(() => containerRef)
    const { destroy, node } = createGraph(containerRef.value)
    cleanup(() => destroy())
  })

  return <div ref={containerRef} class={'w-full flex-grow'} />
})
