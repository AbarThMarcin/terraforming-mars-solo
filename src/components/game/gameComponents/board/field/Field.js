import city from '../../../../../assets/images/objects/city.png'
import greenery from '../../../../../assets/images/objects/greenery.png'
import FieldBonus from './FieldBonus'
import FieldLine from './FieldLine'

const Field = ({ field }) => {
   const styles = {
      left: `calc(var(--field-height) * 0.1 + (var(--field-width) * 0.537) * ${field.y})`,
      top: `calc(var(--field-height) * 1.48 + (var(--field-height) * 1.61) * ${field.x})`,
   }
   return (
      <div className="board-tharsis-field-container" style={styles}>
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
            {(field.object === 'city-neutral' || field.object === 'city') && (
               <img src={city} className="field-object" alt="city"></img>
            )}
            {field.object === 'greenery' && (
               <img src={greenery} className="field-object" alt="greenery"></img>
            )}
         </div>
      </div>
   )
}

export default Field
