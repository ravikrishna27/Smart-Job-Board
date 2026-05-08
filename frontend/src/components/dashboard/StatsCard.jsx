export default function StatsCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
        {trend && (
          <p className={`text-sm mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value} this week
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
        <Icon size={24} />
      </div>
    </div>
  );
}
