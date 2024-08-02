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

  console.log(sessionData);
  if (sessionData === undefined || status === 'loading') {
    console.log('session loading...', status, Date.now() - start);
    return (
      <Loading>{null}</Loading>
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
