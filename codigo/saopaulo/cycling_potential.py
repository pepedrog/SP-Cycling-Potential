import bikescience.distributions as dist
from bikescience.slope import plot_slope, plot_slopes, split_route
import scipy.stats as st

genders = {1: 'm', 2: 'f', 'm': 'm', 'f': 'f'}

potential_distributions = {
    'distance_m':    (st.invweibull, (1.9624908421440037, -1358.5912359607478, 3558.697966253873)),
    'distance_f':    (st.johnsonsu,  (-1.6348791801316755, 0.8220563043475115, 599.1107992085285, 401.86433888871386)),
    'age_m':         (st.gausshyper, (5.279282420419191, 9.427435120845999, 1.7042238760442698, -0.6290314796750072, -9.35105798112198, 113.89907371835868)),
    'age_f':         (st.loggamma,   (897.3569843061273, -2332.923603808461, 347.1732584129129)),
    'slope_0_m':     (st.halfgennorm, (0.5938931306470469, -0.24400150361767925, 331.4710613095754)) ,
    'slope_1_m':     (st.wald, (-104.76240577720931, 685.9786628776621)) ,
    'slope_2_m':     (st.invgauss, (2.108522364223588, -32.82673098772308, 182.06556527798517)) ,
    'slope_3_m':     (st.invgauss, (2.688687820077516, -21.13444964695273, 97.67944984207021)) ,
    'slope_4_m':     (st.invgauss, (5.502101429028432, -8.13123108843531, 30.571313764443463)) ,
    'slope_5_m':     (st.halfcauchy, (-1.4470696301679076e-08, 44.668468802008306)) ,
    'slope_6_m':     (st.beta, (0.8131995575475309, 331.1621037526766, -1.631515678560271e-25, 20738.671835648325)) ,
    'slope_7_m':     (st.foldcauchy, (0.0944460919704757, -0.7864682761930095, 9.393897207087463)) ,
    'slope_8_m':     (st.foldcauchy, (0.00673535113084469, -3.1474534806095553e-09, 4.321341682356357)) ,
    'slope_9_m':     (st.pearson3, (2.2573136160688976, 10.607177295812832, 11.97186286894759)) ,
    'slope_10_m':    (st.wald, (-4.043061534826781, 14.276893670640046)),
    'slope_0_f':     (st.exponpow, (0.5605940467562757, -1.8784725802483102e-25, 1565.4492572779232)),
    'slope_1_f':     (st.gengamma, (0.590524483516389, 1.0275914711243868, -8.664310862508725e-28, 677.519552928482)),
    'slope_2_f':     (st.gengamma, (0.47380391166676794, 1.1693288358580536, -8.062714753528154e-30, 406.8704200176831)),
    'slope_3_f':     (st.halfcauchy, (-1.6974581783015064e-09, 59.79317588661688)),
    'slope_4_f':     (st.halfcauchy, (-1.9353863324140777e-10, 5.523495637773543)),
    'slope_5_f':     (st.gilbrat, (-8.883473023487747, 29.8148343960495)),
    'slope_6_f':     (st.gilbrat, (-6.238336526524279, 19.324184822768018)),
    'slope_7_f':     (st.pearson3, (2.2988440861319095, 15.545779168414187, 17.868661252810796)),
    'slope_8_f':     (st.wald, (-6.11511658910011, 21.926956014811573)),
    'slope_9_f':     (st.wald, (-3.6592002310221847, 12.678789700411755)),
    'slope_10_f':    (st.gilbrat, (-1.3698237608138852, 3.9046811037876776))
}

def scale_potential_to_1 (x, distribution, param):
    d = dist.make_pdf(distribution, param)
    max_value = max (x for x in d)
    
    y = distribution.pdf(x, *param)
    return y / max_value

def partial_cycling_potential (variable, gender, value):
    global potential_distributions, genders
    d = potential_distributions[variable + '_' + genders[gender]]
    return scale_potential_to_1 (value, d[0], d[1])

# Return a dict with how many meters were traveled in each slope degree
def meters_per_degree (route):
    d = {}
    stretchs = split_route(route, 'line', False)
    for st in stretchs:
        degree = str(min(10, round(st[1])))
        if degree not in d.keys():
            d[degree] = 0
        d[degree] += st[0].length * 100000
    return d

def inclination_potential (route, gender):
    global potential_distributions, genders
    meters_dict = meters_per_degree(route)
    potential = 0
    max_weight = 0
    for degree, meters in meters_dict.items():
        d = int(degree)
        if (d > 0): 
            distrib = potential_distributions['slope_' + degree + '_' + genders[gender]]
            potential += distrib[0].cdf(meters, *distrib[1]) * d
    
    weights = 55 # sum of 1 to 10
    return potential / weights

def cycling_potential_variables (trip):
    pot_d = partial_cycling_potential ('distance', trip['SEXO'], trip['length'])
    pot_a = partial_cycling_potential ('age', trip['SEXO'], trip['IDADE'])
    pot_i = inclination_potential (trip['geometry'], trip['SEXO'])
    
    return pot_d, pot_a, 1 - pot_i

def cycling_potential(trip):
    pot_d, pot_a, pot_i = cycling_potential_variables(trip)
    return (pot_d + pot_a + pot_i) / 3