"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can track your order status in your account dashboard.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard), QRIS, and bank transfers. All transactions are secure and encrypted.",
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free shipping on all orders over specific amounts within the Jabodetabek.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can return it in its original condition for a full refund.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you will receive an email with tracking information. You can also log into your account to view order status.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-accent">
            Find answers to common questions about shopping at LeonShop
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-light transition-colors"
              >
                <span className="font-medium text-secondary">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-accent">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-accent mb-4">
            Still have questions? Contact our support team
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
