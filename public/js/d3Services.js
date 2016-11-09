/*global d3*/
var d3Services = (function () {
    'use strict';

    return {
        draw: function (width, height, cells) {
            var grid = d3.select('#grid').append('svg')
                .attr('width', width + 'px')
                .attr('height', height + 'px')
                .attr('id', 'svgGrid')
                // Remove comments to allow zoom and pan of the grid
                /*
                    .call(d3.zoom().on('zoom', function () {
                        grid.attr('transform', d3.event.transform);
                    }))
                */
                .append('g'),

                row = grid.selectAll('.row')
                .data(cells)
                .enter().append('svg:g')
                .attr('class', 'row'),

                col = row.selectAll('.cell')
                .data(function (c) {
                    return c;
                })
                .enter().append('svg:rect')
                .attr('class', 'cell')
                .attr('x', function (c) {
                    return c.x;
                })
                .attr('y', function (c) {
                    return c.y;
                })
                .attr('width', function (c) {
                    return c.width;
                })
                .attr('height', function (c) {
                    return c.height;
                })
                .style('fill', function (c) {
                    return c.color;
                })
                .style('stroke', 'black')
                .style('stroke-width', '0.3px');
        },
        repaint: function () {
            d3.selectAll('rect')
                .style('fill', function (c) {
                    return c.color;
                });
        },
        remove: function () {
            d3.select('svg').remove();
        }
    };
}());
