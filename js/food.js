    var state_abbr = {'AL': 'Alabama', 'AK': 'Alaska','AR': 'Arkansas','AZ': 'Arizona','CA': 'California','CO': 'Colorado','CT': 'Connecticut',
            'DC': 'Washington DC','DE': 'Delaware','FL': 'Florida','GA': 'Georgia','HI': 'Hawaii','IA': 'Iowa','ID': 'Idaho','IL': 'Illinois',
            'IN': 'Indiana','KS': 'Kansas','KY': 'Kentucky','LA': 'Louisiana','MA': 'Massachusetts','MD': 'Maryland','ME': 'Maine',
            'MI': 'Michigan','MN': 'Minnesota','MO': 'Missouri','MS': 'Mississippi','MT': 'Montana','NC': 'North Carolina',
            'ND': 'North Dakota','NE': 'Nebraska','NH': 'New Hampshire','NJ': 'New Jersey','NM': 'New Mexico','NV': 'Nevada',
            'NY': 'New York','OH': 'Ohio','OK': 'Oklahoma','OR': 'Oregon','PA': 'Pennsylvania','RI': 'Rhode Island',
            'SC': 'South Carolina','SD': 'South Dakota','TN': 'Tennessee','TX': 'Texas','UT': 'Utah','VA': 'Virginia',
            'VT': 'Vermont','WA': 'Washington','WI': 'Wisconsin','WV': 'West Virginia','WY': 'Wyoming'
    }

    var state_abbr_reverse = {'Alabama': 'AL','Alaska': 'AK','Arizona': 'AZ','Arkansas': 'AR','California': 'CA','Colorado': 'CO','Connecticut': 'CT',
        'Washington DC': 'DC','Delaware': 'DE','Florida': 'FL','Georgia': 'GA','Hawaii': 'HI','Idaho': 'ID','Illinois': 'IL','Indiana': 'IN','Iowa': 'IA',
        'Kansas': 'KS','Kentucky': 'KY','Louisiana': 'LA','Maine': 'ME','Maryland': 'MD','Massachusetts': 'MA','Michigan': 'MI','Minnesota': 'MN','Mississippi': 'MS',
        'Missouri': 'MO','Montana': 'MT','Nebraska': 'NE','Nevada': 'NV','New Hampshire': 'NH','New Jersey': 'NJ','New Mexico': 'NM','New York': 'NY',
        'North Carolina': 'NC','North Dakota': 'ND','Ohio': 'OH','Oklahoma': 'OK','Oregon': 'OR','Pennsylvania': 'PA','Rhode Island': 'RI',
        'South Carolina': 'SC','South Dakota': 'SD','Tennessee': 'TN','Texas': 'TX','Utah': 'UT','Vermont': 'VT','Virginia': 'VA','Washington': 'WA',
        'West Virginia': 'WV','Wisconsin': 'WI','Wyoming': 'WY'
    }
    
    var states = Object.keys(state_abbr)

    
    function tooltipHtml(n, d){	// function to create html content string in tooltip div. 
		
        return "<h4>"+ n +"</h4><table>"+
			"<tr><td>Illnesses</td><td>" + (d.illnesses) + "</td></tr>"+
			"<tr><td>Hospitalizations</td><td>" + (d.hospitalizations) + "</td></tr>"+
			"<tr><td>Fatalities</td><td>" + (d.fatalities) + "</td></tr>"+
			"</table>";
	}
    
    var food_illnesses = d3.map();
    
    d3.json("illnesses.json", function(error, all_data) {
        if (error) throw error;
      
        var data = all_data["2010"]
        //console.log(data)
      
        var sampleData = {};
		
        states.forEach(function(abbr){ 
            var low_value = 0;
            var mid_value = 10;
            var high_value = 100;
            
            state_name = state_abbr[abbr]
            //console.log(state_name)
            //console.log(data[state_name])
      
            var pop = data[state_name]["population"];
            var ill = data[state_name]["illnesses"];
            var hospital = data[state_name]["hospitalizations"];
            var deaths = data[state_name]["fatalities"];
            var all_incidents = ill + hospital + deaths;
            
            
            
            var by_population = (all_incidents / pop) * 100000;
            
            food_illnesses.set(abbr, +by_population);
            //console.log(state_name)
            //console.log(by_population)
            //console.log( rgb.toString(d3.interpolateYlGn(0)))
            //console.log(d3.interpolateOranges(0))
            //console.log(d3.interpolateOranges(1))
            sampleData[state_name] = {population: pop, 
                                      illnesses: ill, 
                                      hospitalizations: hospital, 
                                      fatalities: deaths,
                                      //rate: all_incidents,
                                      //color: d3.interpolate("#fff5eb", "#7f2704")(by_population)
                                      /*color: d3.interpolate("#fcfbfd", "#3f007d")(by_population)*/
                                      }; 
                                
                            
                         
            });
        
            /* draw states on id #statesvg */	
            uStates.draw("#statesvg", sampleData, tooltipHtml);
	
            d3.select(self.frameElement).style("height", "600px"); 
    });
    

    
    