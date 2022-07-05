import { PAGES } from '../../../data/pages'
import BtnGoBack from '../BtnGoBack'

const Settings = ({ setPage }) => {
   return (
      <div className="settings center">
         Settings
         <BtnGoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Settings
