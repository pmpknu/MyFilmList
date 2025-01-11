import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div>
      <h1>Welcome to the Movie App</h1>
      {user.isAuthenticated ? (
        <p>Logged in as: {user.username}</p>
      ) : (
        <p>Please log in to continue</p>
      )}
    </div>
  );
};

export default HomePage;
