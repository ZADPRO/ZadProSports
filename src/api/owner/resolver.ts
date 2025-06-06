import { ownerRepository } from "./ownerRepository";

export class ownerResolver {
  public ownerRepository: any;
  constructor() {
    this.ownerRepository = new ownerRepository();
  }
  public async addOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.addOwnersV1(user_data,token_data, domain_code);
  }
  public async uploadGroundImageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.uploadGroundImageV1(user_data,token_data, domain_code);
  }
  public async uploadownerDocuments1V1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.uploadownerDocuments1V1(user_data,token_data, domain_code);
  }
  public async uploadownerDocuments2V1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.uploadownerDocuments2V1(user_data,token_data, domain_code);
  }
  public async deleteimagesV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.deleteimagesV1(user_data,token_data, domain_code);
  }
  public async listOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.listOwnersV1(user_data,token_data, domain_code);
  }
  public async updateOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.updateOwnersV1(user_data,token_data, domain_code);
  }
  public async getOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.getOwnersV1(user_data,token_data, domain_code);
  }
  public async getOwnerDocumentsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.getOwnerDocumentsV1(user_data,token_data, domain_code);
  }
  public async deleteOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.deleteOwnersV1(user_data,token_data, domain_code);
  }
  public async ownerStatusV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.ownerStatusV1(user_data,token_data, domain_code);
  }
  public async ownerHistoryWithStatusV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.ownerHistoryWithStatusV1(user_data,token_data, domain_code);
  }
  public async listSportsCategoryV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.ownerRepository.listSportsCategoryV1(user_data,token_data, domain_code);
  }

}