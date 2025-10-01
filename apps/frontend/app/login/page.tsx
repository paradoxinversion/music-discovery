"use client";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center py-2">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="flex flex-col space-y-4 w-80">
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => console.log("Login Clicked")}
        >
          Login
        </button>
      </form>
    </div>
  );
}
