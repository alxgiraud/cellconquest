/*global factionNameGenerator, console*/
var cellServices = (function () {
    'use strict';

    var cells = [], // all the cells displayed in the grid
        factions = [], // all the factions (i. e. species) fighting in the grid
        factionColors = [],
        isPeaceful = false,

        util = {
            randInt: function (min, max) {
                if (typeof min === 'undefined') {
                    min = 0;
                }
                if (typeof max === 'undefined') {
                    max = 0;
                }
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            randFloat: function (min, max) {
                if (typeof min === 'undefined') {
                    min = 0;
                }
                if (typeof max === 'undefined') {
                    max = 0;
                }
                return Math.random() * (max - min) + min;
            },
            getRandomColor: function () {
                var letters = '0123456789ABCDEF',
                    color = '#',
                    i;

                for (i = 0; i < 6; i += 1) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        },

        setFactionColors = function (nbFactions) {
            var baseColors = ['#a6cee3', '#b2df8a', '#1f78b4', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#b15928'],
                i;
            factionColors = [];
            for (i = 0; i < nbFactions; i += 1) {
                if (baseColors.length > i) {
                    factionColors.push(baseColors[i]);
                } else {
                    factionColors.push(util.getRandomColor());
                }
            }
        },
        getFactionColor = function (id) {
            return (id < 0) ? 'white' : factionColors[id];
        },
        getFriendlyNeighbors = function (x, y, factionId) {
            var neighbors = 0;

            // X-1 ; Y-1
            if (x > 0 && y > 0 && cells[x - 1][y - 1].age > 0 && cells[x - 1][y - 1].factionId === factionId) {
                neighbors += 1;
            }
            // X-1 ; Y+1
            if (x > 0 && y < cells[0].length - 1 && cells[x - 1][y + 1].age > 0 && cells[x - 1][y + 1].factionId === factionId) {
                neighbors += 1;
            }
            // X+1 ; Y-1
            if (x < cells.length - 1 && y > 0 && cells[x + 1][y - 1].age > 0 && cells[x + 1][y - 1].factionId === factionId) {
                neighbors += 1;
            }
            // X+1 ; Y+1
            if (x < cells.length - 1 && y < cells[0].length - 1 && cells[x + 1][y + 1].age > 0 && cells[x + 1][y + 1].factionId === factionId) {
                neighbors += 1;
            }
            // X-1 ; Y
            if (x > 0 && cells[x - 1][y].age > 0 && cells[x - 1][y].factionId === factionId) {
                neighbors += 1;
            }
            // X ; Y-1
            if (y > 0 && cells[x][y - 1].age > 0 && cells[x][y - 1].factionId === factionId) {
                neighbors += 1;
            }
            // X ; Y+1
            if (y < cells[0].length - 1 && cells[x][y + 1].age > 0 && cells[x][y + 1].factionId === factionId) {
                neighbors += 1;
            }
            // X+1 ; Y
            if (x < cells.length - 1 && cells[x + 1][y].age > 0 && cells[x + 1][y].factionId === factionId) {
                neighbors += 1;
            }

            return neighbors;
        },
        getNewBasePosition = function (baseId) {
            var isAvailableBase = false,
                rndRow,
                rndCol,
                totalNeighbors,
                i;

            //the new factoion need an empty 3x3 square in the grid to be generated
            while (!isAvailableBase) {

                rndRow = util.randInt(1, cells.length - 2);
                rndCol = util.randInt(1, cells[0].length - 2);

                totalNeighbors = 0;
                for (i = baseId; i > -1; i -= 1) {
                    totalNeighbors += getFriendlyNeighbors(rndRow, rndCol, i);
                }

                if (cells[rndRow][rndCol].factionId === -1 && totalNeighbors === 0) {
                    isAvailableBase = true;
                }
            }

            return {
                x: rndRow,
                y: rndCol
            };
        },
        createFaction = function (id, lifespanRange, propagationChanceRange, neighborsRequired, attackRange, defenseRange, endlessMode) {

            var lifespan = (endlessMode) ? 9999999999 : util.randFloat(parseFloat(lifespanRange.min, 10) * 10, parseFloat(lifespanRange.max, 10) * 10),
                propagationChance = util.randFloat(parseFloat(propagationChanceRange.min / 100), parseFloat(propagationChanceRange.max / 100)),
                attack = util.randFloat(parseFloat(attackRange.min / 100), parseFloat(attackRange.max / 100)),
                defense = util.randFloat(parseFloat(defenseRange.min / 100), parseFloat(defenseRange.max / 100));

            return {
                id: id,
                name: factionNameGenerator.generateName(),
                lifespan: lifespan,
                propagationChance: propagationChance,
                neighborsRequired: neighborsRequired,
                attack: attack,
                defense: defense,
                color: getFactionColor(id),
                presence: 0
            };
        },
        createBase = function (position, faction) {
            cells[position.x - 1][position.y].age += 1;
            cells[position.x - 1][position.y].color = faction.color;
            cells[position.x - 1][position.y].factionId = faction.id;

            cells[position.x][position.y - 1].age += 1;
            cells[position.x][position.y - 1].color = faction.color;
            cells[position.x][position.y - 1].factionId = faction.id;

            cells[position.x][position.y].age += 1;
            cells[position.x][position.y].color = faction.color;
            cells[position.x][position.y].factionId = faction.id;

            cells[position.x][position.y + 1].age += 1;
            cells[position.x][position.y + 1].color = faction.color;
            cells[position.x][position.y + 1].factionId = faction.id;

            cells[position.x + 1][position.y].age += 1;
            cells[position.x + 1][position.y].color = faction.color;
            cells[position.x + 1][position.y].factionId = faction.id;
        },
        evolve = function (faction) {
            var i,
                j,
                cell,
                cellsToConquer = [];

            for (i = 0; i < cells.length; i += 1) {
                for (j = 0; j < cells[i].length; j += 1) {
                    cell = cells[i][j];
                    cell.friendlyNeighbors = getFriendlyNeighbors(i, j, faction.id);

                    if (cell.factionId === faction.id) {
                        if (cell.age > faction.lifespan) {
                            //Cell dies of old age
                            cell.age = 0;
                            cell.factionId = -1;
                            cell.color = getFactionColor(-1);
                        } else {
                            // Existing cells became older
                            cell.age += 1;
                        }

                    } else if ((cell.friendlyNeighbors > faction.neighborsRequired && Math.random() > 1 - faction.propagationChance) &&
                            (cell.age === 0 || (Math.random() < (0.5 + faction.attack - factions[cell.factionId].defense) && !isPeaceful))) {
                        //The faction invades an empty or enemy cell
                        cellsToConquer.push([i, j]);
                    }
                }
            }
            for (i = 0; i < cellsToConquer.length; i += 1) {
                cell = cells[cellsToConquer[i][0]][cellsToConquer[i][1]];
                cell.age = 1;
                cell.factionId = faction.id;
                cell.color = getFactionColor(faction.id);
            }
        },
        setPresence = function () {
            var i,
                j,
                cell,
                nbCells = 0,
                nbEmptyCells = 0,
                nbCellsOccupiedByFaction = [];

            for (i = 0; i < factions.length; i += 1) {
                nbCellsOccupiedByFaction[i] = 0;
            }

            for (i = 0; i < cells.length; i += 1) {
                for (j = 0; j < cells[i].length; j += 1) {
                    cell = cells[i][j];
                    nbCells += 1;

                    if (cell.factionId === -1) {
                        nbEmptyCells += 1;
                    } else {
                        nbCellsOccupiedByFaction[cell.factionId] += 1;
                    }
                }
            }

            for (i = 0; i < factions.length; i += 1) {
                factions[i].presence = nbCellsOccupiedByFaction[i] / nbCells;
            }
        };

    return {
        initCells: function (width, height, nbColumns, nbRows, peacefulMode) {
            var gridItemWidth = width / nbColumns,
                gridItemHeight = height / nbRows,
                xpos = 0,
                ypos = 0,
                i,
                j;
            isPeaceful = peacefulMode;
            cells = [];

            for (i = 0; i < nbRows; i += 1) {
                cells[i] = [];

                for (j = 0; j < nbColumns; j += 1) {
                    cells[i].push({
                        age: 0,
                        factionId: -1,
                        width: gridItemWidth,
                        height: gridItemHeight,
                        x: xpos,
                        y: ypos,
                        color: getFactionColor(-1)
                    });

                    xpos += gridItemWidth;
                }

                xpos = 0;
                ypos += gridItemHeight;
            }
        },
        generateFactions: function (nbFactions, lifespan, propagationChance, neighborsRequired, attack, defense, endlessMode) {
            var i,
                isAvailableBase,
                newBasePosition,
                name,
                newFaction;

            factions = [];

            if (nbFactions * 9 > (cells[0].length * cells.length) || cells[0].lenght < 3 || cells.length < 3) {
                console.error('The grid is too small to handle all these factions!');
                return;
            }

            setFactionColors(nbFactions);
            for (i = 0; i < nbFactions; i += 1) {
                newBasePosition = getNewBasePosition(i);
                newFaction = createFaction(i, lifespan, propagationChance, neighborsRequired, attack, defense, endlessMode);
                factions.push(newFaction);
                createBase(newBasePosition, newFaction);
            }
        },
        getCells: function () {
            return cells;
        },
        getFactions: function () {
            setPresence();
            return factions;
        },
        tick: function () {
            var i,
                nbOccupiedCellsByFaction = [],
                totalCells = 0;

            for (i = 0; i < factions.length; i += 1) {
                evolve(factions[i]);
            }

            setPresence();
        },
        resizeCells: function (width, height) {
            var gridItemWidth = width / cells[0].length,
                gridItemHeight = height / cells.length,
                xpos = 0,
                ypos = 0,
                i,
                j;

            for (i = 0; i < cells.length; i += 1) {
                for (j = 0; j < cells[i].length; j += 1) {
                    cells[i][j].width = gridItemWidth;
                    cells[i][j].height = gridItemHeight;
                    cells[i][j].x = xpos;
                    cells[i][j].y = ypos;

                    xpos += gridItemWidth;
                }

                xpos = 0;
                ypos += gridItemHeight;
            }
        }
    };
}());
