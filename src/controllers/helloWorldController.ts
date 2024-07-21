import { Request, Response } from "express";
export const helloWorldController = (req: Request, res: Response) => {
	res.send("Hello, World!");
};
