const lastAttempt = (e) => e.attempts?.[e.attempts.length - 1] ?? null;

export const execTime = (e) => e.createdAt ?? null;
export const execOk = (e) => e.status === "Success";
export const execAttempts = (e) => e.attempts?.length ?? 0;
export const execStatusCode = (e) => lastAttempt(e)?.statusCode ?? null;
export const execDuration = (e) => lastAttempt(e)?.responseTime ?? null;
export const execMessage = (e) => lastAttempt(e)?.message ?? "";
