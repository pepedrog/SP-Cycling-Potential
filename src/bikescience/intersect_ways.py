import geopandas as gpd
import numpy as np
from matplotlib import pyplot as plt


def intersect_ways(geodf1, idx1, geodf2, idx2, buffer_size=0, original_geometries=True):
    """
    Intersect two GeoDataFrames of lines (e.g., highways with bikeways) when there is no data column that
    corresponds them.
    
    Params:
    - geodf1, geodf2: geodataframes
    - idx1, idx2: lists of row identifier rows
    - buffer_size: width of way for intersecting
      (if zero, buffers are not applied - useful for slow, previously buffered)
    - original_geometries: brigs together the geometries in geodf1 and geodf2
    
    Returns: a dataframe composed of each possible intersection, containing the columns:
    - id columns of both GeoDataFrames
    - intersection: the intersection polygon
    - geometry1 and geometry2 (if original_geometries is True)
    
    Example:
    intersect_ways(highways, ['id_highway'], bike_lanes, ['id_bike_lane'], 0.0001)
    """
    
    if buffer_size > 0:
        print('Buffering GeoDataFrames...')
        buffered1 = gpd.GeoDataFrame(geodf1[idx1], geometry=geodf1.buffer(buffer_size))
        buffered2 = gpd.GeoDataFrame(geodf2[idx2], geometry=geodf2.buffer(buffer_size))
    else:
        buffered1 = geodf1
        buffered2 = geodf2

    intersections = gpd.sjoin(buffered1, buffered2, op='intersects')
    intersections = intersections.merge(buffered2, on=idx2)
    intersections['intersection'] = intersections.apply(
            lambda row: row.geometry_x.intersection(row.geometry_y),
            axis=1)
    
    columns_to_return = idx1 + idx2 + ['intersection']
    if original_geometries:
        intersections.rename(columns={'geometry_x': 'geometry1', 'geometry_y': 'geometry2'},
                             inplace=True)
        columns_to_return += ['geometry1', 'geometry2']
    return intersections[columns_to_return]


def merge_with_original_geometries(intersections, geodf1, idx1, geodf2, idx2):
    """Use if parameter original_geometries passed to intersect_ways was False"""
    new_df = intersections.merge(geodf1[idx1 + ['geometry']], on=idx1) \
                          .merge(geodf2[idx2 + ['geometry']], on=idx2)
    new_df.rename(columns={'geometry_x': 'geometry1', 'geometry_y': 'geometry2'},
                           inplace=True)
    return new_df


def metric_intersection_area(intersections):
    return gpd.GeoSeries(intersections.intersection).area


def aggregate_max_intersections(intersections, agg_idx, metric_col):
    return intersections.groupby(agg_idx, as_index=False).agg({metric_col: 'max'})


def plot_intersect_distributions(intersections, metric_col, cut_point=float('inf')):
    stat = intersections[metric_col]
    plt.figure(figsize=(10, 10))
    plt.ticklabel_format(style='sci', axis='x', scilimits=(0,0))
    plt.hist(stat[stat < cut_point], bins=100)
    plt.show()
    
    
def take_maxes(intersections, max_areas, agg_idx, metric_col):
    filter_by_max = intersections.merge(max_areas, on=agg_idx)
    filter_by_max.rename(columns={metric_col + '_x': metric_col + '_this', metric_col + '_y': metric_col + '_max'}, 
                         inplace=True)
    filter_by_max = filter_by_max[filter_by_max[metric_col + '_this'] == filter_by_max[metric_col + '_max']]
    return filter_by_max
    
    
def inspect_intersections(intersections, max_areas, agg_idx, cut_points, metric_col):
    filter_by_max = take_maxes(intersections, max_areas, agg_idx, metric_col)
    minimum = float('-inf')
    for maximum in cut_points + [float('inf')]:
        selected = filter_by_max[(filter_by_max[metric_col + '_max'] >= minimum) & 
                                 (filter_by_max[metric_col + '_max'] < maximum)]
        if len(selected) > 0:
            yield minimum, maximum, selected
        minimum = maximum
        

def original_geometries(intersections, geodfs=[]):
    """
    Take the original geometries from the intersections, only once each one.
    
    plot_geometries(intersections, [(geodf1, idx1), (geodf2, idx2)])
    """
    
    geometries = []
    for t in geodfs:
        merged = intersections[t[1]].drop_duplicates().merge(t[0][t[1] + ['geometry']], on=t[1])
        geometries.append(gpd.GeoDataFrame(geometry=merged.geometry))
    return geometries

    
def separate_remaining(geodf, max_areas, agg_idx, metric_col):
    merge = geodf.merge(max_areas, on=agg_idx, how='left')
    selected = merge[merge[metric_col].isnull()]
    return selected.drop(columns=[metric_col])

def geometry_intersection_length(geodf_polygons, polygon_id_column, geodf_lines, length_label="lines_length"):
    """
        Intersects one GeoDataFrame of Polygons (e.g., city districts) 
        with one GeoDataFrame of Lines (e.g., bike-lanes)
        and calculates the length of the intersection (e.g., length of bike-lanes per district)

        Returns a new GeoDataFrame, equal to geodf_area, but with one new column 
        (named after the parameter length_label) containing the sum of the length in kilometer
        of all intersections in each polygon
    """
    lines_per_polygon = gpd.overlay(geodf_lines, geodf_polygons, how = 'intersection')
    lines_per_polygon = lines_per_polygon[[polygon_id_column, 'geometry']]
    lines_per_polygon[length_label] = lines_per_polygon['geometry'].length * 100
    lines_per_polygon = lines_per_polygon.groupby([polygon_id_column], as_index=False).sum()
    return geodf_polygons.merge(right = lines_per_polygon, on = polygon_id_column,
                               how = 'left', suffixes = ("", "")).fillna(0)