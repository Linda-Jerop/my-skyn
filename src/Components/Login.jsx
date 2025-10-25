<div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <input className="w-full p-2 mb-3 border rounded-md" />
    <input className="w-full p-2 mb-4 border rounded-md" />
    <p className="text-red-500 text-sm mb-3">{error}</p>
    <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
      Login
    </button>
  </form>
</div>
