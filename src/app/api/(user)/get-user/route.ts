import { User } from "@/models/user.model";
import { APIResponse, safeUserResponse } from "@/lib/APIResponse";
import { validateSession } from "@/lib/validateSession";
import { NextRequest } from "next/server";

const RESPONSES = {
	SUCCESS: (data: object) => ({
		success: true,
		message: "User found",
		status: 200,
		data,
	}),
	INTERNAL_ERROR: {
		success: false,
		message: "Some internal error occurred while getting user",
		status: 500,
	},
};

export async function GET(req: NextRequest) {
	try {
		console.log("Here");

		const sessionValidationRes = await validateSession({ allowGuest: true });
		console.log("Here 2 ");

		if (!sessionValidationRes.success) return APIResponse(sessionValidationRes);

		console.log("Here 3");

		const { user } = sessionValidationRes.data as any;

		console.log("Here 4", user);

		let userId = req.nextUrl.searchParams.get("userId");

		console.log("Here 5", userId , "\n" , typeof userId);

		if (!userId) return APIResponse(RESPONSES.INTERNAL_ERROR);

		console.log("Here 6");

		if (userId === "me")
			return APIResponse(
				RESPONSES.SUCCESS({
					user: safeUserResponse(user),
					isMe: true,
				})
			);

		console.log("Here 7");

		const foundUser = await User.findOne({ "_id" :  userId});
		if (!foundUser) return APIResponse(RESPONSES.INTERNAL_ERROR);

		console.log("Here 8");

		return APIResponse(
			RESPONSES.SUCCESS({
				user: safeUserResponse(foundUser),
				isMe: false,
			})
		);
	} catch (error) {
		console.log("Error getting user : \n", error);
		return APIResponse(RESPONSES.INTERNAL_ERROR);
	}
}
