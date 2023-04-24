export const VERSIONS = [
   {
      number: '0.2.4',
      date: '2023-04-24',
      updates: [
         {
            title: "Cost reduction on a card from deck after playing Inventors' Guild's or Business Network's action fixed",
            description: '',
         },
      ],
   },
   {
      number: '0.2.3',
      date: '2023-04-21',
      updates: [
         {
            title: 'Icons of cards with ids: 002 and 003 have been fixed',
            description: '',
         },
         {
            title: 'Statistics page fixed',
            description: '',
         },
         {
            title: 'Cards animation fixed',
            description: '',
         },
      ],
   },
   {
      number: '0.2.2',
      date: '2023-04-20',
      updates: [
         {
            title: 'Session expired issue solved',
            description:
               'There was a bug where the application crashed when user session expired and clicked ranked match, create quick match with id or play quick match with id. It is now fixed.',
         },
         {
            title: 'Corporation name added to the end stats table',
            description: '',
         },
      ],
   },
   {
      number: '0.2.1',
      date: '2023-04-19',
      updates: [
         {
            title: 'Code refactoring done for styles and files structure',
            description: '',
         },
         {
            title: 'Heat to temperature button disabled when 8C',
            description:
               'Button to raise a temperature using heat is not disabled when temperature reaches 8C.',
         },
         {
            title: 'Sorting by playability fixed',
            description: '',
         },
         {
            title: "Payment for Aquifer Pumping's action can now be decreased only by steel, not titan",
            description:
               "There were some cases, where after playing any space card and having that action available, you could pay for the ocean from Aquifer Pumping's action with titan (only if you had any titan resource). The bug is now fixed.",
         },
         {
            title: 'Number of placed oceans fixed after playing some cards',
            description:
               'Whenever you place one of any number of oceans from any action, the counter of oceans will now update.',
         },
         {
            title: 'Disappearing actions from actions list fixed',
            description:
               'There were few actions, increasing any global parameter, that were disappearing after a specific global parameter was maxed. It is now fixed.',
         },
      ],
   },
   {
      number: '0.2.0',
      date: '2023-04-04',
      updates: [
         {
            title: 'Achievements bug fixed',
            description: 'Achievements page is now displayed correctly.',
         },
      ],
   },
   {
      number: '0.1.9',
      date: '2023-03-13',
      updates: [
         {
            title: 'Statistics bug fixed',
            description: 'Games Statistics page and More Stats page are now displayed correctly.',
         },
      ],
   },
   {
      number: '0.1.8',
      date: '2022-11-26',
      updates: [
         {
            title: 'Power Infrastructure & Hired Raiders icons corrected',
            description: '',
         },
         {
            title: 'Arrows in "Select card to discard" phase corrected',
            description:
               'Arrows are now showing when the "Select card to discard" phase is on and more cards are added to the player\'s cards in hand.',
         },
      ],
   },
   {
      number: '0.1.7',
      date: '2022-09-12',
      updates: [
         {
            title: 'Insulation and Moss requirements fixed',
            description:
               'Insulation is now playable with 0 heat production, Moss is not unplayable without at least 1 plant.',
         },
      ],
   },
   {
      number: '0.1.6',
      date: '2022-09-02',
      updates: [
         {
            title: 'Nitrite Reducing Bacteria immediate effect icon corrected',
            description: '',
         },
         {
            title: 'Caretaker Contract action requirement fixed',
            description: 'The action is now independent of the temperature parameter.',
         },
         {
            title: 'Tip Text in Main Menu hidden when loading',
            description:
               'Before: the Tip Text for Account, Ranked Match or Match with Id was showing when the state was loading. After: it is now hidden.',
         },
         {
            title: 'Sort settings saving on server fixed',
            description:
               "Sort by buttons in the cards modal now are updating user's settings on the server properly.",
         },
         {
            title: 'Tags requirements fixed',
            description:
               'Before: having research played counted ANY tag as +1 to the tags requirements. After: it is not counted as +1 ONLY for science tags requirements.',
         },
      ],
   },
   {
      number: '0.1.5',
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
         {
            title: 'Cards left in deck added to the ended ranked matches',
            description:
               'For testing purposes; cards seen vs cards left in deck now can be easily compared.',
         },
      ],
   },
   {
      number: '0.1.4',
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
      number: '0.1.3',
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
      number: '0.1.2',
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
      number: '0.1.1',
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
      number: '0.1.0',
      date: '2022-08-23',
      updates: [
         {
            title: 'Beta released',
            description: '',
         },
      ],
   },
]
