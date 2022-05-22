import { useContext } from 'react'
import { StateGameContext, ModalsContext } from '../Game'
import icon_mln from '../../../assets/images/resources/mln.png'
import { hasTag } from '../../../util/misc'
import { getTagIcon, TAGS } from '../../../data/tags'
import { REQUIREMENTS } from '../../../data/requirements'
import { RESOURCES } from '../../../data/resources'
import tempIcon from '../../../assets/images/other/tempIcon.png'
import oxIcon from '../../../assets/images/other/oxIcon.png'
import oceanIcon from '../../../assets/images/objects/ocean.png'

const Card = ({ card, isBig }) => {
   const { modals } = useContext(ModalsContext)
   const { requirementsMet } = useContext(StateGameContext)
   // If card is playable (all requirements met)
   const available = requirementsMet(card)

   // If requirement to be shown on card
   const showRequirement = (req) => {
      return (
         req.type === REQUIREMENTS.TEMPERATURE ||
         req.type === REQUIREMENTS.OXYGEN ||
         req.type === REQUIREMENTS.OCEAN ||
         req.type === REQUIREMENTS.TAGS ||
         req.other === RESOURCES.STEEL ||
         req.other === RESOURCES.TITAN ||
         req.type === REQUIREMENTS.ECOLOGICAL_ZONE ||
         req.type === REQUIREMENTS.RAD_SUITS
      )
   }

   const getTempOrOxText = (req) => {
      return `${req.other === 'max' ? 'max ' : ''}${req.value}${
         req.type === REQUIREMENTS.TEMPERATURE ? '°C ' : '% '
      }`
   }
   const getOceanText = (req) => {
      return `${req.other === 'max' ? 'max ' : ''}${req.value > 2 ? req.value : ''}`
   }
   const oceansCount = (v) => {
      let arr = []
      for (let i = 0; i < v; i++) {
         arr.push(i)
      }
      return arr
   }

   // Card disabled (greyed out; new layer with half opacity is shown) only when
   // requirements are not met, we are in the cards in hand modal
   // (but a card is not clicked because then both modals:
   // cards and cardWithAction are shown [cards = display-none])
   // and we are not in draft phase
   const disabled =
      !available &&
      modals.cards &&
      modals.modalCardsType === 'Cards In Hand' &&
      !modals.cardWithAction &&
      !modals.draft

   // Cursor is pointer when over card only when: card is small (draft, sellCard and
   // cardsPlayer/cardsInHand) AND when a card is not clicked because then
   // both modals: cards and cardWithAction are shown [cards = display-none]
   const pointer =
      (modals.draft || modals.sellCards || modals.cards) &&
      !modals.cardWithAction &&
      !modals.cardViewOnly

   return (
      <>
         <div
            className={`
            card full-size
            ${pointer && 'pointer'}
            ${
               hasTag(card, TAGS.EVENT)
                  ? 'card-bg-red'
                  : card.effect !== null || card.iconNames.action !== null || card.id === 173
                  ? 'card-bg-blue'
                  : 'card-bg-green'
            }
         `}
         >
            {/* BLACK INSET BORDER */}
            <div className="black-border">
               {/* NAME */}
               <div
                  className={`
                     name ${
                        hasTag(card, TAGS.EVENT)
                           ? 'card-bg-red'
                           : card.effect !== null ||
                             card.iconNames.action !== null ||
                             card.id === 173
                           ? 'card-bg-blue'
                           : 'card-bg-green'
                     }
                     ${card.name.length >= 24 ? 'long' : card.name.length >= 21 ? 'mid-long' : ''}
                  `}
               >
                  <span>{card.name}</span>
               </div>
               {/* DESCRIPTION */}
               {isBig && <div className="description">{card.description}</div>}
            </div>
            {/* CURRENT COST */}
            <div className="current-cost">
               <img className="center full-size" src={icon_mln} alt="" />
               <span className="center">{card.currentCost}</span>
            </div>
            {/* ORIGINAL COST */}
            {card.originalCost !== card.currentCost && (
               <div className="original-cost">
                  <img className="center full-size" src={icon_mln} alt="" />
                  <span className="center">{card.originalCost}</span>
               </div>
            )}
            {/* TAGS */}
            {card.tags.length > 0 && (
               <div className="tags">
                  {card.tags.map((tag, idx) => (
                     <div key={idx} className="tag">
                        <img src={getTagIcon(tag)} alt="" />
                     </div>
                  ))}
               </div>
            )}
            {/* REQUIREMENTS */}
            {card.requirements.map(
               (req, idx) =>
                  showRequirement(req) && (
                     <div key={idx} className={`req ${req.other === 'max' ? 'max' : ''}`}>
                        {/* // Temperature & Oxygen */}
                        {(req.type === REQUIREMENTS.TEMPERATURE ||
                           req.type === REQUIREMENTS.OXYGEN) && (
                           <>
                              <div className='text'>{getTempOrOxText(req)}</div>
                              <div>
                                 {req.type === REQUIREMENTS.TEMPERATURE ? (
                                    <img src={tempIcon} alt="temperature_icon" />
                                 ) : (
                                    <img src={oxIcon} alt="oxygen_icon" />
                                 )}
                              </div>
                           </>
                        )}
                        {/* Oceans */}
                        {req.type === REQUIREMENTS.OCEAN && (
                           <>
                              {getOceanText(req) && <div className='text'>{getOceanText(req)}</div>}
                              <div>
                                 {req.value > 2 ? (
                                    <img src={oceanIcon} alt="ocean_icon" />
                                 ) : (
                                    oceansCount(req.value).map((_, idx) => (
                                       <img key={idx} src={oceanIcon} alt="ocean_icon" />
                                    ))
                                 )}
                              </div>
                           </>
                        )}
                     </div>
                  )
            )}
         </div>
         {disabled && <div className="card-disabled full-size pointer"></div>}
      </>
   )
}

export default Card
