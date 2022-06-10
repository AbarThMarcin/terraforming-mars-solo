/* Used to show selected corp */
import { useContext } from 'react'
import { StatePlayerContext } from '../../Game'
import Corp from '../Corp'

const ModalCorp = () => {
   const { statePlayer } = useContext(StatePlayerContext)
   return (
         <Corp corp={statePlayer.corporation} />
   )
}

export default ModalCorp
