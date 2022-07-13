import { useContext } from 'react'
import { StateBoardContext } from '../../Game'
import Field from './field/Field'

const BoardGanymede = () => {
   const { stateBoard } = useContext(StateBoardContext)
   const field = stateBoard.find((field) => field.name === 'GANYMEDE COLONY')

   return <div className="board-ganymede">{stateBoard.length > 0 && <Field field={field} />}</div>
}

export default BoardGanymede
