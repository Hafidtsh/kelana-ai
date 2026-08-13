# def get_int_input(user):
#     while True:
#         try:
#             return int(input(user))
#         except ValueError:
#             print("Masukan input yang benar...")


# def print_trip_summary(
#     destination,
#     days,
#     travel_style,
#     hotel_cost,
#     food_cost,
#     budget,
#     miscellaneous_cost,
#     transportation_cost,
# ):
#     total_estimated_cost = (
#         hotel_cost + food_cost + transportation_cost + miscellaneous_cost
#     )

#     print("========================")
#     print("Kelana AI")
#     print("========================")
#     print(f"Destination            : {destination}")
#     print(f"Days                   : {days}")
#     print(f"Travel Style           : {travel_style}")
#     print(f"Budget                 : {budget}")
#     print(f"Hotel Cost             : {hotel_cost}")
#     print(f"Food Cost              : {food_cost}")
#     print(f"Misc Cost              : {miscellaneous_cost}")
#     print(f"Transport Cost         : {transportation_cost}")
#     print(f"Total Estimation Cost  : {total_estimated_cost}")

#     if total_estimated_cost > budget:
#         print("BudgetTeuCukup")
#     else:
#         print("BudgetCukupHade")

#     print()


# destination = input("Masukan Destination :")
# travel_style = input("Masukan Style :")
# days = get_int_input("Days :")
# budget = get_int_input("Budget :")
# hotel_cost = get_int_input("Hotel Cost :")
# food_cost = get_int_input("Food Cost :")
# transportation_cost = get_int_input("Transport Cost :")
# miscellaneous_cost = get_int_input("Misc Cost :")


# print_trip_summary(
#     destination,
#     days,
#     travel_style,
#     hotel_cost,
#     food_cost,
#     budget,
#     miscellaneous_cost,
#     transportation_cost,
# )

# baju = ["kaos", "kemeja", "jas"]

# for item in baju:
#     print(item)

# for i in range(5, 12, 3):
#     print(i)

# k = 1

# while k <= 5:
#     print(k)
#     k += 1

# for i in range(1, 11):
#     print(i)


# angka = int(input("Masukan angka : "))

# for i in range(1, 11):
#     print(f"{angka} x {i} = {angka * i}")

# total = 0

# for i in range(1, 6):
#     total += i

# print(total)

# password_benar = "cloud123"

# for i in range(3):
#     password = input("Password : ")

#     if password == password_benar:
#         print("login berhasil")
#         break

# else:
#     print("Akun di blokir")


# for h in range(1, 101):
#     print(h)

# for o in range(2, 101):
#     if o % 2 == 0:
#         print(o)

# total2 = 0

# for q in range(1, 101):
#     total2 += q

# print(total2)


# while menu == True:
#     profile = input("1")
#     password = input("2")
#     if menu == profile or password:


# ============================================================
# LATIHAN - Menu Sederhana dengan while
# ============================================================

username = "Hafid"
password = "cloud123"

while True:
    print("===========================")
    print("         MAIN MENU         ")
    print("===========================")
    print("1. Lihat Profil")
    print("2. Ubah Password")
    print("3. Keluar")
    print("===========================")

    pilihan = input("Pilih menu (1/2/3) : ")

    if pilihan == "1":
        print(f"\n👤 Username : {username}")
        print(f"🔒 Password : {'*' * len(password)}\n")

    elif pilihan == "2":
        password_baru = input("Masukan password baru : ")
        password = password_baru
        print("✅ Password berhasil diubah!\n")

    elif pilihan == "3":
        print("👋 Sampai jumpa!")
        break

    else:
        print("⚠️  Pilihan tidak valid, coba lagi.\n")
