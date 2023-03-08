import geopandas as gpd
import pandas as pd

#creates a new table with headers in portuguese
def change_tiers_table_header_pt(tiers_table):
    tiers_table_pt = tiers_table.copy()
    tiers_table_pt.set_index('tier',inplace=True)
    tiers_table_pt.sort_index(ascending=False,inplace=True)
    tiers_table_pt.columns = ['max','min','# fluxos','% fluxos']
    tiers_table_pt.index.name='quartil'
    return tiers_table_pt