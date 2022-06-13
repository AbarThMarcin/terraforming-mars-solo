import iconMln from '../../../../../assets/images/resources/mln.svg'

const ModalHeader = ({ text, eachText }) => {
   return (
      <div className="header">
         <span className="text center">{text}</span>
         {eachText && (
            <div className="eachText">
               <div className="icon">
                  <img className="center" src={iconMln} alt="icon_mln" />
                  <span className="center">{eachText}</span>
               </div>
               <span>each</span>
            </div>
         )}
      </div>
   )
}

export default ModalHeader
