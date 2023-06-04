export default function clxs(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
