import { financeRepository } from "./finance-repository";

export class financeResolver {
  public financeRepository: any;
  constructor() {
    this.financeRepository = new financeRepository();
  }
  public async recordBookingFinanceV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.recordBookingFinanceV1(user_data,token_data, domain_code);
  }
  public async getWeeklyPayoutsV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.getWeeklyPayoutsV1(user_data,token_data, domain_code);
  }
  public async listPayoutesV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.financeRepository.listPayoutesV1(user_data,token_data, domain_code);
  }

}