import { SectionDivider } from './components/SectionDivider'
import { Hero } from './sections/Hero'
import { LogoBar } from './sections/LogoBar'
import { HowItWorks } from './sections/HowItWorks'
import { ProductStates } from './sections/ProductStates'
import { AudienceBuilder } from './sections/AudienceBuilder'
import { Capabilities } from './sections/Capabilities'
import { DataSection } from './sections/DataSection'
import { ProofNumbers } from './sections/ProofNumbers'
import { FinalCTA } from './sections/FinalCTA'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <LogoBar />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <ProductStates />
      <SectionDivider />
      <AudienceBuilder />
      <SectionDivider />
      <Capabilities />
      <DataSection />
      <ProofNumbers />
      <FinalCTA />
    </div>
  )
}
