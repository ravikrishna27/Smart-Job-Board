import SearchBar from './SearchBar';

export default function HeroSection() {
  return (
    <section className="relative bg-blue-50 py-20 lg:py-32 overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container-custom relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Find your <span className="text-blue-600">dream job</span> <br className="hidden md:block" />
          with Smart Job Board
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Discover thousands of job opportunities with all the information you need. 
          Its your future, we just help you get there.
        </p>

        {/* Search Bar Wrapper */}
        <div className="px-4">
          <SearchBar />
        </div>

        {/* Popular Searches */}
        <div className="mt-8 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Popular:</span> Frontend Developer, Product Designer, Data Scientist, Remote
        </div>
      </div>
    </section>
  );
}
