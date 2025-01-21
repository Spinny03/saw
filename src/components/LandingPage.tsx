'use client';

export default function LandingPage() {
  return (
    <div className="bg-gray-100 text-gray-900">
      {/* Header Section */}
      <header className="bg-teal-500 py-10 text-center text-white">
        <h1 className="text-4xl font-semibold">CoralApp</h1>
        <p className="mt-2 text-lg">
          Gestione Task per Team. Organizza, Collabora e Raggiungi i Tuoi
          Obiettivi!
        </p>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-gray-800">
        <ul className="flex justify-center space-x-8 py-4">
          <li>
            <a
              href="#cosa-facciamo"
              className="rounded px-4 py-2 text-white hover:bg-teal-500"
            >
              Cosa Facciamo
            </a>
          </li>
          <li>
            <a
              href="#chi-siamo"
              className="rounded px-4 py-2 text-white hover:bg-teal-500"
            >
              Chi Siamo
            </a>
          </li>
          <li>
            <a
              href="#dove-siamo"
              className="rounded px-4 py-2 text-white hover:bg-teal-500"
            >
              Dove Siamo
            </a>
          </li>
          <li>
            <a
              href="#contatti"
              className="rounded px-4 py-2 text-white hover:bg-teal-500"
            >
              Contatti
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-screen-xl px-4 py-16">
        {/* Cosa Facciamo */}
        <section id="cosa-facciamo" className="mb-20">
          <h2 className="mb-4 text-3xl font-bold">Cosa Facciamo</h2>
          <p className="text-lg leading-relaxed">
            CoralApp è uno strumento intuitivo e potente che aiuta i team a
            organizzare e monitorare i propri task. Con la possibilità di creare
            board condivise, assegnare attività, e collaborare in tempo reale,
            facilitiamo la gestione dei progetti, aumentando produttività e
            trasparenza.
          </p>
        </section>

        {/* Product Description */}
        <section className="mb-20 flex flex-col items-start justify-between lg:flex-row">
          {' '}
          {/* Modifica qui: items-center -> items-start */}
          <img
            src="/lorempixel.jpg"
            alt="CoralApp Example"
            className="mr-8 w-full rounded-lg shadow-lg lg:mb-0 lg:w-1/2"
          />
          <div className="ml-8 flex flex-col justify-start lg:mt-0 lg:w-1/2">
            <h2 className="mb-4 text-2xl font-semibold">
              Organizza il tuo lavoro in modo semplice e visivo
            </h2>
            <p className="text-lg leading-relaxed">
              Con CoralApp puoi creare boards personalizzate per ogni progetto,
              aggiungere task, monitorare progressi e assegnare responsabilità.
              Rendi la gestione dei tuoi progetti chiara e facilmente
              comprensibile per tutti i membri del team.
            </p>
          </div>
        </section>

        {/* Chi Siamo */}
        <section id="chi-siamo" className="mb-20">
          <h2 className="mb-4 text-3xl font-bold">Chi Siamo</h2>
          <p className="text-lg leading-relaxed">
            Siamo un team di esperti in gestione dei progetti e sviluppo
            software. Il nostro obiettivo è semplificare la vita dei team di
            lavoro, creando strumenti potenti e facili da usare. Crediamo che un
            buon software di collaborazione possa fare la differenza nella
            produttività e nel successo di ogni azienda.
          </p>
        </section>

        {/* Dove Siamo */}
        <section id="dove-siamo" className="mb-20">
          <h2 className="mb-4 text-3xl font-bold">Dove Siamo</h2>
          <p className="text-lg leading-relaxed">
            CoralApp è un prodotto globale. Il nostro team è distribuito tra
            diverse località, ma lavoriamo insieme come una squadra per
            costruire un prodotto che aiuti team di ogni parte del mondo. La
            nostra sede principale si trova a Milano, Italia.
          </p>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="mb-4 text-3xl font-bold">Il Nostro Team</h2>
          <div className="flex justify-around">
            <div className="text-center">
              <img
                src="/memoji.png"
                alt="Filippo Spinella"
                className="mb-4 rounded-full"
              />
              <p className="font-semibold">Filippo Spinella</p>
              <p>Fondatore</p>
            </div>
            <div className="text-center">
              <img
                src="memojig.png"
                alt="Andrea Garaccioni"
                className="mb-4 rounded-full"
              />
              <p className="font-semibold">Andrea Garaccioni</p>
              <p>Co-Fondatore</p>
            </div>
          </div>
        </section>

        {/* Contatti */}
        <section id="contatti" className="mb-20">
          <h2 className="mb-4 text-3xl font-bold">Contattaci</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Hai domande o desideri provare CoralApp? Contattaci oggi!
          </p>
          <p className="text-lg font-semibold">
            Email:{' '}
            <a href="mailto:support@coralapp.com" className="text-teal-500">
              support@coralapp.com
            </a>
          </p>
          <p className="text-lg font-semibold">Telefono: +39 123 456 789</p>
        </section>
      </div>
    </div>
  );
}
