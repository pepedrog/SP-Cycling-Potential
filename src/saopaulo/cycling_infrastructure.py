import geopandas as gpd
import folium

def load_protected_lanes (path = '../data/sao-paulo/infraestrutura-cicloviaria/cet/Ciclovias.shp'):
    protected_lanes = \
            gpd.read_file(path)
    protected_lanes = protected_lanes.dissolve(by="programa", as_index=False)
    protected_lanes = protected_lanes[protected_lanes['programa'].str.contains("CICLOVIA")] # tira ciclofaixa
    protected_lanes.crs = {'init': 'epsg:4326'} 
    #protected_lanes.to_crs(epsg='4326', inplace=True)
    return protected_lanes

def load_bike_lanes (path = '../data/sao-paulo/infraestrutura-cicloviaria/cet/Ciclovias.shp'):
    bike_lanes = \
            gpd.read_file(path)
    bike_lanes = bike_lanes.dissolve(by="programa", as_index=False)
    bike_lanes = bike_lanes[bike_lanes['programa'].str.contains("CICLOFAIXA")] # arquivo também contém ciclovia
    bike_lanes.crs = {'init': 'epsg:4326'}  
    #bike_lanes.to_crs(epsg='4326', inplace=True)
    return bike_lanes

def load_sharrow_lanes (path = '../data/sao-paulo/infraestrutura-cicloviaria/cet/Ciclorrotas.shp'):
    sharrow_lanes = \
            gpd.read_file(path)
    sharrow_lanes = sharrow_lanes.dissolve(by="programa", as_index=False)
    sharrow_lanes.crs = {'init': 'epsg:4326'}  
    #sharrow_lanes.to_crs(epsg='4326', inplace=True)
    return sharrow_lanes

def plot_cycling_infra(fmap, protected_lanes, bike_lanes, sharrow_lanes,
                       protected_color = 'red', bike_lane_color = 'green', 
                       sharrow_color = 'orange'):
    style_protected = lambda style:{'color':protected_color, 'weight': 2}
    style_lane = lambda style:{'color':bike_lane_color, 'weight': 2}
    style_sharrow = lambda style:{'color':sharrow_color, 'weight': 2}
    folium.GeoJson(protected_lanes, show = False, control = True,
                       style_function = style_protected,
                       name = 'Mostrar Ciclovias').add_to(fmap)
    folium.GeoJson(bike_lanes, show = False, control = True,
                       style_function = style_lane,
                       name = 'Mostrar Ciclofaixas').add_to(fmap)
    ciclorrotas=folium.FeatureGroup(name = 'Mostrar Ciclorrotas', show = False, control = True)
    for i in range(0, len(sharrow_lanes)):
        folium.GeoJson(sharrow_lanes.iloc[i]['geometry'],
                       style_function = style_sharrow).add_to(ciclorrotas)
    ciclorrotas.add_to(fmap)
