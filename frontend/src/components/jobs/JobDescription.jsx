export default function JobDescription({ job }) {
  return (
    <div className="space-y-8 text-gray-700 leading-relaxed">
      {/* About the role */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
        <p>{job.description}</p>
      </section>

      {/* Responsibilities */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
          {job.responsibilities?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Requirements */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
        <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
          {job.requirements?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* About Company */}
      <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-3">About {job.company}</h2>
        <p className="text-gray-600">{job.aboutCompany}</p>
      </section>
    </div>
  );
}
