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

def print_trip_summary(destination, days, budget, travel_tyle):
    print("===========================")
    print("KelanaAI")
    print("===========================")
    print(f"Destination    : {destination}")
    print(f"Days           : {days}")
    print(f"Budget         : {budget}")
    print(f"Style          : {travel_tyle}")


# Call it with any trip
print_trip_summary("Japan", 5, 1500, "Family")
print_trip_summary("Solo", 5, 1500, "FamilyD")