import { adminRepository } from "./admin-repository";

export class adminResolver {
  public adminRepository: any;
  constructor() {
    this.adminRepository = new adminRepository();
  }
  public async userSignUpV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.userSignUpV1(user_data,token_data, domain_code);
  }
  public async userLoginV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.userLoginV1(user_data,token_data, domain_code);
  }
  public async listUserBookingsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.listUserBookingsV1(user_data,token_data, domain_code);
  }
  public async deleteBookingsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.deleteBookingsV1(user_data,token_data, domain_code);
  }
  public async listSignUpUsersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.listSignUpUsersV1(user_data,token_data, domain_code);
  }
  public async listOverallAuditV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.listOverallAuditV1(user_data,token_data, domain_code);
  }
  public async reportPageV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.reportPageV1(user_data,token_data, domain_code);
  }
  public async dashboardV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.dashboardV1(user_data,token_data, domain_code);
  }
  public async approveGroundV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.approveGroundV1(user_data,token_data, domain_code);
  }
  public async ownerAuditV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.adminRepository.ownerAuditV1(user_data,token_data, domain_code);
  }
}