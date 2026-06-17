import { memo } from 'react';
import type { BlockchainEvent } from '../types/event';

interface EventRowProps {
  event: BlockchainEvent;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function shortenAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const EventRow = memo(function EventRow({ event }: EventRowProps) {
  return (
    <article className="event-row" data-event-id={event.eventId}>
      <div className="event-row__primary">
        <span className="event-row__name">{event.eventName ?? event.type}</span>
        <span className="event-row__ledger">Ledger {event.ledger}</span>
      </div>
      <div className="event-row__meta">
        <span>{shortenAddress(event.contractAddress)}</span>
        <span>{formatTime(event.receivedAt)}</span>
      </div>
      <div className="event-row__details">
        <span>Value: {event.value}</span>
        {event.txHash && <span>Tx: {shortenAddress(event.txHash)}</span>}
      </div>
    </article>
  );
});
