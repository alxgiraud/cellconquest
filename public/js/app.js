/*global cellServices, d3Services, Vue*/
(function () {
    'use strict';

    var width = (document.body.clientWidth < 768) ? document.getElementById('grid').offsetWidth - 17 : document.getElementById('grid').offsetWidth,
        height = width,
        defaultParameters = {
            nbColumns: 30,
            nbRows: 30,
            nbFactions: 4,
            lifespan: {
                min: 3,
                max: 5
            },
            endlessMode: false,
            propagationChance: {
                min: 6,
                max: 10
            },
            neighborsRequired: 1,
            attack: {
                min: 0,
                max: 50
            },
            defense: {
                min: 0,
                max: 50
            },
            peacefulMode: false
        },
        app,
        loopId,

        getEmptyPresence = function () {
            var i,
                factions = cellServices.getFactions(),
                total = 0;
            for (i = 0; i < factions.length; i += 1) {
                total += Math.round(factions[i].presence * 100);
            }
            return 100 - total;
        },
        refreshEmptyPresence = function () {
            var emptyPresence = getEmptyPresence();
            app.emptyPresence = (emptyPresence > 0) ? emptyPresence : 0;
        },
        refreshFactions = function () {
            app.factions = cellServices.getFactions();
        };

    cellServices.initCells(width, height, defaultParameters.nbColumns, defaultParameters.nbRows, defaultParameters.peacefulMode);
    cellServices.generateFactions(defaultParameters.nbFactions, defaultParameters.lifespan, defaultParameters.propagationChance, defaultParameters.neighborsRequired, defaultParameters.attack, defaultParameters.defense);

    d3Services.draw(width, height, cellServices.getCells());

    app = new Vue({
        el: '#app',
        data: {
            hasError: false,
            factions: cellServices.getFactions(),
            emptyPresence: getEmptyPresence(),
            isRunning: false,
            nbColumns: defaultParameters.nbColumns,
            nbRows: defaultParameters.nbRows,
            nbFactions: defaultParameters.nbFactions,
            lifespan: {
                min: defaultParameters.lifespan.min,
                max: defaultParameters.lifespan.max
            },
            endlessMode: false,
            propagationChance: {
                min: defaultParameters.propagationChance.min,
                max: defaultParameters.propagationChance.max
            },
            neighborsRequired: defaultParameters.neighborsRequired,
            attack: {
                min: defaultParameters.attack.min,
                max: defaultParameters.attack.max
            },
            defense: {
                min: defaultParameters.defense.min,
                max: defaultParameters.defense.max
            },
            peacefulMode: defaultParameters.peacefulMode,
            hideLifespanLabel: false,
            delay: 100
        },
        methods: {
            run: function () {
                if (this.isRunning) {
                    this.isRunning = false;
                    clearInterval(loopId);

                } else {
                    this.isRunning = true;

                    loopId = setInterval(function () {
                        cellServices.tick();
                        d3Services.repaint();
                        refreshEmptyPresence();
                    }, this.delay);
                }
            },
            reset: function () {
                this.nbColumns = defaultParameters.nbColumns;
                this.nbRows = defaultParameters.nbRows;
                this.nbFactions = defaultParameters.nbFactions;
                this.lifespan.min = defaultParameters.lifespan.min;
                this.lifespan.max = defaultParameters.lifespan.max;
                this.endlessMode = defaultParameters.endlessMode;
                this.propagationChance.min = defaultParameters.propagationChance.min;
                this.propagationChance.max = defaultParameters.propagationChance.max;
                this.neighborsRequired = defaultParameters.neighborsRequired;
                this.attack.min = defaultParameters.attack.min;
                this.attack.max = defaultParameters.attack.max;
                this.defense.min = defaultParameters.defense.min;
                this.defense.max = defaultParameters.defense.max;
                this.peacefulMode = defaultParameters.peacefulMode;
                this.refresh();
            },
            refresh: function () {

                var width = document.getElementById('grid').offsetWidth,
                    height = width;
                if (this.isRunning) {
                    this.isRunning = false;
                    clearInterval(loopId);
                }

                cellServices.initCells(width, height, this.nbColumns, this.nbRows, this.peacefulMode);
                cellServices.generateFactions(this.nbFactions, this.lifespan, this.propagationChance, this.neighborsRequired, this.attack, this.defense, this.endlessMode);

                if (cellServices.getFactions().length > 0) {
                    this.hasError = false;
                    d3Services.remove();
                    d3Services.draw(width, height, cellServices.getCells());

                    refreshFactions();
                    refreshEmptyPresence();
                    this.hideLifespanLabel = (this.endlessMode) ? true : false;

                } else {
                    //TODO: error handling
                    this.hasError = true;
                }
            }
        }
    });
}());
