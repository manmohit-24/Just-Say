"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { messageReqSchema, MessageReqType } from "@/schemas/message.schema";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResType } from "@/lib/APIResponse";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function () {
	const { data: session } = useSession();

	const receiverId = useParams().userId;
	const form = useForm<MessageReqType>({
		resolver: zodResolver(messageReqSchema),
		defaultValues: {
			content: "",
			isAnonymous: false,
			isTrulyAnonymous: session?.user._id === "guest" ? true : false,
			receiverId: receiverId?.toString() || "",
		},
	});

	const [isSending, setIsSending] = useState(false);
	const [contentCounter, setContentCounter] = useState(0);

	const [user, setUser] = useState({
		username: "",
		name: "",
		avatar: ""
	});

	useEffect(() => {
		(async () => {
			try {
				const { data: res } = await axios.get(
					`/api/get-user?userId=${receiverId}`
				);
				setUser(res.data.user);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const onSubmit: SubmitHandler<MessageReqType> = async (data) => {
		setIsSending(true);
        try {
            console.log(data);
            
            const { data: res } = await axios.post("/api/send-message", data);
            console.log(res);
            
			if (res.success) {
				toast.success(res.message);
            } else {
                
				toast.error(res.message);
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResType>;
			toast.error(axiosError.response?.data.message || "Something went wrong");
		} finally {
			setIsSending(false);
		}
	};

	useEffect(() => {
		setContentCounter(form.watch("content").length);
	}, [form.watch("content")]);

	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-background rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-4">Send Message to {user.name}</h1>

			<Card className="w-full gap-1 ">
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<Avatar className="h-10 w-10 bg-foreground rounded-full flex items-center justify-center">
								<AvatarFallback className="text-background font-bold">
									{user.name[0]}
								</AvatarFallback>
							</Avatar>

							<div>
								<CardTitle className="text-base font-semibold">
									{user.name}
								</CardTitle>
								<CardDescription className="text-xs">
									@{user.username}
								</CardDescription>
							</div>
						</div>
					</div>
					<Separator />
				</CardHeader>
				<CardContent>
					<div>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Controller
								name="receiverId"
								control={form.control}
								render={({ field }) => (
									<div className="flex items-center space-x-2">
										<input
											{...field}
											value={receiverId}
											disabled={true}
											className="hidden"
										/>
									</div>
								)}
							/>
							<FieldGroup>
								<Controller
									name="content"
									control={form.control}
									render={({ field }) => (
										<Field>
											<FieldLabel htmlFor="content">
												Write Your Message
											</FieldLabel>
											<Textarea
												{...field}
												placeholder="Type your anonymous message here..."
												className="min-h-[120px] resize-none"
											/>
											<FieldDescription
												className={`${contentCounter < 10 || contentCounter > 500 ? "text-red-500" : ""}`}
											>
												{" "}
												{contentCounter} / 500
											</FieldDescription>

											<FieldError>
												{form.formState.errors.content?.message}
											</FieldError>
										</Field>
									)}
								/>
							</FieldGroup>

							<div className="flex items-center justify-between mt-4">
								<div className="space-y-4">
									<FieldGroup>
										<Controller
											name="isAnonymous"
											control={form.control}
											render={({ field }) => (
												<Field>
													<div className="flex items-center gap-2 text-nowrap">
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
															id="isAnonymous"
														/>
														<FieldLabel
															htmlFor="isAnonymous"
															className="text-sm text-muted-foreground"
														>
															Send anonymously
														</FieldLabel>
														<InfoTooltip content="Stay anonymous while keeping control —receiver will not be able to see but you can still unsend your message later." />
													</div>
													<FieldError>
														{form.formState.errors.isAnonymous?.message}
													</FieldError>
												</Field>
											)}
										/>
									</FieldGroup>
									<FieldGroup>
										<Controller
											name="isTrulyAnonymous"
											control={form.control}
											render={({ field }) => (
												<Field>
													<div className="flex flex-row items-center gap-2 text-nowrap">
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
															id="isTrulyAnonymous"
															disabled={session?.user._id === "guest"}
														/>
														<FieldLabel
															htmlFor="isTrulyAnonymous"
															className="text-sm text-muted-foreground"
														>
															Send Truely Anonymously
														</FieldLabel>
														<InfoTooltip content="Go fully invisible — this message is completely detached from your account for total privacy and freedom. Can't be unsent later" />
													</div>
													<FieldError>
														{form.formState.errors.isTrulyAnonymous?.message}
													</FieldError>
												</Field>
											)}
										/>
									</FieldGroup>
								</div>
								<Button
									type="submit"
									disabled={isSending}
									className="px-6 font-medium"
								>
									{isSending ? (
										<>
											<Spinner /> Sending...
										</>
									) : (
										"Send Message"
									)}
								</Button>
							</div>
						</form>
					</div>
				</CardContent>
			</Card>

			<Separator />
		</div>
	);
}

const InfoTooltip = ({ content }: { content: string }) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					className="ml-1 text-muted-foreground hover:text-foreground"
				>
					<HelpCircle className="h-4 w-4" />
				</button>
			</TooltipTrigger>
			<TooltipContent className="max-w-xs text-sm">{content}</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);
