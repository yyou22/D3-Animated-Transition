import './assets/scss/app.scss'

//jq -s '.[0] * .[1]' links.json nodes.json > data.json

var $ = require('jquery')
var d3 = require('d3')

$(document).ready(function() {

    var width = 1200;
    var height = 1200;

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

        var linkForce  = d3.forceLink(data.links).distance(300);

        var simulation = d3.forceSimulation(data.nodes)
                            .alphaDecay(0.01)
                            .force("linkForce",linkForce)
                            .force("center", d3.forceCenter(600, 600));

        var link = svg
            .selectAll(".link")
            .data(data.links)
            .enter()
            .append("line")
                .style("stroke", "#BB6A9A")
                .attr("stroke-width", 0.5)

        var node = svg
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("r", 6)
                .attr("stroke", "#691A45")
                .attr("stroke-width", 1)
                .style("fill", "#69b3a2")
                .call(d3.drag()
                .on("start",dragstarted)
                .on("drag",dragged)
                .on("end",dragended));

        function dragstarted(d) {
           simulation.restart();
           simulation.alpha(0.7);
           d.fx = d.x;
           d.fy = d.y;
        }

        function dragged(d) {
           d.fx = d3.event.x;
           d.fy = d3.event.y;
        }

        function dragended(d) {
           d.fx = null;
           d.fy = null;
           simulation.alphaTarget(0.1);
        }

        function ticked(){
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        };

        simulation.on("tick",ticked);

        //adjacency matrix
        var matrix = [];
        var total_items = data.nodes.length

        data.nodes.forEach( function(node) {

            matrix[node.index] = d3.range(total_items).map(item_index => {
                return {
                    x: item_index,
                    y: node.index,
                    z: 0
                };
            });
        });

        data.links.forEach( function(link) {

            matrix[link.source.index][link.target.index].z += 1;
            matrix[link.target.index][link.source.index].z += 1;
            data.nodes[link.source.index].count += 1;
            data.nodes[link.target.index].count += 1;

        });

        var matrixScale = d3.scaleBand().range([50, width-50]).domain(d3.range(total_items));
        var opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);

        var rows = svg.selectAll(".row")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "row")
                        .attr("transform", (d, i) => {
                            return "translate(0," + matrixScale(i) + ")";
                        });

        var squares = rows.selectAll(".cell")
                        .data(d => d.filter(item => item.z > 0))
                        .enter().append("rect")
                        .attr("class", "cell")
                        .attr("x", d => matrixScale(d.x))
                        .attr("width", matrixScale.bandwidth())
                        .attr("height", matrixScale.bandwidth())
                        .style("fill-opacity", d => opacityScale(d.z)).style("fill", "purple")

        var columns = svg.selectAll(".column")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "column")
                        .attr("transform", (d, i) => {
                            return "translate(" + matrixScale(i) + ")rotate(-90)";
                        });

        rows.append("text")
            .attr("class", "label")
            .attr("x", 40)
            .attr("y", matrixScale.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .attr("font-size","5px")
            .text((d, i) => data.nodes[i].Id);
    });

})
