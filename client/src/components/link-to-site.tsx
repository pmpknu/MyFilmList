export default function LinkToSite({ link = 'https://mfl.maxbarsukov.ru' }: { link?: string }) {
  return (
    <a className='text-blue-600 hover:underline dark:text-blue-500' href={link}>
      {link}
    </a>
  );
}
