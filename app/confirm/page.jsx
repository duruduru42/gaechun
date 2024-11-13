import { useSearchParams } from 'next/navigation';

export default function Signup() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message'); // Access 'message' directly

  return (
    <div>
      <div className="w-full px-8 sm:max-w-lg mx-auto mt-8">
        <p className="text-foreground">{message}</p>
      </div>
    </div>
  );
}
