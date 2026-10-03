import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jobService } from "../services/jobService";
import { executionService } from "../services/executionService";
import { intervalLabel } from "../validations/jobSchemas";
import { isPaused } from "../lib/job";
import { execAttempts, execDuration, execMessage, execOk, execStatusCode, execTime } from "../lib/execution";
import { btnOutline } from "../lib/ui";
import { StatusDot } from "./Monitors";

const execCols = "grid grid-cols-[1fr_auto] gap-x-6 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [executions, setExecutions] = useState(null);
  const [execError, setExecError] = useState("");

  const load = useCallback(
    () => jobService.getById(id).then((r) => setJob(r.data)).catch((e) => setError(e.message)),
    [id]
  );
  useEffect(() => { load(); }, [load]);

  const loadExecutions = useCallback(() => {
    setExecError("");
    return executionService
      .getByJob(id)
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : r.data?.executions ?? [];
        const newestFirst = [...list].sort((a, b) => new Date(execTime(b)) - new Date(execTime(a)));
        setExecutions(newestFirst.slice(0, 5));
      })
      .catch((e) => { setExecError(e.message); setExecutions([]); });
  }, [id]);
  useEffect(() => { loadExecutions(); }, [loadExecutions]);

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  const toggle = () => run(async () => {
    await (isPaused(job) ? jobService.activate(id) : jobService.pause(id));
    await load();
  });

  const remove = () => {
    if (!window.confirm(`Delete "${job.jobName}"? This can't be undone.`)) return;
    run(async () => { await jobService.remove(id); navigate("/", { replace: true }); });
  };

  if (!job) return error ? <p role="alert" className="text-red-700">{error}</p> : <p className="text-ink/60">Loading monitor</p>;

  const paused = isPaused(job);
  const rows = [
    ["Status", <StatusDot key="s" job={job} />],
    ["Method", job.method],
    ["URL", job.url],
    ["Interval", intervalLabel(job.monitorInterval)],
  ];
  const headers = Object.keys(job.headers ?? {}).length ? JSON.stringify(job.headers, null, 2) : "None";
  const body = job.body ? JSON.stringify(job.body, null, 2) : "None";

  return (
    <div>
      <Link to="/" className="text-sm font-medium text-ink/70 underline underline-offset-4 hover:text-ink">All monitors</Link>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{job.jobName}</h1>
          <p className="mt-2 truncate text-ink/70">{job.url}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/jobs/${id}/edit`} className={btnOutline}>Edit</Link>
          <button onClick={toggle} disabled={busy} className={btnOutline}>{paused ? "Activate" : "Pause"}</button>
          <button onClick={remove} disabled={busy} className={`${btnOutline} border-red-700 text-red-700 hover:bg-red-50`}>Delete</button>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}

      <div className="mt-10 grid gap-x-20 border-t border-ink lg:grid-cols-2">
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-b border-ink/15 py-4">
              <dt className="text-ink/60">{k}</dt>
              <dd className="break-all text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-8 py-4">
          <section>
            <h2 className="font-semibold">Headers</h2>
            <pre className="mt-3 overflow-x-auto rounded-md bg-gray-50 p-4 text-sm">{headers}</pre>
          </section>
          <section>
            <h2 className="font-semibold">Body</h2>
            <pre className="mt-3 overflow-x-auto rounded-md bg-gray-50 p-4 text-sm">{body}</pre>
          </section>
        </div>
      </div>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight">Recent executions</h2>
          <button onClick={loadExecutions} className="text-sm font-semibold underline cursor-pointer underline-offset-4">Refresh</button>
        </div>

        <div className="mt-4 border-t border-ink">
          {executions === null ? (
            <p className="py-6 text-ink/60">Loading executions</p>
          ) : execError ? (
            <p role="alert" className="py-6 text-red-700">{execError}</p>
          ) : executions.length === 0 ? (
            <p className="py-6 text-ink/60">No executions yet. Results appear here after the first check runs.</p>
          ) : (
            <>
              <div className={`hidden border-b border-ink/20 py-3 text-sm text-ink/60 ${execCols}`}>
                <span>Time</span><span>Result</span><span>Status code</span><span>Response time</span><span>Attempts</span>
              </div>
              {executions.map((e, i) => {
                const ok = execOk(e);
                const code = execStatusCode(e);
                const ms = execDuration(e);
                const t = execTime(e);
                const attempts = execAttempts(e);
                const msg = execMessage(e);
                return (
                  <div key={e._id ?? e.id ?? i} className={`items-center border-b border-ink/15 py-4 ${execCols}`}>
                    <span className="font-medium tabular-nums">{t ? new Date(t).toLocaleString() : "Unknown time"}</span>
                    <span className={`text-right text-sm font-semibold lg:text-left ${ok ? "" : "text-red-700"}`}>
                      <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle ${ok ? "bg-ink" : "bg-red-700"}`} />
                      {ok ? "Success" : "Failed"}
                    </span>
                    <span className="text-sm text-ink/70 tabular-nums">{code ? `Status ${code}` : "No response"}</span>
                    <span className="text-right text-sm text-ink/70 tabular-nums lg:text-left">{ms !== null ? `${ms} ms` : "n/a"}</span>
                    <span className="text-sm text-ink/70 tabular-nums">{attempts} {attempts === 1 ? "attempt" : "attempts"}</span>
                    {!ok && msg && <p className="col-span-full mt-2 text-sm text-red-700">{msg}</p>}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </div>
  );
}