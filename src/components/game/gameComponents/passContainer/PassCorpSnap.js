import { useContext } from 'react'
import { StateGameContext } from '../../Game'

const PassCorpSnap = () => {
   const { stateGame } = useContext(StateGameContext)

   return (
      <div className="pass-corp-snap">
         <div className="pass-corp-snap-logo">LOGO</div>
         <div className="pass-corp-tr">{stateGame.tr}</div>
      </div>
   )
}

export default PassCorpSnap
