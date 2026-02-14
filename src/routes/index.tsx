import ShaderBackground from "@/components/shader";
import StaggeredText from "@/components/staggered-text";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <ShaderBackground />
      <main className="relative min-h-screen flex items-center justify-center px-8">
        <div className="absolute bottom-5 left-auto right-auto">
          made with less than three in the USA
        </div>
        <div className="max-w-3xl w-full text-start">
          <p className="text-5xl sm:text-8xl md:text-9xl font-semibold tracking-wide text-balance text-start mx-auto">
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
          <div className="flex flex-col md:flex-row justify-between mt-12 gap-4">
            <StaggeredText
              delay={1.75}
              animationOffset={0.2}
              className="text-3xl sm:text-5xl text-gray-300"
              text="for nobody."
            />
            <StaggeredText
              delay={2.75}
              animationOffset={0.2}
              className="text-3xl sm:text-4xl text-gray-300"
              text={[
                {
                  element: (
                    <p className="font-cursive text-4xl ml-auto w-max">nyt</p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </main>
    </>
  );
}
