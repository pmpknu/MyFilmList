export default function LinkToSite({ link = 'https://mfl.maxbarsukov.ru' }: { link?: string }) {
  return (
    <a className='text-blue-600 dark:text-blue-500 hover:underline' href={link}>{link}</a>
  );
}
