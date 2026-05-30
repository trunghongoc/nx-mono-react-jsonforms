import { Link } from 'react-router-dom';
import { useApiMutation } from '@nx-mono-react-jsonforms/api';
import { Button } from '@nx-mono-react-jsonforms/core';

import { PROJECT2_HOME, ROUTES } from './routes';

const JSON_PLACEHOLDER_USER_URL =
  'https://jsonplaceholder.typicode.com/users/1';

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export function HomePage() {
  const { mutate, data, isPending, isError, error } =
    useApiMutation<JsonPlaceholderUser>({ method: 'get' });

  return (
    <div>
      <p>Project 1</p>
      <Button
        loading={isPending}
        onClick={() => mutate({ url: JSON_PLACEHOLDER_USER_URL })}
      >
        Click me
      </Button>
      {isError && (
        <p className="mt-2 text-error" role="alert">
          {error.message}
        </p>
      )}
      {data && (
        <pre className="mt-2 overflow-auto rounded-md bg-neutral-100 p-2 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      <p className="mt-2">
        <Link to={ROUTES.PAGE_2}>Go to page 2</Link>
        {' · '}
        <Link to={PROJECT2_HOME}>Go to Project 2</Link>
      </p>
    </div>
  );
}
