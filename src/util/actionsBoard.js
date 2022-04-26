import { TILE_NAMES } from '../data/board'

export const ACTIONS_BOARD = {
   // Set available all fields based on the tile in payload
   SET_AVAILABLE: 'Changes available parameter to true based on the tile in payload',
   // Set specific field's object to a given object and make all fields unavailable
   SET_OBJECT: "Set specific field's object to a given object",
}

export const reducerBoard = (state, action) => {
   switch (action.type) {
      // Set available
      case ACTIONS_BOARD.SET_AVAILABLE:
         switch (action.payload) {
            case TILE_NAMES.GREENERY:
               return state.map((field) => ({ ...field, available: !field.object && !field.name }))
            default:
               return state
         }
      // Set specific field's object to a given object and make all fields unavailable
      case ACTIONS_BOARD.SET_OBJECT:
         return state.map((field) => {
            if (
               field.x === action.payload.x &&
               field.y === action.payload.y &&
               field.name === action.payload.name
            ) {
               return { ...field, available: false, object: action.payload.obj }
            } else {
               return { ...field, available: false }
            }
         })
      default:
         return state
   }
}
