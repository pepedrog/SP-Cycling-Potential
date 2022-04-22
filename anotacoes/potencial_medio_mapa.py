
def calculate_trips_mean_pot_intersection (trips, zones, potential_label):
    
    trips_geometries = list(trips['geometry'])
    trips_expansion = list(trips['FE_VIA'])
    trips_potential = list(trips[potential_label])

    total_per_zone = [0]*len(zones) # hash to store trips indexed by zones

    progress = 0
    
    for z in range(len(zone_shp)):
        total_trips = 0
        zone = zones.iloc[z]['geometry']
        
        if z / len(zones) >= progress:
            print (round(progress * 100), '%')
            progress += 0.1
            
            
        for i in range (len (trips_geometries)):
            if reference == 'intersection':
                if (trips_geometries[i].intersects(zone)):
                    total_per_zone[z] += trips_expansion[i] * trips_potential[i]
                    total_trips += trips_expansion[i]
            
            else:
                p = trips_geometries[i].coords[reference]
                if (Point(p[0], p[1]).within(zone)):
                    total_per_zone[z] += trips_expansion[i] * trips_potential[i]
                    total_trips += trips_expansion[i]
        
        total_per_zone[z] = 0 if total_trips == 0 else total_per_zone[z] / total_trips
            
    return total_per_zone    
    
    
    
    
def plot_potential_mean_widgets():
    im = interact_manual(
        plot_potential_mean,
        variable = widgets.Dropdown(options = [('Final', 'final_potential'), 
                                               ('Distance', 'distance_potential'), 
                                               ('Age', 'age_potential'), 
                                               ('Inclination', 'inclination_potential')],
                                    description = 'Potential Variable', 
                                    style={'description_width': '300px'},
                                    layout = widgets.Layout(width = '500px')),
        reference = widgets.Dropdown(options = [('Origin', 0), ('Destination', -1), 
                                                ('Whole Trip', 'intersection')],
                                     description = 'Trip Reference Point:\t', 
                                    style={'description_width': '300px'},
                                    layout = widgets.Layout(width = '500px')),
        
        modal = widgets.Dropdown(options = [('All', None), ('Car', 'car'), ('Subway', 'subway'),
                                            ('Pedestrian', 'pedestrian'), ('Motorcycle', 'motorcycle'),
                                            ('Train', 'train')],
                                 description = 'Modal', 
                                    style={'description_width': '300px'},
                                    layout = widgets.Layout(width = '500px'))
    )
    im.widget.children[4].description = 'Plot Map'
    
def plot_potential_mean(variable, reference, modal, only_sp = True):
    trips = [0]*len(zone_shp)
    potential = [0]*len(zone_shp)
    
    zones = zone_shp.loc[zone_shp["NumeroMuni"] == 36] if only_sp else zone_shp

    if modal != None:
        aux = od_trips.loc[od_trips['modal'] == modal]
    else:
        aux = od_trips
        
    if reference == 'intersect':
        mean = calculate_trips_mean_pot_intersection(aux, 
                                                    zones, variable)
    else:
        for i, t in aux.iterrows():
            potential[int(t[reference] - 1)] += t[variable] * t['FE_VIA']
            trips[int(t[reference] - 1)] += t['FE_VIA']

        mean = [0 if trips[i] == 0 else potential[i] / trips [i] for i in range(517)]
    
    zone_shp['mean_potential'] = mean
    zones = zone_shp.loc[zone_shp["NumeroMuni"] == 36] if only_sp else zone_shp

    tooltip_columns = ['NomeZona', 'mean_potential']
    tooltip_aliases = ['Zone', 'Mean Potential (' + reference + ')']
    fmap = gr.map_around_sp(the_grid=None,zoom=10,plot_grid=False)
    choro_folium.plot_choropleth(fmap, 'Mean Potential (' + reference + ') ' + ' (' + variable + ')', 
                                 'YlOrBr', lambda x : x['mean_potential'], 
                          zones, tooltip_columns, tooltip_aliases)
    display(fmap)


plot_potential_mean_widgets()
