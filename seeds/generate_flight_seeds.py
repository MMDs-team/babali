import random
from datetime import datetime, timedelta

# شرکت‌های هواپیمایی ایرانی
agencies = [
    {"name": "ایران‌ایر", "phone": "۰۲۱۴۶۶۲۲"},
    {"name": "ماهان‌ایر", "phone": "۰۲۱۴۴۹۰۰"},
    {"name": "آسمان‌ایر", "phone": "۰۲۱۸۸۷۹۹"},
]

# فرودگاه‌ها
airports = [
    {"name": "فرودگاه مهرآباد", "city": "تهران"},
    {"name": "فرودگاه ارومیه", "city": "ارومیه"},
    {"name": "فرودگاه مشهد", "city": "مشهد"},
    {"name": "فرودگاه شیراز", "city": "شیراز"},
    {"name": "فرودگاه شهید بهشتی", "city": "اصفهان"},
    {"name": "فرودگاه سنندج", "city": "سنندج"},
    {"name": "فرودگاه تبریز", "city": "تبریز"},
    {"name": "فرودگاه اهواز", "city": "اهواز"},
    {"name": "فرودگاه کیش", "city": "کیش"},
]

# هواپیماها
airplanes = [
    {"model": "ایرباس A320", "seat_count": 180},
    {"model": "بوئینگ 737", "seat_count": 160},
    {"model": "فوکر 100", "seat_count": 100},
    {"model": "ATR 72", "seat_count": 70},
    {"model": "ایرباس A310", "seat_count": 220},
]

# تاریخ شروع = امروز
today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
days = 7  # یک هفته

# ---- Generate INSERTs ----
with open("flight_seed.sql", "w", encoding="utf-8") as f:
    f.write("-- Insert flight_agency\n")
    for i, a in enumerate(agencies, start=1):
        f.write(
            f"INSERT INTO flight_agency (flight_agency_id, name, phone) "
            f"VALUES ({i}, '{a['name']}', '{a['phone']}');\n"
        )

    f.write("\n-- Insert flight_airport\n")
    for i, ap in enumerate(airports, start=1):
        f.write(
            f"INSERT INTO flight_airport (airport_id, name, city) "
            f"VALUES ({i}, '{ap['name']}', '{ap['city']}');\n"
        )

    f.write("\n-- Insert flight_airplane\n")
    for i, p in enumerate(airplanes, start=1):
        f.write(
            f"INSERT INTO flight_airplane (airplane_id, model, seat_count) "
            f"VALUES ({i}, '{p['model']}', {p['seat_count']});\n"
        )

    f.write("\n-- Insert flight_travel\n")
    travel_id = 1
    for day_offset in range(days):
        day_date = today + timedelta(days=day_offset)

        # همه جفت‌های فرودگاه
        i = 0
        for origin in airports:
            i += 1
            for dest in airports:
                if origin == dest:
                    continue

                # تعداد پرواز در این مسیر
                flights_count = random.randint(3, 5)

                for _ in range(flights_count):
                    airplane_id = random.randint(1, len(airplanes))
                    agency_id = random.randint(1, len(agencies))
                    airport_id = i

                    # زمان پرواز
                    hour = random.randint(5, 22)
                    minute = random.choice([0, 15, 30, 45])
                    dt = day_date + timedelta(hours=hour, minutes=minute)

                    price = random.randint(1_000_000, 5_000_000)
                    terminal_no = random.randint(1, 5)
                    flight_type = "داخلی"
                    flight_class = random.choice(["اکونومی", "بیزینس"])
                    description = (
                        f"پرواز از {origin['city']} به {dest['city']} "
                        f"در تاریخ {dt.date()} ساعت {dt.strftime('%H:%M')}"
                    )

                    f.write(
                        f"INSERT INTO flight_travel (travel_id, airport_id, airplane_id, flight_agency_id, "
                        f"date_time, price, dest, origin, terminal_no, flight_type, description, flight_class, max_loggage_weight) "
                        f"VALUES ({travel_id}, {airport_id}, {airplane_id}, {agency_id}, "
                        f"'{dt.strftime('%Y-%m-%d %H:%M:%S')}', {price}, "
                        f"'{dest['city']}', '{origin['city']}', {terminal_no}, "
                        f"'{flight_type}', '{description}', '{flight_class}', {random.choice([15,20,25,30])});\n"
                    )

                    travel_id += 1

print("✅ SQL file generated: seed.sql")
