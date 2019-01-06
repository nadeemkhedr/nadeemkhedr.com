import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt="Nadeem Khedr"
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%'
          }}
        />
        <p>
          Written by <strong>Nadeem Khedr</strong> citizen of the world, you can
          find me on{' '}
          <a
            href="https://twitter.com/nadeemkhedr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{' '}
          &{' '}
          <a
            href="https://github.com/nadeemkhedr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
