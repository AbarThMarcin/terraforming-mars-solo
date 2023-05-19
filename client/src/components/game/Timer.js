import { useContext, useEffect, useMemo, useState } from 'react'
import { ModalsContext, UserContext } from '.'
import { updateGameData } from '../../api/activeGame'

const UPDATE_SERVER_EVERY_SECONDS = 1

const Timer = ({ durationSeconds, setSyncError }) => {
   const { user, type } = useContext(UserContext)
   const { modals } = useContext(ModalsContext)
   const [seconds, setSeconds] = useState(durationSeconds)

   const time = useMemo(() => {
      let hrs = Math.floor(seconds / 60 / 60)
      let mins = Math.floor(seconds / 60) % 60
      let secs = seconds % 60

      hrs = hrs > 9 ? hrs : `0${hrs}`
      mins = mins > 9 ? mins : `0${mins}`
      secs = secs > 9 ? secs : `0${secs}`

      return `${hrs}:${mins}:${secs}`
   }, [seconds])

   useEffect(() => {
      const intervalUpdTimer = setInterval(() => {
         setSeconds((prev) => prev + 1)
      }, 1000)

      return () => clearInterval(intervalUpdTimer)
   }, [])

   useEffect(() => {
      if (user && !modals.endStats) {
         if (seconds % UPDATE_SERVER_EVERY_SECONDS === 0) {
            updateGameData(user.token, { durationSeconds: seconds }, type).then((res) => {
               if (res.message === 'success') {
                  setSyncError('')
               } else {
                  setSyncError('THERE ARE SOME ISSUES WITH UPDATING GAME ON SERVER')
               }
            })
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [seconds])

   return <span>({time})</span>
}

export default Timer
