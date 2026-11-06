export function EmptyAnnounce({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-line bg-white/50 px-5 py-8 text-ink-soft">
      {message}
    </div>
  );
}
