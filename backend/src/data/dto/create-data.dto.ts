export class CreateDataDto {
  readonly query: string;
  readonly queryHash: string;
  readonly value: number;
  readonly callCountSinceLast: number;
  readonly date: Date;
}
