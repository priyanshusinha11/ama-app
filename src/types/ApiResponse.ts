import { Message } from "@/model/User";
export interface ApiResponse {
    success: boolean;
    message: string;
    isAccecptingMessages?: boolean
    messages?: Array<Message>
}