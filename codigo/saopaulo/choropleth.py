import bikescience.map_widgets as mpw
import saopaulo.cycling_infrastructure as cinfra
import folium

def plot_zones(fmap, geodf_zones, opacity_function, color, plot_rmsp = True):
    """
        Function to plot the the choropleth zones (polygons)
        Parameters:
            fmap: folium map where the polygons will be added
            geodf_zones: GeoDataFrame containing the data to be plotted
            opacity_function: lambda to calculate the value of the polygon
            Example: opacity_function = lambda x : x['properties']['area']
    """ 
    style_zones = lambda x: {'color': 'black', 'weight': 1, 'opacity': 0.3, 'fillOpacity': 0.1}
    folium.GeoJson(geodf_zones.loc[geodf_zones['NumeroMuni'] == 36],
                   style_function = lambda x : {'color': 'black', 'weight': 1, 'opacity': 1, 
                                                'fillOpacity': opacity_function(x), 'fillColor': color},
                   name='Zonas', control=False).add_to(fmap)
    if plot_rmsp:
        folium.GeoJson(geodf_zones.loc[geodf_zones['NumeroMuni'] != 36],
                       style_function = style_zones,
                       name='Zonas', control=False).add_to(fmap)
    
def plot_zones_tooltip(fmap, geodf, fields, aliases):
    """
        Function to set the tooltip (text that appear when the cursor is over)
        Fields are the collumns of the geodf to be written
        Aliases and fields must be in the same order 
    """
    tooltip_zona=folium.features.GeoJsonTooltip(
                        fields, aliases)
    folium.GeoJson(geodf.loc[geodf['NumeroMuni'] == 36],
                   style_function = lambda x : {'opacity': 0, 'fillOpacity': 0},
                   name = 'Detalhes da zona', control = True,
                   tooltip = tooltip_zona).add_to(fmap)

def plot_choropleth(fmap, title, color, value_function, geodf_zones, 
                      tooltip_columns, tooltip_aliases):
    """
        Add a choropleth style element to fmap, calculating values for the geodf_zones.
        this geoDataFrame must be on the SaoPaulo zone DataFrames pattern,
        i.e., contain a column 'NumeroMuni' and the SaoPaulo number must be 36
    """
    geodf_zones['choropleth_value'] = geodf_zones.apply(value_function, axis=1)
    max_value = max(geodf_zones['choropleth_value'])
    geodf_zones['choropleth_value'] = geodf_zones['choropleth_value']/max_value
    opacity_function = lambda x : x['properties']['choropleth_value']
    
    plot_zones(fmap, geodf_zones, opacity_function, color)
    plot_zones_tooltip(fmap, geodf_zones, tooltip_columns, tooltip_aliases)
    
    fmap.get_root().html.add_child(folium.Element(mpw.build_title(title)))
    fmap.get_root().html.add_child(folium.Element(mpw.build_legend(title, color, 0, str(round(max_value,2)))))
    fmap.get_root().html.add_child(folium.Element(mpw.drag_function(title)))
