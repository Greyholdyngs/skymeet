"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export function useTypewriter({ words, typingSpeed = 90, deletingSpeed = 45, pauseDuration = 1600 }: UseTypewriterOptions) {
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        if (!currentWord) return;

        let delay = deleting ? deletingSpeed : typingSpeed;

        if (!deleting && text === currentWord) {
            delay = pauseDuration;
        }

        const timeout = window.setTimeout(() => {
        if (!deleting && text === currentWord) {
            setDeleting(true);
            return;
        }

        if (deleting && text === "") {
            setDeleting(false);
            setWordIndex((previous) => (previous + 1) % words.length);
            return;
        }

        setText((previous) => deleting ? previous.slice(0, -1) : currentWord.slice(0, previous.length + 1));
        }, delay);

        return () => window.clearTimeout(timeout);
    }, [ words, wordIndex, text, deleting, typingSpeed, deletingSpeed, pauseDuration ]);

  return text;
}