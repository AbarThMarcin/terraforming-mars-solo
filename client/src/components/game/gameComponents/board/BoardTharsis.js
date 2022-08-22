import { useContext } from 'react'
import { StateBoardContext } from '../../Game'
import Field from './field/Field'

const BoardTharsis = () => {
   const { stateBoard } = useContext(StateBoardContext)

   return (
      <div className="board-tharsis full-size">
         {stateBoard.length > 0 &&
            stateBoard
               .filter(
                  (field) => field.name !== 'PHOBOS SPACE HAVEN' && field.name !== 'GANYMEDE COLONY'
               )
               .map((field, idx) => <Field key={idx} field={field} />)}
      </div>
   )
}

export default BoardTharsis
