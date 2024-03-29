import { useContext, useState, useEffect, useRef } from 'react'
import BtnGoBack from '../../BtnGoBack'
import spinner from '../../../../assets/other/spinner.gif'
import { updateUser } from '../../../../api/user'
import { SettingsContext } from '../../../../App'
import { SoundContext } from '../../../../App'
import { APP_MESSAGES } from '../../../../data/app'

const Settings = ({ user, setUser }) => {
   const { settings, setSettings } = useContext(SettingsContext)
   const { music, sound } = useContext(SoundContext)
   const [newSettings, setNewSettings] = useState(settings)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(null)
   const musicRange = useRef()
   const gameRange = useRef()

   useEffect(() => {
      setNewSettings(settings)
      if (settings) {
         musicRange.current.value = settings.musicVolume * 100
         musicRange.current.style.backgroundSize = `${settings.musicVolume * 100}%`
         gameRange.current.value = settings.gameVolume * 100
         gameRange.current.style.backgroundSize = `${settings.gameVolume * 100}%`
      }
   }, [settings])

   const handleClickLeftArrow_speed = () => {
      setSuccess(null)
      setError(null)
      let id = newSettings.speedId - 1
      if (id < 1) id = 4
      setNewSettings({ ...newSettings, speedId: id })
   }
   const handleClickRightArrow_speed = () => {
      setSuccess(null)
      setError(null)
      let id = newSettings.speedId + 1
      if (id > 4) id = 1
      setNewSettings({ ...newSettings, speedId: id })
   }

   const handleClickArrow_totVP = () => {
      setSuccess(null)
      setError(null)
      setNewSettings({ ...newSettings, showTotVP: !newSettings.showTotVP })
   }

   const handleClickArrow_sort = (type, arrow) => {
      setSuccess(null)
      setError(null)
      // Change on Front-end
      let digit = type === 'hand' ? parseInt(newSettings.sortId[0].slice(0, 1)) : parseInt(newSettings.sortId[1].slice(0, 1))
      let sign = type === 'hand' ? newSettings.sortId[0].slice(1, 2) : newSettings.sortId[1].slice(1, 2)
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
      newSortId = type === 'hand' ? [`${digit}${sign}`, newSettings.sortId[1]] : [newSettings.sortId[0], `${digit}${sign}`]
      setNewSettings({ ...newSettings, sortId: newSortId })
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

      sound.btnGeneralClick.play()
      try {
         setError(null)
         setSuccess(null)
         setLoading(true)

         const settings = {
            gameSpeed: newSettings.speedId,
            showTotalVP: newSettings.showTotVP,
            handSortId: newSettings.sortId[0],
            playedSortId: newSettings.sortId[1],
            musicVolume: newSettings.musicVolume,
            gameVolume: newSettings.gameVolume,
         }
         // Update Server Data
         if (user) {
            const { data } = await updateUser(user.token, { settings })
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data)
         }
         // Update App's Current Session
         setSettings(newSettings)

         setSuccess(APP_MESSAGES.SUCCESS)
         setLoading(false)
      } catch (error) {
         setError(APP_MESSAGES.FAILURE)
         setLoading(false)
      }
   }

   function handleRangeInput(e) {
      setSuccess(null)
      setError(null)
      const range = e.target
      const value = range.value
      if (e.target.name === 'musicVolume') {
         setNewSettings({ ...newSettings, musicVolume: value / 100 })
         music.volume(value / 100)
      } else {
         setNewSettings({ ...newSettings, gameVolume: value / 100 })
         Object.keys(sound).forEach((key) => sound[key].volume(value / 100))
      }
      range.style.backgroundSize = `${value}%`
   }

   return (
      <div className="menu-container green-border center">
         <div className="window-header">SETTINGS</div>
         {/* Animation Speed */}
         <div className="settings">
            <span>ANIMATION SPEED</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickLeftArrow_speed}></div>
               {newSettings.speedId === 1 && <span>SLOW</span>}
               {newSettings.speedId === 2 && <span>NORMAL</span>}
               {newSettings.speedId === 3 && <span>FAST</span>}
               {newSettings.speedId === 4 && <span>VERY FAST</span>}
               <div className="arrow arrow-right pointer" onClick={handleClickRightArrow_speed}></div>
            </div>
         </div>
         {/* Show Total VP */}
         <div className="settings">
            <span>SHOW TOTAL POINTS</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={handleClickArrow_totVP}></div>
               <span>{newSettings.showTotVP ? 'YES' : 'NO'}</span>
               <div className="arrow arrow-right pointer" onClick={handleClickArrow_totVP}></div>
            </div>
         </div>
         {/* Cards In Hand Sort by */}
         <div className="settings">
            <span>CARDS IN HAND SORT BY</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={() => handleClickArrow_sort('hand', 'left')}></div>
               {newSettings.sortId[0] === '1a' && <span>{`COST (ASC)`}</span>}
               {newSettings.sortId[0] === '1b' && <span>{`COST (DESC)`}</span>}
               {newSettings.sortId[0] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {newSettings.sortId[0] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {newSettings.sortId[0] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {newSettings.sortId[0] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {newSettings.sortId[0] === '4a' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {newSettings.sortId[0] === '4b' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               {newSettings.sortId[0] === '5a' && <span>{`PLAYABILITY (ASC)`}</span>}
               {newSettings.sortId[0] === '5b' && <span>{`PLAYABILITY (DESC)`}</span>}
               <div className="arrow arrow-right pointer" onClick={() => handleClickArrow_sort('hand', 'right')}></div>
            </div>
         </div>
         {/* Cards Played Sort by */}
         <div className="settings">
            <span>CARDS PLAYED SORT BY</span>
            <div className="item">
               <div className="arrow arrow-left pointer" onClick={() => handleClickArrow_sort('played', 'left')}></div>
               {newSettings.sortId[1] === '1a' && <span>{`COST (ASC)`}</span>}
               {newSettings.sortId[1] === '1b' && <span>{`COST (DESC)`}</span>}
               {newSettings.sortId[1] === '2a' && <span>{`CARD TYPE (ASC)`}</span>}
               {newSettings.sortId[1] === '2b' && <span>{`CARD TYPE (DESC)`}</span>}
               {newSettings.sortId[1] === '3a' && <span>{`TAGS (ASC)`}</span>}
               {newSettings.sortId[1] === '3b' && <span>{`TAGS (DESC)`}</span>}
               {newSettings.sortId[1] === '4a-played' && <span>{`CHRONOLOGICAL (ASC)`}</span>}
               {newSettings.sortId[1] === '4b-played' && <span>{`CHRONOLOGICAL (DESC)`}</span>}
               <div className="arrow arrow-right pointer" onClick={() => handleClickArrow_sort('played', 'right')}></div>
            </div>
         </div>
         {/* Music Volume */}
         <div className="settings">
            <span>MUSIC VOLUME</span>
            <div className="item">
               <input ref={musicRange} className="volume pointer" type="range" name="musicVolume" min="0" max="100" onInput={handleRangeInput} />
            </div>
         </div>
         {/* Game Volume */}
         <div className="settings">
            <span>GAME VOLUME</span>
            <div className="item">
               <input
                  ref={gameRange}
                  className="volume pointer"
                  type="range"
                  name="gameVolume"
                  min="0"
                  max="100"
                  onInput={handleRangeInput}
                  onMouseUp={() => sound.btnGeneralClick.play()}
               />
            </div>
         </div>
         {/* Apply Changes Button */}
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
         {/* Error Or Success Message */}
         {error && <div className="main-menu-error">{error}</div>}
         {success && <div className="main-menu-success">{success}</div>}
         <BtnGoBack music={music} soundCopy={sound} />
      </div>
   )
}

export default Settings
