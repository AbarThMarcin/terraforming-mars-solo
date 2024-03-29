import { useContext, useState, useMemo, useRef } from 'react'
import { CARDS } from '../../../../../../data/cards'
import { range } from '../../../../../../utils/array'
import CardForStats from './CardForStats'
import { SoundContext } from '../../../../../../App'
import { ModalsContext } from '../../index'
import { motion, AnimatePresence } from 'framer-motion'
import { TIP_TEXTS } from '../../../../../../data/app'

const StatsCards = ({ currPlayer }) => {
   const { sound } = useContext(SoundContext)
   const { setShowModalCard, setModalCard, setShowModalAllCards, setModalCardsIds, setModalCardsTitle } = useContext(ModalsContext)
   // Tooltips for % Played and % Purchased
   const [showTipPlayed, setShowTipPlayed] = useState(false)
   const [showTipPurchased, setShowTipPurchased] = useState(false)
   const refTipPlayed = useRef()
   const refTipPurchased = useRef()
   const [tipTop, setTipTop] = useState(0)
   const [tipLeft, setTipLeft] = useState(0)

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
      () => getMostPerc('played'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const mostPurchasedPerc = useMemo(
      () => getMostPerc('purchased'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   // Count of cards for all stats with the same top value
   const countTopPlayed = useMemo(
      () => mostPlayed.filter((card) => card[1] === mostPlayed[0][1] && card[2] === mostPlayed[0][2]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopSeen = useMemo(
      () => mostSeen.filter((card) => card[1] === mostSeen[0][1]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopPurchased = useMemo(
      () => mostPurchased.filter((card) => card[1] === mostPurchased[0][1] && card[2] === mostPurchased[0][2]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopPlayedPerc = useMemo(
      () => mostPlayedPerc.filter((card) => card[1] === mostPlayedPerc[0][1] && card[2] === mostPlayedPerc[0][2]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )
   const countTopPurchasedPerc = useMemo(
      () => mostPurchasedPerc.filter((card) => card[1] === mostPurchasedPerc[0][1] && card[2] === mostPurchasedPerc[0][2]).length,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currPlayer]
   )

   const setTipPositionPlayed = (e) => {
      const height = refTipPlayed.current.getBoundingClientRect().height
      const width = refTipPlayed.current.getBoundingClientRect().width
      const top = Math.floor(e.clientY - refTipPlayed.current.getBoundingClientRect().top)
      const left = Math.floor(e.clientX - refTipPlayed.current.getBoundingClientRect().left)
      setTipTop(top)
      setTipLeft(left)
      if (top < -3 || top > height || left < -3 || left > width) setShowTipPlayed(false)
   }

   const setTipPositionPurchased = (e) => {
      const height = refTipPurchased.current.getBoundingClientRect().height
      const width = refTipPurchased.current.getBoundingClientRect().width
      const top = Math.floor(e.clientY - refTipPurchased.current.getBoundingClientRect().top)
      const left = Math.floor(e.clientX - refTipPurchased.current.getBoundingClientRect().left)
      setTipTop(top)
      setTipLeft(left)
      if (top < -3 || top > height || left < -3 || left > width) setShowTipPurchased(false)
   }

   function getMost(cardsType) {
      let most = []
      let allCards
      let allCardsSeen
      switch (cardsType) {
         case 'played':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.played], [])
            allCardsSeen = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])
            break
         case 'seen':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])
            break
         case 'purchased':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.purchased], [])
            allCardsSeen = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])
            break
         default:
            break
      }

      range(1, 208).forEach((id) => {
         const value = allCards.reduce((tot, card) => (card.id === id ? tot + 1 : tot), 0)
         if (cardsType === 'played' || cardsType === 'purchased') {
            const value2 = allCardsSeen.reduce((tot, card) => (card.id === id ? tot + 1 : tot), 0)
            if (value2) most.push([id, value, ((value / value2) * 100).toFixed(0)])
         } else {
            most.push([id, value])
         }
      })

      if (cardsType === 'played' || cardsType === 'purchased') {
         most = most.sort(sortByTwoLevels)
      } else {
         most = most.sort((a, b) => b[1] - a[1])
      }
      return most
   }

   function getMostPerc(cardsType) {
      let most = []
      let allCards
      switch (cardsType) {
         case 'played':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.played], [])
            break
         case 'purchased':
            allCards = games.reduce((cards, game) => [...cards, ...game.cards.purchased], [])
            break
         default:
            break
      }
      const allCardsSeen = games.reduce((cards, game) => [...cards, ...game.cards.seen], [])

      range(1, 208).forEach((id) => {
         const currentCardSeen = allCardsSeen.reduce((tot, card) => (card.id === id ? tot + 1 : tot), 0)
         const currentCard = allCards.reduce((tot, card) => (card.id === id ? tot + 1 : tot), 0)
         if (currentCardSeen) most.push([id, ((currentCard / currentCardSeen) * 100).toFixed(0), currentCard, currentCardSeen])
      })

      most = most.sort(sortByTwoLevels)
      return most
   }

   function sortByTwoLevels(a, b) {
      if (a[1] === b[1]) {
         return b[2] - a[2]
      }
      return b[1] - a[1]
   }

   return (
      <div className="details">
         <div className="player-name">{currPlayer.name}</div>
         <div className="statsCards-box center">
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
                  {mostPurchased.length > 0 ? (
                     mostPurchased[0][1] === 0 ? (
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
                                 <CardForStats card={CARDS.find((card) => card.id === mostPlayed[0][0])} />
                              </div>
                              <div className="value">
                                 <span>{mostPlayed[0][1]}</span> {mostPlayed[0][1] > 1 ? 'TIMES' : 'TIME'}
                              </div>
                           </div>
                           <div className="and-more">
                              {countTopPlayed > 1 && (
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopPlayed - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              )}
                           </div>
                        </div>
                     )
                  ) : (
                     <div className="no-cards">NO CARDS</div>
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
                  {mostPlayed.length > 0 && mostPlayed[0][1] > 0 && <span>SEE ALL CARDS</span>}
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
                  {mostPurchased.length > 0 ? (
                     mostPurchased[0][1] === 0 ? (
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
                                 <CardForStats card={CARDS.find((card) => card.id === mostPurchased[0][0])} />
                              </div>
                              <div className="value">
                                 <span>{mostPurchased[0][1]}</span> {mostPurchased[0][1] > 1 ? 'TIMES' : 'TIME'}
                              </div>
                           </div>
                           <div className="and-more">
                              {countTopPurchased > 1 && (
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopPurchased - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              )}
                           </div>
                        </div>
                     )
                  ) : (
                     <div className="no-cards">NO CARDS</div>
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
                  {mostPurchased.length > 0 && mostPurchased[0][1] > 0 && <span>SEE ALL CARDS</span>}
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
                  {mostSeen.length > 0 ? (
                     mostSeen[0][1] === 0 ? (
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
                                 <CardForStats card={CARDS.find((card) => card.id === mostSeen[0][0])} />
                              </div>
                              <div className="value">
                                 <span>{mostSeen[0][1]}</span> {mostSeen[0][1] > 1 ? 'TIMES' : 'TIME'}
                              </div>
                           </div>
                           <div className="and-more">
                              {countTopSeen > 1 && (
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopSeen - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              )}
                           </div>
                        </div>
                     )
                  ) : (
                     <div className="no-cards">NO CARDS</div>
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
                  {mostSeen.length > 0 && mostSeen[0][1] > 0 && <span>SEE ALL CARDS</span>}
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
                           className="question"
                           ref={refTipPlayed}
                           onMouseOver={(e) => {
                              setTipPositionPlayed(e)
                              setShowTipPlayed(true)
                           }}
                           onMouseLeave={() => setShowTipPlayed(false)}
                           onMouseMove={(e) => setTipPositionPlayed(e)}
                        >
                           <span>?</span>
                           {/* Tooltip */}
                           {showTipPlayed && (
                              <AnimatePresence>
                                 <motion.div
                                    key="keyTipPlayed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0, delay: 0.2 }}
                                    className="tip tip-statscards right"
                                    style={{ top: tipTop, left: tipLeft }}
                                 >
                                    {TIP_TEXTS.STATS_PLAYED}
                                 </motion.div>
                              </AnimatePresence>
                           )}
                        </div>
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
                                    setModalCard(CARDS.find((card) => card.id === mostPlayedPerc[0][0]))
                                    setShowModalCard(true)
                                 }}
                              >
                                 {/* Top Card */}
                                 <CardForStats card={CARDS.find((card) => card.id === mostPlayedPerc[0][0])} />
                              </div>
                              <div className="value">
                                 <span>{mostPlayedPerc[0][1]}</span>% ({mostPlayedPerc[0][2]}/{mostPlayedPerc[0][3]})
                              </div>
                           </div>
                           <div className="and-more">
                              {countTopPlayedPerc > 1 && (
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopPlayedPerc - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              )}
                           </div>
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
                  {mostPlayedPerc.length > 0 && mostPlayedPerc[0][1] > 0 && <span>SEE ALL CARDS</span>}
               </div>
            </div>
            {/* % Most Purchased */}
            <div className="full-size">
               <div className="content">
                  {/* Title */}
                  <div className="content-title">
                     <div>
                        MOST
                        <br />
                        <span>% PURCHASED</span>
                        <br />
                        CARD(S):
                        {/* Question Mark */}
                        <div
                           className="question"
                           ref={refTipPurchased}
                           onMouseOver={(e) => {
                              setTipPositionPurchased(e)
                              setShowTipPurchased(true)
                           }}
                           onMouseLeave={() => setShowTipPurchased(false)}
                           onMouseMove={(e) => setTipPositionPurchased(e)}
                        >
                           <span>?</span>
                           {/* Tooltip */}
                           {showTipPurchased && (
                              <AnimatePresence>
                                 <motion.div
                                    key="keyTipPurchased"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0, delay: 0.2 }}
                                    className="tip tip-statscards"
                                    style={{ top: tipTop, left: tipLeft }}
                                 >
                                    {TIP_TEXTS.STATS_PURCHASED}
                                 </motion.div>
                              </AnimatePresence>
                           )}
                        </div>
                     </div>
                  </div>
                  {mostPurchasedPerc.length > 0 ? (
                     mostPurchasedPerc[0][1] === 0 ? (
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
                                    setModalCard(CARDS.find((card) => card.id === mostPurchasedPerc[0][0]))
                                    setShowModalCard(true)
                                 }}
                              >
                                 {/* Top Card */}
                                 <CardForStats card={CARDS.find((card) => card.id === mostPurchasedPerc[0][0])} />
                              </div>
                              <div className="value">
                                 <span>{mostPurchasedPerc[0][1]}</span>% ({mostPurchasedPerc[0][2]}/{mostPurchasedPerc[0][3]})
                              </div>
                           </div>
                           <div className="and-more">
                              {countTopPurchasedPerc > 1 && (
                                 <div>
                                    AND
                                    <br />
                                    <span>{countTopPurchasedPerc - 1}</span>
                                    <br />
                                    MORE...
                                 </div>
                              )}
                           </div>
                        </div>
                     )
                  ) : (
                     <div className="no-cards">NO CARDS</div>
                  )}
               </div>
               <div
                  className="see-all pointer"
                  onClick={() => {
                     setModalCardsIds(mostPurchasedPerc)
                     setModalCardsTitle('MOST % PURCHASED CARDS')
                     setShowModalAllCards(true)
                  }}
               >
                  {mostPurchasedPerc.length > 0 && mostPurchasedPerc[0][1] > 0 && <span>SEE ALL CARDS</span>}
               </div>
            </div>
         </div>
      </div>
   )
}

export default StatsCards
