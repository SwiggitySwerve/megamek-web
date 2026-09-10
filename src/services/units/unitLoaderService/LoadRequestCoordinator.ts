export interface ILoadRequestTicket {
  readonly key: string;
}

/** Owns which in-flight result may open an editor; source reads may finish independently. */
export class LoadRequestCoordinator {
  private current: ILoadRequestTicket | null = null;

  begin(key: string): ILoadRequestTicket | null {
    if (this.current?.key === key) return null;
    const ticket = { key };
    this.current = ticket;
    return ticket;
  }

  isCurrent(ticket: ILoadRequestTicket): boolean {
    return this.current === ticket;
  }

  finish(ticket: ILoadRequestTicket): void {
    if (this.isCurrent(ticket)) this.current = null;
  }

  cancel(): void {
    this.current = null;
  }
}
