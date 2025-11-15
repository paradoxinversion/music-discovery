import Link from "next/link";

export default function AccessUnauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-bold mb-4">Access Unauthorized</h1>
      <p className="text-lg text-center">
        You do not have permission to access this page. This may be due to not
        being logged in or lacking the necessary privileges.
      </p>
      <p>
        You can try to logging in and returning to this page. (If you are
        redirected to the Discover page, you may already be logged in and this
        screen may be an error.)
      </p>
      <Link href="/login">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Login Page
        </button>
      </Link>
      <Link href="/discover">
        <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Go to Discover Page
        </button>
      </Link>
    </div>
  );
}
