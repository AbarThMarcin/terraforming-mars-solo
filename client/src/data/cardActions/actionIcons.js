import action_unmi from '../../assets/images/actions/action_unmi.svg'
import action_searchForLife from '../../assets/images/actions/action_searchForLife.svg'
import cardBuyOrDiscard from '../../assets/images/actions/action_cardBuyOrDiscard.svg'
import action_martianRails from '../../assets/images/actions/action_martianRails.svg'
import action_waterImport from '../../assets/images/actions/action_waterImport.svg'
import action_spaceElevator from '../../assets/images/actions/action_spaceElevator.svg'
import action_devCenter from '../../assets/images/actions/action_devCenter.svg'
import action_magnetizer from '../../assets/images/actions/action_magnetizer.svg'
import add1animal from '../../assets/images/actions/action_add1animal.svg'
import action_securityFleet from '../../assets/images/actions/action_securityFleet.svg'
import action_regolithEaters from '../../assets/images/actions/action_regolithEaters.svg'
import action_ghgBacteria from '../../assets/images/actions/action_ghgBacteria.svg'
import action_ants from '../../assets/images/actions/action_ants.svg'
import action_tardigrades from '../../assets/images/actions/action_tardigrades.svg'
import action_electroCatapult from '../../assets/images/actions/action_electroCatapult.svg'
import action_spaceMirrors from '../../assets/images/actions/action_spaceMirrors.svg'
import action_physicsComplex from '../../assets/images/actions/action_physicsComplex.svg'
import action_ironworks from '../../assets/images/actions/action_ironworks.svg'
import action_steelworks from '../../assets/images/actions/action_steelworks.svg'
import action_oreProcessor from '../../assets/images/actions/action_oreProcessor.svg'
import action_industrialCenter from '../../assets/images/actions/action_industrialCenter.svg'
import action_symbiotic from '../../assets/images/actions/action_symbiotic.svg'
import action_extremeCold from '../../assets/images/actions/action_extremeCold.svg'
import action_caretakerContract from '../../assets/images/actions/action_caretakerContract.svg'
import action_nitriteBacteria from '../../assets/images/actions/action_nitriteBacteria.svg'
import action_waterSplitting from '../../assets/images/actions/action_waterSplitting.svg'
import action_aquiferPumping from '../../assets/images/actions/action_aquiferPumping.svg'
import action_powerInfra from '../../assets/images/actions/action_powerInfra.svg'
import action_restrictedArea from '../../assets/images/actions/action_restrictedArea.svg'
import action_undergroundDet from '../../assets/images/actions/action_undergroundDet.svg'
import action_aiCentral from '../../assets/images/actions/action_aiCentral.svg'

export const ACTION_ICONS = {
   ACTION_UNMI: 'Action UNMI',
   ACTION_SEARCHFORLIFE: 'Action Search For Life',
   CARDBUYORDISCARD: 'Action Card Buy Or Discard',
   ACTION_MARTIANRAILS: 'Action Martian Rails',
   ACTION_WATERIMPORT: 'Action Water Import From Europa',
   ACTION_SPACEELEVATOR: 'Action Space Elevator',
   ACTION_DEVCENTER: 'Action Development Center',
   ACTION_MAGNETIZER: 'Action Equatorial Magnetizer',
   ADD1ANIMAL: 'Action Add 1 Animal',
   ACTION_SECURITYFLEET: 'Action Security Fleet',
   ACTION_REGOLITHEATERS: 'Action Regolith Eaters',
   ACTION_GHGBACTERIA: 'Action GHG Reducing Bacteria',
   ACTION_ANTS: 'Action Ants',
   ACTION_TARDIGRADES: 'Action Tardigrades',
   ACTION_ELECTROCATAPULT: 'Action Electro Catapult',
   ACTION_SPACEMIRRORS: 'Action Space Mirrors',
   ACTION_PHYSICSCOMPLEX: 'Action Physics Complex',
   ACTION_IRONWORKS: 'Action Ironworks',
   ACTION_STEELWORKS: 'Action Steelworks',
   ACTION_OREPROCESSOR: 'Action Ore Processor',
   ACTION_INDUSTRIALCENTER: 'Action Industrial Center',
   ACTION_SYMBIOTIC: 'Action Symbiotic Fungus',
   ACTION_EXTREMECOLD: 'Action Extreme-cold Fungus',
   ACTION_CARETAKERCONTRACT: 'Action Caretaker Contract',
   ACTION_NITRITEBACTERIA: 'Action Nitrite Reducing Bacteria',
   ACTION_WATERSPLITTING: 'Action Water Splitting Plant',
   ACTION_AQUIFERPUMPING: 'Action Aquifer Pumping',
   ACTION_POWERINFRA: 'Action Power Infrastructure',
   ACTION_RESTRICTEDAREA: 'Action Restricted Area',
   ACTION_UNDERGROUNDDET: 'Action Underground Detonations',
   ACTION_AICENTRAL: 'Action AI Central',
}

export const getActionIcon = (actionIconName) => {
   switch (actionIconName) {
      case ACTION_ICONS.ACTION_UNMI:
         return action_unmi
      case ACTION_ICONS.ACTION_SEARCHFORLIFE:
         return action_searchForLife
      case ACTION_ICONS.CARDBUYORDISCARD:
         return cardBuyOrDiscard
      case ACTION_ICONS.ACTION_MARTIANRAILS:
         return action_martianRails
      case ACTION_ICONS.ACTION_WATERIMPORT:
         return action_waterImport
      case ACTION_ICONS.ACTION_SPACEELEVATOR:
         return action_spaceElevator
      case ACTION_ICONS.ACTION_DEVCENTER:
         return action_devCenter
      case ACTION_ICONS.ACTION_MAGNETIZER:
         return action_magnetizer
      case ACTION_ICONS.ADD1ANIMAL:
         return add1animal
      case ACTION_ICONS.ACTION_SECURITYFLEET:
         return action_securityFleet
      case ACTION_ICONS.ACTION_REGOLITHEATERS:
         return action_regolithEaters
      case ACTION_ICONS.ACTION_GHGBACTERIA:
         return action_ghgBacteria
      case ACTION_ICONS.ACTION_ANTS:
         return action_ants
      case ACTION_ICONS.ACTION_TARDIGRADES:
         return action_tardigrades
      case ACTION_ICONS.ACTION_ELECTROCATAPULT:
         return action_electroCatapult
      case ACTION_ICONS.ACTION_SPACEMIRRORS:
         return action_spaceMirrors
      case ACTION_ICONS.ACTION_PHYSICSCOMPLEX:
         return action_physicsComplex
      case ACTION_ICONS.ACTION_IRONWORKS:
         return action_ironworks
      case ACTION_ICONS.ACTION_STEELWORKS:
         return action_steelworks
      case ACTION_ICONS.ACTION_OREPROCESSOR:
         return action_oreProcessor
      case ACTION_ICONS.ACTION_INDUSTRIALCENTER:
         return action_industrialCenter
      case ACTION_ICONS.ACTION_SYMBIOTIC:
         return action_symbiotic
      case ACTION_ICONS.ACTION_EXTREMECOLD:
         return action_extremeCold
      case ACTION_ICONS.ACTION_CARETAKERCONTRACT:
         return action_caretakerContract
      case ACTION_ICONS.ACTION_NITRITEBACTERIA:
         return action_nitriteBacteria
      case ACTION_ICONS.ACTION_WATERSPLITTING:
         return action_waterSplitting
      case ACTION_ICONS.ACTION_AQUIFERPUMPING:
         return action_aquiferPumping
      case ACTION_ICONS.ACTION_POWERINFRA:
         return action_powerInfra
      case ACTION_ICONS.ACTION_RESTRICTEDAREA:
         return action_restrictedArea
      case ACTION_ICONS.ACTION_UNDERGROUNDDET:
         return action_undergroundDet
      case ACTION_ICONS.ACTION_AICENTRAL:
         return action_aiCentral
      default:
         return
   }
}
