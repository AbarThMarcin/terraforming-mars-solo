import { useContext } from 'react'
import BtnGoTo from '../btnGoTo/BtnGoTo'
import { DataContext, ModalsContext } from '..'
import { TabTypeContext } from '..'
import { getCorporationById } from '../../../../../utils/corporation'
import { useNavigate } from 'react-router-dom'
import { MATCH_TYPES, TABS } from '../../../../../data/app'

const TableGamesRow = ({ id, game, currPlayer, user, setDataForGame }) => {
   let navigate = useNavigate()
   const { setShowModal, setModalText, setEditMode, setLinkOrComment, setGameId } = useContext(ModalsContext)
   const { setType } = useContext(TabTypeContext)
   const { setGame } = useContext(DataContext)

   function handleClickAddLink() {
      setModalText(game.link)
      setEditMode(true)
      setLinkOrComment('link')
      setGameId(game._id)
      setShowModal(true)
   }
   function handleClickAddComment() {
      setModalText(game.comment)
      setEditMode(true)
      setLinkOrComment('comment')
      setGameId(game._id)
      setShowModal(true)
   }

   function handleClickLink() {
      if (!game.link) return
      setModalText(game.link)
      setEditMode(false)
      setLinkOrComment('link')
      setGameId(game._id)
      setShowModal(true)
   }
   function handleClickComment() {
      if (!game.comment) return
      setModalText(game.comment)
      setEditMode(false)
      setLinkOrComment('comment')
      setGameId(game._id)
      setShowModal(true)
   }

   function handleClickLog() {
      setGame(game)
      setType(TABS.GAMES_LOG)
   }

   async function handleClickReplay() {
      await setDataForGame({ type: MATCH_TYPES.REPLAY, dataForReplay: game })
      navigate('/match')
   }

   const btnStyles = {
      width: 'calc(100% - var(--default-size) * 0.5)',
      fontSize: 'calc(var(--default-size) * 0.8)',
   }

   const btnAddLinkStyles = {
      width: 'calc(100% - var(--default-size) * 0.5)',
      fontSize: 'calc(var(--default-size) * 0.7)',
   }

   const btnSmallerFontStyles = {
      width: 'calc(100% - var(--default-size) * 0.5)',
      fontSize: 'calc(var(--default-size) * 0.5)',
   }

   const getDuration = (seconds) => {
      let hrs = Math.floor(seconds / 60 / 60)
      let mins = Math.floor(seconds / 60) % 60
      let secs = seconds % 60

      hrs = hrs > 9 ? hrs : `0${hrs}`
      mins = mins > 9 ? mins : `0${mins}`
      secs = secs > 9 ? secs : `0${secs}`

      return `${hrs}:${mins}:${secs}`
   }

   return (
      <div className="row">
         <div>{id}</div>
         <div>{game.season === 0 ? 'PRESEASON' : game.season}</div>
         <div>{game.corporation ? getCorporationById(game.corporation).name : 'NO CORP'}</div>
         <div>{game.startTime ? `${game.startTime.slice(0, 10)}\n${game.startTime.slice(11, 19)}` : ''}</div>
         <div>{game.durationSeconds ? getDuration(game.durationSeconds) : ''}</div>
         <div>{game.endTime ? `${game.endTime.slice(0, 10)}\n${game.endTime.slice(11, 19)}` : ''}</div>
         <div>{game.victory ? 'WIN' : 'LOSS'}</div>
         <div>{game.points.tr}</div>
         <div>{game.points.greenery}</div>
         <div>{game.points.city}</div>
         <div>{game.points.vp}</div>
         <div>{game.points.total}</div>
         <div>
            <BtnGoTo text="LOG" action={handleClickLog} styles={btnStyles} />
         </div>
         <div>
            <BtnGoTo text="REPLAY" action={handleClickReplay} styles={btnStyles} />
         </div>
         <div className={`${game.link ? 'pointer' : ''}`} onClick={handleClickLink}>
            {currPlayer?._id === user?._id && !game.link ? (
               <BtnGoTo text="ADD LINK" action={handleClickAddLink} styles={btnAddLinkStyles} />
            ) : (
               <>
                  <span className="too-long">{game.link}</span>
                  {game.link && <span>...</span>}
               </>
            )}
         </div>
         <div className={`${game.comment ? 'pointer' : ''}`} onClick={handleClickComment}>
            {currPlayer?._id === user?._id && !game.comment ? (
               <BtnGoTo text="ADD COMMENT" action={handleClickAddComment} styles={btnSmallerFontStyles} />
            ) : (
               <>
                  <span className="too-long">{game.comment}</span>
                  {game.comment && <span>...</span>}
               </>
            )}
         </div>
      </div>
   )
}

export default TableGamesRow
