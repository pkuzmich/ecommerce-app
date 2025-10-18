import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="p-5 flex-center text-sm text-muted-foreground">
        {currentYear} {APP_NAME} &copy; Developed by&nbsp;
        <Link
          href="https://github.com/pkuzmich"
          target="_blank"
          className="link hover:underline"
          rel="noopener noreferrer"
        >
          Pavlo Kuzmich
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
