import csv 
import sys
import json
import collections

years_selected = [str(year) for year in range(2000, 2016)]


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
    
    f = open('data/population.csv', 'r')
    reader = csv.reader(f)
    next(reader) #skip header
    for row in reader:
        state = row[0].strip()
        for i in range(0, len(years_selected)):
            y = years_selected[i]
            temp = years[y] 
            if(state not in temp):
                years[y][state] = {"population": 0, "illnesses": 0, "hospitalizations": 0, "fatalities": 0}
                
            existing_data = years[y][state]
            col_num = i+1;
            existing_data["population"] = int(row[col_num].replace(",", ""))
                
    with open('data/illnesses.json', 'w') as outfile:
        json.dump(years, outfile)
    
    
main()