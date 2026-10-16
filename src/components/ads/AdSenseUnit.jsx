import { useEffect } from "react";

// AdSense units for different placements
const AD_SLOTS = {
  leaderboard: "7264929408",      // 728x90 or responsive
  rectangle: "2841969201",        // 300x250 or responsive
  vertical: "3947352957",         // 160x600 or responsive
  square: "4586127832",           // 250x250
};

export default function AdSenseUnit({ slot = "rectangle", className = "" }) {
  useEffect(() => {
    // Push AdSense ads whenever component mounts
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.log("AdSense error:", e);
      }
    }
  }, []);

  const adSlot = AD_SLOTS[slot] || AD_SLOTS.rectangle;

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6102960658829353"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
