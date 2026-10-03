import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/jobService";
import { intervalLabel } from "../validations/jobSchemas";
import { isPaused, jobId } from "../lib/job";
import { btnPrimary } from "../lib/ui";

export function StatusDot({ job }) {
  const paused = isPaused(job);
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span className={`h-2.5 w-2.5 rounded-full ${paused ? "border-2 border-ink" : "bg-ink"}`} />
      {paused ? "Paused" : "Active"}
    </span>
  );
}

const cols = "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_90px_160px_110px] lg:gap-6";

export default function Monitors() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    jobService.getMyJobs().then((r) => setJobs(r.data ?? [])).catch((e) => setError(e.message));
  }, []);

  if (error) return <p role="alert" className="text-red-700">{error}</p>;
  if (!jobs) return <p className="text-ink/60">Loading monitors</p>;

  const paused = jobs.filter(isPaused).length;

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Monitors</h1>
          <p className="mt-2 text-ink/70">
            {jobs.length} {jobs.length === 1 ? "endpoint" : "endpoints"}, {paused} paused
          </p>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-10 border-t border-ink py-16">
          <p className="text-2xl font-semibold">You aren't monitoring anything yet.</p>
          <p className="mt-2 max-w-md text-ink/70">Add the URL of an API and we'll check it on the schedule you choose.</p>
          <Link to="/jobs/new" className={`${btnPrimary} mt-6`}>Start monitor</Link>
        </div>
      ) : (
        <div className="mt-10 border-t border-ink">
          <div className={`hidden border-b border-ink/20 py-3 text-sm text-ink/60 ${cols}`}>
            <span>Name</span><span>URL</span><span>Method</span><span>Interval</span><span>Status</span>
          </div>
          {jobs.map((job) => (
            <Link
              key={jobId(job)}
              to={`/jobs/${jobId(job)}`}
              className={`flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-ink/15 px-1 py-4 transition-colors hover:bg-#ffff ${cols}`}
            >
              <span className="basis-full truncate font-semibold lg:basis-auto">{job.jobName}</span>
              <span className="basis-full truncate text-ink/70 lg:basis-auto">{job.url}</span>
              <span className="text-sm font-medium">{job.method}</span>
              <span className="text-sm text-ink/70">{intervalLabel(job.monitorInterval)}</span>
              <StatusDot job={job} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
