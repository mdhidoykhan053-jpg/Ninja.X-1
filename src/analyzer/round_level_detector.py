from typing import Dict, Any

class RoundLevelDetector:
    """
    Detects institutional psychological round number support/resistance levels.
    """
    @staticmethod
    def inspect_price(price: float) -> Dict[str, Any]:
        p_str = f"{price:.5f}"
        last_digits = int(p_str.split(".")[1][-2:])
        
        is_major = last_digits in (0, 50)
        is_minor = last_digits in (20, 80)
        
        level_type = "NONE"
        if is_major:
            level_type = "MAJOR_ROUND_NUMBER"
        elif is_minor:
            level_type = "MINOR_ROUND_NUMBER"
            
        return {
            "price": price,
            "last_digits": last_digits,
            "level_type": level_type,
            "reversal_probability": 0.89 if is_major else (0.78 if is_minor else 0.45)
        }
