import { LanguageCode } from '../types/loomlink';
import { DostLocaleBundle } from '../types/loomDost';

export const LOOM_DOST_DICTIONARY: Record<LanguageCode, DostLocaleBundle> = {
  te: {
    ui: {
      name: 'లూమ్ దోస్త్ (Loom Dost)',
      subtitle: 'మీ చేనేత సహాయకుడు',
      idleTooltip: 'సహాయం కావాలా? నొక్కండి.',
      listeningLabel: 'వింటున్నాను… ఆపడానికి నొక్కండి.',
      thinkingPrefix: '[SIMULATED]',
      repeatBtn: 'మళ్ళీ చెప్పు',
      slowDownBtn: 'నెమ్మదిగా',
      normalSpeedBtn: 'సాధారణ వేగం',
      translateLabel: 'భాష',
      nextBtn: 'తరువాత',
      prevBtn: 'వెనుకకు',
      gotItBtn: 'అర్థమైంది',
      askVoiceBtn: 'మాట్లాడి అడగండి',
      stopListeningBtn: 'వినిపించడం ఆపు',
      askPlaceholder: 'అడగండి (ఉదా: కనిష్ట ధర, GI, Voice-PIN)...',
      sendBtn: 'అడుగు',
      yesBtn: 'అవును (Yes)',
      noBtn: 'వద్దు (No)',
      muteLabel: 'మాట ఆపు',
      unmuteLabel: 'మాట ఆన్',
      dismissLabel: 'మూసివేయి',
      openGuideLabel: 'లూమ్ దోస్త్ తెరవండి',
      offscreenHint: 'సూచించిన భాగాన్ని చూడటానికి మెల్లగా పైకి లేదా కిందికి చూడండి.',
      errorUnclear:
        'మీ మాట స్పష్టంగా వినిపించలేదు. మళ్ళీ చెప్పండి లేదా కింది ఎంపికలలో ఒకటి ఎంచుకోండి.',
      retryBtn: 'మళ్ళీ ప్రయత్నించండి',
      simulatedBadge: '[SIMULATED]',
      activityTitle: 'AI ఇప్పుడు ఏం చేస్తోంది [SIMULATED]',
      waitingActionBadge: 'మీ చర్య కోసం వేచి ఉన్నాము',
      approvalBadge: 'Voice-PIN ఆమోదం తప్పనిసరి',
    },
    stateLabels: {
      IDLE: 'సిద్ధంగా ఉంది',
      LISTENING: 'వింటున్నాను',
      THINKING: 'పరిశీలిస్తోంది [SIMULATED]',
      EXPLAINING: 'వివరిస్తున్నాను',
      WAITING_FOR_ACTION: 'మీ పని కోసం వేచి ఉంది',
      APPROVAL_REMINDER: 'మీ ఆమోదం అవసరం',
      ERROR_HELP: 'మళ్ళీ ప్రయత్నించండి',
    },
    thinkingStatuses: {
      checkingYarnBill: 'మీ దారం బిల్లు పట్టు అంచుకు సరిపోతుందో లేదో చూస్తున్నాను… [SIMULATED]',
      matchingCluster: 'గద్వాల్ క్లస్టర్ వివరాలను సరిపోల్చుతున్నాను… [SIMULATED]',
      calculatingPrice: 'న్యాయమైన ధరను లెక్కిస్తున్నాను… [SIMULATED]',
      preparingListing: 'కొనుగోలుదారులకు సిద్ధంగా ఉన్న కార్డు తయారు చేస్తున్నాను… [SIMULATED]',
    },
    claimDefinitions: {
      VERIFIED: 'VERIFIED అంటే అసలు బిల్లు లేదా ఫోటోతో రుజువు అయింది.',
      'ARTISAN-REPORTED':
        'ARTISAN-REPORTED అంటే మీరు చెప్పారు, కానీ ఇంకా రసీదు జతచేయలేదు.',
      PENDING: 'PENDING అంటే సర్టిఫికేట్ లేదా రుజువు కోసం వేచి ఉంది.',
      BLOCKED: 'BLOCKED అంటే రుజువు లేకపోవడం వల్ల ప్రదర్శించబడదు.',
    },
    pricingDemoFlow: {
      welcomeTitle: 'ధరల వివరణ',
      welcome: 'ఇది మీ గద్వాల్ చీర ధరల పేజీ. నేను ప్రతి రూపాయిని వివరిస్తాను.',
      materialTitle: 'దారం ఖర్చు',
      material: (amount) => `మీ దారం ఖర్చు ${amount}.`,
      labourTitle: 'కుటుంబ శ్రమ విలువ',
      labour: (workers, days, amount) =>
        `మీ కుటుంబం ${workers} మంది, ${days} రోజులు పనిచేసింది. అందుకు ${amount}.`,
      floorTitle: 'కనిష్ట ధర రక్షణ',
      floor: (amount) =>
        `మీ కనిష్ట ధర ${amount}. దీని కంటే తక్కువ ధరను అంగీకరించకండి.`,
      giTitle: 'GI ట్యాగ్ స్థితి',
      giPending: 'GI రుజువు ఇంకా లేదు. కాబట్టి ఇది PENDINGగా ఉంటుంది.',
      giVerified: 'మీ GI సర్టిఫికేట్ అప్‌లోడ్ అయింది. కాబట్టి ఇది VERIFIEDగా ఉంది.',
      giBlocked: 'సరైన GI రుజువు లేనందున ఈ క్లెయిమ్ BLOCKEDగా ఉంది.',
      askReplayTitle: 'మళ్ళీ వింటారా?',
      askReplay: 'మీకు ధర ఎలా వచ్చిందో మళ్ళీ చెప్పాలా?',
      slowSummaryTitle: 'నెమ్మదైన పూర్తి ధర వివరణ',
      slowSummary: (mat, lab, log, floor, rec, bulkMin) =>
        `దారం ఖర్చు ${mat}. శ్రమ విలువ ${lab}. రెండూ కలిపి కనిష్ట ధర ${floor}. ప్యాకింగ్ ${log}, రిటర్న్ రిజర్వ్ 3%, ప్లాట్‌ఫారమ్ ఫీజు 9% కలిపి నేరుగా అమ్మే ధర ${rec}. బల్క్ కనీస ధర ${bulkMin}.`,
      voicePinTitle: 'మీ తుది ఆమోదం',
      voicePinReminder: 'ఈ ధరను ప్రచురించడానికి మీ Voice-PIN ఆమోదం అవసరం.',
    },
    screens: {
      voice: {
        recordCue:
          'మైక్ బటన్ నొక్కి మీ చీర గురించి తెలుగులో చెప్పండి. నెట్‌వర్క్ లేకపోయినా టైప్ చేయవచ్చు.',
        inputsCue:
          'న్యాయమైన ధర లెక్కించడానికి దారం ఖర్చు, మగ్గం రోజులు, పనిచేసిన వారి సంఖ్య అడుగుతాము.',
        unsupportedCue:
          'రుజువు లేని క్లెయిమ్‌లను నేను VERIFIED అని రాయను. ముందుగా రసీదులు చూస్తాను.',
        giPendingCue:
          'GI సర్టిఫికేట్ ఇంకా అప్‌లోడ్ కాలేదు. అందుకే GI గద్వాల్ PENDINGగా ఉంది.',
      },
      evidence: {
        yarnBillCue:
          'దారం బిల్లు మీ పట్టు మరియు జరీ ఖర్చును VERIFIED చేస్తుంది.',
        loomPhotoCue:
          'మగ్గం ఫోటో మీరు చేనేతలో పనిచేశారని రుజువు చేస్తుంది.',
        coopGiCue:
          'సహకార సంఘం ID మరియు GI సర్టిఫికేట్ ఉంటేనే GI ట్యాగ్ VERIFIED అవుతుంది.',
        handloomConsentCue:
          'హ్యాండ్లూమ్ మార్క్ ఫోటో చేనేత గుర్తింపును చూపుతుంది. మీ పేరు చూపించాలా వద్దా మీరే నిర్ణయిస్తారు.',
        verifiedVsReportedCue:
          'రుజువు ఉంటే VERIFIED. లేకుంటే ARTISAN-REPORTED లేదా PENDINGగా మాత్రమే చూపిస్తాము.',
      },
      pricing: {
        logisticsCue:
          'ప్యాకింగ్ మరియు రవాణా ఖర్చు చీర సురక్షితంగా చేరడానికి ఉద్దేశించబడింది.',
        feesCue:
          '3% రిటర్న్ రిజర్వ్ మరియు 9% ప్లాట్‌ఫారమ్ ఫీజు ముందే స్పష్టంగా చూపిస్తాము. దాచిన కోతలు ఉండవు.',
        recommendedBulkCue:
          'ఇది మీ కనిష్ట ధర. దీని కంటే తక్కువ ధరను అంగీకరించకండి, మీరు కోరుకుంటే తప్ప.',
      },
      publish: {
        gateCue:
          'కొనుగోలుదారులకు కనిపించే కార్డు ఇదే. మీ Voice-PIN వేస్తేనే ఇది ప్రచురించబడుతుంది.',
      },
      negotiation: {
        offerBelowFloorCue: (offer, floor) =>
          `కొనుగోలుదారు ఇచ్చిన ${offer} మీ కనిష్ట ధర ${floor} కంటే తక్కువగా ఉంది. అందుకే ఆపి ఉంచాము.`,
        offerAboveFloorCue: (offer, rec) =>
          `ఈ ${offer} ధర కనిష్ట ధర కంటే ఎక్కువ, కానీ సిఫార్సు చేసిన ${rec} కంటే తక్కువ. కౌంటర్ ధర పంపవచ్చు.`,
        counterCapacityCue: (counter, days) =>
          `AI ${counter} కౌంటర్ ధరను సిద్ధం చేసింది. ${days} రోజుల్లో డెలివరీ సాధ్యమా అని మీరే చూసి ఆమోదించాలి.`,
        approvalCue:
          'ఈ కౌంటర్ ధర లేదా ఆర్డర్ మీ Voice-PIN ఆమోదం తర్వాతే ఖరారవుతుంది.',
      },
      bulk: {
        capacityCue: (qty, weavers) =>
          `${qty} చీరలను ఒకే మగ్గంపై నేయలేము. దీనికి క్లస్టర్‌లో ${weavers} మంది నేతన్నలు కలిసి పనిచేయాలి.`,
        stagedDeadlineCue:
          'బల్క్ ఆర్డర్లలో దశలవారీ చెల్లింపు ఉంటుంది. అసాధ్యమైన గడువు మరియు కనిష్ట ధర కంటే తక్కువ ఆఫర్‌ను అంగీకరించవద్దు.',
      },
      janai: {
        qcDispatchCue:
          'JanAI కేఫ్ ఆపరేటర్ శ్రీనివాస్ నాణ్యత తనిఖీ, ప్యాకింగ్ ఫోటో మరియు పార్శిల్ పంపడం మాత్రమే చేస్తారు.',
        operatorLockCue:
          'కేఫ్ ఆపరేటర్ మీ ధరను మార్చలేరు, ఆఫర్‌ను అంగీకరించలేరు లేదా తప్పుడు క్లెయిమ్‌లు రాయలేరు.',
      },
      receipt: {
        netCue: (netUnit, total, qty) =>
          `${qty} చీరలకు మీ చేతికి వచ్చే నికర డబ్బు ${total}. ప్రతి చీరకు ${netUnit} మీకు దక్కుతుంది.`,
        retainedCue: (pct) =>
          `రిటైల్ ధరలో ${pct}% వాటా నేరుగా మీకే లభించింది.`,
        upliftCue: (trader, uplift) =>
          `సాధారణ దళారి ఇచ్చే ${trader}తో పోలిస్తే, LoomLink ద్వారా ప్రతి చీరకు ${uplift} అదనంగా వచ్చాయి.`,
      },
      general: {
        welcomeCue:
          'నమస్కారం! నేను లూమ్ దోస్త్. ఈ స్క్రీన్‌లో ఉన్న ప్రతి అంశాన్ని సులభమైన తెలుగులో వివరిస్తాను.',
      },
    },
    quickTopics: [
      { id: 'floor', label: 'కనిష్ట ధర ఏమిటి?', query: 'floor price' },
      { id: 'gi', label: 'GI ఎందుకు PENDING?', query: 'gi pending' },
      { id: 'pin', label: 'Voice-PIN ఎందుకు?', query: 'voice pin' },
      { id: 'receipt', label: 'నాకు ఎంత వస్తుంది?', query: 'net payout' },
    ],
  },

  kn: {
    ui: {
      name: 'ಲೂಮ್ ದೋಸ್ತ್ (Loom Dost)',
      subtitle: 'ನಿಮ್ಮ ನೇಕಾರರ ಮಾರ್ಗದರ್ಶಿ',
      idleTooltip: 'ಸಹಾಯ ಬೇಕೇ? ನನ್ನನ್ನು ಒತ್ತಿ.',
      listeningLabel: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ… ನಿಲ್ಲಿಸಲು ಒತ್ತಿ.',
      thinkingPrefix: '[SIMULATED]',
      repeatBtn: 'ಮತ್ತೆ ಹೇಳು',
      slowDownBtn: 'ನಿಧಾನವಾಗಿ',
      normalSpeedBtn: 'ಸಾಮಾನ್ಯ ವೇಗ',
      translateLabel: 'ಭಾಷೆ',
      nextBtn: 'ಮುಂದೆ',
      prevBtn: 'ಹಿಂದೆ',
      gotItBtn: 'ಅರ್ಥವಾಯಿತು',
      askVoiceBtn: 'ಮಾತನಾಡಿ ಕೇಳಿ',
      stopListeningBtn: 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
      askPlaceholder: 'ಕೇಳಿ (ಉದಾ: ಕನಿಷ್ಠ ಬೆಲೆ, GI, Voice-PIN)...',
      sendBtn: 'ಕಳುಹಿಸಿ',
      yesBtn: 'ಹೌದು (Yes)',
      noBtn: 'ಬೇಡ (No)',
      muteLabel: 'ಧ್ವನಿ ನಿಲ್ಲಿಸು',
      unmuteLabel: 'ಧ್ವನಿ ಆನ್',
      dismissLabel: 'ಮುಚ್ಚಿ',
      openGuideLabel: 'ಲೂಮ್ ದೋಸ್ತ್ ತೆರೆಯಿರಿ',
      offscreenHint: 'ಗುರುತಿಸಿದ ಭಾಗವನ್ನು ನೋಡಲು ನಿಧಾನವಾಗಿ ಮೇಲೆ ಅಥವಾ ಕೆಳಗೆ ನೋಡಿ.',
      errorUnclear:
        'ನಿಮ್ಮ ಮಾತು ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಹೇಳಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಬಳಸಿ.',
      retryBtn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
      simulatedBadge: '[SIMULATED]',
      activityTitle: 'AI ಈಗ ಏನು ಮಾಡುತ್ತಿದೆ [SIMULATED]',
      waitingActionBadge: 'ನಿಮ್ಮ ಕ್ರಿಯೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
      approvalBadge: 'Voice-PIN ಒಪ್ಪಿಗೆ ಕಡ್ಡಾಯ',
    },
    stateLabels: {
      IDLE: 'ಸಿದ್ಧವಾಗಿದೆ',
      LISTENING: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ',
      THINKING: 'ಪರಿಶೀಲಿಸುತ್ತಿದೆ [SIMULATED]',
      EXPLAINING: 'ವಿವರಿಸುತ್ತಿದೆ',
      WAITING_FOR_ACTION: 'ನಿಮ್ಮ ಕ್ರಿಯೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
      APPROVAL_REMINDER: 'ನಿಮ್ಮ ಒಪ್ಪಿಗೆ ಅಗತ್ಯ',
      ERROR_HELP: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    },
    thinkingStatuses: {
      checkingYarnBill: 'ನಿಮ್ಮ ನೂಲಿನ ಬಿಲ್ ರೇಷ್ಮೆ ಅಂಚನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆಯೇ ಎಂದು ನೋಡುತ್ತಿದ್ದೇನೆ… [SIMULATED]',
      matchingCluster: 'ಗದ್ವಾಲ್ ಕ್ಲಸ್ಟರ್ ಮಾಹಿತಿಯನ್ನು ಹೊಂದಿಸುತ್ತಿದ್ದೇನೆ… [SIMULATED]',
      calculatingPrice: 'ನ್ಯಾಯಯುತ ಬೆಲೆಯನ್ನು ಲೆಕ್ಕಹಾಕುತ್ತಿದ್ದೇನೆ… [SIMULATED]',
      preparingListing: 'ಖರೀದಿದಾರರಿಗೆ ಸಿದ್ಧ ಪಟ್ಟಿ ತಯಾರಿಸುತ್ತಿದ್ದೇನೆ… [SIMULATED]',
    },
    claimDefinitions: {
      VERIFIED: 'VERIFIED ಎಂದರೆ ಬಿಲ್ ಅಥವಾ ಫೋಟೋ ಪುರಾವೆ ಇದೆ.',
      'ARTISAN-REPORTED':
        'ARTISAN-REPORTED ಎಂದರೆ ನೀವು ಹೇಳಿದ್ದೀರಿ, ಆದರೆ ದಾಖಲೆ ಇನ್ನೂ ಬಾಕಿ ಇದೆ.',
      PENDING: 'PENDING ಎಂದರೆ ಪ್ರಮಾಣಪತ್ರದ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ.',
      BLOCKED: 'BLOCKED ಎಂದರೆ ಪುರಾವೆ ಇಲ್ಲದ ಕಾರಣ ತೋರಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    },
    pricingDemoFlow: {
      welcomeTitle: 'ಬೆಲೆ ವಿವರಣೆ',
      welcome: 'ಇದು ನಿಮ್ಮ ಗದ್ವಾಲ್ ಸೀರೆಯ ಬೆಲೆ ಪುಟ. ನಾನು ಪ್ರತಿ ರೂಪಾಯಿಯನ್ನು ವಿವರಿಸುತ್ತೇನೆ.',
      materialTitle: 'ನೂಲಿನ ವೆಚ್ಚ',
      material: (amount) => `ನಿಮ್ಮ ನೂಲಿನ ವೆಚ್ಚ ${amount}.`,
      labourTitle: 'ಕುಟುಂಬದ ಶ್ರಮ',
      labour: (workers, days, amount) =>
        `ನಿಮ್ಮ ಕುಟುಂಬದ ${workers} ಜನರು ${days} ದಿನ ಕೆಲಸ ಮಾಡಿದ್ದಾರೆ. ಅದಕ್ಕೆ ${amount}.`,
      floorTitle: 'ಕನಿಷ್ಠ ಬೆಲೆ ರಕ್ಷಣೆ',
      floor: (amount) =>
        `ಇದು ನಿಮ್ಮ ಕನಿಷ್ಠ ಬೆಲೆ ${amount}. ನೀವು ಬಯಸಿದರೆ ಮಾತ್ರ ಇದಕ್ಕಿಂತ ಕಡಿಮೆ ಬೆಲೆಗೆ ಒಪ್ಪಬೇಡಿ.`,
      giTitle: 'GI ಟ್ಯಾಗ್ ಸ್ಥಿತಿ',
      giPending: 'GI ಪುರಾವೆ ಇನ್ನೂ ಇಲ್ಲ. ಆದ್ದರಿಂದ ಇದು PENDING ಆಗಿರುತ್ತದೆ.',
      giVerified: 'GI ಪ್ರಮಾಣಪತ್ರ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ. ಆದ್ದರಿಂದ ಇದು VERIFIED ಆಗಿದೆ.',
      giBlocked: 'GI ಪುರಾವೆ ಇಲ್ಲದ ಕಾರಣ ಈ ಹಕ್ಕು BLOCKED ಆಗಿದೆ.',
      askReplayTitle: 'ಮತ್ತೆ ಹೇಳಬೇಕೇ?',
      askReplay: 'ಬೆಲೆ ಹೇಗೆ ಬಂದಿತು ಎಂದು ಮತ್ತೆ ನಿಧಾನವಾಗಿ ಹೇಳಲೇ?',
      slowSummaryTitle: 'ನಿಧಾನವಾದ ಬೆಲೆ ವಿವರಣೆ',
      slowSummary: (mat, lab, log, floor, rec, bulkMin) =>
        `ನೂಲಿನ ವೆಚ್ಚ ${mat}. ಶ್ರಮ ${lab}. ಕನಿಷ್ಠ ಬೆಲೆ ${floor}. ಪ್ಯಾಕಿಂಗ್ ${log}, ರಿಟರ್ನ್ ಮೀಸಲು 3%, ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ 9% ಸೇರಿ ನೇರ ಬೆಲೆ ${rec}. ಬಲ್ಕ್ ಕನಿಷ್ಠ ಬೆಲೆ ${bulkMin}.`,
      voicePinTitle: 'ನಿಮ್ಮ ಅಂತಿಮ ಒಪ್ಪಿಗೆ',
      voicePinReminder: 'ಈ ಬೆಲೆಯನ್ನು ಪ್ರಕಟಿಸಲು ನಿಮ್ಮ Voice-PIN ಒಪ್ಪಿಗೆ ಬೇಕು.',
    },
    screens: {
      voice: {
        recordCue: 'ಮೈಕ್ ಒತ್ತಿ ಸೀರೆಯ ವಿವರ ಹೇಳಿ. ಇಂಟರ್ನೆಟ್ ನಿಧಾನವಾಗಿದ್ದರೆ ಟೈಪ್ ಕೂಡ ಮಾಡಬಹುದು.',
        inputsCue: 'ನ್ಯಾಯಯುತ ಬೆಲೆಗೆ ನೂಲಿನ ವೆಚ್ಚ, ಮಗ್ಗದ ದಿನಗಳು ಮತ್ತು ಜನರ ಸಂಖ್ಯೆ ಕೇಳುತ್ತೇವೆ.',
        unsupportedCue: 'ಪುರಾವೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಹಕ್ಕನ್ನು VERIFIED ಎಂದು ತೋರಿಸುವುದಿಲ್ಲ.',
        giPendingCue: 'GI ಪ್ರಮಾಣಪತ್ರ ಅಪ್‌ಲೋಡ್ ಆಗುವವರೆಗೆ GI PENDING ಆಗಿರುತ್ತದೆ.',
      },
      evidence: {
        yarnBillCue: 'ನೂಲಿನ ಬಿಲ್ ರೇಷ್ಮೆ ಮತ್ತು ಜರಿ ವೆಚ್ಚವನ್ನು VERIFIED ಮಾಡುತ್ತದೆ.',
        loomPhotoCue: 'ಮಗ್ಗದ ಫೋಟೋ ಕೈಮಗ್ಗದ ಕೆಲಸವನ್ನು ಸಾಬೀತುಪಡಿಸುತ್ತದೆ.',
        coopGiCue: 'ಸಹಕಾರಿ ID ಮತ್ತು GI ಪ್ರಮಾಣಪತ್ರವಿದ್ದರೆ ಮಾತ್ರ GI VERIFIED ಆಗುತ್ತದೆ.',
        handloomConsentCue: 'ಹ್ಯಾಂಡ್ಲೂಮ್ ಮಾರ್ಕ್ ಕೈಮಗ್ಗದ ಗುರುತು ನೀಡುತ್ತದೆ. ಹೆಸರು ತೋರಿಸುವ ಆಯ್ಕೆ ನಿಮ್ಮದು.',
        verifiedVsReportedCue: 'ಪುರಾವೆ ಇದ್ದರೆ VERIFIED. ಇಲ್ಲದಿದ್ದರೆ ARTISAN-REPORTED ಅಥವಾ PENDING.',
      },
      pricing: {
        logisticsCue: 'ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸಾಗಣೆ ವೆಚ್ಚ ಸೀರೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತಲುಪಿಸಲು ಇರುತ್ತದೆ.',
        feesCue: '3% ರಿಟರ್ನ್ ಮೀಸಲು ಮತ್ತು 9% ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕವನ್ನು ಮೊದಲೇ ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸಲಾಗಿದೆ.',
        recommendedBulkCue: 'ಇದು ನಿಮ್ಮ ಕನಿಷ್ಠ ಬೆಲೆ. ನೀವು ಬಯಸಿದರೆ ಮಾತ್ರ ಇದಕ್ಕಿಂತ ಕಡಿಮೆ ಬೆಲೆಗೆ ಒಪ್ಪಬೇಡಿ.',
      },
      publish: {
        gateCue: 'ಖರೀದಿದಾರರು ನೋಡುವ ಕಾರ್ಡ್ ಇದು. ನಿಮ್ಮ Voice-PIN ನಂತರವೇ ಪ್ರಕಟವಾಗುತ್ತದೆ.',
      },
      negotiation: {
        offerBelowFloorCue: (offer, floor) =>
          `ಖರೀದಿದಾರರ ${offer} ಬೆಲೆ ನಿಮ್ಮ ಕನಿಷ್ಠ ಬೆಲೆ ${floor} ಗಿಂತ ಕಡಿಮೆ ಇದೆ. ಅದನ್ನು ತಡೆಯಲಾಗಿದೆ.`,
        offerAboveFloorCue: (offer, rec) =>
          `${offer} ಕನಿಷ್ಠ ಬೆಲೆಗಿಂತ ಹೆಚ್ಚು, ಆದರೆ ಶಿಫಾರಸು ಬೆಲೆ ${rec} ಗಿಂತ ಕಡಿಮೆ ಇದೆ.`,
        counterCapacityCue: (counter, days) =>
          `${counter} ಪ್ರತಿದರ ಸಿದ್ಧವಾಗಿದೆ. ${days} ದಿನಗಳಲ್ಲಿ ತಲುಪಿಸಲು ಸಾಧ್ಯವೇ ಎಂದು ನೀವೇ ನೋಡಿ.`,
        approvalCue: 'ಯಾವುದೇ ಅಂತಿಮ ಬೆಲೆಗೆ ನಿಮ್ಮ Voice-PIN ಒಪ್ಪಿಗೆ ಬೇಕು.',
      },
      bulk: {
        capacityCue: (qty, weavers) =>
          `${qty} ಸೀರೆಗಳಿಗೆ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಸುಮಾರು ${weavers} ನೇಕಾರರು ಸೇರಿ ಕೆಲಸ ಮಾಡಬೇಕು.`,
        stagedDeadlineCue:
          'ದೊಡ್ಡ ಆರ್ಡರ್‌ಗಳಲ್ಲಿ ಹಂತ ಹಂತವಾಗಿ ಪಾವತಿ ಇರುತ್ತದೆ. ಅಸಾಧ್ಯವಾದ ಗಡುವನ್ನು ಒಪ್ಪಬೇಡಿ.',
      },
      janai: {
        qcDispatchCue: 'ಜನ್‌ಎಐ ಕೆಫೆ ನಿರ್ವಾಹಕ ಶ್ರೀನಿವಾಸ್ ಗುಣಮಟ್ಟ ತಪಾಸಣೆ, ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ರವಾನೆ ಮಾಡುತ್ತಾರೆ.',
        operatorLockCue: 'ಕೆಫೆ ನಿರ್ವಾಹಕರು ಬೆಲೆಯನ್ನು ಅಥವಾ ಸೀರೆಯ ಹಕ್ಕುಗಳನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
      },
      receipt: {
        netCue: (netUnit, total, qty) =>
          `${qty} ಸೀರೆಗಳಿಗೆ ನಿಮ್ಮ ನಿವ್ವಳ ಆದಾಯ ${total}. ಪ್ರತಿ ಸೀರೆಗೆ ${netUnit} ಸಿಗುತ್ತದೆ.`,
        retainedCue: (pct) => `ಚಿಲ್ಲರೆ ಬೆಲೆಯ ${pct}% ನೇರವಾಗಿ ನೇಕಾರರಿಗೇ ಉಳಿದಿದೆ.`,
        upliftCue: (trader, uplift) =>
          `ಮಧ್ಯವರ್ತಿ ಕೊಡುವ ${trader} ಕ್ಕೆ ಹೋಲಿಸಿದರೆ, ಪ್ರತಿ ಸೀರೆಗೆ ${uplift} ಹೆಚ್ಚು ಸಿಕ್ಕಿದೆ.`,
      },
      general: {
        welcomeCue: 'ನಮಸ್ಕಾರ! ನಾನು ಲೂಮ್ ದೋಸ್ತ್. ಈ ಪುಟದ ಪ್ರತಿಯೊಂದು ವಿಷಯವನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸುತ್ತೇನೆ.',
      },
    },
    quickTopics: [
      { id: 'floor', label: 'ಕನಿಷ್ಠ ಬೆಲೆ ಎಂದರೇನು?', query: 'floor price' },
      { id: 'gi', label: 'GI ಏಕೆ PENDING?', query: 'gi pending' },
      { id: 'pin', label: 'Voice-PIN ಏಕೆ?', query: 'voice pin' },
      { id: 'receipt', label: 'ನನಗೆ ಎಷ್ಟು ಸಿಗುತ್ತದೆ?', query: 'net payout' },
    ],
  },

  hi: {
    ui: {
      name: 'लूम दोस्त (Loom Dost)',
      subtitle: 'आपका बुनाई साथी',
      idleTooltip: 'मदद चाहिए? मुझे दबाएँ।',
      listeningLabel: 'सुन रहा हूँ… रोकने के लिए दबाएँ।',
      thinkingPrefix: '[SIMULATED]',
      repeatBtn: 'दोबारा बताओ',
      slowDownBtn: 'धीरे बोलो',
      normalSpeedBtn: 'सामान्य गति',
      translateLabel: 'भाषा',
      nextBtn: 'आगे',
      prevBtn: 'पीछे',
      gotItBtn: 'समझ आ गया',
      askVoiceBtn: 'बोलकर पूछें',
      stopListeningBtn: 'सुनना बंद करें',
      askPlaceholder: 'पूछें (जैसे: न्यूनतम कीमत, GI, Voice-PIN)...',
      sendBtn: 'पूछें',
      yesBtn: 'हाँ (Yes)',
      noBtn: 'नहीं (No)',
      muteLabel: 'आवाज़ बंद',
      unmuteLabel: 'आवाज़ चालू',
      dismissLabel: 'बंद करें',
      openGuideLabel: 'लूम दोस्त खोलें',
      offscreenHint: 'दिखाई गई चीज़ देखने के लिए स्क्रीन थोड़ा ऊपर या नीचे करें।',
      errorUnclear:
        'आपकी आवाज़ साफ नहीं आई। कृपया दोबारा बोलें या नीचे दिए विकल्प चुनें।',
      retryBtn: 'फिर कोशिश करें',
      simulatedBadge: '[SIMULATED]',
      activityTitle: 'AI अभी क्या कर रहा है [SIMULATED]',
      waitingActionBadge: 'आपके कदम की प्रतीक्षा है',
      approvalBadge: 'Voice-PIN मंज़ूरी ज़रूरी है',
    },
    stateLabels: {
      IDLE: 'तैयार है',
      LISTENING: 'सुन रहा है',
      THINKING: 'जाँच रहा है [SIMULATED]',
      EXPLAINING: 'समझा रहा है',
      WAITING_FOR_ACTION: 'आपके काम की प्रतीक्षा',
      APPROVAL_REMINDER: 'आपकी मंज़ूरी ज़रूरी',
      ERROR_HELP: 'फिर कोशिश करें',
    },
    thinkingStatuses: {
      checkingYarnBill: 'जाँच रहा हूँ कि आपका धागे का बिल सिल्क बॉर्डर को साबित करता है या नहीं… [SIMULATED]',
      matchingCluster: 'गदवाल क्लस्टर की जानकारी मिला रहा हूँ… [SIMULATED]',
      calculatingPrice: 'उचित और साफ कीमत की गणना कर रहा हूँ… [SIMULATED]',
      preparingListing: 'खरीदारों के लिए कार्ड तैयार कर रहा हूँ… [SIMULATED]',
    },
    claimDefinitions: {
      VERIFIED: 'VERIFIED का मतलब है बिल या फोटो से सबूत मिल गया है।',
      'ARTISAN-REPORTED':
        'ARTISAN-REPORTED का मतलब है आपने बताया है, पर सबूत अभी बाकी है।',
      PENDING: 'PENDING का मतलब है सर्टिफिकेट की जाँच अभी बाकी है।',
      BLOCKED: 'BLOCKED का मतलब है सबूत न होने से यह दावा नहीं दिखेगा।',
    },
    pricingDemoFlow: {
      welcomeTitle: 'कीमत की जानकारी',
      welcome: 'यह आपकी गदवाल साड़ी की कीमत का पेज है। मैं हर रुपया समझाऊँगा।',
      materialTitle: 'धागे का खर्च',
      material: (amount) => `आपके धागे का खर्च ${amount} है।`,
      labourTitle: 'परिवार की मेहनत',
      labour: (workers, days, amount) =>
        `आपके परिवार के ${workers} लोगों ने ${days} दिन काम किया। उसके ${amount} बनते हैं।`,
      floorTitle: 'न्यूनतम कीमत सुरक्षा',
      floor: (amount) =>
        `यह आपकी न्यूनतम कीमत ${amount} है। जब तक आप चाहें, इससे कम कीमत स्वीकार न करें।`,
      giTitle: 'GI टैग स्थिति',
      giPending: 'GI सबूत अभी अपलोड नहीं है। इसलिए यह PENDING रहेगा।',
      giVerified: 'GI सर्टिफिकेट मिल गया है। अब यह VERIFIED है।',
      giBlocked: 'सबूत न होने से GI दावा अभी BLOCKED है।',
      askReplayTitle: 'क्या फिर से सुनें?',
      askReplay: 'क्या मैं धीरे से फिर समझाऊँ कि यह कीमत कैसे बनी?',
      slowSummaryTitle: 'धीमी गति में पूरा हिसाब',
      slowSummary: (mat, lab, log, floor, rec, bulkMin) =>
        `धागा ${mat}। मेहनत ${lab}। दोनों मिलाकर न्यूनतम कीमत ${floor}। पैकिंग ${log}, रिटर्न रिज़र्व 3% और प्लेटफॉर्म शुल्क 9% जोड़कर सीधी कीमत ${rec}। थोक न्यूनतम कीमत ${bulkMin}।`,
      voicePinTitle: 'आपकी अंतिम मंज़ूरी',
      voicePinReminder: 'यह कीमत प्रकाशित करने के लिए आपका Voice-PIN ज़रूरी है।',
    },
    screens: {
      voice: {
        recordCue: 'माइक दबाकर साड़ी के बारे में बोलें। नेटवर्क कम हो तो लिख भी सकते हैं।',
        inputsCue: 'सही कीमत निकालने के लिए हम धागे का खर्च, दिन और लोगों की संख्या पूछते हैं।',
        unsupportedCue: 'बिना सबूत किसी दावे को VERIFIED नहीं दिखाया जाता।',
        giPendingCue: 'GI सर्टिफिकेट अपलोड होने तक GI टैग PENDING रहेगा।',
      },
      evidence: {
        yarnBillCue: 'धागे का बिल सिल्क बॉर्डर और ज़री के दावे को VERIFIED करता है।',
        loomPhotoCue: 'करघे की फोटो साबित करती है कि साड़ी हाथ से बुनी गई है।',
        coopGiCue: 'सहकारी ID और GI सर्टिफिकेट अपलोड होने पर ही GI VERIFIED होगा।',
        handloomConsentCue: 'हैंडलूम मार्क से बुनाई की पहचान मिलती है। नाम दिखाना आपकी मर्ज़ी है।',
        verifiedVsReportedCue: 'सबूत होने पर VERIFIED, वरना ARTISAN-REPORTED या PENDING दिखेगा।',
      },
      pricing: {
        logisticsCue: 'पैकिंग और डिलीवरी खर्च साड़ी को सुरक्षित भेजने के लिए है।',
        feesCue: '3% रिटर्न रिज़र्व और 9% प्लेटफॉर्म शुल्क पहले से साफ लिखा है। कोई छुपा खर्च नहीं।',
        recommendedBulkCue: 'यह आपकी न्यूनतम कीमत है। जब तक आप चाहें, इससे कम कीमत स्वीकार न करें।',
      },
      publish: {
        gateCue: 'खरीदार को यही कार्ड दिखेगा। आपके Voice-PIN के बिना यह पब्लिश नहीं होगा।',
      },
      negotiation: {
        offerBelowFloorCue: (offer, floor) =>
          `खरीदार का ${offer} प्रस्ताव आपकी न्यूनतम कीमत ${floor} से कम है, इसलिए रोक दिया गया है।`,
        offerAboveFloorCue: (offer, rec) =>
          `${offer} न्यूनतम कीमत से ऊपर है, लेकिन सुझाई गई कीमत ${rec} से कम है।`,
        counterCapacityCue: (counter, days) =>
          `${counter} का काउंटर प्रस्ताव तैयार है। ${days} दिन में डिलीवरी संभव हो तभी हाँ करें।`,
        approvalCue: 'किसी भी अंतिम कीमत के लिए आपका Voice-PIN ज़रूरी है।',
      },
      bulk: {
        capacityCue: (qty, weavers) =>
          `${qty} साड़ियों के लिए क्लस्टर के लगभग ${weavers} बुनकरों को मिलकर काम करना होगा।`,
        stagedDeadlineCue:
          'थोक ऑर्डर में किश्तों में भुगतान होता है। नामुमकिन समय-सीमा और कम कीमत मंजूर न करें।',
      },
      janai: {
        qcDispatchCue: 'जनएआई कैफे ऑपरेटर श्रीनिवास केवल गुणवत्ता जाँच, पैकिंग और पार्सल भेजते हैं।',
        operatorLockCue: 'कैफे ऑपरेटर कीमत बदल नहीं सकते और न ही कोई ऑर्डर खुद मंजूर कर सकते हैं।',
      },
      receipt: {
        netCue: (netUnit, total, qty) =>
          `${qty} साड़ियों पर आपको कुल ${total} शुद्ध मिलेंगे, यानी हर साड़ी पर ${netUnit}।`,
        retainedCue: (pct) => `बाज़ार की खुदरा कीमत का ${pct}% सीधे बुनकर के पास आया है।`,
        upliftCue: (trader, uplift) =>
          `बिचौलिए के ${trader} के मुकाबले LoomLink पर हर साड़ी में ${uplift} ज़्यादा मिले।`,
      },
      general: {
        welcomeCue: 'नमस्ते! मैं लूम दोस्त हूँ। मैं इस स्क्रीन की हर बात आसान हिंदी में समझाऊँगा।',
      },
    },
    quickTopics: [
      { id: 'floor', label: 'न्यूनतम कीमत क्या है?', query: 'floor price' },
      { id: 'gi', label: 'GI PENDING क्यों है?', query: 'gi pending' },
      { id: 'pin', label: 'Voice-PIN क्यों?', query: 'voice pin' },
      { id: 'receipt', label: 'मुझे कितना मिलेगा?', query: 'net payout' },
    ],
  },

  en: {
    ui: {
      name: 'Loom Dost',
      subtitle: 'Your Weaving Guide',
      idleTooltip: 'Need help? Tap me.',
      listeningLabel: 'Listening… Tap to stop.',
      thinkingPrefix: '[SIMULATED]',
      repeatBtn: 'Repeat',
      slowDownBtn: 'Slow down',
      normalSpeedBtn: 'Normal speed',
      translateLabel: 'Language',
      nextBtn: 'Next',
      prevBtn: 'Back',
      gotItBtn: 'Got it',
      askVoiceBtn: 'Ask by Voice',
      stopListeningBtn: 'Stop Listening',
      askPlaceholder: 'Ask simply (e.g. floor price, GI, Voice-PIN)...',
      sendBtn: 'Ask',
      yesBtn: 'Yes',
      noBtn: 'No',
      muteLabel: 'Mute',
      unmuteLabel: 'Unmute',
      dismissLabel: 'Dismiss',
      openGuideLabel: 'Open Loom Dost guide',
      offscreenHint: 'Scroll gently up or down to view the highlighted item.',
      errorUnclear:
        'Your voice was unclear. You can repeat it or choose from the options below.',
      retryBtn: 'Retry',
      simulatedBadge: '[SIMULATED]',
      activityTitle: 'What the AI Is Checking [SIMULATED]',
      waitingActionBadge: 'Waiting for your action',
      approvalBadge: 'Voice-PIN approval required',
    },
    stateLabels: {
      IDLE: 'Ready to help',
      LISTENING: 'Listening',
      THINKING: 'Checking [SIMULATED]',
      EXPLAINING: 'Explaining',
      WAITING_FOR_ACTION: 'Waiting for you',
      APPROVAL_REMINDER: 'Your approval needed',
      ERROR_HELP: 'Try again',
    },
    thinkingStatuses: {
      checkingYarnBill: 'I am checking whether your yarn bill supports the silk-border claim… [SIMULATED]',
      matchingCluster: 'Matching Gadwal cluster records… [SIMULATED]',
      calculatingPrice: 'Calculating fair transparent price… [SIMULATED]',
      preparingListing: 'Preparing buyer-ready listing card… [SIMULATED]',
    },
    claimDefinitions: {
      VERIFIED: 'VERIFIED means backed by an uploaded bill or photo.',
      'ARTISAN-REPORTED':
        'ARTISAN-REPORTED means you stated it, and proof is not attached yet.',
      PENDING: 'PENDING means waiting for official certificate or proof.',
      BLOCKED: 'BLOCKED means hidden because supporting proof is missing.',
    },
    pricingDemoFlow: {
      welcomeTitle: 'Price Guide',
      welcome: 'This is your Gadwal saree pricing page. I will explain every rupee clearly.',
      materialTitle: 'Yarn Cost',
      material: (amount) => `Your yarn and zari material cost is ${amount}.`,
      labourTitle: 'Family Loom Labour',
      labour: (workers, days, amount) =>
        `${workers} people in your family wove for ${days} days. That fair labour is ${amount}.`,
      floorTitle: 'Artisan Floor Price',
      floor: (amount) =>
        `This is your floor price: ${amount}. Do not accept less than this unless you choose to.`,
      giTitle: 'GI Tag Status',
      giPending: 'There is no GI certificate yet. So GI stays truthfully PENDING.',
      giVerified: 'Your GI certificate is uploaded. So GI is now VERIFIED.',
      giBlocked: 'Supporting cluster proof is missing, so GI is BLOCKED.',
      askReplayTitle: 'Hear Again?',
      askReplay: 'Would you like me to explain slowly how this price was calculated?',
      slowSummaryTitle: 'Slow Full Price Breakdown',
      slowSummary: (mat, lab, log, floor, rec, bulkMin) =>
        `Yarn is ${mat}. Fair labour is ${lab}. Together your floor price is ${floor}. Adding ${log} packing, 3% returns reserve, and 9% platform fee gives ${rec} recommended direct price. Bulk minimum is ${bulkMin}.`,
      voicePinTitle: 'Your Final Authority',
      voicePinReminder: 'This price can be published only after your Voice-PIN approval.',
    },
    screens: {
      voice: {
        recordCue: 'Tap the mic and describe your saree in your own language. You can also type anytime.',
        inputsCue: 'We ask for yarn cost, loom days, and workers to protect your minimum wage.',
        unsupportedCue: 'I never mark a claim VERIFIED without a real photo or bill.',
        giPendingCue: 'GI Gadwal stays PENDING until a GI certificate is uploaded.',
      },
      evidence: {
        yarnBillCue: 'Your yarn bill proves silk border and zari material costs so buyers see VERIFIED.',
        loomPhotoCue: 'Your pit-loom photo proves handloom weaving labour.',
        coopGiCue: 'Cooperative ID and GI Certificate are both needed before GI can show VERIFIED.',
        handloomConsentCue: 'Handloom Mark verifies craft authenticity. Displaying your name is your choice.',
        verifiedVsReportedCue: 'VERIFIED has uploaded proof. ARTISAN-REPORTED or PENDING means proof is still awaited.',
      },
      pricing: {
        logisticsCue: 'Packaging and logistics cover safe moisture-proof delivery.',
        feesCue: '3% returns reserve and 9% platform fee are shown upfront with zero hidden cuts.',
        recommendedBulkCue: 'This is your floor price. Do not accept less than this unless you choose to.',
      },
      publish: {
        gateCue: 'This is the exact card buyers see. Nothing publishes without your Voice-PIN.',
      },
      negotiation: {
        offerBelowFloorCue: (offer, floor) =>
          `The buyer offered ${offer}, which is below your ${floor} floor price. We blocked it for you.`,
        offerAboveFloorCue: (offer, rec) =>
          `The ${offer} offer is above your floor price, but below the ${rec} recommended direct price.`,
        counterCapacityCue: (counter, days) =>
          `We prepared a ${counter} counteroffer. Check if ${days} days delivery fits your loom schedule.`,
        approvalCue: 'Only your Voice-PIN can approve a counteroffer or delivery commitment.',
      },
      bulk: {
        capacityCue: (qty, weavers) =>
          `${qty} sarees cannot be woven on one loom. Around ${weavers} cluster weavers must share the work.`,
        stagedDeadlineCue:
          'Bulk orders use staged payments. Never accept an impossible deadline or below-floor rate.',
      },
      janai: {
        qcDispatchCue: 'JanAI Café operator Srinivas logs quality checks, packaging photos, and courier dispatch.',
        operatorLockCue: 'The café operator cannot change your prices, accept offers, or edit product claims.',
      },
      receipt: {
        netCue: (netUnit, total, qty) =>
          `Across ${qty} sarees, your net payout is ${total}. You keep ${netUnit} per saree.`,
        retainedCue: (pct) => `You retained ${pct}% of the comparable urban retail price.`,
        upliftCue: (trader, uplift) =>
          `Compared to ${trader} from a traditional trader, LoomLink earns you ${uplift} more per saree.`,
      },
      general: {
        welcomeCue: 'Namaste! I am Loom Dost. I explain every screen step by step in simple words.',
      },
    },
    quickTopics: [
      { id: 'floor', label: 'What is floor price?', query: 'floor price' },
      { id: 'gi', label: 'Why is GI PENDING?', query: 'gi pending' },
      { id: 'pin', label: 'Why Voice-PIN?', query: 'voice pin' },
      { id: 'receipt', label: 'How much do I earn?', query: 'net payout' },
    ],
  },
};
