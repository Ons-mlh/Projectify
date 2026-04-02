export default function Footer() {
  return (
    <div className="border-t border-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-teal-600 font-bold text-lg">Projectify</span>
        <p className="text-sm text-gray-400">
          Made with 💚 by{" "}
          <a
            href="https://www.linkedin.com/in/ons-el-maleh-648531300/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 decoration-teal-300 hover:decoration-teal-500 transition-colors"
          >
            Ons El Maleh
          </a>
        </p>
      </div>
    </div>
  );
}
