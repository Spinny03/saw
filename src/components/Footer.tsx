export default function Footer() {
  return (
    <footer className="bg-teal-900 py-4 text-white">
      <div className="container mx-auto flex items-center justify-between px-4">
        <p>
          © {new Date().getFullYear()} CoralApp. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
