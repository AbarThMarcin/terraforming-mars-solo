import { useContext, useState } from 'react'
import { useMemo } from 'react'
import { CARDS } from '../../../../../../data/cards'
import { range } from '../../../../../../utils/misc'
import CardForStats from './CardForStats'
import { SoundContext } from '../../../../../../App'
import { ModalsContext } from '../../../../../game'

const tipText =
   'Total played divided by total seen. Example: in 10 games card has been seen 5 times and played 2 times. % Most Played for that card is 40%.'

const Details = ({ currPlayer }) => {
   const { sound } = useContext(SoundContext)
   const [showTipOnPercPlayed, setShowTipOnPercPlayed] = useState(false)
   const {
      setShowModalCard,
      setModalCard,
      setShowModalAllCards,
      setModalCardsIds,
      setModalCardsTitle,
   } = useContext(ModalsContext)
   // Arrays of cards
   const games = useMemo(
      () => currPlayer.games.filter((game) => !game.forfeited),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const mostPlayed = useMemo(
      () => getMost('played'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const mostSeen = useMemo(
      () => getMost('seen'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const mostPurchased = useMemo(
      () => getMost('purchased'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const mostPlayedPerc = useMemo(
      () => getMostPlayedPerc(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   // Count of cards for all stats with the same top value
   const countTopPlayed = useMemo(
      () => mostPlayed.filter((card) => card[1] === mostPlayed[0][1]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopSeen = useMemo(
      () => mostSeen.filter((card) => card[1] === mostSeen[0][1]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopPurchased = useMemo(
      () => mostPurchased.filter((card) => card[1] === mostPurchased[0][1]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopPlayedPerc = useMemo(
      () => mostPlayedPerc.filter((card) => card[1] === mostPlayedPerc[0][1]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )

   function getMost(cardsType) {
      let most = []
      let allCards
      switch (cardsType) {
         case 'played':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.played], [])
            break
         case 'seen':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])
            break
         case 'purchased':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.purchased], [])
            break
         default:
            break
      }

      range(1, 208).forEach((id) => {
         most.push([id, allCards.reduce((tot, card) => (card.id === id ? tot + 1 : tot), 0)])
      })

      most = most.sort((a, b) => b[1] - a[1])
      return most
   }

   function getMostPlayedPerc() {
      let most = []
      const allCardsPlayed = games.reduce((cards, game) => [...cards, ...game.cards.played], [])
      const allCardsSeen = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])

      range(1, 208).forEach((id) => {
         const currentCardSeen = allCardsSeen.reduce(
            (tot, card) => (card.id === id ? tot + 1 : tot),
            0
         )
         const currentCardPlayed = allCardsPlayed.reduce(
            (tot, card) => (card.id === id ? tot + 1 : tot),
            0
         )
         if (currentCardSeen)
            most.push([id, ((currentCardPlayed / currentCardSeen) * 100).toFixed(0)])
      })

      most = most.sort((a, b) => b[1] - a[1])
      return most
   }

   return (
      <div className="details">
         <div className="player-name">{currPlayer.name}</div>
         <div className="stats-box center">
            {/* Most Played Cards */}
            <div className="full-size">
               <div className="content">
                  {/* Title */}
                  <div className="content-title">
                     <div>
                        MOST
                        <br />
                        <span>PLAYED</span>
                        <br />
                        CARD(S):
                     </div>
                  </div>
                  {mostPlayed[0][1] === 0 ? (
                     <div className="no-cards">NO CARDS</div>
                  ) : (
                     <div className="content-cards">
                        <div className="top-card-with-value">
                           {/* How Many Times */}
                           <div
                              className="card-container small"
                              style={{ transform: 'translateY(-5%) scale(0.62)' }}
                              onClick={() => {
                                 sound.btnCardsClick.play()
                                 setModalCard(CARDS.find((card) => card.id === mostPlayed[0][0]))
                                 setShowModalCard(true)
                              }}
                           >
                              {/* Top Card */}
                              <CardForStats
                                 card={CARDS.find((card) => card.id === mostPlayed[0][0])}
                              />
                           </div>
                           <div className="value">
                              <span>{mostPlayed[0][1]}</span>{' '}
                              {mostPlayed[0][1] > 1 ? 'TIMES' : 'TIME'}
                           </div>
                        </div>
                        {countTopPlayed > 1 && (
                           <div className="and-more">
                              <div>
                                 AND
                                 <br />
                                 <span>{countTopPlayed - 1}</span>
                                 <br />
                                 MORE...
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <div
                  className="see-all pointer"
                  onClick={() => {
                     setModalCardsIds(mostPlayed)
                     setModalCardsTitle('MOST PLAYED CARDS')
                     setShowModalAllCards(true)
                  }}
               >
                  {mostPlayed[0][1] > 0 && <span>SEE ALL CARDS</span>}
               </div>
            </div>
            {/* Most Seen Cards */}
            <div className="full-size">
               <div className="content">
                  {/* Title */}
                  <div className="content-title">
                     <div>
                        MOST
                        <br />
                        <span>SEEN</span>
                        <br />
                        CARD(S):
                     </div>
                  </div>
                  {mostSeen[0][1] === 0 ? (
                     <div className="no-cards">NO CARDS</div>
                  ) : (
                     <div className="content-cards">
                        <div className="top-card-with-value">
                           {/* How Many Times */}
                           <div
                              className="card-container small"
                              style={{ transform: 'translateY(-5%) scale(0.62)' }}
                              onClick={() => {
                                 sound.btnCardsClick.play()
                                 setModalCard(CARDS.find((card) => card.id === mostSeen[0][0]))
                                 setShowModalCard(true)
                              }}
                           >
                              {/* Top Card */}
                              <CardForStats
                                 card={CARDS.find((card) => card.id === mostSeen[0][0])}
                              />
                           </div>
                           <div className="value">
                              <span>{mostSeen[0][1]}</span> {mostSeen[0][1] > 1 ? 'TIMES' : 'TIME'}
                           </div>
                        </div>
                        {countTopSeen > 1 && (
                           <div className="and-more">
                              <div>
                                 AND
                                 <br />
                                 <span>{countTopSeen - 1}</span>
                                 <br />
                                 MORE...
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <div
                  className="see-all pointer"
                  onClick={() => {
                     setModalCardsIds(mostSeen)
                     setModalCardsTitle('MOST SEEN CARDS')
                     setShowModalAllCards(true)
                  }}
               >
                  {mostPlayed[0][1] > 0 && <span>SEE ALL CARDS</span>}
               </div>
            </div>
            {/* Most Purchased Cards */}
            <div className="full-size">
               <div className="content">
                  {/* Title */}
                  <div className="content-title">
                     <div>
                        MOST
                        <br />
                        <span>PURCHASED</span>
                        <br />
                        CARD(S):
                     </div>
                  </div>
                  {mostPurchased[0][1] === 0 ? (
                     <div className="no-cards">NO CARDS</div>
                  ) : (
                     <div className="content-cards">
                        <div className="top-card-with-value">
                           {/* How Many Times */}
                           <div
                              className="card-container small"
                              style={{ transform: 'translateY(-5%) scale(0.62)' }}
                              onClick={() => {
                                 sound.btnCardsClick.play()
                                 setModalCard(CARDS.find((card) => card.id === mostPurchased[0][0]))
                                 setShowModalCard(true)
                              }}
                           >
                              {/* Top Card */}
                              <CardForStats
                                 card={CARDS.find((card) => card.id === mostPurchased[0][0])}
                              />
                           </div>
                           <div className="value">
                              <span>{mostPurchased[0][1]}</span>{' '}
                              {mostPurchased[0][1] > 1 ? 'TIMES' : 'TIME'}
                           </div>
                        </div>
                        {countTopPurchased > 1 && (
                           <div className="and-more">
                              <div>
                                 AND
                                 <br />
                                 <span>{countTopPurchased - 1}</span>
                                 <br />
                                 MORE...
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
               <div
                  className="see-all pointer"
                  onClick={() => {
                     setModalCardsIds(mostPurchased)
                     setModalCardsTitle('MOST PURCHASED CARDS')
                     setShowModalAllCards(true)
                  }}
               >
                  {mostPurchased[0][1] > 0 && <span>SEE ALL CARDS</span>}
               </div>
            </div>
            {/* % Most Played */}
            <div className="full-size">
               <div className="content">
                  {/* Title */}
                  <div className="content-title">
                     <div>
                        MOST
                        <br />
                        <span>% PLAYED</span>
                        <br />
                        CARD(S):
                        {/* Question Mark */}
                        <div
                           className="question pointer"
                           onClick={() => setShowTipOnPercPlayed(true)}
                           onMouseLeave={() => setShowTipOnPercPlayed(false)}
                        >
                           <span>?</span>
                        </div>
                        {/* Tip */}
                        {showTipOnPercPlayed && <div className="tip">{tipText}</div>}
                     </div>
                  </div>
                  {mostPlayedPerc.length > 0 ? (
                     mostPlayedPerc[0][1] === 0 ? (
                        <div className="no-cards">NO CARDS</div>
                     ) : (
                        <div className="content-cards">
                           <div className="top-card-with-value">
                              {/* How Many Times */}
                              <div
                                 className="card-container small"
                                 style={{ transform: 'translateY(-5%) scale(0.62)' }}
                                 onClick={() => {
                                    sound.btnCardsClick.play()
                                    setModalCard(
                                       CARDS.find((card) => card.id === mostPlayedPerc[0][0])
                                    )
                                    setShowModalCard(true)
                                 }}
                              >
                                 {/* Top Card */}
                                 <CardForStats
                                    card={CARDS.find((card) => card.id === mostPlayedPerc[0][0])}
                                 />
                              </div>
                              <div className="value">
                                 <span>{mostPlayedPerc[0][1]}</span>%
                              </div>
                           </div>
                           {countTopPlayedPerc > 1 && (
                              <div className="and-more">
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopPlayedPerc - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              </div>
                           )}
                        </div>
                     )
                  ) : (
                     <div className="no-cards">NO CARDS</div>
                  )}
               </div>
               <div
                  className="see-all pointer"
                  onClick={() => {
                     setModalCardsIds(mostPlayedPerc)
                     setModalCardsTitle('MOST % PLAYED CARDS')
                     setShowModalAllCards(true)
                  }}
               >
                  {mostPlayedPerc.length > 0 && mostPlayedPerc[0][1] > 0 && (
                     <span>SEE ALL CARDS</span>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Details
