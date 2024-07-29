
import React from 'react'
import { useState, useEffect } from 'react';
import Button from './Button';
import BetBox from './BetBox.1';

function controller() {

  const [hasWon, setHasWon] = useState(false);
  const [betDirection, setBetDirection] = useState("up");

  const handlePlaceBet = () => {
    setHasWon(!hasWon);
    
  };

  
  useEffect(( ) => {
    console.log(hasWon);
    
  }, [hasWon] )

  return (
    <div className="w-full md:w-[850px] lg:w-[1200px] py-12 mx-auto px-5">
      <Button runFunction = {handlePlaceBet} />
      <BetBox betDirection={betDirection} setBetDirection={setBetDirection} />
    </div>
  )
}

export default controller