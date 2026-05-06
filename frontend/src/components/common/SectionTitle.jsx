export default function SectionTitle({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
