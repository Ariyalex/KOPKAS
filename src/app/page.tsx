'use client'

import { FeatureKopkas } from "@/components/home_ui/feature_home";
import { HeaderHome } from "../components/home_ui/header_home";
import { HomeIntro } from "../components/home_ui/home_intro";
import { PsikologKopkas } from "@/components/home_ui/psikolog_home";
import { Footer } from "@/components/home_ui/footer";

export default function Home() {
  return (
    <main className="">
      <HeaderHome />
      <div className="p-0">
        <HomeIntro />
        <FeatureKopkas />
        <PsikologKopkas />
      </div>
      <Footer />

    </main>
  );
}
