'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

interface SignInButtonProps {
  pending: boolean;
}

const SignInButton = ({ pending }: SignInButtonProps) => {
  return (
    <Button type="submit" className="w-full" variant="default" disabled={pending}>
      {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Sign In'}
    </Button>
  );
};

const CredentialsSignInForm = () => {
  const initialState = { success: false, message: '' };
  const [state, dispatch, isPending] = useActionState(signInCredentials, initialState);

  return (
    <form action={dispatch}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="E-mail"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div className="space-y-2">
          <SignInButton pending={isPending} />
        </div>
        {state && !state.success && <div className="text-center text-destructive">{state.message}</div>}
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" target="_self" className="link">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
