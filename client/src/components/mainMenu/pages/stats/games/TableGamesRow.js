import { useContext } from 'react'
import BtnGoTo from '../btnGoTo/BtnGoTo'
import { DataContext, ModalsContext } from '..'
import { TABS } from '../../../../../App'
import { TabTypeContext } from '..'

const TableGamesRow = ({ id, game, currPlayer, user }) => {
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

   const btnLogStyles = {
      width: 'calc(var(--default-size) * 3.4)',
      fontSize: 'calc(var(--default-size) * 0.8)',
   }

   const btnAddLinkStyles = {
      width: 'calc(var(--default-size) * 4)',
      fontSize: 'calc(var(--default-size) * 0.8)',
   }

   const btnAddCommentStyles = {
      width: 'calc(var(--default-size) * 5.3)',
      fontSize: 'calc(var(--default-size) * 0.6)',
   }

   return (
      <div className="row">
         <div>{id}</div>
         <div>{game.season === 0 ? 'PRESEASON' : game.season}</div>
         <div>{game.corporation ? game.corporation.name : 'NO CORP'}</div>
         <div>{game.victory ? 'WIN' : 'LOSS'}</div>
         <div>{game.points.tr}</div>
         <div>{game.points.greenery}</div>
         <div>{game.points.city}</div>
         <div>{game.points.vp}</div>
         <div>{game.points.total}</div>
         <div>
            <BtnGoTo text="LOG" action={handleClickLog} styles={btnLogStyles} />
         </div>
         <div className={`${game.link && 'pointer'}`} onClick={handleClickLink}>
            {currPlayer?._id === user?._id && !game.link ? (
               <BtnGoTo text="ADD LINK" action={handleClickAddLink} styles={btnAddLinkStyles} />
            ) : (
               <>
                  <span className="too-long">{game.link}</span>
                  {game.link && <span>...</span>}
               </>
            )}
         </div>
         <div className={`${game.comment && 'pointer'}`} onClick={handleClickComment}>
            {currPlayer?._id === user?._id && !game.comment ? (
               <BtnGoTo text="ADD COMMENT" action={handleClickAddComment} styles={btnAddCommentStyles} />
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
