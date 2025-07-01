function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-700 text-white font-sans text-center p-8">
      <h1 className="text-[6rem] m-0 font-extrabold tracking-wider drop-shadow-lg">
        404
      </h1>
      <h2 className="text-2xl mt-4 mb-2 font-semibold">Page Not Found</h2>
      <p className="text-lg mb-8 opacity-85">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-3 bg-white text-purple-700 rounded-full font-semibold text-base shadow-lg transition-colors duration-200 hover:bg-purple-700 hover:text-white"
      >
        Go Home
      </a>
      <div className="mt-12 opacity-20 text-[8rem] select-none">🚧</div>
    </div>
  );
}

export default NotFoundPage;
