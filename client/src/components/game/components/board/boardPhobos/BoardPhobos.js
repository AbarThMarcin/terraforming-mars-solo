import { useContext } from 'react'
import { StateBoardContext } from '../../../../game'
import Field from '../field'

const BoardPhobos = () => {
   const { stateBoard } = useContext(StateBoardContext)
   const field = stateBoard.find((field) => field.name === 'PHOBOS SPACE HAVEN')

   return <div className="board-phobos">{stateBoard.length > 0 && <Field field={field} />}</div>
}

export default BoardPhobos