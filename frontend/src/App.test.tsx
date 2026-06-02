import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
  it('renders the app title and increments counter', async () => {
    render(<App />);

    const counterButton = screen.getByRole('button', { name: /Count is 0/i });
    expect(counterButton).toBeInTheDocument();

    await userEvent.click(counterButton);
    expect(screen.getByRole('button', { name: /Count is 1/i })).toBeInTheDocument();
  });
});
