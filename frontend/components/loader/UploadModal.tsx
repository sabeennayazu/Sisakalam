"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, X, XCircle } from "lucide-react";
import { createPoem, saveDraft as savePoemDraft } from "@/utils/poems.api";
import { createStory, saveDraft as saveStoryDraft } from "@/utils/stories.api";

export type PublishingContentType = "story" | "poem";
type TaskOperation = "publish" | "save" | "copy-link";

interface PublishingTaskInput {
	type: PublishingContentType;
	payload: Record<string, unknown>;
	operation?: TaskOperation;
	url?: string;
	request?: () => Promise<unknown>;
	onSuccess?: (result: unknown) => void;
	onSettled?: () => void;
}

interface PublishingTask extends PublishingTaskInput {
	status: "uploading" | "success" | "failure";
	error: string | null;
	result: unknown;
}

type TaskListener = (task: PublishingTask | null) => void;

let activeTask: PublishingTask | null = null;
const listeners = new Set<TaskListener>();

const notify = () => {
	listeners.forEach((listener) => listener(activeTask));
};

const updateTask = (updates: Partial<PublishingTask>) => {
	if (activeTask) {
		activeTask = { ...activeTask, ...updates };
		notify();
	}
};

const getErrorMessage = (error: unknown) =>
	error instanceof Error ? error.message : "We could not publish your work. Please try again.";

const startTask = ({ type, payload, operation = "publish", url, request: customRequest, onSuccess, onSettled }: PublishingTaskInput) => {
	activeTask = { type, payload, operation, url, request: customRequest, onSuccess, onSettled, status: "uploading", error: null, result: null };
	notify();

	if (operation === "copy-link") {
		void navigator.clipboard.writeText(url ?? window.location.href)
			.then(() => updateTask({ status: "success", result: { title: "Link copied" } }))
			.catch((error: unknown) => updateTask({ status: "failure", error: getErrorMessage(error) }));
		return;
	}

	const request = customRequest
		? customRequest()
		: operation === "save"
			? type === "poem" ? savePoemDraft(payload) : saveStoryDraft(payload)
			: type === "poem" ? createPoem(payload) : createStory(payload);
	void request
		.then((result) => {
			updateTask({ status: "success", result });
			activeTask?.onSuccess?.(result);
			activeTask?.onSettled?.();
		})
		.catch((error: unknown) => {
			updateTask({ status: "failure", error: getErrorMessage(error) });
			activeTask?.onSettled?.();
		});
};

export const startPublishing = (input: PublishingTaskInput) => startTask({ ...input, operation: "publish" });
export const startSaving = (input: PublishingTaskInput) => startTask({ ...input, operation: "save" });
export const startCopyLink = (url: string) => startTask({ type: "story", payload: { title: "Link copied" }, operation: "copy-link", url });

const subscribe = (listener: TaskListener) => {
	listeners.add(listener);
	listener(activeTask);
	return () => {
		listeners.delete(listener);
	};
};

const getPublishedTitle = (result: unknown, fallback: string) => {
	if (result && typeof result === "object" && "title" in result && typeof result.title === "string") {
		return result.title;
	}
	return fallback;
};

export default function UploadModal() {
	const [task, setTask] = useState<PublishingTask | null>(activeTask);

	useEffect(() => subscribe(setTask), []);

	useEffect(() => {
		if (task?.status === "success" && task.operation === "publish") {
			localStorage.removeItem("writing-draft");
		}
	}, [task?.operation, task?.status]);

	if (!task) return null;

	const label = task.type === "story" ? "story" : "poem";
	const isCopying = task.operation === "copy-link";
	const title = getPublishedTitle(task.result, task.payload.title as string);
	const isSaving = task.operation === "save";

	const close = () => {
		if (task.status !== "uploading") {
			activeTask = null;
			notify();
		}
	};

	const retry = () => startTask(task);

	return (
		<div className="fixed inset-0 z-100 flex items-start justify-center bg-black/20 px-4 pt-5 backdrop-blur-[2px] md:pt-8">
			<div className="w-full max-w-5xl overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
				<div className="flex min-h-20 items-center gap-4 px-5 py-4 md:px-7">
					<div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${task.status === "success" ? "bg-emerald-50 text-emerald-700" : task.status === "failure" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"}`}>
						{task.status === "uploading" && <LoaderCircle size={22} className="animate-spin" />}
						{task.status === "success" && <Check size={23} strokeWidth={2.5} />}
						{task.status === "failure" && <XCircle size={23} strokeWidth={2.5} />}
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="font-serif text-base font-bold text-gray-900 md:text-lg">
								{task.status === "uploading" && (isCopying ? "Copying link..." : isSaving ? `Saving your ${label} draft...` : `Your ${label} is uploading...`)}
								{task.status === "success" && (isCopying ? "Link copied" : isSaving ? `Your ${label} draft has been saved` : `Your ${label} has been published`)}
								{task.status === "failure" && (isCopying ? "Could not copy link" : isSaving ? `Your ${label} draft could not be saved` : `Your ${label} could not be published`)}
							</h2>
							<span className="bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
								{title || label}
							</span>
						</div>

						{task.status === "uploading" && !isCopying && (
							<div className="mt-2 flex items-center gap-3">
								<div className="h-1.5 w-full max-w-64 overflow-hidden rounded-full bg-gray-200">
									<div className="h-full w-2/3 animate-pulse rounded-full bg-black" />
								</div>
								<span className="whitespace-nowrap text-xs text-gray-500">{isSaving ? "Saving securely" : "Publishing securely"}</span>
							</div>
						)}
						{task.status === "failure" && <p className="mt-1 text-sm text-red-600">{task.error}</p>}
					</div>

					{task.status === "success" && !isSaving && !isCopying && (
						<div className="hidden items-center gap-3 md:flex">
							<button type="button" className="flex items-center gap-2 bg-slate-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-slate-200">
								<Copy size={14} /> Copy Link
							</button>
							<button type="button" className="flex items-center gap-2 bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800">
								View Live <ExternalLink size={14} />
							</button>
						</div>
					)}

					{task.status === "failure" && (
						<button type="button" onClick={retry} className="shrink-0 bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800">
							Retry
						</button>
					)}

					<button type="button" onClick={close} disabled={task.status === "uploading"} aria-label="Close" className="shrink-0 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
						<X size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}
