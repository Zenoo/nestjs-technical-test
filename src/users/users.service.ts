import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '85fed9e2-e7ad-47c4-a4be-2f5814e7033a',
      username: 'john',
      password: 'changeme',
    },
    {
      id: '84b4a12f-13c9-4de7-9676-3c004bced5c3',
      username: 'maria',
      password: 'guess',
    },
  ];

  create(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);

    return createUserDto;
  }

  findAll() {
    return this.users;
  }

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  update(uuid: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${uuid} user`;
  }

  remove(uuid: string) {
    return `This action removes a #${uuid} user`;
  }
}
