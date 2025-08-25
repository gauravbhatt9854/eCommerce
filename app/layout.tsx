"use client"
import './globals.css'
import Nav from './(components)/nav/page'
import { AppStateProvider } from './(components)/provider/AppStateProvider'
import ChatComponent from './(components)/globalChat/page'
import { SocketProvider } from "./(components)/provider/SocketProvider";
import Script from 'next/script'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <SocketProvider>
        <html lang="en">
          <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}></Script>
          <body className='relative'>
            <ChatComponent />
            <header>
            </header>
            <Nav></Nav>
            <main>{children}</main>
          </body>
        </html>
      </SocketProvider>
    </AppStateProvider>
  )
}