"use client"
import './globals.css'
import Nav from './(components)/nav/page'
import { AppStateProvider } from './(components)/provider/AppStateProvider'
import ChatComponent from './(components)/globalChat/page'
import { SocketProvider } from "./(components)/provider/SocketProvider";
import Adsense from './(components)/adsense/Adsense'
import Head from 'next/head'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <SocketProvider>
        <html lang="en">
          <head>
            <Adsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID!} />
          </head>
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