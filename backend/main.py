# ============================================================
# KODE LAMA (versi awal)
# ============================================================
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


# def print_trip_summary(
#     destination,
#     days,
#     budget,
#     travel_style,
#     hotel_cost,
#     food_cost,
#     transportation_cost,
#     miscellaneous_cost,
# ):
#     total_estimated_cost = (
#         hotel_cost + food_cost + transportation_cost + miscellaneous_cost
#     )

#     print("===========================")
#     print("KelanaAI")
#     print("===========================")
#     print(f"Destination    : {destination}")
#     print(f"Days           : {days}")
#     print(f"Budget         : {budget}")
#     print(f"Style          : {travel_style}")
#     print(f"Hotel Cost     : {hotel_cost}")
#     print(f"Food Cost      : {food_cost}")
#     print(f"Transport      : {transportation_cost}")
#     print(f"Misc Cost      : {miscellaneous_cost}")
#     print(f"Total Cost     : {total_estimated_cost}")

#     if total_estimated_cost > budget:
#         print("⚠️ Budget exceeded.")
#     elif (
#         days != int
#         or budget != int
#         or hotel_cost != int
#         or food_cost != int
#         or transportation_cost != int
#         or miscellaneous_cost != int
#     ):
#         print("harus angka")
#     else:
#         print(print_trip_summary)

#     print()


# print_trip_summary("Japan", 5, 1500, "Family", 900, 300, 250, 100)
# print_trip_summary("Solo", 6, 1500, "Backpacker", 300, 100, 150, 75)
# ============================================================
# KODE BARU (versi dengan validasi input)
# ============================================================


def get_int_input(prompt):
    """Minta input angka, ulangi hanya field ini kalau salah."""
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("⚠️  Harus angka! Coba lagi.")


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
    print("        KelanaAI           ")
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
        print("⚠️  Budget exceeded!")
    else:
        print("✅ Budget aman.")

    print()


# Input dari user
destination = input("Masukan Destinasi : ")
travel_style = input("Style             : ")
days = get_int_input("Days              : ")
budget = get_int_input("Budget            : ")
hotel_cost = get_int_input("Hotel Cost        : ")
food_cost = get_int_input("Food Cost         : ")
transportation_cost = get_int_input("Transport Cost    : ")
miscellaneous_cost = get_int_input("Misc Cost         : ")

print_trip_summary(
    destination,
    days,
    budget,
    travel_style,
    hotel_cost,
    food_cost,
    transportation_cost,
    miscellaneous_cost,
)
