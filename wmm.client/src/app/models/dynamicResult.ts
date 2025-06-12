export interface DynamicResult<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
}
