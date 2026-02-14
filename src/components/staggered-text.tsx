"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * A single token in the staggered text animation.
 * Can be a plain string, a React component, or an object with custom delay.
 */
type StaggeredToken =
  | string
  | React.ReactNode
  | {
      /** The text or element to render */
      element: string | React.ReactNode;
      /** Additional delay (in seconds) to add after this token appears */
      delay?: number;
      /** Whether to force a line break after this token */
      newline?: boolean;
    };

interface StaggeredTextProps<T extends React.ElementType = "div"> {
  /** Text content as a string or array of tokens */
  text: StaggeredToken[] | string;
  /** CSS classes applied to the container element */
  className?: string;
  /** Initial vertical offset in pixels (defaults to computed line-height) */
  offset?: number;
  /** Delay before first token appears (seconds) */
  delay?: number;
  /** Duration of each token's animation (seconds) */
  duration?: number;
  /** Delay between each token's start time (seconds) */
  staggerDelay?: number;
  /** Whether animation should only play once when scrolled into view */
  once?: boolean;
  /** HTML element type to render as container */
  as?: T;
  /** Delay between opacity and y-position animations (seconds). This is what you need for a twitch-website-esque */
  animationOffset?: number;
}

/**
 * Internal representation after normalizing mixed token types.
 * Strings are split into words/whitespace, objects are unwrapped.
 */
interface NormalizedToken {
  /** The React node to render */
  element: React.ReactNode;
  /** Extra delay to add after this token (from StaggeredToken object) */
  delay?: number;
  /** True if this token is only whitespace (won't animate) */
  isWhitespace?: boolean;
  /** Whether to insert a line break after this token */
  newline?: boolean;
}

export default function StaggeredText<T extends React.ElementType = "div">({
  text,
  className = "",
  offset: propOffset,
  delay = 0,
  duration = 0.1,
  staggerDelay = 0.1,
  once = false,
  as,
  animationOffset = 0,
}: StaggeredTextProps<T>) {
  const Component = as || "div";
  if (typeof text === "string") text = [text];
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState<number>(propOffset ?? 20);

  // Get computed line-height if offset is not provided
  useEffect(() => {
    if (propOffset === undefined && ref.current) {
      const computed = window.getComputedStyle(ref.current);
      const lineHeight = computed.lineHeight;

      if (lineHeight === "normal") {
        const fontSize = parseFloat(computed.fontSize || "16");
        setOffset(fontSize * 1.2); // Approx fallback
      } else {
        setOffset(parseFloat(lineHeight));
      }
    }
  }, [propOffset]);

  // Normalize tokens into { element, optional delay, isWhitespace }
  const normalizeTokens = (input: StaggeredToken[]): NormalizedToken[] => {
    const result: NormalizedToken[] = [];

    input.forEach((item) => {
      if (typeof item === "string") {
        const parts = item.split(/(\s+)/g).filter((w) => w.length > 0);
        parts.forEach((word) =>
          result.push({
            element: word,
            isWhitespace: /\s+/.test(word),
          }),
        );
      } else if (
        typeof item === "object" &&
        item !== null &&
        "element" in item
      ) {
        result.push({
          element: item.element,
          delay: item.delay,
          newline: item.newline,
        });
      } else {
        result.push({ element: item });
      }
    });

    return result;
  };

  const tokens = normalizeTokens(text);

  // Calculate per-token delays including custom pauses
  let accumulatedDelay = delay;
  const tokenDelays = tokens.map((token) => {
    const thisDelay = accumulatedDelay;
    accumulatedDelay += staggerDelay;
    if (token.delay !== undefined) {
      accumulatedDelay += token.delay; // Extra pause after this token
    }
    return thisDelay;
  });

  const Comp = Component as any;

  return (
    <Comp className={className} ref={ref}>
      <span style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
        {tokens.map((token, index) => {
          if (token.isWhitespace) {
            return <span key={`space-${index}`}>{token.element}</span>;
          }

          return (
            <React.Fragment key={`token-${index}`}>
              <motion.span
                style={{ display: "inline-block" }}
                initial={{ opacity: 0, y: offset }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: {
                    duration,
                    delay: tokenDelays[index],
                  },
                  y: {
                    duration,
                    delay: tokenDelays[index] + animationOffset,
                  },
                }}
                viewport={{ once }}
                className="origin-bottom"
              >
                {token.element}
              </motion.span>
              {token.newline && <br />}
            </React.Fragment>
          );
        })}
      </span>
    </Comp>
  );
}
