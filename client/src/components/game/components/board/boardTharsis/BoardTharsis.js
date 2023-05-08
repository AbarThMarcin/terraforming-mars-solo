import { useContext } from 'react'
import { StateBoardContext } from '../../../../game'
import Field from '../field'

const BoardTharsis = ({ setTotalVP }) => {
   const { stateBoard } = useContext(StateBoardContext)

   return (
      <div className="board-tharsis full-size">
         {stateBoard.length > 0 &&
            stateBoard
               .filter((field) => field.name !== 'PHOBOS SPACE HAVEN' && field.name !== 'GANYMEDE COLONY')
               .map((field, idx) => <Field key={idx} field={field} setTotalVP={setTotalVP} />)}
      </div>
   )
}

export default BoardTharsis
