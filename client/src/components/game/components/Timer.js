import { useContext, useEffect, useMemo } from 'react'
import { ModalsContext, UserContext } from '..'
import { updateGameData } from '../../../api/activeGame'

const UPDATE_SERVER_EVERY_SECONDS = 30

const Timer = ({ durationSeconds, setDurationSeconds, setSyncError }) => {
   const { user, type } = useContext(UserContext)
   const { modals } = useContext(ModalsContext)

   const time = useMemo(() => {
      let hrs = Math.floor(durationSeconds / 60 / 60)
      let mins = Math.floor(durationSeconds / 60) % 60
      let secs = durationSeconds % 60

      hrs = hrs > 9 ? hrs : `0${hrs}`
      mins = mins > 9 ? mins : `0${mins}`
      secs = secs > 9 ? secs : `0${secs}`

      return `${hrs}:${mins}:${secs}`
   }, [durationSeconds])

   useEffect(() => {
      const intervalUpdTimer = setInterval(() => {
         setDurationSeconds((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(intervalUpdTimer)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   useEffect(() => {
      if (user && !modals.endStats) {
         if (durationSeconds % UPDATE_SERVER_EVERY_SECONDS === 0) {
            updateGameData(user.token, { durationSeconds }, type).then((res) => {
               if (res.message === 'success') {
                  setSyncError('')
               } else {
                  setSyncError('THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER')
               }
            })
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [durationSeconds])

   return <span>({time})</span>
}

export default Timer
