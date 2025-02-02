import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">
        404 - Stránka nenájdená
      </h1>
      <p className="text-gray-600 mt-2">
        Prepáčte, ale stránka, ktorú hľadáte, neexistuje alebo k nej nemáte
        prístup.
      </p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Naspäť na úvodnú stránku
      </Link>
    </div>
  );
}
