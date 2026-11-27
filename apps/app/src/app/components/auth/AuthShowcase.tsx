import type { ReactNode } from "react";
import AuthProductPreview from "./AuthProductPreview";
import styles from "./AuthShowcase.module.css";

interface AuthShowcaseProps {
  children: ReactNode;
}

export default function AuthShowcase({ children }: AuthShowcaseProps) {
    return (
        <main className={styles.showcase}>
            <div className={styles.ambientGlow} />
            <div className={styles.ambientGlowSecondary} />
            <div className={styles.showcaseContent}>
                <div className={styles.formPanel}> {children} </div>
                <div className={styles.previewPanel}>
                    <AuthProductPreview />
                </div>
            </div>
        </main>
    );
}