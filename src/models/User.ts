export interface User {
  id: string;
  username: string;
  discriminator: string;
  createdAt: Date;
}

export class UserModel {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
