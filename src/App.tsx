import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

import styles from './styles.module.css'

const cards = [
  'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  rot: 0,
})
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1, y: 0 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  ` rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, i => ({
    from: from(i),
    ...to(i),
  }))
  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity, distance }) => {
    const dir = xDir < 0 ? -1 : 1
    api.start(i => {
      if (index != i) return
      if (!down && distance > 200)
        gone.add(index)
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? calculateX(mx) : 0 // When a card is gone it flys out left or right, otherwise goes back to zero

      const rot = down ? mx / 15 : isGone ? (200 + window.innerWidth) * dir / 15 : 0
      const scale = 1
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 20, tension: down ? 800 : isGone ? 80 : 500 },
      }
    })

  })

  const calculateX = (x: number) => {
    if (Math.abs(x) > window.innerWidth / 2) {
      if (x < 0) return -window.innerWidth / 2
      if (x > 0) return window.innerWidth / 2
    }
    return x
  }
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)

  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
            }}
          />
        </animated.div>
      ))}
    </>
  )
}

export default function App() {
  return (
    <div className={styles.container}>
      <Deck />
    </div>
  )
}