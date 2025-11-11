const discordlogo = '/assets/img/icons/discordlogo.png';
const facebooklogo = '/assets/img/icons/facebooklogo.png';
const githublogo = '/assets/img/icons/githublogo.png';
const instagramlogo = '/assets/img/icons/instagramlogo.png';
const maillogo = '/assets/img/icons/maillogo.png';
import type { SocialLink } from '@/types';

export const SocialLinks: SocialLink[] = [
  {
    icon: discordlogo,
    href: 'https://discord.com/invite/tbKkvjV2W8',
    title: 'Discord',
  },
  {
    icon: instagramlogo,
    href: 'https://www.instagram.com/kdt.suo/?theme=dark',
    title: 'Instagram',
  },
  {
    icon: maillogo,
    href: 'mailto:kpopdanceteam.suo@gmail.com',
    title: 'Email',
  },
  {
    icon: githublogo,
    href: 'https://github.com/kdtsuo/v3',
    title: 'GitHub',
  },
  {
    icon: facebooklogo,
    href: 'https://www.facebook.com/profile.php?id=61577850668849',
    title: 'Facebook',
  },
];
