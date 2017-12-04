    var state_abbr = {'AL': 'Alabama', 'AK': 'Alaska','AR': 'Arkansas','AZ': 'Arizona','CA': 'California','CO': 'Colorado','CT': 'Connecticut',
            'DC': 'Washington DC','DE': 'Delaware','FL': 'Florida','GA': 'Georgia','HI': 'Hawaii','IA': 'Iowa','ID': 'Idaho','IL': 'Illinois',
            'IN': 'Indiana','KS': 'Kansas','KY': 'Kentucky','LA': 'Louisiana','MA': 'Massachusetts','MD': 'Maryland','ME': 'Maine',
            'MI': 'Michigan','MN': 'Minnesota','MO': 'Missouri','MS': 'Mississippi','MT': 'Montana','NC': 'North Carolina',
            'ND': 'North Dakota','NE': 'Nebraska','NH': 'New Hampshire','NJ': 'New Jersey','NM': 'New Mexico','NV': 'Nevada',
            'NY': 'New York','OH': 'Ohio','OK': 'Oklahoma','OR': 'Oregon','PA': 'Pennsylvania','RI': 'Rhode Island',
            'SC': 'South Carolina','SD': 'South Dakota','TN': 'Tennessee','TX': 'Texas','UT': 'Utah','VA': 'Virginia',
            'VT': 'Vermont','WA': 'Washington','WI': 'Wisconsin','WV': 'West Virginia','WY': 'Wyoming'
    }
    
    var states = Object.keys(state_abbr)

    
    function tooltipHtml(n, d){	// function to create html content string in tooltip div. 
		
        return "<h4>"+ n +"</h4><table>"+
			"<tr><td>Illnesses</td><td>" + (d.illnesses) + "</td></tr>"+
			"<tr><td>Hospitalizations</td><td>" + (d.hospitalizations) + "</td></tr>"+
			"<tr><td>Fatalities</td><td>" + (d.fatalities) + "</td></tr>"+
			"</table>";
	}
    
        // when the input range changes update the circle 
    d3.select("#nRadius").on("input", function() {
      update(+this.value);
    });

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
        

    // year label; the value is set on transition.
    var label = svg.append("text")
        .attr("class", "year label")
        .attr("text-anchor", "end")
        .attr("y", height - 150)
        .attr("x", width - 30)
        .text(2010);

    // update the elements
    function update(year) {
      //console.log(year)
      //console.log(static_data)
      data = static_data[year]
      //console.log(data)
      
      // adjust the text on the range slider
      //d3.select("#nRadius-value").text(year);
      d3.select("#nRadius").property("value", year);

        // update the year label
        label.text(year);

        var sampleData = {};
		
        food_illnesses.clear()
        states.forEach(function(abbr){ 
                     
            state_name = state_abbr[abbr]
      
            var pop = data[state_name]["population"];
            var ill = data[state_name]["illnesses"];
            var hospital = data[state_name]["hospitalizations"];
            var deaths = data[state_name]["fatalities"];
            var all_incidents = ill + hospital + deaths;
            
            
            
            var by_population = (all_incidents / pop) * 100000;
            
            food_illnesses.set(abbr, +by_population);

            sampleData[state_name] = {population: pop, 
                                      illnesses: ill, 
                                      hospitalizations: hospital, 
                                      fatalities: deaths,
                                      }; 
                                         
            });
            //console.log(sampleData)
            /* draw states on id #statesvg */	
            uStates.draw("#statesvg", sampleData, tooltipHtml);
	
            d3.select(self.frameElement).style("height", "600px"); 
    }
    
    var food_illnesses = d3.map();
    
    static_data = {};
    
    d3.queue()
        .defer(d3.json, "illnesses.json")
        .await(analyze);

    function analyze(error, data) {
      if(error) { console.log(error); }


      static_data["2010"] = data["2010"];
      static_data["2011"] = data["2011"];
      static_data["2012"] = data["2012"];
      static_data["2013"] = data["2013"];
      static_data["2014"] = data["2014"];
      static_data["2015"] = data["2015"];
      update("2010");
    }
    

    

    
    
    