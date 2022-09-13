import React, { useEffect, useRef } from 'react'

import Code from '../Code'
import Demo from '../Demo'
import Panzoom, { PanzoomObject } from '../../src/panzoom'

const code = (
  <Code>{`\
const panzoom = Panzoom(elem)
const panzoom2 = Panzoom(child, {
  setTransform: (elem, { x, y, scale }) => {
    // Adjust the panning according to the parent's scale
    const parentScale = panzoom.getScale()
    panzoom2.setStyle(
      'transform',
      \`scale(\${scale}) translate(\${x / parentScale}px, \${y / parentScale}px)\`
    )
  }
})
function adjustScale(zoomIn: boolean) {
  const oldScale = panzoom.getScale()
  if (zoomIn) {
    panzoom.zoomIn()
  } else {
    panzoom.zoomOut()
  }
  const newScale = panzoom.getScale()
  const pan = panzoom2.getPan()
  // Adjust child starting X/Y according the new scale for panning
  panzoom2.pan((pan.x / oldScale) * newScale, (pan.y / oldScale) * newScale, {
    animate: true
  })
}
zoomInButton.addEventListener('click', () => adjustScale(true))
zoomOutButton.addEventListener('click', () => adjustScale(false))
`}</Code>
)

export default function PanzoomWithinPanzoom() {
  const elem = useRef<HTMLDivElement>(null)
  const elemTwo = useRef<HTMLDivElement>(null)
  const panzoomRef = useRef<PanzoomObject>(null)
  const panzoom2Ref = useRef<PanzoomObject>(null)
  let panzoom = panzoomRef.current
  let panzoom2 = panzoom2Ref.current
  useEffect(() => {
    panzoom = panzoomRef.current = Panzoom(elem.current)

    elem && elem.current.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)


    panzoom2 = panzoom2Ref.current = Panzoom(elemTwo.current, {
      contain: 'inside',

      setTransform: (
        _elem: HTMLElement,
        {

          x, y,

          scale,
        }
          : {
            x: number; y: number;
            scale: number,

          }
      ) => {
        const parentScale = panzoom.getScale()




        panzoom2 && panzoom2.setStyle(
          'transform',
          `scale(${scale}) translate(${x / parentScale}px, ${y / parentScale}px)`
        )
      }
    })
  }, [])

  function adjustScale(zoomIn: boolean) {
    const oldScale = panzoom.getScale()
    if (zoomIn) {
      panzoom.zoomIn()
    } else {
      panzoom.zoomOut()
    }
    const newScale = panzoom.getScale()
    const pan = panzoom2.getPan()
    panzoom2.pan((pan.x / oldScale) * newScale, (pan.y / oldScale) * newScale, {
      animate: true
    })
  }
  return (
    <Demo
      title="A Panzoom instance within another Panzoom instance"
      subtitle="With no zooming, this is trivial. However, if you want the parent to zoom, you must account for the parent's scale to pan the child element properly."
      code={code}
    >
      <div className="buttons">
        <button onClick={() => adjustScale(true)}>Zoom In</button>
        <button onClick={() => adjustScale(false)}>Zoom Out</button>
        <button
          onClick={() => {
            panzoom.reset()
            panzoom2.reset()
          }}
        >
          Reset
        </button>
      </div>
      <div className="panzoom-parent">
        <div
          className="panzoom"
          ref={elem}
          style={{

          }}
        >
          <div
            className='elemTwo'
            ref={elemTwo}

          >

          </div>
          <img style={{ width: '100%', height: '100%' }} src="awesome_tiger.svg" />
        </div>
      </div>
    </Demo>
  )
}
