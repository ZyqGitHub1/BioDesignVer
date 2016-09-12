function draw(data){
    $('#div_force').empty();
    var width = $('#wrap').width(),
        height = $('#wrap').height(),
        color = d3.scale.category20(),
        tree = d3.layout.tree();
    var x,y,s;
    var zoom = d3.behavior.zoom()
                          .translate([0, 0])    //  move distance
                          .scaleExtent([0.5, 6])  //  scale range
                          .scale(1)             //  scale times
                          .on("zoom", zoomed);
    function zoomed() {
        x=d3.event.translate[0];    //  dista in time
        y=d3.event.translate[1];    //  dista in time
        s=d3.event.scale;           //  scale times in time
        recommend_network.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }
    var tooltip = d3.select("body")		//	add related text shhow bar
					.append("div")
					.attr("class","tooltip")
					.style("opacity",0.0);
    var svg = d3.select('#div_force')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style({
                  'border':'1px solid #000'
                })
                .call(zoom);
    var recommend_network = svg.append('g');
    var nodes = tree.nodes(data);
    var links = tree.links(nodes);
    var force = d3.layout.force()
                     .nodes(nodes)
                     .links(links)
                     .size([width, height])
                     .gravity(0.04)
                     .linkDistance(175)
                     .charge([-550])
                     .start();
    var svgEdge = recommend_network.selectAll('line')
                            .data(links)
                            .enter()
                            .append('line')
                            .style('stroke', '#ccc')
                            .style('stroke-width', 5)
                            .on("mouseover", function(d){
								tooltip.html(d["target"].relations)
									   .style("left", (d3.event.pageX) + "px")
									   .style("top", (d3.event.pageY + 20) + "px")
									   .style("opacity",1.0);
								})
						    .on("mousemove",function(d){			//	mouse move in and show tooltip bar
								tooltip.style("left", (d3.event.pageX) + "px")
									   .style("top", (d3.event.pageY + 20) + "px");
								})
						    .on("mouseout",function(d){			//	mouse move out and tooltip bar's opacity is zero
								tooltip.style("opacity",0.0);
								});				
    var svgNode = recommend_network.selectAll('circle')
                                    .data(nodes)
                                    .enter()
                                    .append('a')
                                    .append('circle')
                                    .attr("xlink:href","#page-2")
                                    .attr("class","pageload-link")
                                    .attr('r',function(d){
                                        cr= 24 - 4 * (d.depth - 1);  
										return cr;
									})
                                    .style("fill",function(d,i){
                                        return color(i);
                                    })
                                    .style('stroke', '#fff')
                                    .style('stroke-width', 3)
                                    .on("mouseover",function(d,i){
                                        $("#loader").css('background',color(i));
                                        d3.select(this).style('fill', 'yellow')
                                    })
                                    .on("mouseout",function(d, i){
                                        d3.select(this).style('fill', color(i))
                                    })
                                    .on("click", function(d){
                                        return d.name;
                                    });
    var svgText = recommend_network.selectAll('text')
                           .data(nodes)
                           .enter()
                           .append('text')
                           .style('fill', 'black')
                           .attr('dx', 20)
                           .attr('dy', 8)
                           .text(function(d){
                                return d.name;
                           })
    force.on('tick', function(){
        //	renew edge location
        svgEdge.attr("x1",function(d){ return d.source.x; })
                 .attr("y1",function(d){ return d.source.y; })
                 .attr("x2",function(d){ return d.target.x; })
                 .attr("y2",function(d){ return d.target.y; });
        //	renew node location
        svgNode.attr("cx",function(d){ return d.x; })
                 .attr("cy",function(d){ return d.y; });
        //	renew text location
        svgText.attr("x", function(d){ return d.x; })
                 .attr("y", function(d){ return d.y; });
        });
    }