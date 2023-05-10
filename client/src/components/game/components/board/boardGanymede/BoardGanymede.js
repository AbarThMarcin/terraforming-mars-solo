import { useContext } from 'react'
import { StateBoardContext } from '../../../../game'
import Field from '../field'

const BoardGanymede = ({ showCoordinates }) => {
   const { stateBoard } = useContext(StateBoardContext)
   const field = stateBoard.find((field) => field.name === 'GANYMEDE COLONY')

   return <div className="board-ganymede">{stateBoard.length > 0 && <Field field={field} showCoordinates={showCoordinates} />}</div>
}

export default BoardGanymede
