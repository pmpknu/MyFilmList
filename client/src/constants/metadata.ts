import { Metadata } from 'next';

const keywords = [
  "MyFilmList",
  "my-film-list",
  "My Film List",
  "kinopoisk",
  "кинопоиск",
  "MAL",
  "My Anime List",
  "MyAnimeList",
  "отслеживание фильмов",
  "списки фильмов",
  "отзывы о фильмах",
  "оценки фильмов",
  "рекомендации фильмов",
  "кино",
  "фильмы",
  "коллекции фильмов",
  "планируемые фильмы",
  "просмотренные фильмы",
  "кинообсуждения",
  "кинофанаты",
  "жанры фильмов",
  "рейтинг фильмов",
  "приложение для фильмов",
  "кино-аппликация",
  "онлайн-кино",
  "кино-сообщество",
  "movie tracking",
  "movie lists",
  "movie reviews",
  "movie ratings",
  "movie recommendations",
  "cinema",
  "films",
  "film collections",
  "planned movies",
  "watched movies",
  "film discussions",
  "movie fans",
  "film genres",
  "movie ratings",
  "movie app",
  "online cinema",
  "film community"
];

const metadata: Metadata = {
  metadataBase: new URL('https://mfl.maxbarsukov.ru/'),
  title: { default: "Главная", template: "%s | MyFilmList" },
  applicationName: 'MyFilmList',
  authors: [
    {
      name: 'Макс Барсуков',
      url: 'https://github.com/maxbarsukov'
    },
    {
      name: 'Даниил Горляков',
      url: 'https://github.com/pmpknu'
    }
  ],
  creator: 'MyFilmList Team',
  description: '🍿🎬 MyFilmList — это приложение, предназначенное для отслеживания фильмов, которое позволяет вести собственные списки просмотренного, запланированного к просмотру контента, оценивать фильмы, оставлять отзывы и делиться рекомендациями, находить новые произведения для просмотра по рекомендациям, жанрам и рейтингам.',
  keywords,
};

export default metadata;
