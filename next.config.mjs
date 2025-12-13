import withPWA from "next-pwa";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bdtakatbcorgzzftbvhi.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabins-images/**",
      },
    ],
  },
  // output: "export",
};

export default withPWA({
  dest: "public", // Output directory for service worker and workbox files
  register: true, // Register the service worker
  skipWaiting: true, // Activate the service worker immediately
  // disable: process.env.NODE_ENV === "development", // Optional: Disable PWA in development mode
  // Add other workboxOptions here if needed
})(nextConfig);

// export default nextConfig;
