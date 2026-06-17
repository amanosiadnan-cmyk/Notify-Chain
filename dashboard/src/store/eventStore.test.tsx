import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from '@jest/globals';
import { EventFiltersBar } from '../components/EventFiltersBar';
import { EventListPanel } from '../components/EventListPanel';
import { useEventStore } from '../store/eventStore';
import { generateMockEvents } from '../utils/eventData';

describe('event store selective subscriptions', () => {
  it('filter updates do not require reloading the full event collection', async () => {
    useEventStore.setState({
      events: generateMockEvents(100),
      filters: { search: '', contractAddress: 'all', eventType: 'all' },
      isLoading: false,
      error: null,
    });

    render(
      <div style={{ height: 600, width: 800 }}>
        <EventFiltersBar />
        <EventListPanel />
      </div>
    );

    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);

    const searchInput = screen.getByLabelText('Search');
    await userEvent.type(searchInput, 'TaskCreated');

    const filteredRows = screen.getAllByRole('article');
    expect(filteredRows.length).toBeLessThan(100);
    expect(filteredRows[0].textContent).toContain('TaskCreated');
  });
});
