	window.addEventListener('load',function(){
		d3.json('tree.json', 
				function(err, graph) {
					var width = 1300,
						height = 700,
						diameter = 140;
						angle = 360;
						color = d3.scale.category20(),
						tree = d3.layout.tree()
										.size([angle, diameter])
										.separation(function(a, b){
											return (a.parent == b.parent ? 1: 2) / a.depth;
										});

					var x,y,scales;

					var zoom = d3.behavior.zoom()
							          	  .translate([width/2, height/2])   //  move distance
							          	  .scaleExtent([0.1, 4])  			//  scale range
							          	  .scale(1)             			//  scale times
							          	  .on("zoom", zoomed);
					
					function zoomed() {
				        x      = d3.event.translate[0];    					//  dista in time
				        y      = d3.event.translate[1];    					//  dista in time
				        scales = d3.event.scale;           					//  scale times in time    
				        tree_network.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
			        }

			        var tooltip = d3.select("body")							//	add related text shhow bar
									.append("div")
									.attr("class","tooltip")
									.style("opacity",0.0);

				   var svg = d3.select('.div_tree')							//	father svg
						        .append('svg')
						        .attr('width', width)
								.attr('height', height)
								.style({
						          'border':'1px solid #000'
						        })
						        .call(zoom);

					var tree_network = svg.append('g')						//	network graph svg
										  .attr('transform', 'translate(' + width/2  + ',' + height/2  + ')');

					var diagonal = d3.svg.diagonal.radial()
									 .projection(function(d) { return [d.y, (d.x / 180 * Math.PI)]; });

					roots = init(graph);		//	init network and just show nodes whose depth is 0 and 1
					console.log(roots);
					redraw(roots);				//	start to show network graph

					 
					function redraw(source){			//redraw network graph

					    /*
					    part_1  transform data by layout-tree
					    */
					    var nodes = tree.nodes(roots);
					    var links = tree.links(nodes);
					    console.log(nodes);
					    console.log(links);

					    //	renew axis_y of point
					    nodes.forEach(function(d) { d.y = d.depth * 180; });

					    /*
					    part_2  handle links
					    */

					    //	get update part of data links 
					    var linkUpdate = tree_network.selectAll(".link")
					                        .data(links, function(d){ return d.target.name; });
					                        
					    //	get enter part of data links
					    var linkEnter = linkUpdate.enter();

					    //	get exit part of data links
					    var linkExit = linkUpdate.exit();

					    //	handle enter part
					    linkEnter.insert('path', '.link')
								 .attr('class', 'link')
								 .attr('d', diagonal)
								 .style('stroke', '#ccc')
								 .style('stroke-width', 4)
						         .on("mouseover", function(d){
						         	tooltip.html(d["source"].name + "-" + d["target"].relations + "-" + d["target"].name)
										   .style("left", (d3.event.pageX) + "px")
										   .style("top", (d3.event.pageY + 20) + "px")
										   .style("opacity",100.0);
								 })
								 .on("mousemove",function(d){
								 	tooltip.style("left", (d3.event.pageX) + "px")
										   .style("top", (d3.event.pageY + 40) + "px");
								 })
								 .on("mouseout",function(d){
								 	tooltip.style("opacity",0.0);
								 });
						          					          

					    //	handle update part
					    linkUpdate.attr("d", diagonal);
					    			

					    //	handle exit part
					    linkExit.attr("d", function(d) {
							            var o = {x: source.x, y: source.y};
							            return diagonal({source: o, target: o});
							          }).remove();

					    /*
					    part_3  handle nodes
					    */

					    //	get update part of data nodes 
					    var nodeUpdate = tree_network.selectAll(".node")
					                        .data(nodes, function(d){ return d.name; });

					    //	get enter part of data nodes 
					    var nodeEnter = nodeUpdate.enter();

					    //	get exit part of data links 
					    var nodeExit = nodeUpdate.exit();

					    //	handle enter part
					    var enterNodes = nodeEnter.append("a")
					                    .attr("class","node")
					                    .attr('transform', function(d){
													  	return "rotate(" + (d.x-90) + ")translate(" + d.y + ")";
													 })
					                    .on("click", function(d) { 
					                    	childControl(nodes, d); 
					                    	redraw(d); 
					                    })
					                    .on("contextmenu", function(d){
					                    	console.log("jumpto");
					                    	jumpTo(d);
					                    });

					    enterNodes.append("circle");

					    enterNodes.append("text")
						          .attr("x", function(d) { return d.children || d._children ? -14 : 14; })
						          .attr("dy", ".35em")
						          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
						          .attr("transform", function(d){
			    				   		return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
			    				   })
						          .text(function(d) { return d.name; })
						          .style("fill-opacity", 0);


					    //	handle update part
					    var updateNodes = nodeUpdate.attr('transform', function(d){
													  	return "rotate(" + (d.x-90) + ")translate(" + d.y + ")";
													 });

					    updateNodes.select("circle")
							      .attr('r',function(d){
							      	cr= 24 - 4 * (d.depth - 1);
							      	return cr;
								  })
								  .style('stroke', function(d, i) { return d._children ? "lightsteelblue" :  "#fff"; })
								  .style('stroke-width', 3)
							      .style("fill", function(d, i) { return d._children ? "#fff" :  color(i); })
							      .on("mouseover",function(d,i){
							      	d3.select(this).style('fill', 'yellow');
								  })
								  .on("mouseout",function(d, i){
								  	d3.select(this).style("fill", function(d) { return d._children ? "#fff" :  color(i); });
								  })

					    updateNodes.select("text").style("fill-opacity", 1);

					    //	handle exit part
					    var exitNodes = nodeExit.attr('transform', function(d){
					    								return "rotate(" + (d.x-90) + ")translate(" + d.y + ")";
													}).remove();

					    exitNodes.select("circle").attr("r", 0);
					    exitNodes.select("text").style("fill-opacity", 0);

					    nodes.forEach(function(d) {		//	save nodes x, y in temp variable
					      d.x0 = d.x;
					      d.y0 = d.y;
					    });

					}	//	redraw(data) end

					function init(data){				//	close children of all nodes if its depth > 0		
					  	if("children" in data){
					  		for(var i = 0; i < data.children.length; i ++){
					  			data.children[i] = init(data.children[i]);
					  			if(data.children[i].children){
					  				data.children[i]._children = data.children[i].children;
					  				data.children[i].children = null;
					  			}
					  		}
					  	}
					  	return data;
					}
					  					  
					function childControl(nodes, d){	//	turn on/off children datas of nodes	
					  	if(d.depth > 0){
					  		for(var i = 0; i < nodes.length; i ++){
					  			if(nodes[i].depth == d.depth){
					  				if (nodes[i] != d) {							//	turn off some children nodes
					  					if(nodes[i].children){ 						//	if children nodes exist 
									      nodes[i]._children = nodes[i].children; 	//	save children nodes into _children
									      nodes[i].children = null;  				//	set children with null
									    }
					  				}
					  				else{
					  					if(d.children){ 
									      d._children = d.children; 
									      d.children = null;  						//	turn on some children nodes
									    }else{  									//	if none of children nodes exist
									      d.children = d._children; 				//	get from _children
									      d._children = null; 						//	set _children with null
								    	}
					  				}
					  			}
					  		}
					  	}
					}

					function jumpTo(d){
						gene = d;
						window.location.href='/paper.html';
					}
  
				})
	},false);