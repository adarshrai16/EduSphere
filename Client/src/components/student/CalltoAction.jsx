import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <section className="call-to-action">
      <h1>Learn anything, anytime, anywhere</h1>

      <p>
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum
        anim id veniam aliqua proident excepteur commodo do ea.
      </p>

      <div className="cta-buttons">
        <button className="cta-primary">
          Get started
        </button>

        <button className="cta-secondary">
          Learn more
          <img src={assets.arrow_icon} alt="arrow" />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
