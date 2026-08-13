def calculate_daily_budget(budget, days):
    return budget / days


def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_recommended_places(destination):
    places = {
        "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "bali": ["Tanah Lot", "Ubud", "Kuta Beach"],
        "paris": ["Eiffel Tower", "Louvre", "Montmartre"],
    }
    # cari berdasarkan nama destinasi (lowercase)
    return places.get(destination.lower(), ["Belum ada rekomendasi untuk destinasi ini."])
