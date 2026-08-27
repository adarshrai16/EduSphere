import React from 'react'
import { assets } from '../../assets/assets'

const CalltoAction = () => {
  return (
    <div className="call-to-action">

      <h1>
        Learn anything, anytime, anywhere
      </h1>

      <p>
        Incididunt sint fugiat pariatur cupidata consectetur sit cillum
        anim id veniam aliqua proident excepteur commodo do ea.
      </p>

      <div className="cta-buttons">

        <button className="get-started-btn">
          Get started
        </button>

        <button className="learn-more-btn">
          Learn more
          <img
            src={assets.arrow_icon}
            alt="arrow_icon"
          />
        </button>

      </div>

    </div>
  )
}

export default CalltoAction