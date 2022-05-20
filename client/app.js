import './assets/scss/app.scss'

//jq -s '.[0] * .[1]' links.json nodes.json > data.json

var $ = require('jquery')
var d3 = require('d3')

$(document).ready(function() {

    var svg = d3.select('.canvas')

    $.getJSON('/data/data.json', function(data){

        var nodeById = d3.map();

        data.nodes.forEach(function(node) {
            nodeById.set(node.Id, node);
        });

        data.links.forEach(function(link) {
            link.source = nodeById.get(link.Source);
            link.target = nodeById.get(link.Target);
        });

        var link = svg
            .selectAll(".link")
            .data(data.links)
            .enter()
            .append("line")
                .style("stroke", "#000000")

        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("r", 5)
                .style("fill", "#69b3a2")

        var simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink()
                    .id(function(d) {return d.Id;})
                    .links(data.links)
            )
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(400, 400))
            .on("end", ticked);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

    });

})
