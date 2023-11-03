import { useContext } from 'react'
import { StateGameContext } from '../../../../game'
import FieldBonus from './FieldBonus'
import FieldLine from './FieldLine'
import { assignIconToTileData } from '../../../../../data/board'
import { useSubactionTile } from '../../../../../hooks/useSubactionTile'

const Field = ({ field, showCoordinates }) => {
   const { stateGame } = useContext(StateGameContext)
   const styles = {
      left: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? '50%' : `calc(var(--field-width) * 0.05 + (var(--field-width) * 0.538) * ${field.y})`,
      top: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? '50%' : `calc(var(--field-height) * 1.8 + (var(--field-height) * 1.615) * ${field.x})`,
      transform: field.name === 'GANYMEDE COLONY' || field.name === 'PHOBOS SPACE HAVEN' ? 'translate(-50%, -50%)' : 'translate(0, 0)',
   }

   const { handleClickField } = useSubactionTile(field)

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
            {field.object && <img src={assignIconToTileData(field.object)} className="field-object" alt={field.object}></img>}
         </div>
         {/* Container Extensions */}
         <div className="field-extension field-extension top"></div>
         <div className="field-extension field-extension bottom"></div>
         {/* Coordinates */}
         {showCoordinates && (
            <div className="coordinates">
               (x: {field.x}, y: {field.y})
            </div>
         )}
      </div>
   )
}

export default Field
