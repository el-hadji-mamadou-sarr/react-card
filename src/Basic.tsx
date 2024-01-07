import React, { useState } from 'react'
import { useSprings, animated, to as interpolate, useSpring } from '@react-spring/web'
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

function Basic() {
    const [count, setCount] = useState(0);
    const [spring, api] = useSpring(
        () => ({
            from: { opacity: 0 },
            to: { opacity: 1 },
        }),
    )

    const counter = () => {
        setCount(count + 1);
        api.start(() => {
            return {
                opacity: 0.5
            }
        })
    }
    return (
        <div>
            <button onClick={counter}>increment </button>
            <animated.div style={spring}>Hello World</animated.div>
        </div>

    );
}

export default Basic;