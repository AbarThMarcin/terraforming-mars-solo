import BoardTharsis from './BoardTharsis'
import BoardPhobos from './BoardPhobos'
import BoardGanymede from './BoardGanymede'

const Board = () => {
  return (
    <div className='board center'>
       <BoardTharsis />
       <BoardPhobos />
       <BoardGanymede />
    </div>
  )
}

export default Board