"use client";

import { memo } from "react";
import Image from "next/image";
import { tableEcoNotFoundIllustration } from "@/assets/404";
import styles from "@/components/error/not-found.module.css";

type ErrorHeroProps = {
  compact?: boolean;
};

function ErrorHeroComponent({ compact = false }: ErrorHeroProps) {
  const imgSize = compact ? 260 : 420;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={styles.heroImageWrap}>
        <Image
          src={tableEcoNotFoundIllustration}
          alt="TableEco not found illustration"
          width={imgSize}
          height={imgSize}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h1
          className={styles.hero404}
          style={{ fontSize: compact ? 84 : 152, marginBottom: compact ? 4 : 8, lineHeight: 1 }}
        >
          404
        </h1>
        <h2 className={compact ? "text-xl font-bold" : "text-3xl font-bold"}>
          Oops! Page not found
        </h2>
        <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
        <p className="text-xs text-muted-foreground">Discover curated tables and decor while we guide you back.</p>
      </div>
    </div>
  );
}

const ErrorHero = memo(ErrorHeroComponent);

export default ErrorHero;
