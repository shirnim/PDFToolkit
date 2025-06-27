import SignupForm from '@/components/signup-form';
import Header from '@/components/header';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-sm flex-col items-center justify-center px-4 md:px-6">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
