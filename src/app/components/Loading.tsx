import { CSpinner } from "@coreui/react";
import { Suspense, ReactPropTypes } from "react";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <SessionProvider session={undefined} >
//           {children}
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

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