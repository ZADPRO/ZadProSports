import { settingsRepository } from "./settings-repository";

export class settingsResolver {
  public settingsRepository: any;
  constructor() {
    this.settingsRepository = new settingsRepository();
  }
  public async addSportCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addSportCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateSportCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateSportCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteSportCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteSportCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listSportCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listSportCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addFeaturesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addFeaturesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateFeaturesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateFeaturesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFeaturesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteFeaturesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  // public async listFeaturesV1(
  //   user_data: any,
  //   token_data: any,
  //   domain_code: any
  // ): Promise<any> {
  //   return await this.settingsRepository.listFeaturesV1(
  //     user_data,
  //     token_data,
  //     domain_code
  //   );
  // }

  public async listFeaturesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    // console.log("User ID:", token_data.id, "Role ID:", token_data.roleId);
    console.log("token_data", token_data);

    return await this.settingsRepository.listFeaturesV1(
      user_data,
      token_data,
      domain_code
    );
  }

  public async addUserGuidelinesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addUserGuidelinesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateUserGuidelinesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateUserGuidelinesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteUserGuidelinesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteUserGuidelinesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listUserGuidelinesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listUserGuidelinesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addFacilitiesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addFacilitiesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateFacilitiesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateFacilitiesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFacilitiesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteFacilitiesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listFacilitiesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listFacilitiesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addAdditionalTipsV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addAdditionalTipsV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateAdditionalTipsV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateAdditionalTipsV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteAdditionalTipsV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteAdditionalTipsV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listAdditionalTipsV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listAdditionalTipsV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async uploadFoodImageV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.uploadFoodImageV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFoodImageV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteFoodImageV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addFoodAndSnacksV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addFoodAndSnacksV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateFoodAndSnacksV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateFoodAndSnacksV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFoodAndSnacksV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteFoodAndSnacksV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listFoodAndSnacksV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listFoodAndSnacksV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async addFoodComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.addFoodComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateFoodComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.updateFoodComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deleteFoodComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.deleteFoodComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listFoodComboV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listFoodComboV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listFoodCategoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.settingsRepository.listFoodCategoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
}
