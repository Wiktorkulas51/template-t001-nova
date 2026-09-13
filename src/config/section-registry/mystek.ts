import type { SectionEntry } from './types';

const icon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 9h8M8 13h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const blueprint = (id: string, label: string, groupId: SectionEntry['groupId'], hint: string, dataKey: string): SectionEntry => ({
  id, label, groupId, hint, source: 'mystek', icon,
  defaultVariant: 'default', variants: { default: { component: 'MystekAuditSectionBlock', dataKey } },
});

export const mystekSections: Record<string, SectionEntry> = {
  aboutBentoHome: {
    id: 'aboutBentoHome', label: 'Bento eksperta', groupId: 'about', hint: 'Duża karta biograficzna oraz dwie pionowe karty statystyk', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'AboutBentoHomeBlock', dataKey: 'about-bento-home' } },
  },
  serviceGlassHome: {
    id: 'serviceGlassHome', label: 'Usługi, glass 2 kolumny', groupId: 'services', hint: 'Pięć wysokich kart usług z ikonami, opisem i linkiem', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'ServiceGlassHomeBlock', dataKey: 'service-glass-home' } },
  },
  heroAuthoritySplit: {
    id: 'heroAuthoritySplit', label: 'Hero eksperta, split', groupId: 'hero', hint: 'Dwukolumnowy hero z portretem, dwoma CTA i trzema punktami zaufania', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'HeroAuthoritySplitBlock', dataKey: 'hero-authority-split' } },
  },
  complianceArchitectureGrid: {
    id: 'complianceArchitectureGrid', label: 'Architektura usług, 2 plus 3', groupId: 'services', hint: 'Dwie rozbudowane karty główne oraz trzy mniejsze moduły z dekoracją blueprint', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'ComplianceArchitectureGridBlock', dataKey: 'compliance-architecture-grid' } },
  },
  offerServiceBento: {
    id: 'offerServiceBento', label: 'Oferta usług, bento 8 plus 4 plus 6 plus 6 plus 12', groupId: 'services', hint: 'Pięć kart usług z układem bento, pełnymi listami, tagami i zdjęciem końcowym', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'OfferServiceBentoMystekBlock', dataKey: 'offer-service-bento' } },
  },
  boutiqueHeroAbout: {
    id: 'boutiqueHeroAbout', label: 'Hero O mnie, boutique split', groupId: 'hero', hint: 'Asymetryczny hero z portretem, kwalifikacją i CTA LinkedIn', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekBoutiqueHeroBlock', dataKey: 'boutique-hero-about' } },
  },
  aboutBentoPage: {
    id: 'aboutBentoPage', label: 'Profil zawodowy, bento 8 plus 4 plus 6 plus 6', groupId: 'about', hint: 'Bento z bio, doświadczeniem, zdjęciem, kwalifikacjami i publikacjami', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAboutBentoPageBlock', dataKey: 'about-bento-page' } },
  },
  offerContactCta: {
    id: 'offerContactCta', label: 'CTA oferty, kontakt i Calendly', groupId: 'cta', hint: 'Ciemna karta CTA z dwoma przyciskami i dekoracyjnymi narożnikami', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'OfferContactCtaMystekBlock', dataKey: 'offer-contact-cta' } },
  },
  auditAbout: {
    id: 'auditAbout', label: 'Audyt, diagnoza zgodności', groupId: 'about', hint: 'Otwierająca sekcja wyjaśniająca sens audytu i wartość raportu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAboutAuditSectionBlock', dataKey: 'mystek-audit-about' } },
  },
  auditTypes: {
    id: 'auditTypes', label: 'Audyt, tryby diagnozy', groupId: 'services', hint: 'Dwie karty: audyt startowy i audyt cykliczny', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditTypesSectionBlock', dataKey: 'mystek-audit-types' } },
  },
  auditScope: {
    id: 'auditScope', label: 'Audyt, zakres diagnostyki', groupId: 'services', hint: 'Sześć obszarów badania zgodnych z oryginalną sekcją zakresu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekScopeAuditSectionBlock', dataKey: 'mystek-audit-scope' } },
  },
  auditRiskMap: {
    id: 'auditRiskMap', label: 'Audyt, mapa ryzyka', groupId: 'content', hint: 'Bento z główną statystyką i kartami najczęstszych luk', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekRiskMapSectionBlock', dataKey: 'mystek-audit-risk-map' } },
  },
  auditProcess: {
    id: 'auditProcess', label: 'Audyt, proces diagnostyczny', groupId: 'process', hint: 'Trzyetapowa oś procesu: analiza, weryfikacja i plan naprawczy', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditProcessBlock', dataKey: 'mystek-audit-process' } },
  },
  auditReport: {
    id: 'auditReport', label: 'Audyt, raport poaudytowy', groupId: 'content', hint: 'Sekcja rezultatu z czterema modułami raportu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditReportBlock', dataKey: 'mystek-audit-report' } },
  },
  auditBenefits: {
    id: 'auditBenefits', label: 'Audyt, korzyści zewnętrznej diagnozy', groupId: 'about', hint: 'Dwie karty wartości: mniejsze ryzyko i obiektywizm', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditBenefitsBlock', dataKey: 'mystek-audit-benefits' } },
  },
  auditPricing: {
    id: 'auditPricing', label: 'Audyt, czynniki wyceny', groupId: 'services', hint: 'Cztery czynniki wpływające na zakres i cenę audytu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditSectionBlock', dataKey: 'mystek-audit-pricing' } },
  },
  auditReviews: {
    id: 'auditReviews', label: 'Audyt, opinie', groupId: 'social', hint: 'Trzy karty opinii umieszczane przed FAQ', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditSectionBlock', dataKey: 'mystek-audit-reviews' } },
  },
  auditFaq: {
    id: 'auditFaq', label: 'Audyt, FAQ', groupId: 'faq', hint: 'Akordeon pytań i odpowiedzi na końcu podstrony audytu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditSectionBlock', dataKey: 'mystek-audit-faq' } },
  },
  auditCta: {
    id: 'auditCta', label: 'Audyt, końcowe CTA', groupId: 'cta', hint: 'Końcowa karta prowadząca do kontaktu', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekAuditSectionBlock', dataKey: 'mystek-audit-cta' } },
  },
  documentationProblem: {
    id: 'documentationProblem', label: 'Dokumentacja, problem zgodności', groupId: 'about', hint: 'Oryginalny układ: karta ostrzegawcza i dwie karty rozwiązania', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekDocumentationProblemBlock', dataKey: 'mystek-documentation-problem' } },
  },
  documentationOffer: {
    id: 'documentationOffer', label: 'Dokumentacja, konfigurator oferty', groupId: 'services', hint: 'Oryginalny konfigurator modułów, pakietu startowego i wyceny', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekDocumentationOfferBlock', dataKey: 'mystek-documentation-offer' } },
  },
  documentationProcess: {
    id: 'documentationProcess', label: 'Dokumentacja, proces wdrożenia', groupId: 'process', hint: 'Oryginalna czterostopniowa oś czasu z naprzemiennym układem', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekDocumentationProcessBlock', dataKey: 'mystek-documentation-process' } },
  },
  premiumBoardRisk: {
    id: 'premiumBoardRisk', label: 'Doradztwo, ryzyko zarządcze', groupId: 'content', hint: 'Lewa kolumna strategiczna i trzy poziome karty ryzyka zarządczego', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekPremiumBoardRiskBlock', dataKey: 'mystek-premium-board-risk' } },
  },
  premiumServices: {
    id: 'premiumServices', label: 'Doradztwo, usługi premium', groupId: 'services', hint: 'Cztery specjalistyczne obszary doradztwa premium', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekPremiumServicesBlock', dataKey: 'mystek-premium-services' } },
  },
  premiumAuthority: {
    id: 'premiumAuthority', label: 'Doradztwo, autorytet eksperta', groupId: 'about', hint: 'Dwukolumnowa sekcja autorytetu eksperta i perspektyw doradczych', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekPremiumAuthorityBlock', dataKey: 'mystek-premium-authority' } },
  },
  premiumModel: {
    id: 'premiumModel', label: 'Doradztwo, model współpracy', groupId: 'services', hint: 'Trzy odrębne modele współpracy premium', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekPremiumModelBlock', dataKey: 'mystek-premium-model' } },
  },
  premiumContact: {
    id: 'premiumContact', label: 'Doradztwo, kontakt premium', groupId: 'cta', hint: 'Końcowa sekcja kontaktowa z wyraźnym CTA', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekPremiumContactBlock', dataKey: 'mystek-premium-contact' } },
  },
  outsourcingBenefits: {
    id: 'outsourcingBenefits', label: 'Outsourcing IOD, korzyści', groupId: 'about', hint: 'Bento z szerokim intro i czterema kartami korzyści', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingBenefitsBlock', dataKey: 'mystek-outsourcing-benefits' } },
  },
  outsourcingWhen: {
    id: 'outsourcingWhen', label: 'Outsourcing IOD, kiedy warto', groupId: 'services', hint: 'Sześć kart sytuacji z oryginalnym CTA interwencji IOD', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingWhenBlock', dataKey: 'mystek-outsourcing-when' } },
  },
  outsourcingCost: {
    id: 'outsourcingCost', label: 'Outsourcing IOD, porównanie kosztów', groupId: 'services', hint: 'Porównanie czynników wpływających na koszt funkcji IOD', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingCostBlock', dataKey: 'mystek-outsourcing-cost' } },
  },
  outsourcingObligation: {
    id: 'outsourcingObligation', label: 'Outsourcing IOD, obowiązki', groupId: 'content', hint: 'Wyraźny układ obowiązków IOD z kartą wiodącą', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingObligationBlock', dataKey: 'mystek-outsourcing-obligation' } },
  },
  outsourcingScope: {
    id: 'outsourcingScope', label: 'Outsourcing IOD, zakres', groupId: 'services', hint: 'Cztery obszary pełnego zakresu obowiązków IOD w układzie kart', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingScopeBlock', dataKey: 'mystek-outsourcing-scope' } },
  },
  outsourcingProcess: {
    id: 'outsourcingProcess', label: 'Outsourcing IOD, proces', groupId: 'process', hint: 'Oś czasu wejścia w stałą współpracę', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekOutsourcingProcessBlock', dataKey: 'mystek-outsourcing-process' } },
  },
  trainingWhy: {
    id: 'trainingWhy', label: 'Szkolenia, dlaczego warto', groupId: 'about', hint: 'Split z wizualnym panelem i osią korzyści', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekTrainingWhyBlock', dataKey: 'mystek-training-why' } },
  },
  trainingOffer: {
    id: 'trainingOffer', label: 'Szkolenia, oferta', groupId: 'services', hint: 'Konfigurator oferty szkoleń w układzie modułowym', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekTrainingOfferBlock', dataKey: 'mystek-training-offer' } },
  },
  trainingProcess: {
    id: 'trainingProcess', label: 'Szkolenia, proces', groupId: 'process', hint: 'Oś czasu procesu przygotowania szkolenia', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekTrainingProcessBlock', dataKey: 'mystek-training-process' } },
  },
  trainingTargets: {
    id: 'trainingTargets', label: 'Szkolenia, odbiorcy', groupId: 'services', hint: 'Bento grup odbiorców szkoleń', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekTrainingTargetsBlock', dataKey: 'mystek-training-targets' } },
  },
  knowledgeSearch: {
    id: 'knowledgeSearch', label: 'Strefa wiedzy, wyszukiwarka', groupId: 'content', hint: 'Wyszukiwanie i filtrowanie tematów eksperckich', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekKnowledgeSearchBlock', dataKey: 'mystek-knowledge-search' } },
  },
  knowledgeArticles: {
    id: 'knowledgeArticles', label: 'Strefa wiedzy, artykuły', groupId: 'content', hint: 'Karty najnowszych publikacji eksperckich', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekKnowledgeArticlesBlock', dataKey: 'mystek-knowledge-articles' } },
  },
  knowledgeVideo: {
    id: 'knowledgeVideo', label: 'Strefa wiedzy, materiały wideo', groupId: 'content', hint: 'Karty rozmów i krótkich wyjaśnień', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekKnowledgeVideoBlock', dataKey: 'mystek-knowledge-video' } },
  },
  knowledgeExternal: {
    id: 'knowledgeExternal', label: 'Strefa wiedzy, materiały zewnętrzne', groupId: 'content', hint: 'Linki do zewnętrznych publikacji i źródeł', source: 'mystek', icon,
    defaultVariant: 'default', variants: { default: { component: 'MystekKnowledgeExternalBlock', dataKey: 'mystek-knowledge-external' } },
  },
};
