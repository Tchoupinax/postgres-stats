import { Controller, Get, Logger } from '@nestjs/common';

@Controller('')
export class DefaultController {
  private logger: Logger = new Logger('DefaultController');

  @Get('/')
  index(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <ul>
          <li><a href="/postgres/global-stats">Postgres - Global stats</a></li>
          <li><a href="/postgres/most-invoked-queries">Postgres - Most invoked queries</a></li>
        </ul>
      </body>
      </html>
    `;
  }
}
