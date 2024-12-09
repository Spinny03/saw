export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex items-center justify-between px-4">
        <p>© {new Date().getFullYear()} Filippo Spinella</p>
      </div>
    </footer>
  );
}
