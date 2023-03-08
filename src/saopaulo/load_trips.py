import pandas as pd

#filters for OD data

#period
def morning(trips):
    """Filter the morning trips, returning a new dataframe."""
    return trips[(trips['hour'] >= 5)  & (trips['hour'] <= 9)]

def lunchtime(trips):
    """Filter the lunchtime trips, returning a new dataframe."""
    return trips[(trips['hour'] >= 11)  & (trips['hour'] <= 13)]

def afternoon(trips):
    """Filter the afternoon trips, returning a new dataframe."""
    return trips[(trips['hour'] >= 17)  & (trips['hour'] <= 19)]

period_functions = [lambda trips: trips, morning, lunchtime, afternoon]

#gender
def women(trips):
    """Filter trips rode by women, returning a new dataframe."""
    return trips[trips['SEXO'] == 2]

def men(trips):
    """Filter trips rode by men, returning a new dataframe."""
    return trips[trips['SEXO'] == 1]

gender_functions = [lambda trips: trips, men, women]

def select_age_range(trips,age_range):
    trips = trips[~trips['IDADE'].isnull()]
    trips = trips[(trips['IDADE'] >= age_range[0]) & (trips['IDADE'] <= age_range[1])]
    return trips

def select_period(trips,period_range):
    trips = trips[(~trips['HORA_SAIDA'].isnull()) | (~trips['HORA_CHEG'].isnull())]
    trips = trips[(trips['HORA_SAIDA'] >= period_range[0]) & (trips['HORA_CHEG'] <= period_range[1])]
    return trips

def select_bike_reason(trips,bike_reason):
    if bike_reason == 0:
        return trips
    else:
        trips = trips[trips['PE_BICI'] == bike_reason]
    return trips
