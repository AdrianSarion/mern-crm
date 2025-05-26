import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { NotebookTabs, Mail, Lock, LogIn, Github } from "lucide-react";
import { useLoginMutation } from "@/features/api/auth";
import { userHasAuthenticated } from "@/features/auth/slice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const schema = z.object({
  // Write it here since it's minimal
  email: z.string().email("Please provide a valid email.").trim(),
  password: z.string().min(8, "Password should at least 8 chars."),
});

export default function LogInPage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const [login, { isLoading, error: err }] = useLoginMutation();
  const onSubmit = async (data) => {
    // went the long road, in order to access the error immediatly.
    // You have to chain `unwrap()`
    await login(data)
      .then((response) => {
        if (response.data) dispatch(userHasAuthenticated(response.data.user));
        if (response.error && response.error.originalStatus !== 401)
          throw "Login Failed, Problem on server end.";
      })
      .catch((err) => {
        console.error(err);
        toast.error("Login failed. Please try again or contact support.");
      });
  };

  return (
    <div className="container relative h-screen w-screen mx-0 grid items-center justify-center max-w-none lg:grid-cols-[1fr_1fr_1fr] lg:px-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="relative hidden h-full flex-col self-start p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <NotebookTabs className="h-6 w-6 text-blue-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">Clikkle</span>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-gray-300">&ldquo;Streamline your business with Clikkle, the modern CRM solution.&rdquo;</p>
            <footer className="text-sm text-gray-400">- Team Clikkle</footer>
          </blockquote>
        </div>
      </div>

      <Card className="max-w-sm mx-auto shadow-2xl bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      autoComplete="current-email"
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link
                      to="#"
                      className="ml-auto inline-block text-xs text-gray-400 hover:text-blue-400 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs">{errors.password.message}</p>
                  )}
                  {err && err.originalStatus === 401 && (
                    <p className="text-red-400 text-xs">Invalid credentials.</p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting || isLoading ? <Spinner /> : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </div>
                  )}
                </Button>
                <Button variant="outline" role="lbrd" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
