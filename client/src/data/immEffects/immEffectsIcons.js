export const getImmEffectIcon = (cardId) => {
   const icons = importAll(require.context('../../assets/images/immEffects/', false, /\.svg$/))
   const icon = icons.find(icon => icon.includes(`icon${cardId}.`))
   return icon
}

function importAll(r) {
   return r.keys().map(r)
}
