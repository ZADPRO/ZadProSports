import { financeRepository } from "./finance-repository";

export class financeResolver {
  public financeRepository: any;
  constructor() {
    this.financeRepository = new financeRepository();
  }
  public async bookingListV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.bookingListV1(user_data,token_data, domain_code);
  }
  public async findAmountsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.findAmountsV1(user_data,token_data, domain_code);
  }
  public async markAsPaidV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.markAsPaidV1(user_data,token_data, domain_code);
  }
  public async listPayoutesV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.listPayoutesV1(user_data,token_data, domain_code);
  }
  public async deletePayoutsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.deletePayoutsV1(user_data,token_data, domain_code);
  }
  public async listOwnersV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.listOwnersV1(user_data,token_data, domain_code);
  }
  
}