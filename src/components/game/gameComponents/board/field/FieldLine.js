const FieldLine = ({ field, lineNo }) => {
   return (
      <div
         className={`
            field-line field-line${lineNo}
            ${field.oceanOnly ? 'field-blue-color' : ''}
            ${field.object === 'city-neutral' ? 'field-transparent-border' : ''}
            ${field.object && field.object !== 'city-neutral' ? 'field-green-color' : ''}
         `}
      ></div>
   )
}

export default FieldLine
