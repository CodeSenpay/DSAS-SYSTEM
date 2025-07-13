import NavBar from "../components/NavBar";
function VMGOPage() {
  return (
    <div>
      <NavBar />
      <div className="flex justify-center items-center min-h-[80vh]">
        <section className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl border border-blue-100">
          <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10 tracking-tight drop-shadow-sm">
            Vision, Mission, and Goal
          </h1>
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-blue-400 rounded-full"></span>
              Vision
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed pl-4">
              To be a leading institution recognized for excellence in
              education, innovation, and service to society.
            </p>
          </div>
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-green-700 mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-green-400 rounded-full"></span>
              Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed pl-4">
              To provide quality education and foster lifelong learning,
              critical thinking, and responsible citizenship through a dynamic
              and inclusive environment.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-orange-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-orange-400 rounded-full"></span>
              Goal
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 leading-relaxed space-y-2">
              <li>Promote academic excellence and innovation.</li>
              <li>Develop competent and ethical professionals.</li>
              <li>Engage in community service and sustainable development.</li>
              <li>Foster a culture of collaboration and respect.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VMGOPage;
