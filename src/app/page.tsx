"use client"
import 'core-js';

import App from './App';
import { useSession } from "next-auth/react";
import StoreProvider from "app/StoreProvider";
import Login from "./Login/page";
import CreatePassword from "./CreatePassword/page";
import Loading from "./components/Loading";

const start = Date.now();

export default function Home() {
  const { data: sessionData, status } = useSession();

  if (sessionData === undefined || status === 'loading') {
    return (
      <Loading>{null}</Loading>
    )
  } else if (sessionData === null) {
    return <Login />;
  } else if (sessionData.user.needPasswordReset) {
    return <CreatePassword />;
  }

  return ( 
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
