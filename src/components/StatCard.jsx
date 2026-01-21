function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      
      {/* Gradient bar */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

      <div className="p-6 flex items-center justify-between">
        {/* Left */}
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-2xl shadow`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
export default StatCard;