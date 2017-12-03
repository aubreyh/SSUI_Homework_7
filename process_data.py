import csv 
import sys
import json
import collections

years_selected = ["2010", "2011", "2012", "2013", "2014", "2015"]

def main():
    data = {}
    f = open('data/outbreaks_modified.csv', 'r')
    reader = csv.reader(f)
    next(reader) #skip header
    for row in reader:
        year = row[0] #e.g., 1998
        month = row[1] #e.g., January
        state = row[2] #e.g., California
        location = row[3].lower() #e.g., Restaurant
        food = row[4] #e.g., Custard
        ingredient = row[5] #e.g., Egg
        species = row[6] #e.g., Salmonella enterica
        serotype = row[7] #e.g., Enteritidis
        status = row[8] # e.g., Confirmed
        
        illnesses = 0
        hospitalizations = 0
        fatalities = 0
        
        if(row[9] != ""):
            illnesses = int(row[9])
        if(row[10] != ""):
            hospitalizations = int(row[10])
        if(row[11] != ""):
            fatalities = int(row[11])
        if("restaurant" in location and year in years_selected): #and "Confirmed" in status):
            if((year, state) in data):
                existing_data = data[(year, state)]
                existing_data["illnesses"] += illnesses
                existing_data["hospitalizations"] += hospitalizations
                existing_data["fatalities"] += fatalities
                data[(year, state)] = existing_data
            else:
                data[(year, state)] = {"population": 0, "illnesses": illnesses, "hospitalizations": hospitalizations, "fatalities": fatalities}
    f.close()
    
    
    years = collections.defaultdict(dict)   
    for (k1, k2), value in data.iteritems(): 
        years[k1][k2] = value
    
    f = open('data/nst-est2016-01_modified.csv', 'r')
    reader = csv.reader(f)
    next(reader) #skip header
    for row in reader:
        state = row[0].strip()
        year_2010 = int(row[3].replace(",", ""))
        year_2011 = int(row[4].replace(",", ""))
        year_2012 = int(row[5].replace(",", ""))
        year_2013 = int(row[6].replace(",", ""))
        year_2014 = int(row[7].replace(",", ""))
        year_2015 = int(row[8].replace(",", ""))
        existing_data = years["2010"][state]
        existing_data["population"] = year_2010
        existing_data = years["2011"][state]
        existing_data["population"] = year_2011
        #print years["2012"]
        existing_data = years["2012"][state]
        existing_data["population"] = year_2012
        existing_data = years["2013"][state]
        existing_data["population"] = year_2013
        existing_data = years["2014"][state]
        existing_data["population"] = year_2014
        existing_data = years["2015"][state]
        existing_data["population"] = year_2015

    with open('data/illnesses.json', 'w') as outfile:
        json.dump(years, outfile)
    
    
main()