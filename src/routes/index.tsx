import ShaderBackground from "@/components/shader";
import StaggeredText from "@/components/staggered-text";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <ShaderBackground />
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-start">
          <p className="text-4xl sm:text-6xl md:text-9xl font-semibold tracking-wide text-balance text-start mx-auto">
            <StaggeredText
              animationOffset={0.2}
              once
              text={[
                {
                  element: (
                    <div className="text-chart-2 brightness-150">micro-</div>
                  ),
                  delay: 0.25,
                  newline: true,
                },
                {
                  element: (
                    <div className="text-chart-3 brightness-150">mini-</div>
                  ),
                  delay: 0.25,
                  newline: true,
                },
                {
                  element: (
                    <div className="text-chart-1 brightness-150">mezzo-</div>
                  ),
                  delay: 0.25,
                  newline: true,
                },
                {
                  element: "b",
                },
                {
                  element: "l",
                },
                {
                  element: "o",
                },
                {
                  element: "g",
                },
                {
                  element: "g",
                },
                {
                  element: "i",
                },
                {
                  element: "n",
                },
                {
                  element: "g",
                },
              ]}
            />
          </p>
          <StaggeredText
            delay={1.75}
            animationOffset={0.2}
            text={[<p className="font-cursive text-4xl mt-8">nyt</p>]}
          />
        </div>
      </main>
    </>
  );
}
