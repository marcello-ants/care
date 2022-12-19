/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FavoriteProviderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: favoriteProvider
// ====================================================

export interface favoriteProvider_favoriteProvider_FavoriteCaregiverPayload_favorite {
  __typename: "Favorite";
  /**
   * Favorite status
   */
  favoriteStatus: boolean;
  /**
   * Favorite Id
   */
  id: string;
}

export interface favoriteProvider_favoriteProvider_FavoriteCaregiverPayload {
  __typename: "FavoriteCaregiverPayload";
  /**
   * Favorite caregiver information
   */
  favorite: favoriteProvider_favoriteProvider_FavoriteCaregiverPayload_favorite;
}

export interface favoriteProvider_favoriteProvider_FavoriteProviderInvalidServiceProfile {
  __typename: "FavoriteProviderInvalidServiceProfile";
  /**
   * Message containing relevant error.
   */
  message: string;
}

export type favoriteProvider_favoriteProvider = favoriteProvider_favoriteProvider_FavoriteCaregiverPayload | favoriteProvider_favoriteProvider_FavoriteProviderInvalidServiceProfile;

export interface favoriteProvider {
  /**
   * Adds a provider to a seeker's favorites.
   */
  favoriteProvider: favoriteProvider_favoriteProvider;
}

export interface favoriteProviderVariables {
  input: FavoriteProviderInput;
}
