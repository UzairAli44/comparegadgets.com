import { formatAgo } from "@/lib/format";

export function Freshness({ hours }: { hours: number }) {
  return (
    <span className="freshness">
      <span />
      {formatAgo(hours)}
    </span>
  );
}
