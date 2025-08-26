"use client"
import AdBanner from './(components)/third-parties/AdBanner';
import HomePage from './(components)/home/page';
export default function Home() {
  return (
    <>
      <HomePage />
      <div className="bg-black">
        <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="2313674621"
        />
      </div>
    </>
  );
}
