import Button from '../Button'
import { PAGES } from '../../../data/pages'

const Menu = ({ setPage, qmAction }) => {
   return (
      <div className="buttons center">
         {/* Quick Match */}
         <Button
            text="QUICK MATCH"
            action={() => {
               qmAction()
            }}
            path="quick-match"
         />
         {/* Statistics */}
         <Button
            text="STATS"
            action={() => {
               setPage(PAGES.STATS)
            }}
         />
         {/* Ranked */}
         <Button
            text="RANKED MATCH"
            action={() => {
               qmAction()
            }}
            path="ranked-match"
            forUser={true}
         />
         {/* Settings */}
         <Button
            text="SETTINGS"
            action={() => {
               setPage(PAGES.SETTINGS)
            }}
            forUser={true}
         />
         {/* Rules */}
         <Button
            text="RANK RULES"
            action={() => {
               setPage(PAGES.RULES)
            }}
         />
         {/* Credits */}
         <Button
            text="CREDITS"
            action={() => {
               setPage(PAGES.CREDITS)
            }}
         />
         {/* Login */}
         <Button
            text="LOGIN"
            action={() => {
               setPage(PAGES.LOGIN)
            }}
         />
         <Button
            text="ACCOUNT"
            action={() => {
               setPage(PAGES.ACCOUNT)
            }}
            forUser={true}
         />
      </div>
   )
}

export default Menu
