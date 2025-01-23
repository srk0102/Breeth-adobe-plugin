import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-base-url.com' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    fetchUserProfile: builder.query({
      query: () => '/user/profile',
    }),
  }),
});

export const { useLoginMutation, useFetchUserProfileQuery } = apiSlice;
