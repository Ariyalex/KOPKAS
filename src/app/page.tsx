import { HeaderHome } from "../components/home_ui/header_home";
import { HomeIntro } from "../components/home_ui/home_intro";

export default function Home() {
  return (
    <main className="">
      <HeaderHome />
      <div className="px-20">
        <HomeIntro />
      </div>
    </main>
  );
}
