import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-10 text-[#1c1c1b] dark:text-white", className)}
    >
      {/* Right "d" — behind, cut away around the front one */}
      <path d="M18 4v.19a11.5 11.5 0 0 1 5.5 9.81v4a11.5 11.5 0 0 1-5.5 9.81V28h8a10 10 0 0 0 10-10v-4A10 10 0 0 0 26 4h-8z" />
      {/* Left "d" — in front */}
      <path d="M4 4h8a10 10 0 0 1 10 10v4a10 10 0 0 1-10 10H4V4z" />
    </svg>
  );
}
