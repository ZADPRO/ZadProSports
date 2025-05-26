
import { feedBackRepository } from "./feedback-repository";

export class feedBackResolver {
  public feedBackRepository: any;
  constructor() {
    this.feedBackRepository = new feedBackRepository();
  }
  public async addFeedBackV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.feedBackRepository.addFeedBackV1(user_data,token_data, domain_code);
  } 
  public async listFeedBackV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.feedBackRepository.listFeedBackV1(user_data,token_data, domain_code);
  } 
  public async groundFeedBackV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.feedBackRepository.groundFeedBackV1(user_data,token_data, domain_code);
  } 
  public async userFeedBackHistoryV1(user_data: any, token_data:any, domain_code: any): Promise<any> {
    return await this.feedBackRepository.userFeedBackHistoryV1(user_data,token_data, domain_code);
  } 
}
