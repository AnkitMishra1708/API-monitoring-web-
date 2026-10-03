import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { jobService } from "../services/jobService";
import { INTERVALS, METHODS, emptyForm, fromJob, jobFormSchema, toPayload } from "../validations/jobSchemas";
import { btnOutline, btnPrimary, fieldCls } from "../lib/ui";

export default function JobEditor() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");

  const {
    register, control, handleSubmit, reset, setError, watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(jobFormSchema), defaultValues: emptyForm });
  const { fields, append, remove } = useFieldArray({ control, name: "headers" });
  const isGet = watch("method") === "GET";

  useEffect(() => {
    if (!editing) return;
    jobService.getById(id).then((r) => reset(fromJob(r.data))).catch((e) => setLoadError(e.message)).finally(() => setLoading(false));
  }, [id, editing, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = toPayload(values);
      if (editing) await jobService.update(id, payload);
      else await jobService.create(payload);
      navigate(editing ? `/jobs/${id}` : "/", { replace: true });
    } catch (e) {
      setError("root", { message: e.message || "Could not save the monitor. Try again." });
    }
  };

  if (loading) return <p className="text-ink/60">Loading monitor</p>;
  if (loadError) return <p role="alert" className="text-red-700">{loadError}</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{editing ? "Edit monitor" : "Start a monitor"}</h1>
      <p className="mt-2 text-ink/70">We'll send a request to this endpoint on the schedule you pick.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 grid gap-x-20 gap-y-8 border-t border-ink pt-8 lg:grid-cols-2">
        <div className="space-y-5">
          <Input label="Name" placeholder="Payments API" error={errors.jobName?.message} {...register("jobName")} />
          <Input label="URL" type="url" placeholder="https://api.example.com/health" error={errors.url?.message} {...register("url")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Select label="Method" name="method" error={errors.method?.message} {...register("method")}>
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </Select>
            <Select label="Check" name="monitorInterval" error={errors.monitorInterval?.message} {...register("monitorInterval", { valueAsNumber: true })}>
              {INTERVALS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </Select>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="mb-1.5 flex items-center justify-between">
              <h2 className="text-sm font-medium">Headers</h2>
              <button type="button" onClick={() => append({ key: "", value: "" })} className="text-sm font-semibold underline underline-offset-4">Add header</button>
            </div>
            {fields.length === 0 && <p className="text-sm text-ink/60">No custom headers.</p>}
            <div className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="flex gap-3">
                  <input aria-label="Header name" placeholder="Authorization" className={fieldCls} {...register(`headers.${i}.key`)} />
                  <input aria-label="Header value" placeholder="Bearer …" className={fieldCls} {...register(`headers.${i}.value`)} />
                  <button type="button" onClick={() => remove(i)} aria-label="Remove header" className="px-2 text-sm font-semibold text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <label htmlFor="body" className="mb-1.5 block text-sm font-medium">Body (JSON)</label>
            <textarea
              id="body" rows={7} readOnly={isGet}
              placeholder={isGet ? "GET requests don't send a body." : '{ "ping": true }'}
              className={`${fieldCls} font-mono text-sm ${isGet ? "bg-paper-deep/50 text-ink/50" : ""}`}
              {...register("body")}
            />
            {errors.body && <p className="mt-1.5 text-sm text-red-700">{errors.body.message}</p>}
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/20 pt-6 lg:col-span-2">
          <button type="submit" disabled={isSubmitting} className={btnPrimary}>
            {isSubmitting ? "Saving" : editing ? "Save changes" : "Start monitor"}
          </button>
          <Link to={editing ? `/jobs/${id}` : "/"} className={btnOutline}>Cancel</Link>
          {errors.root && <p role="alert" className="text-sm text-red-700">{errors.root.message}</p>}
        </div>
      </form>
    </div>
  );
}
