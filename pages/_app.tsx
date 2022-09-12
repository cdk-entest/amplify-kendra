import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import awsconfig from "./../src/aws-exports";
import { ChakraProvider } from "@chakra-ui/react";

try {
  Amplify.configure(awsconfig);
} catch (error) {
  console.log(error);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
