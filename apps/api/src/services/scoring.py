def blended_score(avg_rating: float, distance_m: float) -> float:
    from math import log
    return (avg_rating/5.0)*0.7 + (1.0/max(log(distance_m+10),1))*0.3