import { useState, useContext } from 'react'
import { StateGameContext, ModalsContext } from '../../../Game'
import ModalConfirmation from '../ModalConfirmation'
import Action from './Action'

const ModalStandardProjects = () => {
   const { modals, setModals } = useContext(ModalsContext)
   const { stateGame } = useContext(StateGameContext)

   return (
      <>
         <div
            className={`modal-other-sp-container full-size ${modals.confirmation && 'hidden'}`}
            onClick={() => setModals({ ...modals, standardProjects: false })}
         >
            <div className="modal-other-sp center" onClick={(e) => e.stopPropagation()}>
               {/* HEADER */}
               <div className="modal-other-sp-header">STANDARD PROJECTS</div>
               {/* CLOSE BUTTON */}
               <div
                  className="modal-other-sp-close-btn"
                  onClick={() => setModals({ ...modals, standardProjects: false })}
               >
                  X
               </div>
               {/* ACTIONS */}
               <Action
                  icon={{ url: '' }}
                  name="SELL PATENT"
                  cost={stateGame.standardProjectsCosts.sellPatent}
                  textConf=""
               />
               <Action
                  icon={{ url: '' }}
                  name="POWER PLANT"
                  cost={stateGame.standardProjectsCosts.powerPlant}
                  textConf="Do you want to build a power plant?"
               />
               <Action
                  icon={{ url: '' }}
                  name="ASTEROID"
                  cost={stateGame.standardProjectsCosts.asteroid}
                  textConf="Do you want to use the asteroid project?"
               />
               <Action
                  icon={{ url: '' }}
                  name="AQUIFER"
                  cost={stateGame.standardProjectsCosts.aquifer}
                  textConf="Do you want to build an aquifer?"
               />
               <Action
                  icon={{ url: '' }}
                  name="GREENERY"
                  cost={stateGame.standardProjectsCosts.greenery}
                  textConf="Do you want to build a greenery?"
               />
               <Action
                  icon={{ url: '' }}
                  name="CITY"
                  cost={stateGame.standardProjectsCosts.city}
                  textConf="Do you want to build a city?"
               />
            </div>
         </div>
      </>
   )
}

export default ModalStandardProjects

// Ogarnac akcje sprzedawanie kart
