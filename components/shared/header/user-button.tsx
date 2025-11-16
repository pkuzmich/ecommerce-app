import { Button } from '@/components/ui/button';
import { LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { signOutUser } from '@/lib/actions/user.actions';

const UserButton = async () => {
  const session = await auth();

  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() ?? 'U';

  if (!session) {
    return (
      <Button asChild variant="ghost">
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">{session?.user?.name}</div>
              <div className="text-sm text-muted-foreground leading-none">{session?.user?.email}</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                type="submit"
                variant="ghost"
                className="cursor-pointer px-2 py-4 w-full h-4 justify-start"
              >
                <LogOutIcon /> Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
