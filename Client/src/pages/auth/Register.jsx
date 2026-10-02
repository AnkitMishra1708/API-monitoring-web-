import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { registerSchema } from "../../validations/authSchema.js";
import { authService } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = async (payload) => {
    try {
      await authService.register(payload);
      navigate("/login", { replace: true });
    } catch (err) {
      setError("root", {
        message: err.message || "Could not create account. Try again.",
      });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Add your first endpoint in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#12161A] underline underline-offset-4"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        {errors.root && (
          <p
            role="alert"
            className="rounded-md border border-[#D4361C] px-4 py-3 text-sm text-[#D4361C]"
          >
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
