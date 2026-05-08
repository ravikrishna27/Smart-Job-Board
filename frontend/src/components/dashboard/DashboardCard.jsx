export default function DashboardCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
