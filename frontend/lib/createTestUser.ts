export type TestUser = {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  birthdate: string;
  ssn: string;
  phone: string;
};

// Persian first and last names
const maleFirstNames = [
  "علی", "محمد", "حسین", "رضا", "امیر", "حامد", "مهدی",
  "پارسا", "یاسین", "رامین", "کیان", "سامان", "مهرداد", "بابک", "پوریا"
];

const femaleFirstNames = [
  "زهرا", "مینا", "فاطمه", "لیلا", "سارا", "الهام", "نگار",
  "پریسا", "مونا", "ندا", "ناهید", "مهسا", "حسنا", "آرزو", "رویا", "شیرین"
];

const persianLastNames = [
  "محمدی", "حسینی", "رضایی", "کریمی", "نجفی", "کاظمی", "بهشتی", "سلطانی",
  "رحمانی", "قاسمی", "میرزایی", "حیدری", "محمدزاده", "نیکنام", "شریفی",
  "کربلایی", "هاشمی", "جعفری", "آقایی", "عابدی", "حسینیان", "رضوانی",
  "نوروزی", "رجبی", "موسوی", "پارسا", "فراهانی", "دهقانی", "سلیمانی",
  "یزدانی", "طباطبایی", "شاهی", "ملکی", "مهدوی", "کریمیان", "پورمحمد",
  "علوی", "شجاعی", "نظری", "قربانی"
];

// Helper functions
function randomArrayItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBirthdate(minYear = 1301, maxYear = 1404): string {
  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day).toISOString().split("T")[0];
}

function randomSSN(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function randomPhone(): string {
  return "09" + Math.floor(100000000 + Math.random() * 900000000).toString();
}

// Main function
export function createTestUser(): TestUser {
  const gender: "male" | "female" = Math.random() < 0.5 ? "male" : "female";
  const firstName =
    gender === "male"
      ? randomArrayItem(maleFirstNames)
      : randomArrayItem(femaleFirstNames);

  return {
    firstName,
    lastName: randomArrayItem(persianLastNames),
    gender,
    birthdate: randomBirthdate(),
    ssn: randomSSN(),
    phone: randomPhone(),
  };
}
