interface FaqItem {
  question: string;
  answer: string;
}

// TODO: replace with the real FAQ content.
const FAQS: FaqItem[] = [
  {
    question: "What is Mirra?",
    answer: "Mirra is an AI shopping assistant that helps you discover fashion products based on your wardrobe, personal style, and what you’re looking for.",
  },
  {
    question: "How does Mirra personalize shopping recommendations?",
    answer: "Mirra understands what you already own and your personal style, then helps you discover products that complement your wardrobe instead of showing you endless irrelevant options.",
  },
  {
    question: "Can Mirra find clothes that match my existing wardrobe?",
    answer: "Yes. Tell Mirra what you own or import your past shopping, and it can help you discover new products that work with the pieces you already have.",
  },
  {
    question: "What can I ask Mirra to find?",
    answer: "You can ask Mirra to find almost anything you’re looking for—from a top that goes with your jeans to outfits for a specific occasion, style, budget, or season.",
  },
  {
    question: "How is Mirra different from ChatGPT?",
    answer: "ChatGPT can talk about fashion, but it doesn’t know your wardrobe. Mirra does. By understanding what you own and your style, Mirra can help you discover products that go best with you.",
  },
  {
    question: "Is Mirra a personal stylist or a shopping assistant?",
    answer: "Mirra is primarily an AI shopping assistant focused on helping you discover the right products. Personalized styling and outfit recommendations are an added part of the experience.",
  },
  {
    question: "Is Mirra free?",
    answer: "Mirra is completely free to use for discovering personalized fashion recommendations and asking styling advice.",
  },
];

export default function Faq() {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-3xl text-ink-900">
          Frequently asked questions
        </h2>

        <div className="mt-8 divide-y divide-ink-200 border-t border-b border-ink-200">
          {FAQS.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink-900">
                {item.question}
                <span className="shrink-0 text-xl leading-none text-ink-500 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
