import { useContext } from 'react'
import BtnGoTo from '../BtnGoTo'
import { ModalsContext } from '../Stats'

const TableGamesRow = ({ id, game, currPlayer, user }) => {
   const { setShowModal, setModalText, setEditMode, setLinkOrComment, setGameId } =
      useContext(ModalsContext)

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

   const btnAddLinkStyles = {
      width: 'calc(var(--default-size) * 4.3)',
      fontSize: 'calc(var(--default-size) * 0.8)',
   }

   const btnAddCommentStyles = {
      width: 'calc(var(--default-size) * 5)',
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
               <BtnGoTo
                  text="ADD COMMENT"
                  action={handleClickAddComment}
                  styles={btnAddCommentStyles}
               />
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
