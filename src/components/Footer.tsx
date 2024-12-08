export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex items-center justify-between px-4">
        <p>© {new Date().getFullYear()} Filippo Spinella</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/Spinny03"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/filippo-spinella/"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="h-5 w-5" />
          </a>
          <a
            href="mailto:fili.spin2003@gmail.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <div className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
