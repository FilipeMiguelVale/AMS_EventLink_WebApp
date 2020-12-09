from geopy import distance,exc
from geopy.geocoders import Nominatim

import os
from datetime import datetime, timedelta


# Calculo da severidade
def severity_calc(n_people,velocity, ABS, airbag, overturned, all_seatbelts_on):

    severity = 0

    severity += velocity * (0.2*(100/320)) + n_people * (0.20*(100/5))

    if not all_seatbelts_on:
        severity += 20 * (n_people/5)

    if ABS :
        severity += 5

    if airbag :
        severity += 17

    if overturned :
        severity += 18

    if severity >= 100 :
        severity = 100


    return int(severity)



#Comparar timestamps
def same_timestamp(timestamp):
    current_time = datetime.now()
    delta = timedelta(minutes=2)

    if current_time - delta > timestamp:
        return False
    
    return True

#Comparar distancia 
def isClose(point1,point2):

    dist = distance.vincenty(point1,point2).km # obter distancia entre as duas localizações

    if dist * 1000 > 20:
        return False
    
    return True

# obter endereço da localização
def get_location_address(lat,lng):

    geolocator = Nominatim(user_agent="my-application") # obter geocoder

    try:
        # obter dados da localização
        location_object = geolocator.reverse(
            (lat,lng), exactly_one=True, language="en-US", addressdetails=True, timeout=3)
    except KeyError == exc.GeocoderTimedOut:
        return "ERRO DETECTING THE ADDRESS",None
        
    if location_object is None or location_object.address is None: # retornar erro em caso de dados inexistentes
        return "ADDRESS NOT FOUND",None
    
    # retornar endereço
    city=None
    print(location_object.raw)
    if "county"in list(location_object.raw["address"]):
        city = location_object.raw["address"]["county"]

    if "address" in list(location_object.raw):
        if "city" in list(location_object.raw["address"]):
            if "road" in list(location_object.raw["address"]):
               return location_object.raw["address"]["road"] + ", " + location_object.raw["address"]["city"],city
            else:
                return location_object.raw["address"]["city"],city

    return location_object.address,city