import BoardTharsis from './boardTharsis/BoardTharsis'
import BoardPhobos from './boardPhobos/BoardPhobos'
import BoardGanymede from './boardGanymede/BoardGanymede'
import BtnCoordinates from '../buttons/BtnCoordinates'
import { useState } from 'react'

const Board = () => {
   const [showCoordinates, setShowCoordinates] = useState(false)
   return (
      <>
         <BoardTharsis showCoordinates={showCoordinates} />
         <BoardPhobos showCoordinates={showCoordinates} />
         <BoardGanymede showCoordinates={showCoordinates} />
         <BtnCoordinates showCoordinates={showCoordinates} setShowCoordinates={setShowCoordinates} />
      </>
   )
}

export default Board
