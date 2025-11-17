'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpUser } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

interface SignUpButtonProps {
  pending: boolean;
}

const SignUpButton = ({ pending }: SignUpButtonProps) => {
  return (
    <Button type="submit" className="w-full" variant="default" disabled={pending}>
      {pending ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Sign Up'}
    </Button>
  );
};

const SignUpForm = () => {
  const initialState = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(signUpUser, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            autoComplete="current-password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div className="space-y-2">
          <SignUpButton pending={isPending} />
        </div>
        {state && !state.success && <div className="text-center text-destructive">{state.message}</div>}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
