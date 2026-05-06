export default function Statistics() {
  const stats = [
    { label: "Active Jobs", value: "10K+" },
    { label: "Companies", value: "5K+" },
    { label: "Students", value: "20K+" },
    { label: "Hired Daily", value: "500+" }
  ];

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500">
          {stats.map((stat, index) => (
            <div key={index} className={index % 2 === 0 ? "border-l-0 md:border-l" : ""}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
