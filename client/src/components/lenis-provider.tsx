/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { PropsWithChildren } from "react";

export default function LenisProvider({ children }: PropsWithChildren) {
    return (
        <ReactLenis root autoRaf rafPriority={24} options={{
            lerp: 0.1, // Smoothness intensity
            duration: 1.5, // Scroll duration
            smoothWheel: true, // Enable smooth scrolling for wheel events
            autoResize: true, // Automatically update on resize
        }}>
            {children as any}
        </ReactLenis>
    );
}
