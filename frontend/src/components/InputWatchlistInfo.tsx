import { Input, Switch, Spacer, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { WatchListCreateDto } from '@/interfaces/watchlist/dto/WatchListCreateDto';
import { WatchListUpdateDto } from '@/interfaces/watchlist/dto/WatchListUpdateDto';
import { InputWatchlistInfoProps } from '@/types/InputWatchlistInfoProps';

const InputWatchListInfo = <T extends WatchListCreateDto | WatchListUpdateDto>({ onSubmit, initialData }: InputWatchlistInfoProps<T>) => {
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState(true);

  const doif = (condition: any, callback: (param: any) => void) => {
    if (condition) callback(condition);
  };

  useEffect(() => {
    if (initialData) {
      doif(initialData.name, setName);
      doif(initialData.visibility !== undefined, setVisibility);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const data = {
      name,
      visibility,
    } as T;

    onSubmit(data);
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <h3>Watch List Information</h3>
      <Spacer y={1} />
      <Input
        label="Name"
        placeholder="Watch List Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Spacer y={1} />
      <Switch
        checked={visibility}
        onChange={(e) => setVisibility(e.target.checked)}
      >
        {visibility ? 'Public' : 'Private'}
      </Switch>
      <Spacer y={1} />
      <Button
        onClick={handleSubmit}
        color="success"
      >Submit</Button>
    </div>
  );
};

export default InputWatchListInfo;
