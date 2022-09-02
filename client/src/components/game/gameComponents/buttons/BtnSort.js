import { useContext } from 'react'
import { updateUser } from '../../../../api/apiUser'
import { SettingsContext, SoundContext } from '../../../../App'
import { ACTIONS_PLAYER } from '../../../../stateActions/actionsPlayer'
import { sorted } from '../../../../utils/misc'
import { StatePlayerContext, StateGameContext, ModalsContext, UserContext } from '../../Game'

const BtnSort = ({ id, text }) => {
   const { user, setUser } = useContext(UserContext)
   const { statePlayer, dispatchPlayer } = useContext(StatePlayerContext)
   const { requirementsMet } = useContext(StateGameContext)
   const { modals } = useContext(ModalsContext)
   const { settings, setSettings } = useContext(SettingsContext)
   const { sound } = useContext(SoundContext)
   const cardsTypeId = modals.modalCardsType === 'Cards In Hand' ? 0 : 1

   const handleClickSortBtn = (e) => {
      e.stopPropagation()
      sound.btnGeneralClick.play()
      // Change in Frontend
      let newSortId =
         settings.sortId[cardsTypeId].slice(0, 1) !== id
            ? `${id}a`
            : settings.sortId[cardsTypeId].slice(1, 2) === 'a'
            ? `${id}b`
            : `${id}a`
      newSortId = cardsTypeId === 1 && id === '4' ? newSortId + '-played' : newSortId.slice(0, 2)
      setSettings({
         ...settings,
         sortId:
            cardsTypeId === 0 ? [newSortId, settings.sortId[1]] : [settings.sortId[0], newSortId],
      })
      console.log(cardsTypeId)
      console.log(settings.sortId)
      console.log(newSortId)
      cardsTypeId === 0
         ? dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_IN_HAND,
              payload: sorted(statePlayer.cardsInHand, newSortId, requirementsMet),
           })
         : dispatchPlayer({
              type: ACTIONS_PLAYER.SET_CARDS_PLAYED,
              payload: sorted(statePlayer.cardsPlayed, newSortId, requirementsMet),
           })
      // Change in Backend
      if (user) {
         const settingsObj = {
            gameSpeed: settings.speedId,
            showTotalVP: settings.showTotVP,
            handSortId: cardsTypeId === 0 ? newSortId : settings.sortId[0],
            playedSortId: cardsTypeId === 1 ? newSortId : settings.sortId[1],
            musicVolume: settings.musicVolume,
            gameVolume: settings.gameVolume,
         }
         updateBackend(settingsObj)
      }
   }

   async function updateBackend(settings) {
      try {
         const { data } = await updateUser(user.token, { settings })
         localStorage.setItem('user', JSON.stringify(data))
         setUser(data)
      } catch (error) {
         console.log('Something went wrong.')
      }
   }

   return (
      <div
         className={`btn-sort pointer ${
            id === settings.sortId[cardsTypeId].slice(0, 1) ? 'selected' : 'not-selected'
         }`}
         onClick={handleClickSortBtn}
      >
         {text}
      </div>
   )
}

export default BtnSort
