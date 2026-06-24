export const metadata = {
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

/** Admin routes: no public chrome hints in nested layout (gate handles access). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
