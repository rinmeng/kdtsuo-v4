import Image from 'next/image';

interface IconLink {
  href: string;
  imgSrc: string;
  alt: string;
}

interface IconLinkProps {
  links: IconLink[];
}

export function IconLink({ links }: IconLinkProps) {
  return (
    <div className='mx-auto grid w-full grid-cols-2 justify-items-center gap-2'>
      {links.map((link, index) => (
        <a
          key={index}
          target='_blank'
          rel='noreferrer'
          href={link.href}
          className='nudgeup fadein80 t200e'
        >
          <Image
            className='m-2 h-auto w-14 not-dark:invert-100 dark:invert-0'
            src={link.imgSrc}
            alt={link.alt}
            width={56}
            height={56}
          />
        </a>
      ))}
    </div>
  );
}
