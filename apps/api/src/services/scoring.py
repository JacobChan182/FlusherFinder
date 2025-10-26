def blended_score(avg_rating: float, distance_m: float) -> float:
    from math import log
    return (avg_rating/5.0)*0.7 + (1.0/max(log(distance_m+10),1))*0.3

def calculate_bayesian_rating(ratings_data, prior_rating=3.6, prior_weight=8):
    """
    Bayesian smoothing algorithm for average ratings.
    
    Formula: (total_ratings * avg_rating + prior_rating * prior_weight) / (total_ratings + prior_weight)
    
    This prevents washrooms with few reviews from having extreme ratings.
    A washroom with 1 five-star review won't show 5.0, but will be pulled toward the prior.
    
    Args:
        ratings_data: List of rating dictionaries with 'rating' key
        prior_rating: The prior belief about average rating (default 3.0)
        prior_weight: How much weight to give the prior (default 5 reviews worth)
    
    Returns:
        float: Bayesian smoothed average rating
    """
    if not ratings_data:
        return prior_rating
    
    # Calculate simple average
    total_ratings = len(ratings_data)
    avg_rating = sum(rating['rating'] for rating in ratings_data) / total_ratings
    
    # Apply Bayesian smoothing
    bayesian_rating = (total_ratings * avg_rating + prior_rating * prior_weight) / (total_ratings + prior_weight)
    
    return round(bayesian_rating, 2)

def calculate_weighted_rating(ratings_data):
    """
    Custom rating algorithm - implement your logic here
    Example: Weighted average with recency bias and user credibility
    """
    if not ratings_data:
        return 0.0
    
    total_weighted_rating = 0.0
    total_weight = 0.0
    
    for rating in ratings_data:
        # Example: Weight by recency (newer reviews matter more)
        recency_weight = 1.0
        if rating.get('created_at'):
            from datetime import datetime
            days_old = (datetime.now() - rating['created_at']).days
            recency_weight = max(0.5, 1.0 - (days_old / 365.0))  # Decay over time
        
        # Example: Weight by user credibility (if you track this)
        user_credibility = rating.get('user_credibility', 1.0)
        
        # Combine weights
        weight = recency_weight * user_credibility
        
        total_weighted_rating += rating['rating'] * weight
        total_weight += weight
    
    return total_weighted_rating / total_weight if total_weight > 0 else 0.0