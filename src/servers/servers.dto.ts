import { ApiProperty } from '@nestjs/swagger';

export class ServerDto {
  @ApiProperty({
    type: String,
    description: 'The server url',
    example: 'https://gitlab.com',
  })
  url: string;

  @ApiProperty({
    type: Number,
    description: 'The priority',
    example: 4,
  })
  priority: number;
}
