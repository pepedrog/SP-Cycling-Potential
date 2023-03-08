import numpy as np
import math
import folium

N = 30

def inv_parametric_circle(x, y, xc, yc):
    """
    ** Internal use function **
    
    Given a (x, y) point in a circumference of center (xc, yc), calculates the angle position of (x, y).
    """
    translated_x = x - xc
    translated_y = y - yc
    angle = np.arctan2(translated_y, translated_x)
    if angle < 0: 
        angle += 2*math.pi 
    return angle


def parametric_circle(t, xc, yc, R):
    """
    ** Internal use function **
    
    Given an angle position t in a circumference of center (xc, yc) and radius R, calculates the point (x, y) corresponding to t.
    """
    translated_x = R * np.cos(t)
    translated_y = R * np.sin(t)
    return translated_x + xc, translated_y + yc


def create_arc(N, R, xc, yc, start_point, end_point):
    """
    ** Internal use function **
    
    Create an arc as a set of consecutive points, for plotting on APIs like Folium that only draws straight lines.
    Parameters:
       N - number of points
       R - radius
       xc - center x coordinate
       yc - center y coordinate
       start_point - a (x0, y0) point on the circumference
       end_point - a (x1, y1) point on the circumference
       reverse - a boolean determining the drawing direction (clockwise or counterclockwise)
    """
    start_t = inv_parametric_circle(start_point[0], start_point[1], xc, yc)
    end_t = inv_parametric_circle(end_point[0], end_point[1], xc, yc)

    arc_T = np.linspace(start_t, end_t, N)
    X, Y = parametric_circle(arc_T, xc, yc, R)
    return X, Y, start_t, end_t


def center_x(x1, y1, x2, y2, radius):
    """
    ** Internal use function **
    
    Given circumference points (x1, y1) and (x2, y2) and a radius, calculates the x coordinate of a possible circle center.
    Tip: swapping the order of the points give another possible center.
    """
    radsq = radius * radius
    q = math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
    x3 = (x1 + x2) / 2
    return x3 + math.sqrt(radsq - ((q / 2) * (q / 2))) * ((y1 - y2) / q)


def center_y(x1, y1, x2, y2, radius):
    """
    ** Internal use function **
    
    Given circumference points (x1, y1) and (x2, y2) and a radius, calculates the y coordinate of a possible circle center.
    Tip: swapping the order of the points give another possible center.
    """
    radsq = radius * radius
    q = math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)))
    y3 = (y1 + y2) / 2
    return y3 + math.sqrt(radsq - ((q / 2) * (q / 2))) * ((x2-x1) / q)


def draw_arrow(folium_map, lat1, lon1, lat2, lon2, color='blue', weight=3, tip=6, text='', radius_fac=1.0, reverse = False):
    """
    Draw an arc arrow from two points on a folium map.
    
    Parameters:
       folium_map - the map
       lat1 - latitude of origin point
       lon1 - longitude of origin point
       lat2 - latitude of destination point
       lon2 - longitude of destination point
       color - maybe the month income of the arrow? just kidding :)
       weight - line width
       tip - arrow head size
       text - a hover text for mouse pointing
       radius_fac - The minimum possible radius for the arc is the distance between the points, i.e., 1.0*distance. 
                    This parameter is that multiplication factor: the bigger the factor, the smoother the arc.
    
    The N module variable determine how many segments will make the arc.
    """
    global N
    lat1, lon1, lat2, lon2 = .95*lat1 + .05*lat2, .95*lon1 + .05*lon2, .95*lat2 + .05*lat1, .95*lon2 + .05*lon1
    
    dist_x = lon1 - lon2
    dist_y = lat1 - lat2
    RADIUS = math.sqrt(dist_x*dist_x + dist_y*dist_y) * radius_fac

    if reverse: 
        xc = center_x(lon2, lat2, lon1, lat1, RADIUS)
        yc = center_y(lon2, lat2, lon1, lat1, RADIUS)
    else:
        xc = center_x(lon1, lat1, lon2, lat2, RADIUS)
        yc = center_y(lon1, lat1, lon2, lat2, RADIUS)
    arc_x, arc_y, start, end = create_arc(N, RADIUS, xc, yc, [lon1, lat1], [lon2, lat2])

    arc_points = iter(zip(arc_y, arc_x))
    ant = next(arc_points)
    for p in arc_points:
        folium.PolyLine(locations=[ant, p], color=color, weight = weight, popup=text).add_to(folium_map)
        ant = p

    rotation = 3*math.pi/2 - end
    rotation *= 180 / math.pi  # use degrees
    folium.RegularPolygonMarker(location=[lat2, lon2], fill_color=color, number_of_sides=3, radius=tip, 
                            rotation=rotation, popup=text).add_to(folium_map)
