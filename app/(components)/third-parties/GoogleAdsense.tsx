import { FC } from 'react';
import Script from 'next/script';

const GoogleAdsense: FC<{ pId: string }> = ({ pId }) => (
  <Script 
    async 
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`} 
    crossOrigin="anonymous" 
    strategy="afterInteractive" 
    />
);

export default GoogleAdsense;