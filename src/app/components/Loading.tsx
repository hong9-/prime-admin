import { CSpinner } from "@coreui/react";
import { Suspense, ReactPropTypes } from "react";

export default function Loading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="pt-3 page-loading text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}