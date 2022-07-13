import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BtnGoBack from '../BtnGoBack'
import spinner from '../../../assets/other/spinner.gif'
import { updateUser } from '../../../api/apiUser'

const Settings = ({ user, setUser }) => {
   const navigate = useNavigate()
   const [speedId, setSpeedId] = useState(user?.settings?.gameSpeed || 2)
   const [showTotVP, setShowTotVP] = useState(user !== null ? user.settings.showTotalVP : false)
   const [sortId, setSortId] = useState(
      user !== null ? [user.settings.handSortId, user.settings.playedSortId] : ['4a', '4a-played']
   )
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(null)

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('user'))
      if (!userInfo) navigate('/')

      if (userInfo) {
         setSpeedId(userInfo.settings.gameSpeed)
         setShowTotVP(userInfo.settings.showTotalVP)
      }
   }, [setUser, navigate])

   const handleClickLeftArrow_speed = () => {
      setSuccess(null)
      setError(null)
      let id = speedId - 1
      if (id < 1) id = 4
      setSpeedId(id)
   }
   const handleClickRightArrow_speed = () => {
      setSuccess(null)
      setError(null)
      let id = speedId + 1
      if (id > 4) id = 1
      setSpeedId(id)
   }

   const handleClickArrow_totVP = () => {
      setSuccess(null)
      setError(null)
      setShowTotVP((prev) => !prev)
   }

   const handleClickArrow_sort = (type, arrow) => {
      setSuccess(null)
      setError(null)
      // Change on Front-end
      let digit =
         type === 'hand' ? parseInt(sortId[0].slice(0, 1)) : parseInt(sortId[1].slice(0, 1))
      let sign = type === 'hand' ? sortId[0].slice(1, 2) : sortId[1].slice(1, 2)
      const maxIdDigit = type === 'hand' ? 5 : 4
      let newSortId
      if (sign === 'a') {
         sign = 'b'
         if (arrow === 'left') digit = newDigit(arrow, digit, maxIdDigit)
      } else {
         sign = 'a'
         if (arrow === 'right') digit = newDigit(arrow, digit, maxIdDigit)
      }
      if (type === 'played' && digit === 4) sign += '-played'
      newSortId = type === 'hand' ? [`${digit}${sign}`, sortId[1]] : [sortId[0], `${digit}${sign}`]
      setSortId(newSortId)
   }
   function newDigit(arrow, digit, maxIdDigit) {
      if (arrow === 'left') {
         digit--
         if (digit < 1) digit = maxIdDigit
      } else {
         digit++
         if (digit > maxIdDigit) digit = 1
      }
      return digit
   }

   const handleClickApply = async () => {
      if (loading) return

      try {
         setError(null)
         setSuccess(null)
         setLoading(true)

         const settings = {
            gameSpeed: speedId,
            showTotalVP: showTotVP,
            handSortId: sortId[0],
            playedSortId: sortId[1],
         }
         const { data } = await updateUser(user.token, { settings })
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)

         setSuccess('CHANGES SAVED SUCCESSFULLY!')
         setLoading(false)
      } catch (error) {
         setError('FAILED TO SAVE CHANGES')
         setLoading(false)
      }
   }

   return (
      <div className="window-container settings-container center">
         <div className="window-header">SETTINGS</div>
         {/* Animation Speed */}
         <div className="settings">
            <span>ANIMATION SPEED</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickLeftArrow_speed}></div>
               {speedId === 1 && <span>SLOW</span>}
               {speedId === 2 && <span>NORMAL</span>}
               {speedId === 3 && <span>FAST</span>}
               {speedId === 4 && <span>VERY FAST</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={handleClickRightArrow_speed}
               ></div>
            </div>
         </div>
         {/* Show Total VP */}
         <div className="settings">
            <span>SHOW TOTAL POINTS</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickArrow_totVP}></div>
               <span>{showTotVP ? 'YES' : 'NO'}</span>
               <div className="arrow arrow-right pointer" onClick={handleClickArrow_totVP}></div>
            </div>
         </div>
         {/* Cards In Hand Sort by */}
         <div className="settings">
            <span>CARDS IN HAND SORT BY</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => handleClickArrow_sort('hand', 'left')}
               ></div>
               {sortId[0] === '1a' && <span>{`COST (ASC)`}</span>}
               {sortId[0] === '1b' && <span>{`COST (DESC)`}</span>}
               {sortId[0] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {sortId[0] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {sortId[0] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {sortId[0] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {sortId[0] === '4a' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {sortId[0] === '4b' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               {sortId[0] === '5a' && <span>{`PLAYABILITY (ASC)`}</span>}
               {sortId[0] === '5b' && <span>{`PLAYABILITY (DESC)`}</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => handleClickArrow_sort('hand', 'right')}
               ></div>
            </div>
         </div>
         {/* Cards Played Sort by */}
         <div className="settings">
            <span>CARDS PLAYED SORT BY</span>
            <div className="item">
               <div
                  className="arrow arrow-left pointer"
                  onClick={() => handleClickArrow_sort('played', 'left')}
               ></div>
               {sortId[1] === '1a' && <span>{`COST (ASC)`}</span>}
               {sortId[1] === '1b' && <span>{`COST (DESC)`}</span>}
               {sortId[1] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {sortId[1] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {sortId[1] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {sortId[1] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {sortId[1] === '4a-played' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {sortId[1] === '4b-played' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               <div
                  className="arrow arrow-right pointer"
                  onClick={() => handleClickArrow_sort('played', 'right')}
               ></div>
            </div>
         </div>
         <button className={`pointer ${loading && 'disabled'}`} onClick={handleClickApply}>
            {/* Loading Spinner */}
            {loading ? (
               <div className="spinner">
                  <img className="full-size" src={spinner} alt="loading_spinner" />
               </div>
            ) : (
               <span>APPLY CHANGES</span>
            )}
         </button>
         {error && <div className="main-menu-error">{error}</div>}
         {success && <div className="main-menu-success">{success}</div>}
         <BtnGoBack />
      </div>
   )
}

export default Settings
