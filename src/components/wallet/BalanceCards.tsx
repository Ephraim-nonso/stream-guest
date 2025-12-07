"use client";

interface BalanceCard {
  title: string;
  amount: number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

interface BalanceCardsProps {
  cards: BalanceCard[];
}

export function BalanceCards({ cards }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.gradient} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}
        >
          {/* Icon */}
          <div className="absolute top-4 right-4 opacity-20">
            {card.icon}
          </div>

          <div className="relative z-10">
            <h3 className="text-sm font-medium opacity-90 mb-2">{card.title}</h3>
            <p className="text-2xl sm:text-3xl font-bold mb-1">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(card.amount)}
            </p>
            <p className="text-xs sm:text-sm opacity-90">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

