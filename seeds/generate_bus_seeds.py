import random
from datetime import datetime, timedelta

# مراکز استان‌ها
cities = [
    "تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "اهواز",
    "ارومیه",
    "سنندج", "زنجان", "قزوین"
]

important_cities = ["تهران", "مشهد", "اصفهان", "شیراز", "تبریز"]

bus_types = [
    (1, "vip", 25),
    (2, "man-vip", 26),
    (3, "classic", 36),
]

cooperatives = [
    (1, "ایران‌سفر", "02188888888"),
    (2, "مسافربران وطن", "02177777777"),
]

def generate_sql():
    sql_lines = []

    # Cooperative
    sql_lines.append("-- Cooperative")
    for coop_id, name, phone in cooperatives:
        sql_lines.append(
            f"INSERT INTO bus_cooperative (cooperative_id, name, phone, logo) "
            f"VALUES ({coop_id}, '{name}', '{phone}', NULL);"
        )

    # Terminals
    sql_lines.append("\n-- Terminals")
    for i, city in enumerate(cities, start=1):
        sql_lines.append(
            f"INSERT INTO bus_terminal (terminal_id, name, city, address, phone) "
            f"VALUES ({i}, 'پایانه {city}', '{city}', 'آدرس {city}', '0{i:2d}12345678');"
        )

    # Buses
    sql_lines.append("\n-- Buses")
    for bus_id, bus_type, seat_count in bus_types:
        sql_lines.append(
            f"INSERT INTO bus_bus (bus_id, type, seat_count) VALUES "
            f"({bus_id}, '{bus_type}', {seat_count});"
        )

    # Travels
    sql_lines.append("\n-- Travels")
    travel_id = 1
    today = datetime.now()

    for day in range(7):  # یک هفته آینده
        date_base = today + timedelta(days=day)

        # تهران → همه استان‌ها (۱۰ سفر)
        tehran_id = cities.index("تهران") + 1
        for city in cities:
            if city == "تهران":
                continue
            dest_id = cities.index(city) + 1
            for n in range(5 if city in important_cities else 3):
                hour = random.choice([6, 8, 10, 12, 14, 16, 18, 20])
                dt = date_base.replace(hour=hour, minute=0, second=0, microsecond=0)
                bus_id, btype, cap = random.choice(bus_types)
                coop_id = random.choice([1, 2])
                price = random.choice([350000, 400000, 450000, 500000])
                sql_lines.append(
                    f"INSERT INTO bus_travel "
                    f"(travel_id, bus_id, org_terminal_id, dest_terminal_id, cooperative_id, "
                    f"origin, dest, date_time, price, description, capacity, seat_stat) "
                    f"VALUES ({travel_id}, {bus_id}, {tehran_id}, {dest_id}, {coop_id}, "
                    f"'تهران', '{city}', '{dt.strftime('%Y-%m-%d %H:%M:%S')}', {price}, '', {cap}, '{{}}');"
                )
                travel_id += 1

        # هر مرکز استان → مراکز استان مهم (۲–۳ سفر)
        for org in cities:
            if org == "تهران":
                continue
            org_id = cities.index(org) + 1
            for dest in important_cities:
                if org == dest:
                    continue
                dest_id = cities.index(dest) + 1
                for n in range(random.randint(3, 6)):
                    hour = random.choice([7, 9, 11, 13, 15, 17, 19])
                    dt = date_base.replace(hour=hour, minute=0, second=0, microsecond=0)
                    bus_id, btype, cap = random.choice(bus_types)
                    coop_id = random.choice([1, 2])
                    price = random.choice([350000, 400000, 450000, 500000])
                    sql_lines.append(
                        f"INSERT INTO bus_travel "
                        f"(travel_id, bus_id, org_terminal_id, dest_terminal_id, cooperative_id, "
                        f"origin, dest, date_time, price, description, capacity, seat_stat) "
                        f"VALUES ({travel_id}, {bus_id}, {org_id}, {dest_id}, {coop_id}, "
                        f"'{org}', '{dest}', '{dt.strftime('%Y-%m-%d %H:%M:%S')}', {price}, '', {cap}, '{{}}');"
                    )
                    travel_id += 1

    return "\n".join(sql_lines)

if __name__ == "__main__":
    sql = generate_sql()
    with open("bus_seed.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print("✅ فایل seed_data.sql ساخته شد.")
