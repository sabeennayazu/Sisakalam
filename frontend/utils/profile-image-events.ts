export interface ProfileImageUpdate {
  userId: number;
  imageUrl: string;
}

export const profileImageUpdateEvent = "sisakalam:profile-picture-updated";

export const announceProfileImageUpdate = (update: ProfileImageUpdate) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<ProfileImageUpdate>(profileImageUpdateEvent, { detail: update }));
  }
};