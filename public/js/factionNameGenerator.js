var factionNameGenerator = (function () {
    'use strict';

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    var groups = [
            //team 
            ['armada', 'army', 'battalion', 'brigade', 'cohort', 'commandos', 'company', 'contingent', 'division', 'fleet', 'force', 'garrison', 'guard', 'legion', 'militia', 'patrol', 'phalanx', 'platoon', 'regiment', 'section', 'sentinel', 'sentry', 'squad', 'squadron', 'troop', 'vanguard'],
            //soldiers
            ['avengers', 'champions', 'elite', 'fighters', 'janissaries', 'marines', 'paladins', 'riders', 'skirmishers', 'soldiers', 'troopers', 'veterans', 'victors', 'warriors'],
            //warders
            ['crusaders', 'defenders', 'guardians', 'guards', 'keepers', 'knights', 'lords', 'preservers', 'protectors', 'rangers', 'sentinels', 'sentries', 'wardens', 'warders', 'watchers'],
            //mercenaries
            ['bandits', 'destroyers', 'devourers', 'marauders', 'pirates', 'raptors', 'reavers'],
            //gear
            ['arrows', 'axes', 'blades', 'bows', 'bucklers', 'claws', 'daggers', 'darts', 'fangs', 'fists', 'flails', 'gauntlets', 'halberds', 'hammers', 'helms', 'knives', 'lances', 'maces', 'pikes', 'scythes', 'shields', 'spears', 'swords', 'talons', 'teeth'],
            //creatures
            ['angels', 'basilisks', 'cobras', 'demons', 'devils', 'eagles', 'falcons', 'griffins', 'hawks', 'hounds', 'jaguars', 'lions', 'panthers', 'rats', 'scorpions', 'sharks', 'tigers', 'vipers', 'wolves']
        ],
        description = ['battle', 'blood', 'bolt', 'bone', 'chaos', 'dark', 'death', 'dire', 'doom', 'fire', 'flame', 'free', 'high', 'law', 'light', 'lightning', 'moon', 'night', 'rune', 'sea', 'skull', 'star', 'storm', 'sun', 'thunder', 'thunderbolt', 'torch', 'war', 'wave', 'wind', 'wing', 'wrath'];

    return {
        generateName: function () {
            var group = groups[Math.floor(Math.random() * 6)];
            return (description[Math.floor(Math.random() * description.length)] + ' ' +
                group[Math.floor(Math.random() * group.length)]).capitalize();
        }
    };

}());
