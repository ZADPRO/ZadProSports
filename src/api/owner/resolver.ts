import { ownerRepository } from "./ownerRepository";

export class ownerResolver {
  public ownerRepository: any;
  constructor() {
    this.ownerRepository = new ownerRepository();
  }
  public async addOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.addOwnersV1(user_data,token_data, domain_code);
  }

}