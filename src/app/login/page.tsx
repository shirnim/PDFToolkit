import LoginForm from '@/components/login-form';
import Header from '@/components/header';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-sm flex-col items-center justify-center px-4 md:px-6">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
