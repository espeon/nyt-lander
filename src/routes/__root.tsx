import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import { ThemeProvider, getThemeScript } from "@/components/theme-provider";

type Theme = "dark" | "light" | "system";

function getServerTheme(
  cookieHeader?: string,
  storageKey = "vite-ui-theme",
): Theme {
  if (!cookieHeader) return "system";

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const theme = cookies[storageKey] as Theme | undefined;
  return theme && ["dark", "light", "system"].includes(theme)
    ? theme
    : "system";
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const storageKey = "vite-ui-theme";
  const defaultTheme = "dark";

  const cookieHeader =
    typeof window === "undefined"
      ? (globalThis as any).__request?.headers?.get?.("cookie")
      : undefined;

  const serverTheme = getServerTheme(cookieHeader, storageKey);

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeScript(storageKey, defaultTheme),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          defaultTheme={defaultTheme}
          storageKey={storageKey}
          serverTheme={serverTheme}
        >
          {children}
          {/*<TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />*/}
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
