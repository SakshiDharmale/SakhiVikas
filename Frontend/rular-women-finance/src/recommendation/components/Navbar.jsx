import { Sprout } from "lucide-react";

export default function Navbar({ t }) {
  return (
    <header className="navbar">
      <a className="brand" href="#top" aria-label={t("brand")}>
        <span className="brand-icon"><Sprout size={25} /></span>
        <span><strong>{t("brand")}</strong><small>{t("tagline")}</small></span>
      </a>
    </header>
  );
}
