import type { Metadata } from "next";
import Script from "next/script";
import PageViewTracker from "./components/PageViewTracker";
import "./globals.css";
const adsensePublisherId="ca-pub-3534989499820933";
export const metadata:Metadata={title:"Revista Rumo | Revista científica multidisciplinar",description:"A Revista Rumo recebe manuscritos científicos de diferentes áreas, com submissão e leitura gratuitas e decisões editoriais transparentes.",verification:{google:"TxSfWovss5wRRrEt5OcWFHccbCtavJrUE9BnnYbOPzw"},other:{"google-adsense-account":adsensePublisherId}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><PageViewTracker/>{children}<Script id="google-adsense" async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`} crossOrigin="anonymous"/></body></html>;}
