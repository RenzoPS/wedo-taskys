"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react"
import styles from "./faq.module.css"
import { useI18n } from "../common/I18nContext"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const { t } = useI18n()

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
    { question: t('faq.q8'), answer: t('faq.a8') },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        {/* Header */}
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>{t('faq.title')}</h2>
          <p className={styles.faqSubtitle}>{t('faq.subtitle')}</p>
        </div>

        {/* FAQ Items */}
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                onClick={() => toggleFAQ(index)}
                className={styles.faqButton}
              >
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className={styles.faqIconOpen} />
                ) : (
                  <ChevronDown className={styles.faqIconClosed} />
                )}
              </button>

              {openIndex === index && (
                <div className={styles.faqAnswerWrap}>
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={styles.faqContact}>
          <MessageCircle size={48} className={styles.contactIcon} />
          <h3 className={styles.faqContactTitle}>{t('faq.contactTitle')}</h3>
          <p className={styles.faqContactText}>{t('faq.contactText')}</p>
          <a 
            href="https://forms.gle/tu-form-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.faqContactButton}
          >
            <Mail size={20} />
            {t('faq.contactButton')}
          </a>
        </div>
      </div>
    </section>
  )
}
