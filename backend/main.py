# destination = input("Masukan Destinasi : ")
# country = input("Masukan Kota : ")
# days = int(input("Berapa Hari : "))
# budget = float(input("Budget : "))
# currency = input("Mata Uang : ")
# travel_month = input("Bulan : ")

# print("===============")
# print("KelanaAI")
# print("===============")
# print(f"Destination  : {destination}")
# print(f"Country      : {country}")
# print(f"Days         : {days}")
# print(f"Budget       : {budget}")
# print(f"Currency     : {currency}")
# print(f"Travel Month : {travel_month}")


def print_trip_summary(
    destination,
    days,
    budget,
    travel_style,
    hotel_cost,
    food_cost,
    transportation_cost,
    miscellaneous_cost,
):

    total_estimated_cost = (
        hotel_cost + food_cost + transportation_cost + miscellaneous_cost
    )

    print("===========================")
    print("KelanaAI")
    print("===========================")
    print(f"Destination    : {destination}")
    print(f"Days           : {days}")
    print(f"Budget         : {budget}")
    print(f"Style          : {travel_style}")
    print(f"Hotel Cost     : {hotel_cost}")
    print(f"Food Cost      : {food_cost}")
    print(f"Transport      : {transportation_cost}")
    print(f"Misc Cost      : {miscellaneous_cost}")
    print(f"Total Cost     : {total_estimated_cost}")

    if total_estimated_cost > budget:
        print("⚠️ Budget exceeded.")

    print()


# Call it with any trip
print_trip_summary(
    input("Masukan Destinasi : "),
    int(input("Days : ")),
    int(input("Budget : ")),
    input("Style : "),
    int(input("Hotel : ")),
    int(input("Food : ")),
    int(input("Transport : ")),
    int(input("Misc : ")),
)
# print_trip_summary("Solo", 6, 1500, "Backpacker", 300, 100, 150, 75)
