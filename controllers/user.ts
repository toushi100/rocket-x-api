import { User } from "../models/user";
import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/auth";


export async function update(req: AuthenticatedRequest, res: Response) {
    var user = req.user
    const { fullName, organizationName } = req.body
    // user.fullName = fullName
    // user.organizationName = organizationName
    await user.updateOne({
        fullName,
        organizationName
    })
    user = await User.findById(user._id)
    res.send(user)
}
