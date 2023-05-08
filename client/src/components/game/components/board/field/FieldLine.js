import { TILES } from '../../../../../data/board'

const FieldLine = ({ field, lineNo }) => {
   return (
      <div
         className={`
            field-line field-line${lineNo}
            ${field.oceanOnly && !field.object && 'field-blue-color'}
            ${
               field.object === TILES.CITY_NEUTRAL || field.object === TILES.GREENERY_NEUTRAL || field.object === TILES.OCEAN
                  ? 'field-transparent-border'
                  : field.object && 'field-green-color'
            }
         `}
      ></div>
   )
}

export default FieldLine
