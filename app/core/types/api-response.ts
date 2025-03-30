export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export default BaseResponse; 