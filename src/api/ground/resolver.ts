import { groundRepository } from "./groundRepository";

export class groundResolver {
  public groundRepository: any;
  constructor() {
    this.groundRepository = new groundRepository();
  }
  public async addGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.addGroundV1(user_data,token_data, domain_code);
  }
  public async updateGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.updateGroundV1(user_data,token_data, domain_code);
  }
  public async uploadRoomImageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.uploadRoomImageV1(user_data,token_data, domain_code);
  }
  public async deleteRoomImageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.deleteRoomImageV1(user_data,token_data, domain_code);
  }
  public async uploadGroundImageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.uploadGroundImageV1(user_data,token_data, domain_code);
  }
  public async deleteGroundImageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.deleteGroundImageV1(user_data,token_data, domain_code);
  }
  public async listGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.listGroundV1(user_data,token_data, domain_code);
  }
  public async deleteGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.deleteGroundV1(user_data,token_data, domain_code);
  }
  public async getGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.getGroundV1(user_data,token_data, domain_code);
  }
  public async addAddonsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.addAddonsV1(user_data,token_data, domain_code);
  }
  public async updateAddonsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.updateAddonsV1(user_data,token_data, domain_code);
  }
  public async deleteAddonsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.deleteAddonsV1(user_data,token_data, domain_code);
  }
  public async listAddOnsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.listAddOnsV1(user_data,token_data, domain_code);
  }
  public async addAddonAvailabilityV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.addAddonAvailabilityV1(user_data,token_data, domain_code);
  }
  public async updateAddonAvailabilityV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.updateAddonAvailabilityV1(user_data,token_data, domain_code);
  }
  public async deleteAddonAvailabilityV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.deleteAddonAvailabilityV1(user_data,token_data, domain_code);
  }
  public async listAddonAvailabilityV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.groundRepository.listAddonAvailabilityV1(user_data,token_data, domain_code);
  }

}