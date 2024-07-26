"use client"

import Image from "next/image";
import 'core-js';

import App from './App';
import { useSession } from "next-auth/react";
import { AppProps } from "next/app";
import StoreProvider from "app/StoreProvider";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { CSpinner } from "@coreui/react";
import Login from "./Login/page";
import CreatePassword from "./CreatePassword/page";

const start = Date.now();

export default function Home() {
  const route = useRouter();
  const { data: sessionData, status } = useSession();
  // const status = getStatus();

  console.log(sessionData);
  if (sessionData === undefined || status === 'loading') {
    console.log('session loading...', status, Date.now() - start);
    return (
      <Suspense
        fallback={
          <div className="pt-3 session-loading text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
      }>
      </Suspense>
    )
  } else if (sessionData === null) {
    console.log('session null, redirect to /Login', status, Date.now() - start);
    return <Login />;
  } else if (sessionData.user.needPasswordReset) {
    console.log('Need to redirect to CreatePassword!!!!!!!', status, Date.now() - start);
    return <CreatePassword />;
  }
  
  console.log('session loading done...', status, Date.now() - start);
  return ( 
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
