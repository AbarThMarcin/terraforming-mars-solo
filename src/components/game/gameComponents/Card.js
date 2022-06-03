import { useContext, useState } from 'react'
import { StateGameContext, ModalsContext } from '../Game'
import { hasTag } from '../../../util/misc'
import { getTagIcon, TAGS } from '../../../data/tags'
import { REQUIREMENTS } from '../../../data/requirements'
import { getResIcon, RESOURCES } from '../../../data/resources'
import { getVpIcon } from '../../../data/vp'
import { getImmEffectIcon } from '../../../data/immEffects/immEffectsIcons'
import icon_mln from '../../../assets/images/resources/mln.svg'
import tempIcon from '../../../assets/images/other/tempIcon.svg'
import oxIcon from '../../../assets/images/other/oxIcon.svg'
import oceanIcon from '../../../assets/images/objects/ocean.svg'
import greenery from '../../../assets/images/objects/greenery.svg'
import cityAnyIcon from '../../../assets/images/other/cityAny.svg'
import cardBgGreen from '../../../assets/images/card/card-bg-green.svg'
import cardBgBlue from '../../../assets/images/card/card-bg-blue.svg'
import cardBgRed from '../../../assets/images/card/card-bg-red.svg'

const Card = ({ card, isBig }) => {
   const [info, setInfo] = useState(false)
   const { modals } = useContext(ModalsContext)
   const { requirementsMet } = useContext(StateGameContext)
   // If card is playable (all requirements met)
   const available = requirementsMet(card)
   const immEffectIcon = getImmEffectIcon(card.id)

   // If requirement to be shown on card
   const showRequirement = (req) => {
      return (
         req.type === REQUIREMENTS.TEMPERATURE ||
         req.type === REQUIREMENTS.OXYGEN ||
         req.type === REQUIREMENTS.OCEAN ||
         (req.type === REQUIREMENTS.TAGS &&
            req.other !== TAGS.MICROBE &&
            req.other !== TAGS.ANIMAL) ||
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
   const elementsCount = (v) => {
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
            card full-size ${disabled && 'disabled'}
            ${pointer && 'pointer'}
            ${
               hasTag(card, TAGS.EVENT)
                  ? 'card-bg-red'
                  : card.effect !== null || card.iconNames.action !== null || card.id === 173 // Protected Habitats
                  ? 'card-bg-blue'
                  : 'card-bg-green'
            }
         `}
         >
            {/* BLACK INSET BORDER */}
            <div className="black-border">
               {/* BACKGROUND */}
               {hasTag(card, TAGS.EVENT) ? (
                  <img className='full-size center' src={cardBgRed} alt="card_bg_red" />
               ) : card.effect !== null || card.iconNames.action !== null || card.id === 173 ? (
                  <img className='full-size center' src={cardBgBlue} alt="card_bg_blue" />
               ) : (
                  <img className='full-size center' src={cardBgGreen} alt="card_bg_green" />
               )}
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
               {/* EFFECT */}
               {immEffectIcon && (
                  <div className="effect">
                     <img src={immEffectIcon} alt={`immEffectIcon_for_${card.name}`} />
                  </div>
               )}
               {/* DESCRIPTION */}
               {isBig && (
                  <div className={`description ${card.iconNames.vp && 'with-vp'}`}>
                     {card.description}
                  </div>
               )}
               {/* VP */}
               {card.iconNames.vp && (
                  <div className="vp-container">
                     <img
                        src={getVpIcon(card.iconNames.vp)}
                        className="vp"
                        alt={card.iconNames.vp}
                     />
                  </div>
               )}
               {isBig && (
                  <>
                     {/* CARD INFO SECTION */}
                     {info && (
                        <div className="info-section pointer">
                           {card.info.map((inf, idx) => (
                              <span key={idx}>{inf}</span>
                           ))}
                        </div>
                     )}
                     {/* CARD INFO BUTTON */}
                     <div className="info-btn pointer" onClick={() => setInfo((info) => !info)}>
                        <span>{info ? 'X' : '!'}</span>
                     </div>
                  </>
               )}
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
            {/* CARD ID */}
            {isBig && (
               <div className="id">
                  <span>{`#${card.id}`}</span>
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
                              <div className="text">{getTempOrOxText(req)}</div>
                              {req.type === REQUIREMENTS.TEMPERATURE ? (
                                 <img className="icon" src={tempIcon} alt="temperature_icon" />
                              ) : (
                                 <img className="icon" src={oxIcon} alt="oxygen_icon" />
                              )}
                           </>
                        )}
                        {/* Oceans */}
                        {req.type === REQUIREMENTS.OCEAN && (
                           <>
                              {getOceanText(req) && <div className="text">{getOceanText(req)}</div>}
                              {req.value > 2 ? (
                                 <img className="icon" src={oceanIcon} alt="ocean_icon" />
                              ) : (
                                 elementsCount(req.value).map((_, idx) => (
                                    <img
                                       className="icon"
                                       key={idx}
                                       src={oceanIcon}
                                       alt="ocean_icon"
                                    />
                                 ))
                              )}
                           </>
                        )}
                        {/* Tags */}
                        {req.type === REQUIREMENTS.TAGS && card.id !== 135 && (
                           <>
                              {req.value > 2 && <div className="text">{req.value}</div>}
                              {req.value > 2 ? (
                                 <img
                                    className="icon"
                                    src={getTagIcon(req.other)}
                                    alt={`${req.other}_icon`}
                                 />
                              ) : (
                                 elementsCount(req.value).map((_, idx) => (
                                    <img
                                       className="icon"
                                       key={idx}
                                       src={getTagIcon(req.other)}
                                       alt={`${req.other}_icon`}
                                    />
                                 ))
                              )}
                           </>
                        )}
                        {card.id === 135 && req.other === TAGS.PLANT && (
                           <>
                              <img className="icon" src={getTagIcon(TAGS.PLANT)} alt="plant_icon" />
                              <img
                                 className="icon"
                                 src={getTagIcon(TAGS.MICROBE)}
                                 alt="microbe_icon"
                              />
                              <img
                                 className="icon"
                                 src={getTagIcon(TAGS.ANIMAL)}
                                 alt="animal_icon"
                              />
                           </>
                        )}
                        {/* Steel / Titan production */}
                        {req.other === RESOURCES.STEEL && (
                           <>
                              <img
                                 className="icon"
                                 src={getResIcon(RESOURCES.PROD_BG)}
                                 alt="prod_bg"
                              />
                              <img
                                 src={getResIcon(RESOURCES.STEEL)}
                                 className="icon-res center"
                                 alt="steel_resource"
                              />
                           </>
                        )}
                        {req.other === RESOURCES.TITAN && (
                           <>
                              <img
                                 className="icon"
                                 src={getResIcon(RESOURCES.PROD_BG)}
                                 alt="prod_bg"
                              />
                              <img
                                 src={getResIcon(RESOURCES.TITAN)}
                                 className="icon-res center"
                                 alt="titanq_resource"
                              />
                           </>
                        )}
                        {/* Ecological Zone */}
                        {req.type === REQUIREMENTS.ECOLOGICAL_ZONE && (
                           <div className="icon-ox">
                              <img className="greenery center" src={greenery} alt="greenery_tile" />
                              <img className="ox" src={oxIcon} alt="ox_icon" />
                           </div>
                        )}
                        {/* Rad-Suits */}
                        {req.type === REQUIREMENTS.RAD_SUITS && (
                           <>
                              <img className="icon" src={cityAnyIcon} alt="any_city_tile" />
                              <img className="icon" src={cityAnyIcon} alt="any_city_tile" />
                           </>
                        )}
                     </div>
                  )
            )}
         </div>
      </>
   )
}

export default Card
