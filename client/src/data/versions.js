export const VERSIONS = [
   {
      number: '0.0.5',
      date: '2022-08-31',
      updates: [
         {
            title: 'Cards Seen after playing specific cards fixed for Statistics',
            description:
               'Cards seen and cards left in deck are now properly updated when Olympus Conference effect is in play and any of the following cards are played: Research, Invention Contest, Lagrange Observatory, Technology Demonstration.',
         },
         {
            title: 'Match update on server fixed',
            description:
               'Match is now updated on the server when Mars University, Invention Contest and Business Contacts cards are played and cards have been shown.',
         },
         {
            title: "Phobolog's and Thorgate's starting effects fixed",
            description: '',
         },
      ],
   },
   {
      number: '0.0.4',
      date: '2022-08-30',
      updates: [
         {
            title: 'Arrows in Mars University Modal fixed',
            description:
               'Arrows are now hidden when selecting one card out of 10 (Mars University effect).',
         },
         {
            title: 'Martian Rails action fixed',
            description: 'Martian Rails action now takes into account Capital City as well.',
         },
         {
            title: 'Total Points fixed',
            description:
               'Playing action that gives any kind of bio resource now updates the Total VP properly.',
         },
         {
            title: 'Tags requirement fixed',
            description: 'Research is now treated as TWO science tags, not ONE.',
         },
         {
            title: 'Arctic Algae effect fixed',
            description:
               'Plants are now properly acquired, only when an ocean tile is placed (regardless of the action).',
         },
      ],
   },
   {
      number: '0.0.3',
      date: '2022-08-29',
      updates: [
         {
            title: 'Match update on server fixed',
            description:
               'Before: saving current state of the match did not work properly. After: match is now saved automatically on the server whenever a player plays an action, presses the pass button or confirms the cards in draft purchase.',
         },
         {
            title: 'Logs added to the active and ended matches for testing purposes',
            description: '',
         },
      ],
   },
   {
      number: '0.0.2',
      date: '2022-08-25',
      updates: [
         {
            title: 'Order of the actions and effects fixed',
            description:
               'Before: whenever cards played have been sorted, effects / actions were sorted appropiately. After: effects / actions are always sorted chronologically (ascending).',
         },
      ],
   },
   {
      number: '0.0.1',
      date: '2022-08-24',
      updates: [
         {
            title: 'Livestock card icon corrected',
            description: 'Before: +4M prod. on the immediate effect icon, after: +2M prod.',
         },
         {
            title: 'Standard Projects cost requirements for Helion fixed',
            description:
               "Before: a standard Project (other than Sell Patent) could be played as Helion only with M, eventhough it would decrease its resources below 0. After: button is greyed out unless heat resource's amount is added.",
         },
         {
            title: "Following cards' icons corrected: 'Moss', 'Heather', 'Farming'",
            description: 'Plant resources of the icons have been tightened.',
         },
         {
            title: 'Points from Jovian Combo Cards fixed',
            description: "Jovian Combo Cards now include Saturn Systems' Jovian tag as a point.",
         },
         {
            title: "'Energy to Oxygen' cards actions availability fixed",
            description:
               "You can now play these cards' actions (Ironworks, Steelworks, Ore Processor and Water Splitting Plant) even when it's 14% oxygen.",
         },
         {
            title: 'Cards Seen fixed for Statistics',
            description:
               "Cards seen during a match are now properly saved on the server are correctly included in the 'Most % Played' statistics.",
         },
         {
            title: 'Industrial Center place tiles fixed',
            description:
               'Before: you could place Industrial Center on any tile Not adjacent to city. After: you can place Industrial Center on any tile adjacent to city.',
         },
         {
            title: "Herbivores in the last 'after match' production fixed",
            description:
               'Herbivores are now being correctly added to the card when greeneries are placed at the end of the match (after gen 14).',
         },
         {
            title: "Cost of the Security Fleet's action fixed",
            description:
               "A titan resource is now deducted from the player's resources when using the Security Fleet's action.",
         },
         {
            title: 'Season 0 changed to Preseason for Games Statistics',
            description: '',
         },
         {
            title: 'Versions notice added',
            description: '',
         },
      ],
   },
   {
      number: '0.0.0',
      date: '2022-08-23',
      updates: [
         {
            title: 'Beta released',
            description: '',
         },
      ],
   },
]
