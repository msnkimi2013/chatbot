import React from 'react'
import BetButton from './BetButton'

type Props = {
  betDirection: string;
  setBetDirection: any;
}

function BetBox({betDirection, setBetDirection}: Props) {
  return (
    <div className="mt-5">
        <div className="py-2 border bg-red-100">LAYER 1</div>
        <div className="flex flex-row justify-between py-2 border">
            <BetButton 
              direction="down" 
              betDirection={betDirection} 
              setBetDirection={setBetDirection} 
            />
            <BetButton 
              direction="up"
              betDirection={betDirection} 
              setBetDirection={setBetDirection} 
            />
            <div></div>
        </div>
        <div className="py-2 border bg-fuchsia-100">LAYER 3</div>
    </div>
  )
}

export default BetBox