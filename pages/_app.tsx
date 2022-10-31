import {
  ClerkProvider,
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  useAuth,
} from "@clerk/nextjs";
import type { AppProps } from "next/app";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import {
  HttpLink,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_APOLLO_URI,
});

function Header() {
  return (
    <header
      style={{ display: "flex", justifyContent: "space-between", padding: 20 }}
    >
      <h1>My App</h1>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </header>
  );
}

export const ApolloProviderWrapper = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const authMiddleware = setContext(async (operation, { headers }) => {
      const token = await getToken({ template: "grafbase" });

      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    });

    return new ApolloClient({
      link: from([authMiddleware, httpLink]),
      cache: new InMemoryCache(),
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ApolloProviderWrapper>
        <Header />
        <Component {...pageProps} />
      </ApolloProviderWrapper>
    </ClerkProvider>
  );
}

export default MyApp;
