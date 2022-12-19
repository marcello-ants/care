/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FavoriteRequestInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateSeekerFavoriteList
// ====================================================

export interface updateSeekerFavoriteList_updateSeekerFavoriteList_favorite {
  __typename: "Favorite";
  /**
   * Favorite Id
   */
  id: string;
  /**
   * Favorite status
   */
  favoriteStatus: boolean;
}

export interface updateSeekerFavoriteList_updateSeekerFavoriteList {
  __typename: "FavoriteCaregiverPayload";
  /**
   * Favorite caregiver information
   */
  favorite: updateSeekerFavoriteList_updateSeekerFavoriteList_favorite;
}

export interface updateSeekerFavoriteList {
  /**
   * Adds/Removes caregiver from seekers favorite list , Create a FAVORITE record in monolith
   */
  updateSeekerFavoriteList: updateSeekerFavoriteList_updateSeekerFavoriteList;
}

export interface updateSeekerFavoriteListVariables {
  input: FavoriteRequestInput;
}
