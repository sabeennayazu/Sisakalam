export default function StoriesByGenre() {
  return (
    <section className="py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Stories by Genre</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition">
              <div className="w-full h-40 bg-gray-300 rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Genre Story {item}</h3>
              <p className="text-sm text-gray-600">Explore stories in this genre</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
