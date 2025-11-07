"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiResType } from "@/lib/APIResponse";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";
import { signIn } from "next-auth/react";
import { useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const authPaths = [
	"login",
	"register",
	"forgot-password",
	"reset-password",
	"activate",
];

export default function AuthWatcher() {
	const router = useRouter();
	const pathname = usePathname().split("/")[1];
	const { status } = useSession();
	const { setIsLoadingUser } = useUserStore();
	const loaderset = useRef(false);
	const unAuthLoaderSet = useRef(false);

	if (status === "loading") {
		if (!loaderset.current) {
			setIsLoadingUser(true);
			loaderset.current = true;
		}
		return null;
	}

	if (status === "unauthenticated") {
		if (pathname === "send") return <GuestLogin />;
		else if (!unAuthLoaderSet.current) {
			setIsLoadingUser(false);
			unAuthLoaderSet.current = true;

			if (!authPaths.includes(pathname)) {
				toast.warning("You are not logged in");
				router.replace("/login");
			}
		}
	}

	if (status === "authenticated")
		return <UserFetcher pathname={pathname} router={router} />;

	return null;
}

export function GuestLogin() {
	const { setIsLoadingUser } = useUserStore();
	useEffect(() => {
		(async () => {
			setIsLoadingUser(true);
			try {
				const res = await signIn("guest", { redirect: false });
				if (res?.error) toast.error(res.error.replace("Error: ", ""));
				toast.success("Logged in as guest");
			} catch (error: any) {
				toast.error(error.message || "Guest login failed");
			} finally {
				setIsLoadingUser(false);
			}
		})();
	}, []);

	return null;
}

export function UserFetcher({
	pathname,
	router,
}: {
	pathname: string;
	router: any;
}) {
	const { user, setUser, setIsLoadingUser } = useUserStore();
	useEffect(() => {
		(async () => {
			setIsLoadingUser(true);
			try {
				const { data: res } = await axios.get(`/api/get-user?username=me`);
				if (res.success) setUser(res.data.user);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResType>;
				toast.error(
					axiosError.response?.data.message || "Something went wrong"
				);
			} finally {
				/*setIsLoadingUser(false)
                isLoadingUser is not set to be false here because setUser will take time to update the store. 
                Ironically, we observed that even though the setUser is called before calling setIsLoadingUser to false,
                the isLoadingUser updates before the user. This causes the user to be null for a little time even after isLoadingUser is set to false.
                */
			}
		})();
	}, []);

	useEffect(() => {
		if (user) {
			if (user._id !== "guest" && authPaths.includes(pathname)) {
				toast.warning("You are already logged in");
				router.replace("/dashboard");
			} else if (user._id === "guest" && pathname === "dashboard") {
				console.log("----- here we go sir");

				toast.warning("You are logged in as guest");
				router.replace("/login");
			}
			/*
            So we are setting isLoadingUser to false here, 
            as it is under is if(user) block, 
            it is confirmed that user has been set in store
            */
			setIsLoadingUser(false);
		}
	}, [pathname, user]);

	return null;
}
