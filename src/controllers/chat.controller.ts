import { Request, Response, NextFunction } from "express";
import * as chatService from "../services/chat.services";

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userAId, userBId } = req.body;

        const result = await chatService.createOrGetChat(userAId, userBId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
