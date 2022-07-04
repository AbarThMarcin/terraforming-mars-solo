import { PAGES } from '../../../data/pages'
import GoBack from '../GoBack'

const Settings = ({ setPage }) => {
   return (
      <div className="settings center">
         Settings
         <GoBack action={() => setPage(PAGES.BUTTONS)} />
      </div>
   )
}

export default Settings
