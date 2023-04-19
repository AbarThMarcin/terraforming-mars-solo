import BoardTharsis from './boardTharsis/BoardTharsis'
import BoardPhobos from './boardPhobos/BoardPhobos'
import BoardGanymede from './boardGanymede/BoardGanymede'

const Board = ({ setTotalVP }) => {
   return (
      <>
         <BoardTharsis setTotalVP={setTotalVP} />
         <BoardPhobos />
         <BoardGanymede />
      </>
   )
}

export default Board
