import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Link from 'next/link';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div>
      <h1>Welcome to the Movie App</h1>
      {user.isAuthenticated ? (
        <p>Logged in as: {user.username}</p>
      ) : (
        <p>Please <Link href="/login">log in</Link> to continue</p>
      )}
    </div>
  );
};

export default HomePage;
