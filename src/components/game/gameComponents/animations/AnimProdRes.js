import { useContext } from 'react'
import { getResIcon, RESOURCES } from '../../../../data/resources'
import { StateGameContext, ModalsContext } from '../../Game'

const AnimProdRes = ({ type }) => {
   const { modals } = useContext(ModalsContext)
   const { ANIMATION_SPEED } = useContext(StateGameContext)
   const resType =
      modals.animationData.productionIn.type ||
      modals.animationData.productionOut.type ||
      modals.animationData.resourcesIn.type ||
      modals.animationData.resourcesOut.type
   const [resource, resourceAlt] = getResource()
   const value = getValue()

   function getResource() {
      return [getResIcon(resType), 'res_mln']
   }

   function getValue() {
      if (modals.animationData.productionIn.type) {
         return modals.animationData.productionIn.value
      } else if (modals.animationData.productionOut.type) {
         return -modals.animationData.productionOut.value
      } else if (modals.animationData.resourcesIn.type) {
         return modals.animationData.resourcesIn.value
      } else if (modals.animationData.resourcesOut.type) {
         return -modals.animationData.resourcesOut.value
      }
      return
   }

   return (
      <div
         className={`
            anim-prod-res
            ${type === 'prod-in' || type === 'res-in' ? 'anim-prod-res-in' : 'anim-prod-res-out'}
            ${resType === RESOURCES.MLN ? '' : type === 'prod-in' || type === 'prod-out' ? 'not-mln-prod' : 'not-mln-res'}
         `}
         style={{ animationDuration: `${ANIMATION_SPEED}ms` }}
      >
         {(type === 'prod-in' || type === 'prod-out') && (
            <img src={getResIcon(RESOURCES.PROD_BG)} className="img-prod" alt="prod_bg" />
         )}
         <img src={resource} className="img-res center" alt={resourceAlt} />
         <div className='value center'>{value}</div>
      </div>
   )
}

export default AnimProdRes
