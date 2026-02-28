export default function TopRatedPoems() {
  return (
    <section className="py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Top Rated Poems</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 hover:shadow-lg transition">
              <div className="w-full h-40 bg-amber-200 rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Top Rated Poem {item}</h3>
              <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
