export const membershipPasses = [
  {
    id: "class-registration",
    name: "Class Registration Pass",
    purpose: "Take a class",
    rates: [
      {
        label: "Household",
        eligibility: "Up to two adults plus household members",
        price: "$50",
        period: "year",
      },
    ],
    features: [
      "Register for tennis, pickleball, camps, events and fitness classes.",
      "Court booking, gym access and golf discounts are excluded.",
    ],
  },
  {
    id: "court-and-range",
    name: "Court & Range Access Pass",
    purpose: "Book courts and save on range buckets",
    rates: [
      {
        label: "Household",
        eligibility: "Up to two adults plus household members",
        price: "$120",
        period: "year",
      },
    ],
    features: [
      "Book courts, register for classes and reserve golf simulators up to 7 days ahead.",
      "Save $4 on range buckets, get mini golf and beverage discounts, and access golf happy hour.",
      "Gym access is excluded.",
    ],
  },
  {
    id: "all-access",
    name: "All-Access Pass",
    purpose: "Add gym access",
    rates: [
      {
        label: "Individual",
        eligibility: "One adult age 18 or older",
        price: "$40",
        period: "month",
      },
      {
        label: "Couple",
        eligibility: "Two people in one household",
        price: "$70",
        period: "month",
      },
      {
        label: "Family",
        eligibility:
          "Up to two adults and children age 17 and under in one household",
        price: "$100",
        period: "month",
      },
    ],
    features: [
      "Includes the Court & Range pass benefits, plus the gym, sauna and locker rooms.",
      "Save 5% on golf simulators and reserve up to 10 days ahead.",
    ],
  },
];
