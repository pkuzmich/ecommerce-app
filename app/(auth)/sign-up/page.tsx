import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import SignUpForm from './sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up'
};

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

const SignUpPage = async (props: SignUpPageProps) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();
  if (session) {
    redirect(callbackUrl || '/');
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} width={100} height={100} priority />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your details below to sign up</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
