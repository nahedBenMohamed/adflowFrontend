import { userStore } from '@/app';
import { type Nullable, type UserProfile } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { userProfileApi, type UpdateUserDto, type UpdateUserProfileDto } from '../api';

export class UserProfileStore {
  userProfile: Nullable<UserProfile> = null;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (id: number): Promise<void> => {
    try {
      this.isLoading = true;

      this.userProfile = await userProfileApi.getUserProfile(id);
    } catch (e) {
      throw new Error(`Failed to load user profile: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  update = async ({
    id,
    profileDto,
    userDto,
  }: {
    id: number;
    profileDto: UpdateUserProfileDto;
    userDto: UpdateUserDto;
  }): Promise<void> => {
    if (this.userProfile) this.userProfile.update(profileDto);

    await Promise.all([
      userProfileApi.updateUserProfile({ id, dto: profileDto }),
      userStore.update({ id, dto: userDto }),
    ]);
  };
}
