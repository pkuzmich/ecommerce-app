import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';

const colorTitle = '#8B5CF6';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image src="/images/logo.svg" alt="logo" width={36} height={36} priority={true} />
            <span className="hidden lg:block font-bold text-2xl ml-3" style={{ color: colorTitle }}>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
