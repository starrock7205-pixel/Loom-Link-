import { LanguageCode } from '../types/loomlink';

export interface LocalizedStrings {
  languageName: string;
  nativeLabel: string;
  greeting: string;
  promiseBanner: string;
  recordSareeCta: string;
  evidenceCta: string;
  pricingCta: string;
  publishCta: string;
  offersCta: string;
  receiptCta: string;
  offlineSaved: string;
  voicePromptHint: string;
  voicePinPrompt: string;
  tapToSpeak: string;
}

export const TRANSLATIONS: Record<LanguageCode, LocalizedStrings> = {
  te: {
    languageName: 'Telugu',
    nativeLabel: 'తెలుగు',
    greeting: 'నమస్కారం లక్ష్మి దేవి గారు',
    promiseBanner: 'AI మార్కెట్ శక్తిని ఇస్తుంది. తుది నిర్ణయం నేతన్నదే.',
    recordSareeCta: 'మాటతో చీర వివరాలు చెప్పండి',
    evidenceCta: 'ఆధారాలు అప్‌లోడ్ చేయండి',
    pricingCta: 'న్యాయమైన ధర చూడండి',
    publishCta: 'వాయిస్-పిన్‌తో ఆమోదించండి',
    offersCta: 'కొనుగోలుదారు ఆఫర్లు',
    receiptCta: 'మీ విలువ రసీదు చూడండి',
    offlineSaved: 'నెట్‌వర్క్ లేదు. డ్రాఫ్ట్ ఆఫ్‌లైన్‌లో సేవ్ చేయబడింది.',
    voicePromptHint:
      'మీ చీర రకం, నూలు ఖర్చు, ఎంత మంది ఎన్ని రోజులు పని చేశారో చెప్పండి.',
    voicePinPrompt: 'నిర్ధారించడానికి మీ 4-అంకెల వాయిస్-పిన్ చెప్పండి లేదా టైప్ చేయండి (1234).',
    tapToSpeak: 'మాట్లాడటానికి నొక్కండి',
  },
  hi: {
    languageName: 'Hindi',
    nativeLabel: 'हिन्दी',
    greeting: 'नमस्ते लक्ष्मी देवी जी',
    promiseBanner: 'AI बाज़ार की ताकत देता है। अंतिम अधिकार बुनकर के पास है।',
    recordSareeCta: 'आवाज़ से साड़ी की जानकारी दें',
    evidenceCta: 'सबूत अपलोड करें',
    pricingCta: 'उचित मूल्य देखें',
    publishCta: 'वॉइस-पिन से मंजूरी दें',
    offersCta: 'खरीदार के प्रस्ताव',
    receiptCta: 'अपनी मूल्य रसीद देखें',
    offlineSaved: 'नेटवर्क उपलब्ध नहीं है। ड्राफ्ट ऑफ़लाइन सहेजा गया।',
    voicePromptHint:
      'अपनी साड़ी का कपड़ा, धागे का खर्च, और कितने लोगों ने कितने दिन काम किया बताएं।',
    voicePinPrompt: 'पुष्टि करने के लिए अपना 4-अंकों का वॉइस-पिन बोलें या दर्ज करें (1234)।',
    tapToSpeak: 'बोलने के लिए दबाएं',
  },
  kn: {
    languageName: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    greeting: 'ನಮಸ್ಕಾರ ಲಕ್ಷ್ಮಿ ದೇವಿ ಅವರೇ',
    promiseBanner: 'AI ಮಾರುಕಟ್ಟೆ ಶಕ್ತಿ ನೀಡುತ್ತದೆ. ಅಂತಿಮ ಅಧಿಕಾರ ನೇಕಾರರದ್ದೇ.',
    recordSareeCta: 'ಧ್ವನಿಯಿಂದ ಸೀರೆ ವಿವರ ಹೇಳಿ',
    evidenceCta: 'ಪುರಾವೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    pricingCta: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ನೋಡಿ',
    publishCta: 'ವಾಯ್ಸ್-ಪಿನ್ ಮೂಲಕ ಅನುಮೋದಿಸಿ',
    offersCta: 'ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳು',
    receiptCta: 'ನಿಮ್ಮ ಮೌಲ್ಯ ರಸೀದಿ ನೋಡಿ',
    offlineSaved: 'ನೆಟ್‌ವರ್ಕ್ ಲಭ್ಯವಿಲ್ಲ. ಡ್ರಾಫ್ಟ್ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ.',
    voicePromptHint:
      'ನಿಮ್ಮ ಸೀರೆ ವಿಧ, ನೂಲಿನ ವೆಚ್ಚ, ಎಷ್ಟು ಜನ ಎಷ್ಟು ದಿನ ಕೆಲಸ ಮಾಡಿದರು ಎಂದು ಹೇಳಿ.',
    voicePinPrompt: 'ದೃಢೀಕರಿಸಲು ನಿಮ್ಮ 4-ಅಂಕಿಯ ವಾಯ್ಸ್-ಪಿನ್ ಹೇಳಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (1234).',
    tapToSpeak: 'ಮಾತನಾಡಲು ಒತ್ತಿರಿ',
  },
  en: {
    languageName: 'English',
    nativeLabel: 'English',
    greeting: 'Namaskaram, Lakshmi Devi',
    promiseBanner: 'AI creates market power. The artisan retains final authority.',
    recordSareeCta: 'Describe Saree by Voice',
    evidenceCta: 'Upload Evidence',
    pricingCta: 'View Fair Price',
    publishCta: 'Approve with Voice-PIN',
    offersCta: 'Buyer Offers',
    receiptCta: 'View Value Receipt',
    offlineSaved: 'Network unavailable. Draft saved offline.',
    voicePromptHint:
      'Speak about saree weave, yarn cost, number of weavers, and loom days.',
    voicePinPrompt: 'Speak or enter your 4-digit Voice-PIN to confirm (1234).',
    tapToSpeak: 'Tap to Speak',
  },
};
