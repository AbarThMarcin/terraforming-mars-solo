import { useContext } from 'react'
import { StateBoardContext } from '../../../../game'
import Field from '../field'

const BoardPhobos = ({ showCoordinates }) => {
   const { stateBoard } = useContext(StateBoardContext)
   const field = stateBoard.find((field) => field.name === 'PHOBOS SPACE HAVEN')

   return <div className="board-phobos">{stateBoard.length > 0 && <Field field={field} showCoordinates={showCoordinates} />}</div>
}

export default BoardPhobos
