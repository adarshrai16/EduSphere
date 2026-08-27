import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className="companies">

      <p>
        Trusted by learners from
      </p>

      <div className="company-logos">

        <img
          src={assets.microsoft_logo}
          alt="Microsoft"
        />

        <img
          src={assets.walmart_logo}
          alt="Walmart"
        />

        <img
          src={assets.accenture_logo}
          alt="Accenture"
        />

        <img
          src={assets.adobe_logo}
          alt="Adobe"
        />

        <img
          src={assets.paypal_logo}
          alt="Paypal"
        />

      </div>

    </div>
  )
}

export default Companies