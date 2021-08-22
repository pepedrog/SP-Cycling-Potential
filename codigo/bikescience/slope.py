from shapely.geometry import MultiLineString, LineString, Point
from shapely import ops
import bikescience.map_widgets as mpw
import folium
from IPython.core.display import display, HTML

def calculate_slope (stretch, absolute = False):
    a = stretch.coords[0]
    b = stretch.coords[-1]
    x = ((a[0] - b[0])**2 + (a[1] - b[1])**2)**(0.5) * 10**5
    y = (b[2] - a[2])
    slope = y/x * 100
    if absolute:
        slope = abs(slope)
    return slope

def split_line(line, dist):
    """
        Split a LineString into 2 new LineStrings, the first one have length dist
    """
    if dist >= line.length * 10**5:
        return line, None
    a = line.coords[0]
    b = line.coords[1]
    t = dist / (10**5 * line.length)
    mid_point = Point([(1 - t) * a[0] + t * b[0],
                       (1 - t) * a[1] + t * b[1],
                       (1 - t) * a[2] + t * b[2]])
    return LineString([a, mid_point]), LineString([mid_point, b])
    
def split_route(route, stretch_size, absolute = False):
    segments = list(map(LineString, zip(route.coords[:-1], route.coords[1:])))
    if stretch_size == 'line':
        return [[s, calculate_slope(s, absolute)] for s in segments]
    stretchs = []
    stretch = None
    c_len = 0 # length of current stretch
    while len(segments) > 0:
        seg = segments.pop(0)
        s1, s2 = split_line(seg, stretch_size - c_len)
        
        if stretch is None:
            stretch = s1
        else:
            stretch = ops.linemerge(MultiLineString([stretch, s1]))
        
        if s2 is None:
            c_len += s1.length * 10**5
        else:
            stretchs.append([stretch, calculate_slope(stretch, absolute)])
            stretch = None
            c_len = 0
            segments.insert(0, s2)
    if stretch is not None:
        stretchs.append([stretch, calculate_slope(stretch, absolute)])
    return stretchs

def plot_slope (fmap, route, size, absolute = False):
    stretchs_slope = split_route(route, size, absolute)
    for s in stretchs_slope:
        if s[1] > 7:
            color='black'
        elif s[1] > 5:
            color='#982123'
        elif s[1] > 3:
            color='#D03F2E'
        elif s[1] > 1:
            color='#F1C359'
        elif s[1] > -1:
            color='yellow'
        elif s[1] > -3:
            color='#94C280'
        elif s[1] > -5:
            color='#0C9CB4'
        else:
            color='#025189'
        folium.GeoJson(s[0], control=False, style_function=lambda style, color=color :{'color': color, 'weight': 3}).add_to(fmap)

def build_legend_slopes (absolute):
    if absolute:
        legend = [['black', 'acima de 7%'],
                ['#982123', 'entre 5% e 7%'],
                ['#D03F2E', 'entre 3% e 5%'],
                ['#F1C359', 'entre 1% e 3%'],
                ['yellow', 'entre 0 e 1%']]
    else:
        legend = [['black', 'acima de 7%'],
                ['#982123', 'entre 5% e 7%'],
                ['#D03F2E', 'entre 3% e 5%'],
                ['#F1C359', 'entre 1% e 3%'],
                ['yellow', 'entre -1 e 1%'],
                ['#94C280', 'entre -1% e -3%'],
                ['#0C9CB4', 'entre -3% e -5%'],
                ['#025189', 'abaixo de -5%']]
    return legend

def plot_slopes(fmap, routes, size, absolute=False, title=None):
    for r in routes:
        plot_slope (fmap, r, size, absolute)
    if title != None:
        fmap.get_root().html.add_child(folium.Element(mpw.build_title(title)))
        fmap.get_root().html.add_child(folium.Element(mpw.build_legend_colors(title, build_legend_slopes(absolute))))
        fmap.get_root().html.add_child(folium.Element(mpw.drag_function(title)))
