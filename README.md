# Cell Conquest

### http://cellconquest.herokuapp.com/

**Cell Conquest** is a web application using [Vue.js](https://github.com/vuejs/vue) and [d3.js](https://github.com/d3/d3).

It simulates the evolution of randomly generated cell factions in a grid.

A cell occupied by a faction lives for a certain amount of time then die, leaving the cell empty.
Every 100ms, each faction has a chance to spread to an adjacent cell.

If the cell is already occupied by another faction, the factions will fight.
The chance of success is calculated using the following formula:
`50% + Attack Bonus (assailant) - Defense Bonus (defender)`

Each faction share some randomly assigned attributes.

Attribute | Definition
------------ | -------------
Lifespan | Period of time for which a cell live or is expected to live.
Spread Chance | Probability of an adjacent cell to be conquered by a faction each cycle
Required Neighbors | Amount of adjacent cells (diagonals included) required for spreading
Attack Bonus | Increase the probability of a successful attack
Defense Bonus | Increase the probability of a successful defense

These attributes can be updated in the **Settings** panel.
