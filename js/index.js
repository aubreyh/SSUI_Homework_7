    var food_illnesses = d3.map();
    var static_data;
    var state_paths; 
    var state_abbr;
    var first_year = "2000";
    
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    //year label; the value is set on transition
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 155)
        .attr("x", width - 30)
        .text(parseInt(first_year));
        
    
    var color_scale = d3.scaleQuantize();
    color_scale.domain([0, 45]);
    color_scale.range(d3.schemeOranges[9]);


    d3.queue()
        .defer(d3.json, 'data/illnesses.json')
        .defer(d3.json, 'data/state_paths.json')
        .defer(d3.json, 'data/state_abbreviations.json')
        .await(analyze);


    function analyze(error, illnesses, paths, abbreviations) {
        if (error) { 
            console.log(error); 
        }
        else {
            state_paths = paths["state_paths"];
            state_abbr = abbreviations;
            static_data = illnesses;
            update(first_year);
        }
    }
    
    
    // create html content string in tooltip div
    function tooltip(n, d){	
		
        return "<h4>"+ n +"</h4><table>"+
			   "<tr><td>Illnesses</td><td><span>" + (d.illnesses) + "</span></td></tr>"+
			   "<tr><td>Hospitalizations</td><td><span>" + (d.hospitalizations) + "</span></td></tr>"+
			   "<tr><td>Fatalities</td><td><span>" + (d.fatalities) + "</span></td></tr>"+
               "<tr><td colspan='2'><hr/></td></tr>"+
               "<tr><td>Per 100,000</td><td><span>" + (d.incidents_per_ht) + "</span></td></tr>"+
			   "</table>";
	}
    
    
    // when the input range changes, update the year 
    d3.select("#slider").on("input", function() {
        update(+this.value);
    });
    

    // update the elements
    function update(year) {
        data = static_data[year]
   
        d3.select("#slider").property("value", year);

        label.text(year); // update the year label

        var temp_data = {};
		
        food_illnesses.clear()
        
        Object.keys(state_abbr).forEach(function (abbr){ 
                     
            state_name = state_abbr[abbr]
          
            var population = data[state_name]["population"];
            var illnesses = data[state_name]["illnesses"];
            var hospitalizations = data[state_name]["hospitalizations"];
            var fatalities = data[state_name]["fatalities"];
            var all_incidents = illnesses + hospitalizations + fatalities;
                
            var per_ht = (all_incidents / population) * 100000;
                                
            food_illnesses.set(abbr, +per_ht);

            temp_data[state_name] = { population: population, 
                                      illnesses: illnesses, 
                                      hospitalizations: hospitalizations, 
                                      fatalities: fatalities,
                                      incidents_per_ht: per_ht.toFixed(2)
                                    };                                
        }); 
            
        /* draw states on id #map */	
        state_map.draw("#map", temp_data, state_paths, state_abbr, year, tooltip, color_scale);
	
        d3.select(self.frameElement).style("height", "600px"); 
    }
    

    

    

    
    
    