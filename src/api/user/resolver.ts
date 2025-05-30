import { userRepository } from "./user-repository";

export class userResolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new userRepository();
  }
  public async loginV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.loginV1(user_data,token_data, domain_code);
  }
  public async userGroundBookingV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.userGroundBookingV1(user_data,token_data, domain_code);
  }
  public async listFilteredGroundsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.listFilteredGroundsV1(user_data,token_data, domain_code);
  }
  public async listGroundsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.listGroundsV1(user_data,token_data, domain_code);
  }
  public async listFreeGroundsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.listFreeGroundsV1(user_data,token_data, domain_code);
  }
  public async listProfileDataV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.listProfileDataV1(user_data,token_data, domain_code);
  }
  public async updateProfileDataV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.updateProfileDataV1(user_data,token_data, domain_code);
  }
  public async forgotPasswordV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.forgotPasswordV1(user_data,token_data, domain_code);
  }
  public async resetPasswordV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.resetPasswordV1(user_data,token_data, domain_code);
  }
  public async userBookingHistoryV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.userBookingHistoryV1(user_data,token_data, domain_code);
  }
  public async userAuditPageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.userAuditPageV1(user_data,token_data, domain_code);
  }
  public async getGroundsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.getGroundsV1(user_data,token_data, domain_code);
  }
  public async getUnavailableAddonsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.getUnavailableAddonsV1(user_data,token_data, domain_code);
  }
  public async payConvertStringV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.payConvertStringV1(user_data,token_data, domain_code);
  }
  public async getconvertedDataAmountV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.userRepository.getconvertedDataAmountV1(user_data,token_data, domain_code);
  }
}