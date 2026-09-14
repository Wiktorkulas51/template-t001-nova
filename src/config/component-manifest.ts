import type { BlockCategory } from "./types";

export type BlockClassificationStatus = "confirmed" | "provisional";

export type ComponentManifestEntry = {
  category: BlockCategory;
  status: BlockClassificationStatus;
  /** Opcjonalna sciezka, domyslnie /src/components/registry/${name}.astro */
  path?: string;
};

export function getComponentPath(name: string, entry: ComponentManifestEntry): string {
  return entry.path ?? `/src/components/registry/${name}.astro`;
}

/**
 * Explicit catalog of public registry blocks.
 *
 * Manifest describes files exposed to PageBuilder. Helper components
 * in registry subdirectories are not auto-registered here.
 *
 * "client" classification is confirmed for blocks tied to a specific
 * project. "catalog" classification covers demo and showcase blocks.
 * Remaining blocks stay provisional until usage review.
 */
export const COMPONENT_MANIFEST: Record<string, ComponentManifestEntry> = {
  AboutBlock: { category: "core", status: "provisional" },
  AboutExpertBlock: { category: "core", status: "provisional" },
  AboutLawBlock: { category: "client", status: "confirmed" },
  AboutMarqueeSplitBlock: { category: "core", status: "provisional" },
  AboutSplitBlock: { category: "core", status: "provisional" },
  AboutSplitLeanBlock: { category: "core", status: "provisional" },
  AboutTomRosBlock: { category: "client", status: "confirmed" },
  AboutWireframeBlock: { category: "catalog", status: "confirmed" },
  TeamBlock: { category: "core", status: "provisional", path: "/src/components/registry/about/TeamBlock.astro" },
  AudienceSplitBlock: { category: "core", status: "provisional" },
  BlogListBlock: { category: "core", status: "provisional" },
  CalculatorBlock: { category: "core", status: "provisional" },
  CalculatorWireframeBlock: { category: "catalog", status: "confirmed" },
  CardsFilterableBlock: { category: "core", status: "provisional" },
  CompetitionsBlock: { category: "core", status: "provisional" },
  ContactEditorialBlock: { category: "core", status: "provisional" },
  ContactInfoFormBlock: { category: "core", status: "provisional" },
  ContactPremiumBlock: { category: "core", status: "provisional" },
  ContactSplitBlock: { category: "core", status: "provisional" },
  ContactStudioBlock: { category: "catalog", status: "confirmed" },
  ContactWireframeBlock: { category: "catalog", status: "confirmed" },
  CrossBorderBlock: { category: "client", status: "confirmed" },
  CtaBridgeBlock: { category: "core", status: "provisional" },
  CtaContactFormBlock: { category: "core", status: "provisional" },
  CtaLeanBlock: { category: "core", status: "provisional" },
  CtaSpectrumBlock: { category: "core", status: "provisional" },
  CtaTomRosBlock: { category: "client", status: "confirmed" },
  CtaUpBlock: { category: "core", status: "provisional" },
  CtaBlock: { category: "core", status: "provisional", path: "/src/components/registry/cta/CtaBlock.astro" },
  FaqAccordionBlock: { category: "core", status: "provisional" },
  FaqFlatBlock: { category: "core", status: "provisional" },
  FaqGridBlock: { category: "core", status: "provisional" },
  FaqGroupedBlock: { category: "core", status: "provisional" },
  FaqLeanBlock: { category: "core", status: "provisional" },
  FaqListBlock: { category: "core", status: "provisional" },
  FaqSimpleBlock: { category: "core", status: "provisional" },
  FaqUpBlock: { category: "core", status: "provisional" },
  Faq3Block: { category: "core", status: "provisional", path: "/src/components/registry/faq/Faq3Block.astro" },
  TestimonialV2Block: { category: "core", status: "provisional", path: "/src/components/registry/social/TestimonialV2Block.astro" },
  FeatureGridBlock: { category: "core", status: "provisional" },
  FeaturesBlock: { category: "core", status: "provisional" },
  FeaturesGridBlock: { category: "core", status: "provisional" },
  FeaturesOfferCardsBlock: { category: "core", status: "provisional" },
  FooterColumnsBlock: { category: "core", status: "provisional" },
  FooterContactBlock: { category: "core", status: "provisional" },
  FooterMinimalBlock: { category: "core", status: "provisional" },
  FooterPromoBlock: { category: "core", status: "provisional" },
  NovaFooterBlock: { category: "core", status: "provisional", path: "/src/components/registry/shell/NovaFooterBlock.astro" },
  GalleryBlock: { category: "core", status: "provisional" },
  GalleryCrossfadeBlock: { category: "core", status: "provisional" },
  GalleryStudioBlock: { category: "catalog", status: "confirmed" },
  AccommodationCardsBlock: { category: "client", status: "confirmed" },
  HeroAccommodationBlock: { category: "client", status: "confirmed" },
  HeroCinematicBlock: { category: "core", status: "provisional" },
  HeroCountdownBlock: { category: "core", status: "provisional" },
  HeroEditorialBlock: { category: "core", status: "provisional" },
  HeroLawBlock: { category: "client", status: "confirmed" },
  HeroPhotoBlock: { category: "core", status: "provisional" },
  NovaHeroResponsiveBlock: { category: "client", status: "confirmed", path: "/src/components/registry/hero/NovaHeroResponsiveBlock.astro" },
  HeroSplitBlock: { category: "core", status: "provisional" },
  HeroStatsBlock: { category: "core", status: "provisional" },
  HeroTomRosBlock: { category: "client", status: "confirmed" },
  HeroVideoBlock: { category: "core", status: "provisional" },
  HeroWireframeBlock: { category: "catalog", status: "confirmed" },
  HeroBlock: { category: "core", status: "provisional", path: "/src/components/registry/hero/HeroBlock.astro" },
  KnowledgeCardsBlock: { category: "core", status: "provisional" },
  LcNavbarBlock: { category: "client", status: "confirmed" },
  LcSubnavBlock: { category: "client", status: "confirmed" },
  LogoGridBlock: { category: "core", status: "provisional" },
  MarqueeBlock: { category: "core", status: "provisional" },
  MarqueeImageWallBlock: { category: "core", status: "provisional" },
  MaterialsWireframeBlock: { category: "catalog", status: "confirmed" },
  ServicesHomeBlock: { category: "core", status: "provisional", path: "/src/components/registry/services/ServicesHomeBlock.astro" },
  ModernHouseCtaBlock: { category: "client", status: "confirmed" },
  ModernHouseHeroBlock: { category: "client", status: "confirmed" },
  ModernHouseServicesBentoBlock: { category: "client", status: "confirmed" },
  ModernHouseSplitBlock: { category: "client", status: "confirmed" },
  NavbarContactBlock: { category: "core", status: "provisional" },
  OnlineAdviceBlock: { category: "client", status: "confirmed" },
  PageIntroBlock: { category: "core", status: "provisional" },
  PlayerEmbedBlock: { category: "catalog", status: "confirmed" },
  PortfolioBentoBlock: { category: "core", status: "provisional" },
  ProjectsBlock: { category: "core", status: "provisional", path: "/src/components/registry/portfolio/ProjectsBlock.astro" },
  PortfolioCarouselBlock: { category: "core", status: "provisional" },
  PortfolioCategorizedBlock: { category: "core", status: "provisional" },
  PortfolioDoubleMarqueeBlock: { category: "core", status: "provisional" },
  PortfolioMarqueeBlock: { category: "core", status: "provisional" },
  PortfolioMasonryBlock: { category: "core", status: "provisional" },
  PriceTableBlock: { category: "client", status: "confirmed" },
  ProcessIconStepsBlock: { category: "core", status: "provisional" },
  ProcessRecruitmentBlock: { category: "core", status: "provisional" },
  ProcessTimelineBlock: { category: "core", status: "provisional" },
  ProcessTimelineScrollBlock: { category: "core", status: "provisional" },
  ProductionWireframeBlock: { category: "catalog", status: "confirmed" },
  PublicInfoBlock: { category: "client", status: "confirmed" },
  PurInsulationWireframeBlock: { category: "catalog", status: "confirmed" },
  RoomDetailBlock: { category: "client", status: "confirmed" },
  SaunaBenefitsBlock: { category: "client", status: "confirmed" },
  SaunaGalleryBlock: { category: "client", status: "confirmed" },
  SaunaHowItWorksWireframeBlock: { category: "catalog", status: "confirmed" },
  SaunaPricingBlock: { category: "client", status: "confirmed" },
  ServicesCardsBlock: { category: "core", status: "provisional" },
  ServicesGridBlock: { category: "core", status: "provisional" },
  ServicesMediaCardsBlock: { category: "core", status: "provisional" },
  ServicesStudioGridBlock: { category: "catalog", status: "confirmed" },
  ServicesZigzagBlock: { category: "core", status: "provisional" },
  SpecializationsGridBlock: { category: "core", status: "provisional" },
  StepsNumberedBlock: { category: "core", status: "provisional" },
  TestimonialsMarqueeBlock: { category: "core", status: "provisional" },
  TimelineAlternateBlock: { category: "core", status: "provisional" },
  TransformationsWallBlock: { category: "core", status: "provisional" },
  TrustBarBlock: { category: "core", status: "provisional" },
  UniversityFieldsBlock: { category: "core", status: "provisional" },
  UspPremiumBlock: { category: "core", status: "provisional" },
} as const satisfies Record<string, ComponentManifestEntry>;

const manifestEntries = Object.entries(COMPONENT_MANIFEST) as [string, ComponentManifestEntry][];

export const COMPONENT_CATEGORIES: Record<BlockCategory, string[]> = {
  core: manifestEntries
    .filter(([, entry]) => entry.category === "core")
    .map(([name]) => name),
  client: manifestEntries
    .filter(([, entry]) => entry.category === "client")
    .map(([name]) => name),
  catalog: manifestEntries
    .filter(([, entry]) => entry.category === "catalog")
    .map(([name]) => name),
  legacy: manifestEntries
    .filter(([, entry]) => entry.category === "legacy")
    .map(([name]) => name),
};
