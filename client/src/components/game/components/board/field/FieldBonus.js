import { getResIcon, RESOURCES } from '../../../../../data/resources'

const FieldBonus = ({ bonus }) => {
   return (
      <>
         {bonus === RESOURCES.STEEL && <img src={getResIcon(RESOURCES.STEEL)} className="field-bonus" alt="steel_res"></img>}
         {bonus === RESOURCES.TITAN && <img src={getResIcon(RESOURCES.TITAN)} className="field-bonus" alt="titan_res"></img>}
         {bonus === RESOURCES.PLANT && <img src={getResIcon(RESOURCES.PLANT)} className="field-bonus" alt="plant_res"></img>}
         {bonus === RESOURCES.CARD && <img src={getResIcon(RESOURCES.CARD)} className="field-bonus-card" alt="card"></img>}
      </>
   )
}

export default FieldBonus
