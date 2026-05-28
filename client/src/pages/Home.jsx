import React from 'react'
import FeaturedSection from '../components/Landing/FeaturedSection'
import CategorySection from '../components/Landing/CategorySection'
import CityEventsSection from '../components/Landing/CityEventsSection'
import SuggestionsSection from '../components/Landing/SuggestionsSection'

function Home() {
  return (
    <div className="bg-white w-full min-h-screen">
      <FeaturedSection />
      <CategorySection />
      <CityEventsSection />
       {/*<SuggestionsSection /> */}
    </div>
  )
}

export default Home
