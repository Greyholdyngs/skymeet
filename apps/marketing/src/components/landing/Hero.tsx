"use client"
import Button from "../Button"
import { List, LucideMessageSquare, HomeIcon, UsersRoundIcon, 
        EllipsisVertical, PanelsTopLeft, Mic, VideoIcon, 
        DownloadIcon, Phone, Pointer } from "lucide-react";

import { useState, useEffect } from "react";
import { pageStyle } from "@/style/pageStyle";


const images = [
    {
        id: 1,
        image: "/images/emmy.jpg",
        name: "emmy",
    },
    {
        id: 2,
        image: "/images/grey.jpg",
        name: "grey",
    },
    {
        id: 3,
        image: "/images/frantzou.jpg",
        name: "frantzou",
    },
    {
        id: 4,
        image: "/images/king.jpg",
        name: "king",
    },
    {
        id: 5,
        image: "/images/jo.jpg",
        name: "jo",
    }
]

const pointerPositions = [
        { x: "10%", y: "20%" },
        { x: "45%", y: "20%" },
        { x: "75%", y: "20%" },
        { x: "25%", y: "70%" },
        { x: "55%", y: "70%" },
];

const messages = [
  "Welcome everyone.",
  "Can everyone see my screen?",
  "Let's get started.",
];

const heroText = "Meet, connect, collaborate";
const heroAccent = "seamlessly";

const Hero = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [visibleImages, setVisibleImages] = useState<number[]>([]);

    const [messageIndex, setMessageIndex] = useState(0);
    const [typedMessage, setTypedMessage] = useState("");

    const [isTyping, setIsTyping] = useState(true);
    const [isFading, setIsFading] = useState(false);

    const [typedHeroText, setTypedHeroText] = useState("");
    const [typedAccent, setTypedAccent] = useState("")

    const [heroTyping, setHeroTyping] = useState(true);
    const [animationCycle, setAnimationCycle] = useState(0);

    const [secondsLeft, setSecondsLeft] = useState(24 * 60 + 16);   
    const pointer = pointerPositions[activeImage];

    {/*useEffect(() => {
        if (typedHeroText.length < heroText.length) {
            const timeout = setTimeout(() => {
                setTypedHeroText(
                    heroText.slice(0, typedHeroText.length + 1)
                );
            }, 200);

            return () => clearTimeout(timeout);
        }

        setHeroTyping(false);
    }, [typedHeroText]);*/}

    {/*useEffect(() => {
        const timers = images.map((_, index) =>
        setTimeout(() => {
            setVisibleImages((current) => [...current, index]);
            }, index * 600)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [])

    useEffect(() => {
        const entranceDuration = images.length * 600;
        const startDelay = setTimeout(() => {
            const interval = setInterval(() => {
                setActiveImage((current) => {
                return (current + 1) % images.length;
                });
            }, 1400);

            return () => clearInterval(interval);
            }, entranceDuration + 1500);

        return () => clearTimeout(startDelay);
    }, []);*/}
    useEffect(() => {
        let cancelled = false;
        let timers: ReturnType<typeof setTimeout>[] = [];

        const runCycle = () => {
            if (cancelled) return;

            setVisibleImages([]);
            setActiveImage(0);

            // 1. Bring participants in
            images.forEach((_, index) => {
            const timer = setTimeout(() => {
                if (!cancelled) {
                setVisibleImages((current) => [...current, index]);
                }
            }, index * 600);

            timers.push(timer);
            });

            // 2. Start pointer after everyone appears
            const pointerStart = setTimeout(() => {
            if (cancelled) return;

            let index = 0;

            const movePointer = () => {
                if (cancelled) return;

                if (index >= images.length) {
                // 3. Everyone has been visited
                const fadeTimer = setTimeout(() => {
                    if (cancelled) return;

                    setVisibleImages([]);

                    // 4. Start again
                    const restartTimer = setTimeout(() => {
                    if (!cancelled) {
                        runCycle();
                    }
                    }, 1000);

                    timers.push(restartTimer);
                }, 800);

                timers.push(fadeTimer);
                return;
                }

                setActiveImage(index);
                index++;

                const nextTimer = setTimeout(movePointer, 1400);
                timers.push(nextTimer);
            };

            movePointer();
            }, images.length * 600 + 800);

            timers.push(pointerStart);
        };

        runCycle();

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((seconds) =>
            seconds > 0 ? seconds - 1 : 24 * 60 + 16
            );
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const message = messages[messageIndex];

        if (typedMessage.length < message.length) {
            setIsTyping(true);

            const timeout = setTimeout(() => {
                setTypedMessage(message.slice(0, typedMessage.length + 1));
            }, 65);

            return () => clearTimeout(timeout);
            }

            setIsTyping(false);

            const displayTimeout = setTimeout(() => {
                setIsFading(true);

                setTimeout(() => {
                    setTypedMessage("");
                    setIsFading(false);
                    setMessageIndex((current) => (current + 1) % messages.length);
                }, 700);
        }, 5000);

        return () => clearTimeout(displayTimeout);
    }, [typedMessage, messageIndex]); 

    useEffect(() => {
        let cancelled = false;
        let timeout: ReturnType<typeof setTimeout>;

        const typeText = async () => {
            // Main text
            for (let i = 0; i <= heroText.length; i++) {
            if (cancelled) return;

            setTypedHeroText(heroText.slice(0, i));

            await new Promise<void>((resolve) => {
                timeout = setTimeout(resolve, 150);
            });
            }
            // Small pause before accent text
            await new Promise<void>((resolve) => {
            timeout = setTimeout(resolve, 500);
            });
            // Accent text
            for (let i = 0; i <= heroAccent.length; i++) {
            if (cancelled) return;

            setTypedAccent(heroAccent.slice(0, i));

            await new Promise<void>((resolve) => {
                timeout = setTimeout(resolve, 250);
            });
            }
            // Keep the completed heading visible
            await new Promise<void>((resolve) => {
            timeout = setTimeout(resolve, 500);
            });

            if (!cancelled) {
            setTypedHeroText("");
            setTypedAccent("");

            typeText();
            }
        };

        typeText();

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, []);

    const isHeroTyping = typedHeroText.length < heroText.length || typedAccent.length < heroAccent.length;

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const formattedTime = `00:${String(minutes).padStart(2, "0")}:${String(
    seconds
    ).padStart(2, "0")}`;

  return (
    <div className={`flex flex-col items-center gap-12 px-4 md:pt-32 pt-25 md:flex-row md:justify-between md:px-10 `}> 
        <div className="space-y-5 w-full max-w-xl text-center md:text-left">
            <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
                <span>{typedHeroText}</span>{" "}
                <span className="text-[#7C3AED]">
                    {typedAccent}
                </span>
                {
                    isHeroTyping && (
                        <span className="inline-flex w-8 ml-1 text-[#7C3AED]">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse [animation-delay:150ms]">.</span>
                            <span className="animate-pulse [animation-delay:300ms]">.</span>
                        </span>
                    )
                }
                
            </h1>
            <p className="text-md text-gray-500">High-quality video calls for teams and individuals. No downloads, no hassle.</p>
            <div className="flex items-center md:space-x-7 md:flex-row flex-col md:space-y-0 space-y-5 ">
                <Button href="/signup" buttonType="primary" className="font-semibold">Get Started - It's Free!</Button>
                <Button href="/download" buttonType="secondary" className="font-semibold">Add to Chrome</Button>
            </div>
        </div>
            <div className="px-3">
                <div className="flex md:justify-evenly justify-center items-center md:w-full gap-2.5 py-4 px-3 text-gray-300 text-sm font-semibold">
                    <h6>Team Stanup</h6>
                    <p>{formattedTime}</p>
                    <span className="flex items-center space-x-2 rounded-xl bg-gray-900 md:px-2.5 px-1.5 md:py-1.5 py-1">
                        <UsersRoundIcon size={20} />
                        <p>4</p>
                    </span>
                </div>
                <div className="px-5 relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 md:gap-3.5 sm:gap-2.5 gap-1.5 ">
                        {
                            images.map((img, index) => {
                                const isVisible = visibleImages.includes(index);
                                const isActive = activeImage === index;

                                const imageState = !isVisible ? "translate-y-6 scale-90 opacity-0" : isActive ? "-translate-y-1 scale-[1.05] opacity-100 shadow-lg shadow-purple-500/20" : "translate-y-0 scale-100 opacity-100";

                                return (
                                    <div
                                    key={img.id}
                                    className={`overflow-hidden rounded-xl transition-all duration-500 ease-out md:w-full sm:w-[10vw]
                                                ${imageState}`}
                                >
                                    <img
                                        src={img.image}
                                        alt={img.name}
                                        className="md:h-60 md:w-40 aspect-3/4 w-full object-cover"
                                    />
                                </div>
                                )}
                            )
                        }
                    </div>
                    <div
                        className={`mt-3 flex min-h-6 items-center text-xs text-gray-400 transition-opacity duration-700 ${
                                    isFading ? "opacity-0" : "opacity-100"}`}
                    >
                        <span>{typedMessage}</span>
                        {isTyping && (
                            <span className="ml-1 inline-flex">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse [animation-delay:150ms]">.</span>
                            <span className="animate-pulse [animation-delay:300ms]">.</span>
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between gap-3 items-center py-4 px-3">
                        <span className="flex items-center space-x-5">
                            <span className="rounded-full bg-gray-700 border border-gray-500 p-1.5">
                                <Mic size={18} className="text-gray-50" />
                            </span>
                            <span className="rounded-full bg-gray-700 border border-gray-500 p-1.5">
                                <VideoIcon size={18}  className="text-gray-50"/>
                            </span>
                            <span className="rounded-full bg-gray-700 border border-gray-500 p-1.5">
                                <DownloadIcon size={18}  className="text-gray-50"/>
                            </span>
                        </span>
                        <span className="bg-red-500 rounded-xl py-2 px-5">
                            <Phone size={18} />
                        </span>
                    </div>
                    <Pointer
                        size={25}
                        className="pointer-events-none absolute text-gray-400 transition-all duration-700 ease-in-out"
                        style={{
                            left: pointer.x,
                            top: pointer.y,
                    }}/>
                </div>
            </div>
        </div>
  )
}

export default Hero