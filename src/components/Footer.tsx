export default function Footer() {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p>© {new Date().getFullYear()} Filippo Spinella</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/Spinny03"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/filippo-spinella/"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="w-5 h-5" />
          </a>
          <a
            href="mailto:fili.spin2003@gmail.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
