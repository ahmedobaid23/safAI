import { Sun } from "lucide-react";

export default function WasteStatistics() {
  return (
    <section
      id="problem"
      className="flex min-h-screen px-4 sm:px-6 lg:px-8 py-12 lg:py-0 bg-white"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row justify-between gap-10 items-stretch mt-10 lg:mt-30">
          {/* Left column - Problem statement */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-10 lg:mb-26">
              <Sun className="text-blue-500 w-5 h-5" />
              <span className="text-blue-500 font-medium uppercase tracking-wide text-sm">
                Problem
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Waste generation is increasing day by day
            </h1>

            <p className="text-slate-600 mb-8 max-w-xl">
              The world generates 2.01 billion tonnes of municipal solid waste
              annually, with at least 33 percent of that—extremely
              conservatively—not managed in an environmentally safe manner.
            </p>

            {/* Statistics bars */}
            <div className="space-y-6 mb-8">
              {[
                { year: "2014", width: "30%", value: "135.5" },
                { year: "2016", width: "40%", value: "174.4" },
                { year: "2020", width: "60%", value: "278.3" },
              ].map(({ year, width, value }) => (
                <div key={year}>
                  <div className="font-bold text-slate-800 mb-2">{year}</div>
                  <div className="h-10 bg-gray-100 rounded-md w-full relative">
                    <div
                      className="h-10 bg-blue-500 rounded-md absolute left-0 top-0"
                      style={{ width }}
                    >
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white font-medium">
                        {value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-slate-600">
              Source: International Trade Administration
            </div>
          </div>

          {/* Right column - Stats card */}
          <div className="lg:w-[400px] w-full">
            <div className="bg-slate-700 rounded-2xl p-10 text-white flex flex-col justify-center items-center h-full">
              <div className="text-5xl font-bold mb-2">50,000 +</div>
              <div className="text-slate-300">Satisfied Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
