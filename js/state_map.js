(function(){
	    
	var state_map = {};
		
	state_map.draw = function(id, data, state_paths, state_abbr, year, toolTip, color){	
        
        var old_svg = d3.select("svg");
        var width = +old_svg.attr("width");
        var height = +old_svg.attr("height");
        old_svg.remove()

        var svg = d3.select("#map_container").append("svg")
        svg.attr("id", "map");
        svg.attr("width", width);
        svg.attr("height", height);
        
        // year label; the value is set on transition.
        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 155)
            .attr("x", width - 30)
            .text(year);
        
        /* legend */        
        var x = d3.scaleLinear()
            .domain([1, 10])
            .rangeRound([600, 860]); //width and height of the scale
            
        var g = svg.append("g")
            .attr("class", "key")
            .attr("transform", "translate(0,40)");

        var linear_color = d3.scaleThreshold()
            .domain(d3.range(2, 10))
            .range(d3.schemeOranges[9]);
    
        g.selectAll("rect")
          .data(linear_color.range().map(function(d) {
              d = linear_color.invertExtent(d);
              if (d[0] == null) d[0] = x.domain()[0];
              if (d[1] == null) d[1] = x.domain()[1];
              return d;
            }))
          .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return x(d[0]); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("fill", function(d) { return linear_color(d[0]); });

        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Outbreaks Per Capita");

        tick_values = [5, 10, 15, 20, 25, 30, 35, 40, 45]       
        g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(function(x, i) { return i ? tick_values[i] : tick_values[i] + "%"; })
            .tickValues(linear_color.domain()))
          .select(".domain")
            .remove();

        /* end legend */
    
    
		function mouseOver(d){
			d3.select("#tooltip").transition().duration(200).style("opacity", .9);      
			var state_name = state_abbr[d.id]
			d3.select("#tooltip").html(toolTip(d.n, data[state_name]))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}
		
		function mouseOut(){
			d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
		}
		
		d3.select(id).selectAll(".state")
			.data(state_paths).enter().append("path")
            .attr("class", "state")
            .attr("d", function(d){ 
                return d.d;
            })
			.style("fill",function(d){ 
                var state_name = state_abbr[d.id]
                return color(d.rate = food_illnesses.get(d.id));  
            })
			.on("mouseover", mouseOver).on("mouseout", mouseOut);     
	} // end .draw
    
	this.state_map = state_map;
})();
