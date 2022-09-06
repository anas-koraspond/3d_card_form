import React from "react";

export default function useDeviceDetect() {
  const [isMobile, setMobile] = React.useState(true);

  React.useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    let mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    if (window.innerWidth < 430) {
      mobile = true
    }
    setMobile(mobile);
  }, []);

  return { isMobile };
}