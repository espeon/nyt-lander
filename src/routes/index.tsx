import ShaderBackground from "@/components/shader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <ShaderBackground />
      <main className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-start">
          <p className="text-4xl sm:text-6xl md:text-9xl font-semibold tracking-wide text-balance text-start mx-auto">
            <p className="text-chart-2 brightness-150">micro-</p>
            <p className="text-chart-3 brightness-150">mini-</p>
            <p className="text-chart-1 brightness-150">mezzo-</p>
            blogging
          </p>
          <p className="font-cursive text-4xl mt-8">nyt</p>
        </div>
      </main>
    </>
  );
}
