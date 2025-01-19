import twemoji from 'twemoji';

const Twemoji = ({ emoji, className }: { emoji: string; className?: string }) => (
  <span
    className={className}
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        folder: 'svg',
        ext: '.svg'
      })
    }}
  />
);

export default Twemoji;
