import './assets/scss/app.scss'

//jq -s '.[0] * .[1]' links.json nodes.json > data.json

var $ = require('jquery');
var d3 = require('d3');
var mode = 0;

$(document).ready(function() {

    var width = 1200;
    var height = 1200;

    var svg1 = d3.select('.canvas1')
    var svg2 = d3.select('.canvas2')

    $.getJSON('/data/data.json', function(data){

        var nodeById = d3.map();

        data.nodes.forEach(function(node) {
            nodeById.set(node.Id, node);
        });

        data.links.forEach(function(link) {
            link.source = nodeById.get(link.Source);
            link.target = nodeById.get(link.Target);
        });

        var linkForce  = d3.forceLink(data.links).distance(100);

        var simulation = d3.forceSimulation(data.nodes)
                            .alphaDecay(0.01)
                            //.alphaTarget(1)
                            .force("linkForce",linkForce)
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter(600, 600));

        //adjacency matrix
        var matrix = [];
        var total_items = data.nodes.length

        data.nodes.forEach( function(node) {

            node.count = 0;

            matrix[node.index] = d3.range(total_items).map(item_index => {
                return {
                    x: item_index,
                    y: node.index,
                    z: 0
                };
            });
        });

        var links_ = []

        data.links.forEach( function(link) {

            if (matrix[link.source.index][link.target.index].z == 0 && matrix[link.target.index][link.source.index].z == 0) {
                links_.push({"source":link.source, "target":link.target, "count":1});
            }

            matrix[link.source.index][link.target.index].z += 1;
            matrix[link.target.index][link.source.index].z += 1;
            data.nodes[link.source.index].count += 1;
            data.nodes[link.target.index].count += 1;

        });

        //record the number of occurance for each link
        links_.forEach( function(link) {

            link.count = matrix[link.source.index][link.target.index].z;

        });

        var myColor = d3.scaleLinear().domain([1, 5]).range(["#BE638B", "#AF3168"])

        var link = svg1
            .selectAll(".link")
            .data(links_)
            .enter()
            .append("line")
                //.style("stroke", "#BB6A9A")
                .style("stroke", function(d) {return myColor(d.count);})
                .attr("stroke-width", 3.0)

        var node = svg1
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
                .attr("r", 10)
                .attr("stroke", "#FFFFFF")
                .attr("og", 1)
                .attr("stroke-width", 5)
                .style("fill", "#006E7F")
                .on("mouseover", function(d, i) {
                    d3.select(this).attr("r", 20).style("fill", "#F8B400")
                    d3.select('.canvas1')
                        .append('text')
                        .attr("id", "l" + i)
                        .attr('x', 30)
                        .attr('y', 50)
                        .text("Label: " + String(d.Label))
                        .style("font-size", "34px")
                    d3.select('.canvas1')
                        .append('text')
                        .attr("id", "d" + i)
                        .attr('x', 30)
                        .attr('y', 100)
                        .text("Id: " + String(d.Id))
                        .style("font-size", "34px")
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).attr("r", 10).style("fill", "#006E7F")
                    d3.select("#l" + i).remove();
                    d3.select("#d" + i).remove();
                })
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

        var matrixScale = d3.scaleBand().range([50, width-50]).domain(d3.range(total_items));
        var opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);

        var rows = svg2.selectAll(".row")
                        .data(matrix)
                        .enter().append("g")
                        .attr("class", "row")
                        .attr("transform", (d, i) => {
                            return "translate(0," + matrixScale(i) + ")";
                        });

        var squares = rows.selectAll(".cell")
                        .data(d => d.filter(item => item.z >= 0))
                        .enter().append("rect")
                        .attr("class", "cell")
                        .attr("x", d => matrixScale(d.x))
                        .attr("width", matrixScale.bandwidth())
                        .attr("height", matrixScale.bandwidth())
                        .style("fill-opacity", d => opacityScale(d.z))
                        .style("fill", function(d) {
                            if (matrix[d.x][d.y].z > 0) {
                                return "purple";
                            };
                            if (matrix[d.y][d.x].z > 0) {
                                return "purple";
                            };
                                return "white";
                            })

        var columns = svg2.selectAll(".column")
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

        columns.append("text")
            .attr("class", "label")
            .attr("x", -35)
            .attr("y", matrixScale.bandwidth() / 2)
            .attr("dy", ".32em")
            .attr("text-anchor", "end")
            .attr("font-size","5px")
            .text((d, i) => data.nodes[i].Id);

        //button transition
        d3.select("#trans1").on("click", function() {

            if (mode == 0) {

                mode = 2;

                //stop the force
                simulation.stop();

                //svg1.selectAll("line").remove()
                svg1.selectAll("line").style("opacity", 0)

                svg1.selectAll("circle").on(".drag", null).on("mouseover", null).on("mouseout", null)

                data.nodes.forEach(function(node) {
                    svg1.append("circle")
                        .attr("r", 10)
                        .attr("stroke", "#FFFFFF")
                        .attr("og", 0)
                        .attr("stroke-width", 5)
                        .style("fill", "#006E7F")
                        .attr("cx", 40)
                        .attr("cy", 40)
                        .style("fill-opacity", 0)
                        .style("opacity", 0)
                })

                svg1.selectAll("circle")
                    .transition()
                    .duration(1000)
                    .attr("cx", 40)
                    .attr("cy", 40)

                svg1.selectAll("circle")
                    .transition()
                    .delay(1000)
                    .duration(1)
                    .style("fill-opacity", 10)
                    .style("opacity", 10)

                svg1.selectAll("circle")
                    .filter(function() {
                        return d3.select(this).attr("og") == 1;
                    })
                    .transition()
                    .delay(1000)
                    .duration(2000)
                    .attr("cy", function(d, i) {
                        return matrixScale(i);
                    })
                    .attr("stroke-width", 1)

                svg1.selectAll("circle")
                    .filter(function() {
                        return d3.select(this).attr("og") == 0;
                    })
                    .transition()
                    .delay(1000)
                    .duration(2000)
                    .attr("cx", function(d, i) {
                        console.log(i);
                        return matrixScale(i);
                    })
                    .attr("stroke-width",1)

                svg1.selectAll("circle")
                    .transition()
                    .delay(3000)
                    .duration(1000)
                    .style("fill-opacity", 0)
                    .style("opacity", 0)

                svg1.transition()
                    .delay(3000)
                    .duration(1000)
                    .style("opacity", 0)

                setTimeout(function(){
                    mode = 1
                }, 4500);

            }

        });

        d3.select("#trans2").on("click", function() {

            if (mode == 1) {

                mode = 2

                svg1.selectAll("circle")
                    .transition()
                    .duration(1000)
                    .style("fill-opacity", 1)
                    .style("opacity", 1)

                svg1.transition()
                    .duration(1000)
                    .style("opacity", 10)

                svg1.selectAll("circle")
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("cx", 40)
                    .attr("cy", 40)
                    .attr("stroke-width", 5)

                svg1.selectAll("circle")
                    .transition()
                    .delay(2000)
                    .duration(1000)
                    .attr("cx", 600)
                    .attr("cy", 600)
                    .style("fill-opacity", 0)
                    .style("opacity", 0)

                svg1.selectAll("circle")
                    .transition()
                    .delay(3000)
                    .duration(1000)
                    .style("fill-opacity", 1)
                    .style("opacity", 1)

                svg1.selectAll("line")
                    .transition()
                    .delay(3000)
                    .duration(1000)
                    .style("opacity", 1)

                setTimeout(function(){
                    svg1.selectAll("circle")
                        .filter(function() {
                            return d3.select(this).attr("og") == 0;
                        })
                        .remove()
                    simulation.restart();
                    svg1.selectAll("circle")
                        .on("mouseover", function(d, i) {
                            d3.select(this).attr("r", 20).style("fill", "#F8B400")
                            d3.select('.canvas1')
                                .append('text')
                                .attr("id", "l" + i)
                                .attr('x', 30)
                                .attr('y', 50)
                                .text("Label: " + String(d.Label))
                                .style("font-size", "34px")
                            d3.select('.canvas1')
                                .append('text')
                                .attr("id", "d" + i)
                                .attr('x', 30)
                                .attr('y', 100)
                                .text("Id: " + String(d.Id))
                                .style("font-size", "34px")
                        })
                        .on("mouseout", function(d, i) {
                            d3.select(this).attr("r", 10).style("fill", "#006E7F")
                            d3.select("#l" + i).remove();
                            d3.select("#d" + i).remove();
                        })
                        .call(d3.drag()
                        .on("start",dragstarted)
                        .on("drag",dragged)
                        .on("end",dragended));
                }, 3000);

                setTimeout(function(){
                    mode = 0
                }, 3000);

            };

        });



    });

})
