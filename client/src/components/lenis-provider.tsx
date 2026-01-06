"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { PropsWithChildren } from "react";

export default function LenisProvider({ children }: PropsWithChildren) {
    return (
        <ReactLenis root autoRaf options={{
            lerp: 0.1, // Smoothness intensity
            duration: 1.5, // Scroll duration
        }}>
            {children as any}
        </ReactLenis>
    );
}
