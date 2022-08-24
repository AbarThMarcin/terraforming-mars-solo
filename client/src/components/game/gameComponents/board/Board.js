import BoardTharsis from './BoardTharsis'
import BoardPhobos from './BoardPhobos'
import BoardGanymede from './BoardGanymede'

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
