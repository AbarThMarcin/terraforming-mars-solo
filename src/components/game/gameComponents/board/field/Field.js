import { useContext } from 'react'
import { StateGameContext, StateBoardContext } from '../../../Game'
import city from '../../../../../assets/images/objects/city.png'
import greenery from '../../../../../assets/images/objects/greenery.png'
import FieldBonus from './FieldBonus'
import FieldLine from './FieldLine'
import { TILE_NAMES } from '../../../../../data/board'
import { ACTIONS_BOARD } from '../../../../../util/actionsBoard'
import { ACTIONS_GAME } from '../../../../../util/actionsGame'

const Field = ({ field }) => {
   const { stateGame, dispatchGame } = useContext(StateGameContext)
   const { dispatchBoard } = useContext(StateBoardContext)
   const styles = {
      left:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-height) * 0.1 + (var(--field-width) * 0.537) * ${field.y})`,
      top:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? '50%'
            : `calc(var(--field-height) * 1.48 + (var(--field-height) * 1.61) * ${field.x})`,
      transform:
         field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN'
            ? 'translate(-50%, -50%)'
            : 'translate(0, 0)',
   }

   const handleClickField = () => {
      // If clicked on unavailable field, do nothing
      if (!field.available) return
      // Set field's object to phasePlaceTileData
      dispatchBoard({
         type: ACTIONS_BOARD.SET_OBJECT,
         payload: { x: field.x, y: field.y, name: field.name, obj: stateGame.phasePlaceTileData },
      })
      // Turn phasePlaceTile off
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILE, payload: false })
      dispatchGame({ type: ACTIONS_GAME.SET_PHASE_PLACETILEDATA, payload: null })
   }

   return (
      <div
         className={`
            field-container
            ${stateGame.phasePlaceTile && field.available && 'available'}
            ${stateGame.phasePlaceTile && field.available && 'pointer'}
         `}
         style={styles}
         onClick={handleClickField}
      >
         {/* Border */}
         <FieldLine field={field} lineNo={1} />
         <FieldLine field={field} lineNo={2} />
         <FieldLine field={field} lineNo={3} />
         <FieldLine field={field} lineNo={4} />
         <FieldLine field={field} lineNo={5} />
         <FieldLine field={field} lineNo={6} />
         {/* Data */}
         <div className="field-data center">
            {/* Field Name */}
            {field.name && !field.object && <div className="field-name">{field.name}</div>}
            {/* Field bonus */}
            {field.bonus.length > 0 && !field.object && (
               <div className="field-bonus-container">
                  {field.bonus.map((bonus, idx) => (
                     <FieldBonus key={idx} bonus={bonus} />
                  ))}
               </div>
            )}
            {/* Field Object */}
            {(field.object === TILE_NAMES.CITY || field.object === TILE_NAMES.CITY_NEUTRAL) && (
               <img src={city} className="field-object" alt={TILE_NAMES.CITY}></img>
            )}
            {(field.object === TILE_NAMES.GREENERY ||
               field.object === TILE_NAMES.GREENERY_NEUTRAL) && (
               <img src={greenery} className="field-object" alt={TILE_NAMES}></img>
            )}
         </div>
         {/* Container Extensions */}
         <div className="field-extension field-extension top"></div>
         <div className="field-extension field-extension bottom"></div>
      </div>
   )
}

export default Field
