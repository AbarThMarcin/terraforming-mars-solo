import steel from '../../../../../assets/images/resources/steel.jpg'
import titan from '../../../../../assets/images/resources/titan.jpg'
import plant from '../../../../../assets/images/resources/plant.jpg'
import card from '../../../../../assets/images/resources/card.jpg'

const FieldBonus = ({ bonus }) => {
   return (
      <>
         {bonus === 'steel' && <img src={steel} className="field-bonus" alt="steel_res"></img>}
         {bonus === 'titan' && <img src={titan} className="field-bonus" alt="titan_res"></img>}
         {bonus === 'plant' && <img src={plant} className="field-bonus" alt="plant_res"></img>}
         {bonus === 'card' && <img src={card} className="field-bonus" alt="card"></img>}
      </>
   )
}

export default FieldBonus
