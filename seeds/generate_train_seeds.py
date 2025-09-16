import random
from datetime import datetime, timedelta

# مسیرها و شهرهای بین‌راهی (واقعی و منطقی)
routes_with_edges = {
    ("ارومیه", "تهران"): ["ارومیه", "مهاباد", "میاندوآب", "مراغه", "زنجان", "قزوین", "تهران"],
    ("ارومیه", "مشهد"): ["ارومیه", "تبریز", "زنجان", "قزوین", "تهران", "سمنان", "نیشابور", "مشهد"],
    ("تبریز", "تهران"): ["تبریز", "زنجان", "قزوین", "کرج", "تهران"],
    ("تهران", "بندرعباس"): ["تهران", "قم", "اصفهان", "یزد", "سیرجان", "بندرعباس"],
    ("تهران", "شیراز"): ["تهران", "قم", "کاشان", "اصفهان", "آباده", "صفاشهر", "شیراز"],
    ("اهواز", "مشهد"): ["اهواز", "اراک", "قم", "سمنان", "سبزوار", "مشهد"],
    ("تبریز", "مشهد"): ["تبریز", "زنجان", "قزوین", "تهران", "شاهرود", "نیشابور", "مشهد"],
    ("مشهد", "شیراز"): ["مشهد", "تربت‌حیدریه", "بیرجند", "یزد", "آباده", "شیراز"],
}

# مسیرهای رفت و برگشت
all_routes = {}
for (o, d), cities in routes_with_edges.items():
    all_routes[(o, d)] = cities
    all_routes[(d, o)] = list(reversed(cities))

# Cooperative ها
cooperatives = [
    (1, "ریل ایران", "02188888888"),
    (2, "قطار وطن", "02177777777"),
]

# Train ها (train_id, stars, compartment_capacity, compartment_count)
trains = [
    (1, 5, 6, 10),  # 60 نفر
    (2, 4, 4, 20),   # 64 نفر
    (3, 3, 6, 10),  # 60 نفر
]

# مدت‌زمان هر edge (۲ ساعت = 7200 ثانیه)
EDGE_DURATION_SECONDS = 2 * 60 * 60


def generate_sql():
    sql_lines = []

    # Cooperative
    sql_lines.append("-- Cooperative")
    for coop_id, name, phone in cooperatives:
        sql_lines.append(
            f"INSERT INTO train_cooperative (cooperative_id, name, phone, logo) "
            f"VALUES ({coop_id}, '{name}', '{phone}', NULL);"
        )

    # Train
    sql_lines.append("\n-- Trains")
    for train_id, stars, cap, count in trains:
        sql_lines.append(
            f"INSERT INTO train_train (train_id, stars, compartment_capacity, compartment_count) "
            f"VALUES ({train_id}, {stars}, {cap}, {count});"
        )

    # RouteEdges + Routes
    sql_lines.append("\n-- RouteEdges and Routes")
    edge_id = 1
    route_id = 1
    route_map = {}

    for (origin, dest), cities in all_routes.items():
        edge_ids = []
        for i in range(len(cities) - 1):
            o, d = cities[i], cities[i + 1]
            sql_lines.append(
                f"INSERT INTO train_routeedge (route_edge_id, origin_city, dest_city, duration) "
                f"VALUES ({edge_id}, '{o}', '{d}', {EDGE_DURATION_SECONDS});"
            )
            edge_ids.append(edge_id)
            edge_id += 1

        sql_lines.append(
            f"INSERT INTO train_route (route_id, origin_city, dest_city, edge_identifiers) "
            f"VALUES ({route_id}, '{origin}', '{dest}', '{edge_ids}');"
        )
        route_map[(origin, dest)] = route_id
        route_id += 1

    # Travels
    sql_lines.append("\n-- Travels")
    today = datetime.now()
    travel_id = 1

    for (origin, dest), r_id in route_map.items():
        for day in range(7):  # یک هفته
            date_base = today + timedelta(days=day)
            for n in range(random.randint(3, 5)):  # روزی سه سفر
                hour = random.choice([6, 10, 14, 18, 22])
                dt = date_base.replace(hour=hour, minute=0, second=0, microsecond=0)
                train_id, stars, cap, count = random.choice(trains)
                coop_id = random.choice([1, 2])
                price = random.choice([150000, 200000, 250000, 300000])

                sql_lines.append(
                    f"INSERT INTO train_travel "
                    f"(travel_id, train_id, route_id, cooperative_id, date_time, description, price, capacity, seat_stat) "
                    f"VALUES ({travel_id}, {train_id}, {r_id}, {coop_id}, "
                    f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}', '', {price}, {cap * count}, '{{}}');"
                )
                travel_id += 1

    return "\n".join(sql_lines)


if __name__ == "__main__":
    sql = generate_sql()
    with open("train_seed.sql", "w", encoding="utf-8") as f:
        f.write(sql)
    print("✅ فایل train_seed.sql ساخته شد.")
