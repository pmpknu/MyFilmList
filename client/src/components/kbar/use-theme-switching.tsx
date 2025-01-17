import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: 'Переключить тему',
      shortcut: ['t', 't'],
      section: 'Внешний вид',
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: 'Установить светлую тему',
      section: 'Внешний вид',
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: 'Установить темную тему',
      section: 'Внешний вид',
      perform: () => setTheme('dark')
    }
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
