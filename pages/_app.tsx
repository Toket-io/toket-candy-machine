import "@/styles/globals.css";
import "@/styles/custom.scss";
// import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-bootstrap";

import AuthProvider from "../context/AuthContext";
import ProtectedRoute from "../context/ProtectedRoute";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SSRProvider>
      <AuthProvider>
        <ProtectedRoute router={router}>
          <Component {...pageProps} />
        </ProtectedRoute>
      </AuthProvider>
    </SSRProvider>
  );
}
