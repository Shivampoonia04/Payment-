import axios,{AxiosResponse} from "axios";
import { SubscriptionStatus, ApiError } from "../types/Api"
import { ApiErrorResponse } from "../types/Api";
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email:string, password:string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  localStorage.setItem("user", JSON.stringify(response.data.user));
  window.location.reload();
  return response.data;
};
export const signupUser = async (user: { [key: string]: any }) => {
  const response = await axios.post(`${API_URL}/signup`, { user });
  return response.data;
};
export const fetchMovies = async () => {
  console.log(API_URL+" ali url");
  const response = await axios.get(`${API_URL}/movies`);
  return response.data.movies;
};
export const fetchMovieDetails = async (id:number) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/movies/${id}`,
    {headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    }}
  );
  console.log(response);
  let data=response.data;
  localStorage.setItem("genre", data.genre);
  return data;
};
export const fetchMoviesAll = async (page: number = 1) => {
  try {
    const response = await axios.get(`${API_URL}/movies`, {
      params: { page },
    });
    return {
      movies: response.data.movies,
      pagination: response.data.meta,
    };
  } catch (error: any) {
    throw error;
  }
};
export const fetchMoviesAlll = async (
  page: number,
  genre: string,
  search: string,
  rating: number
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      genre,
      search,
      rating: rating.toString(),
    });
    const response = await fetch(`${API_URL}/movies/search?${params.toString()}`);
    return await response.json();
  } catch (err) {
    return null;
  }
};
export const addMovie = async (data: FormData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/movies`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteMovie = async (movieId: number) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(`${API_URL}/movies/${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete movie (status ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateMovie = (id: number, data: FormData) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/movies/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};


export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
   if (!token) {
      throw new Error("No user data found. User might not be logged in.");
    }
    const tokenn = localStorage.getItem("token");

    if (!tokenn) {
      throw new Error("No authentication token found in user data.");
    }

    console.log("Sending FCM token to backend:", token);
    console.log("Using auth token:", token);

    const response = await fetch(
      `${API_URL}/update_device_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` Bearer ${tokenn}`,
        },
        body: JSON.stringify({ device_token: token }),
      }
    );

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response
        .json()
        .catch(() => ({}));
      throw new Error(
        `Failed to send device token: ${response.status} ${
          response.statusText
        } - ${errorData.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Device token sent to backend successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending device token to backend:", error);
    throw error;
  }
};

export const toggleWishList = async (movie_id: number, token: string) => {
  const response = axios.post(
    `${API_URL}/movies/toggle_watchlist`,
    { movie_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  return response;
};

export const getWishlistMovies = async () => {
  let token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/movies/watchlist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.movies;
};

export const updateProfileImage = async (image:File) => {
  try {
    const formData = new FormData();
    formData.append("profile_picture", image);

    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/update_profile_picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update profile image");
    }

    const data = await response.json();
    return data;
  } catch (error:any) {
    throw new Error(error.message);
  }
};
export const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const data = await response.json();
    return data;
  } catch (error:any) {
    throw new Error(error.message);
  }
};


export const createSubscription = async (planType: string): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${API_URL}/user_subscriptions`,
      { plan_type: planType },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:` Bearer ${token}`,
        },
      }
    );


    if (response.data.error) {
      throw new Error(response.data.error);
    }

    const checkoutUrl = response.data.checkoutUrl || response.data.data?.checkoutUrl || response.data.url;
    if (!checkoutUrl) {
      throw new Error('No checkout URL returned from server.');
    }

    return checkoutUrl;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to initiate subscription');
  }
};


export const success = async (sessionId: string) => {
  try {
    const authToken = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/user_subscriptions/success?session_id=${sessionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.error || 'Failed to verify subscription.');
  }
};
export const isApiError = (data: any): data is ApiError => {
  return data && typeof data === 'object' && 'error' in data;
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    let token=localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response: AxiosResponse<SubscriptionStatus | ApiError> = await axios.get(
      `${API_URL}/user_subscriptions/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("in sub api"+response);

    if (isApiError(response.data)) {
      throw new Error(response.data.error);
    }

    return response.data as SubscriptionStatus;
  } catch (error) {
    console.error('Subscription Status Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      response: axios.isAxiosError(error) ? error.response?.data : undefined,
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
    });

    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (isApiError(data)) {
        throw new Error(data.error);
      }
      throw new Error('Failed to fetch subscription status');
    }

    throw new Error('An unexpected error occurred');
  }
};
export const cancelSubscription = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await axios.get(
    `${API_URL}/user_subscriptions/cancel`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
