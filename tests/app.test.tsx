import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../src/app/App';

afterEach(cleanup);
describe('fundação', () => {
  it('apresenta o estado inicial sem anunciar recursos inexistentes', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'The heart of chess.' })).toBeTruthy();
    expect(screen.getByText('Fundação técnica em desenvolvimento.')).toBeTruthy();
  });
});
