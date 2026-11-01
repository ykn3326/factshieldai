import type { EvidenceItem, Localized, SourceLink, VerificationStatus } from "@/types";

export interface ReportTemplate {
  status: VerificationStatus;
  explanation: Localized;
  evidence: EvidenceItem[];
  sources: SourceLink[];
}

export const REPORT_TEMPLATES: Record<VerificationStatus, ReportTemplate> = {
  misleading: {
    status: "misleading",
    explanation: {
      en: "This message claims the government is giving free laptops to all students. No such scheme appears in official announcements. Messages that ask for Aadhaar or bank details through a link and push you to forward urgently are common signs of scams.",
      hi: "यह संदेश दावा करता है कि सरकार सभी छात्रों को मुफ़्त लैपटॉप दे रही है। आधिकारिक घोषणाओं में ऐसी कोई योजना नहीं मिलती। जो संदेश लिंक के ज़रिए आधार या बैंक जानकारी माँगते हैं और जल्दी फ़ॉरवर्ड करने का दबाव डालते हैं, वे अक्सर धोखाधड़ी के संकेत होते हैं।",
      pa: "ਇਹ ਸੁਨੇਹਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ ਕਿ ਸਰਕਾਰ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਮੁਫ਼ਤ ਲੈਪਟਾਪ ਦੇ ਰਹੀ ਹੈ। ਅਧਿਕਾਰਤ ਐਲਾਨਾਂ ਵਿੱਚ ਅਜਿਹੀ ਕੋਈ ਸਕੀਮ ਨਹੀਂ ਮਿਲਦੀ। ਜੋ ਸੁਨੇਹੇ ਲਿੰਕ ਰਾਹੀਂ ਆਧਾਰ ਜਾਂ ਬੈਂਕ ਜਾਣਕਾਰੀ ਮੰਗਦੇ ਹਨ ਅਤੇ ਜਲਦੀ ਫ਼ਾਰਵਰਡ ਕਰਨ ਦਾ ਦਬਾਅ ਪਾਉਂਦੇ ਹਨ, ਉਹ ਅਕਸਰ ਧੋਖਾਧੜੀ ਦੇ ਸੰਕੇਤ ਹੁੰਦੇ ਹਨ।",
    },
    evidence: [
      {
        title: { en: "No official scheme found", hi: "कोई आधिकारिक योजना नहीं मिली", pa: "ਕੋਈ ਅਧਿਕਾਰਤ ਸਕੀਮ ਨਹੀਂ ਮਿਲੀ" },
        description: {
          en: "Government press releases do not mention a free laptop scheme for all students.",
          hi: "सरकारी प्रेस विज्ञप्तियों में सभी छात्रों के लिए मुफ़्त लैपटॉप योजना का कोई ज़िक्र नहीं है।",
          pa: "ਸਰਕਾਰੀ ਪ੍ਰੈੱਸ ਰਿਲੀਜ਼ਾਂ ਵਿੱਚ ਸਾਰੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਮੁਫ਼ਤ ਲੈਪਟਾਪ ਸਕੀਮ ਦਾ ਕੋਈ ਜ਼ਿਕਰ ਨਹੀਂ।",
        },
      },
      {
        title: { en: "Known scam pattern", hi: "जाना-पहचाना धोखाधड़ी पैटर्न", pa: "ਜਾਣਿਆ-ਪਛਾਣਿਆ ਧੋਖਾਧੜੀ ਪੈਟਰਨ" },
        description: {
          en: "Similar 'free laptop' messages have been flagged as fake by official fact-check units.",
          hi: "ऐसे ही 'मुफ़्त लैपटॉप' संदेशों को आधिकारिक फ़ैक्ट-चेक इकाइयों ने फ़र्ज़ी बताया है।",
          pa: "ਅਜਿਹੇ 'ਮੁਫ਼ਤ ਲੈਪਟਾਪ' ਸੁਨੇਹਿਆਂ ਨੂੰ ਅਧਿਕਾਰਤ ਤੱਥ-ਜਾਂਚ ਇਕਾਈਆਂ ਨੇ ਜਾਅਲੀ ਦੱਸਿਆ ਹੈ।",
        },
      },
      {
        title: { en: "Asks for sensitive details", hi: "संवेदनशील जानकारी माँगता है", pa: "ਸੰਵੇਦਨਸ਼ੀਲ ਜਾਣਕਾਰੀ ਮੰਗਦਾ ਹੈ" },
        description: {
          en: "Real schemes never ask for bank details through forwarded links.",
          hi: "असली योजनाएँ कभी फ़ॉरवर्ड किए गए लिंक से बैंक जानकारी नहीं माँगतीं।",
          pa: "ਅਸਲ ਸਕੀਮਾਂ ਕਦੇ ਫ਼ਾਰਵਰਡ ਕੀਤੇ ਲਿੰਕਾਂ ਰਾਹੀਂ ਬੈਂਕ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗਦੀਆਂ।",
        },
      },
    ],
    sources: [
      { name: "PIB Fact Check", title: { en: "Official government fact-check unit", hi: "सरकार की आधिकारिक फ़ैक्ट-चेक इकाई", pa: "ਸਰਕਾਰ ਦੀ ਅਧਿਕਾਰਤ ਤੱਥ-ਜਾਂਚ ਇਕਾਈ" }, type: "factcheck", url: "https://pib.gov.in/factcheck.aspx" },
      { name: "Cyber Crime Portal", title: { en: "Report and learn about online fraud", hi: "ऑनलाइन धोखाधड़ी की जानकारी और शिकायत", pa: "ਆਨਲਾਈਨ ਧੋਖਾਧੜੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਅਤੇ ਸ਼ਿਕਾਇਤ" }, type: "official", url: "https://cybercrime.gov.in" },
    ],
  },
  verified: {
    status: "verified",
    explanation: {
      en: "The claim that Chandrayaan-3 landed near the Moon's south pole on 23 August 2023 matches official records. India became the first country to land in that region.",
      hi: "चंद्रयान-3 के 23 अगस्त 2023 को चंद्रमा के दक्षिणी ध्रुव के पास उतरने का दावा आधिकारिक रिकॉर्ड से मेल खाता है। भारत उस क्षेत्र में उतरने वाला पहला देश बना।",
      pa: "ਚੰਦਰਯਾਨ-3 ਦੇ 23 ਅਗਸਤ 2023 ਨੂੰ ਚੰਦ ਦੇ ਦੱਖਣੀ ਧਰੁਵ ਨੇੜੇ ਉਤਰਨ ਦਾ ਦਾਅਵਾ ਅਧਿਕਾਰਤ ਰਿਕਾਰਡ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਭਾਰਤ ਉਸ ਖੇਤਰ ਵਿੱਚ ਉਤਰਨ ਵਾਲਾ ਪਹਿਲਾ ਦੇਸ਼ ਬਣਿਆ।",
    },
    evidence: [
      {
        title: { en: "Official mission record", hi: "आधिकारिक मिशन रिकॉर्ड", pa: "ਅਧਿਕਾਰਤ ਮਿਸ਼ਨ ਰਿਕਾਰਡ" },
        description: {
          en: "ISRO's mission page confirms the landing date and location.",
          hi: "ISRO के मिशन पेज पर लैंडिंग की तारीख और स्थान की पुष्टि है।",
          pa: "ISRO ਦੇ ਮਿਸ਼ਨ ਪੰਨੇ 'ਤੇ ਉਤਰਨ ਦੀ ਮਿਤੀ ਅਤੇ ਥਾਂ ਦੀ ਪੁਸ਼ਟੀ ਹੈ।",
        },
      },
      {
        title: { en: "Wide reliable coverage", hi: "भरोसेमंद व्यापक कवरेज", pa: "ਭਰੋਸੇਯੋਗ ਵਿਆਪਕ ਕਵਰੇਜ" },
        description: {
          en: "Multiple trusted news organisations reported the same facts.",
          hi: "कई भरोसेमंद समाचार संस्थाओं ने यही तथ्य बताए।",
          pa: "ਕਈ ਭਰੋਸੇਯੋਗ ਖ਼ਬਰ ਸੰਸਥਾਵਾਂ ਨੇ ਇਹੀ ਤੱਥ ਦੱਸੇ।",
        },
      },
    ],
    sources: [
      { name: "ISRO", title: { en: "Chandrayaan-3 mission page", hi: "चंद्रयान-3 मिशन पेज", pa: "ਚੰਦਰਯਾਨ-3 ਮਿਸ਼ਨ ਪੰਨਾ" }, type: "official", url: "https://www.isro.gov.in" },
      { name: "PIB", title: { en: "Press Information Bureau releases", hi: "पत्र सूचना कार्यालय विज्ञप्तियाँ", pa: "ਪ੍ਰੈੱਸ ਸੂਚਨਾ ਬਿਊਰੋ ਰਿਲੀਜ਼ਾਂ" }, type: "official", url: "https://pib.gov.in" },
    ],
  },
  review: {
    status: "review",
    explanation: {
      en: "Turmeric is widely used at home and may have some health benefits, but there is no reliable evidence that it removes every virus in three days. Health information is mixed and the claim needs expert review. Please consult a doctor for medical advice.",
      hi: "हल्दी घरों में आम है और इसके कुछ स्वास्थ्य लाभ हो सकते हैं, लेकिन इसका कोई भरोसेमंद सबूत नहीं है कि यह तीन दिन में हर वायरस खत्म कर देती है। स्वास्थ्य जानकारी मिली-जुली है और इस दावे की विशेषज्ञ समीक्षा ज़रूरी है। चिकित्सा सलाह के लिए डॉक्टर से मिलें।",
      pa: "ਹਲਦੀ ਘਰਾਂ ਵਿੱਚ ਆਮ ਵਰਤੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਇਸਦੇ ਕੁਝ ਸਿਹਤ ਲਾਭ ਹੋ ਸਕਦੇ ਹਨ, ਪਰ ਇਸਦਾ ਕੋਈ ਭਰੋਸੇਯੋਗ ਸਬੂਤ ਨਹੀਂ ਕਿ ਇਹ ਤਿੰਨ ਦਿਨਾਂ ਵਿੱਚ ਹਰ ਵਾਇਰਸ ਖ਼ਤਮ ਕਰ ਦਿੰਦੀ ਹੈ। ਸਿਹਤ ਜਾਣਕਾਰੀ ਮਿਲੀ-ਜੁਲੀ ਹੈ ਅਤੇ ਇਸ ਦਾਅਵੇ ਦੀ ਮਾਹਰ ਸਮੀਖਿਆ ਜ਼ਰੂਰੀ ਹੈ। ਡਾਕਟਰੀ ਸਲਾਹ ਲਈ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
    },
    evidence: [
      {
        title: { en: "Partial truth", hi: "आंशिक सच", pa: "ਅੰਸ਼ਕ ਸੱਚ" },
        description: {
          en: "Some studies discuss turmeric's properties, but none show it cures all viruses.",
          hi: "कुछ अध्ययन हल्दी के गुणों की बात करते हैं, पर कोई भी यह नहीं दिखाता कि यह सभी वायरस ठीक करती है।",
          pa: "ਕੁਝ ਅਧਿਐਨ ਹਲਦੀ ਦੇ ਗੁਣਾਂ ਦੀ ਗੱਲ ਕਰਦੇ ਹਨ, ਪਰ ਕੋਈ ਵੀ ਇਹ ਨਹੀਂ ਦਿਖਾਉਂਦਾ ਕਿ ਇਹ ਸਾਰੇ ਵਾਇਰਸ ਠੀਕ ਕਰਦੀ ਹੈ।",
        },
      },
      {
        title: { en: "Unnamed 'doctors'", hi: "बिना नाम के 'डॉक्टर'", pa: "ਬਿਨਾਂ ਨਾਮ ਦੇ 'ਡਾਕਟਰ'" },
        description: {
          en: "The message cites doctors without names or sources.",
          hi: "संदेश बिना नाम या स्रोत के डॉक्टरों का हवाला देता है।",
          pa: "ਸੁਨੇਹਾ ਬਿਨਾਂ ਨਾਮ ਜਾਂ ਸਰੋਤ ਦੇ ਡਾਕਟਰਾਂ ਦਾ ਹਵਾਲਾ ਦਿੰਦਾ ਹੈ।",
        },
      },
    ],
    sources: [
      { name: "World Health Organization", title: { en: "Health myth busters", hi: "स्वास्थ्य से जुड़े मिथकों का सच", pa: "ਸਿਹਤ ਨਾਲ ਜੁੜੇ ਭਰਮਾਂ ਦਾ ਸੱਚ" }, type: "health", url: "https://www.who.int" },
      { name: "Ministry of Health (MoHFW)", title: { en: "Official health guidance", hi: "आधिकारिक स्वास्थ्य मार्गदर्शन", pa: "ਅਧਿਕਾਰਤ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ" }, type: "official", url: "https://www.mohfw.gov.in" },
    ],
  },
  unverified: {
    status: "unverified",
    explanation: {
      en: "We could not find reliable evidence for or against this claim. It relies on unnamed 'sources' and no official body has made such an announcement. Treat it with caution and do not forward it until it is confirmed.",
      hi: "हमें इस दावे के पक्ष या विपक्ष में भरोसेमंद सबूत नहीं मिला। यह बिना नाम के 'सूत्रों' पर आधारित है और किसी आधिकारिक संस्था ने ऐसी घोषणा नहीं की है। सावधानी रखें और पुष्टि होने तक इसे आगे न भेजें।",
      pa: "ਸਾਨੂੰ ਇਸ ਦਾਅਵੇ ਦੇ ਹੱਕ ਜਾਂ ਵਿਰੋਧ ਵਿੱਚ ਭਰੋਸੇਯੋਗ ਸਬੂਤ ਨਹੀਂ ਮਿਲਿਆ। ਇਹ ਬਿਨਾਂ ਨਾਮ ਦੇ 'ਸੂਤਰਾਂ' 'ਤੇ ਅਧਾਰਿਤ ਹੈ ਅਤੇ ਕਿਸੇ ਅਧਿਕਾਰਤ ਸੰਸਥਾ ਨੇ ਅਜਿਹਾ ਐਲਾਨ ਨਹੀਂ ਕੀਤਾ। ਸਾਵਧਾਨ ਰਹੋ ਅਤੇ ਪੁਸ਼ਟੀ ਹੋਣ ਤੱਕ ਇਸ ਨੂੰ ਅੱਗੇ ਨਾ ਭੇਜੋ।",
    },
    evidence: [
      {
        title: { en: "No official announcement", hi: "कोई आधिकारिक घोषणा नहीं", pa: "ਕੋਈ ਅਧਿਕਾਰਤ ਐਲਾਨ ਨਹੀਂ" },
        description: {
          en: "No matching notice was found from the relevant authority.",
          hi: "संबंधित प्राधिकरण की ओर से कोई मिलती-जुलती सूचना नहीं मिली।",
          pa: "ਸਬੰਧਤ ਅਥਾਰਟੀ ਵੱਲੋਂ ਕੋਈ ਮਿਲਦੀ-ਜੁਲਦੀ ਸੂਚਨਾ ਨਹੀਂ ਮਿਲੀ।",
        },
      },
      {
        title: { en: "Vague sourcing", hi: "अस्पष्ट स्रोत", pa: "ਅਸਪਸ਼ਟ ਸਰੋਤ" },
        description: {
          en: "Phrases like 'sources say' without names make claims hard to check.",
          hi: "बिना नाम के 'सूत्रों के अनुसार' जैसे वाक्य दावों को जाँचना कठिन बनाते हैं।",
          pa: "ਬਿਨਾਂ ਨਾਮ ਦੇ 'ਸੂਤਰਾਂ ਮੁਤਾਬਕ' ਵਰਗੇ ਵਾਕ ਦਾਅਵਿਆਂ ਨੂੰ ਜਾਂਚਣਾ ਔਖਾ ਬਣਾਉਂਦੇ ਹਨ।",
        },
      },
    ],
    sources: [
      { name: "Reserve Bank of India", title: { en: "Official press releases", hi: "आधिकारिक प्रेस विज्ञप्तियाँ", pa: "ਅਧਿਕਾਰਤ ਪ੍ਰੈੱਸ ਰਿਲੀਜ਼ਾਂ" }, type: "official", url: "https://www.rbi.org.in" },
      { name: "PIB Fact Check", title: { en: "Check viral claims", hi: "वायरल दावों की जाँच", pa: "ਵਾਇਰਲ ਦਾਅਵਿਆਂ ਦੀ ਜਾਂਚ" }, type: "factcheck", url: "https://pib.gov.in/factcheck.aspx" },
    ],
  },
};

const RULES: { status: VerificationStatus; words: string[] }[] = [
  { status: "verified", words: ["chandrayaan", "isro", "चंद्रयान", "ਚੰਦਰਯਾਨ"] },
  { status: "review", words: ["turmeric", "cure", "virus", "हल्दी", "वायरस", "इलाज", "ਹਲਦੀ", "ਵਾਇਰਸ", "ਇਲਾਜ"] },
  { status: "misleading", words: ["free", "lottery", "forward", "aadhaar", "click", "मुफ्त", "मुफ़्त", "फ़ॉरवर्ड", "ਮੁਫ਼ਤ", "ਮੁਫਤ", "ਫ਼ਾਰਵਰਡ"] },
];

/** Demo-only: chooses a template with simple keyword rules. */
export function pickTemplate(text: string): ReportTemplate {
  const t = text.toLowerCase();
  for (const r of RULES) if (r.words.some((w) => t.includes(w))) return REPORT_TEMPLATES[r.status];
  return REPORT_TEMPLATES.unverified;
}
