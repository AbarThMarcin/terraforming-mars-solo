import { RESOURCES, getResIcon } from '../../../../../../../../data/resources'

const LogItemStateResources = ({ state }) => {
   const elements = getResources()

   function getResources() {
      const cards = state.statePlayer.cardsPlayed.filter((card) => card.units.microbe !== 0 || card.units.animal !== 0 || card.units.science !== 0 || card.units.fighter !== 0)
      const resources = cards.map((card) => {
         let resource
         let count
         if (card.units.microbe !== 0) {
            resource = getResIcon(RESOURCES.MICROBE)
            count = card.units.microbe
         } else if (card.units.animal !== 0) {
            resource = getResIcon(RESOURCES.ANIMAL)
            count = card.units.animal
         } else if (card.units.science !== 0) {
            resource = getResIcon(RESOURCES.SCIENCE)
            count = card.units.science
         } else {
            resource = getResIcon(RESOURCES.FIGHTER)
            count = card.units.fighter
         }
         return [card.name, resource, count]
      })
      return resources
   }

   return (
      <div className="state-other-container">
         <div className="state-other-container-title">CARDS WITH RESOURCES{' ('}{elements.length}{')'}</div>
         <ul className="state-other-container-elements">
            {elements.length > 0 ? (
               elements.map((el, idx) => (
                  <li key={idx}>
                     - {el[0]} ({el[2]} <img src={el[1]} alt=''></img>)
                  </li>
               ))
            ) : (
               <li style={{ color: '#777' }}>NO CARDS WITH RESOURCES</li>
            )}
         </ul>
      </div>
   )
}

export default LogItemStateResources
