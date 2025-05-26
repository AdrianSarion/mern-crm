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
import { userSchema } from "@/data/user";
import { useSignupMutation } from "@/features/api/auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotebookTabs, Mail, Lock, User2, Github, ArrowRight } from "lucide-react";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpPage() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const onSubmit = async (data) => {
    // went the long road, in order to access the error immediatly.
    // You have to chain `unwrap()`
    try {
      await signup(data).unwrap();
      toast.info("Registered successfully, Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.status === 409)
        setError("email", { type: 409, message: "Email already exists." });
      toast.error("Registration failed. Please try again or contact support.");
    }
  };

  return (
    <div className="container relative h-screen w-screen mx-0 grid items-center justify-center max-w-none lg:grid-cols-[1fr_1fr_1fr] lg:px-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="relative hidden h-full flex-col self-start p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <NotebookTabs className="h-6 w-6 text-blue-400" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Clikkle CRM
          </span>
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
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div
                  className={cn(
                    "grid grid-cols-2 gap-x-4",
                    errors.lastName || errors.firstName ? "grid-rows-[4fr_1fr]" : "",
                  )}>
                  <div className="grid gap-2">
                    <Label htmlFor="firstName" className="text-gray-300">First name</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        autoComplete="current-firstname"
                        placeholder="John"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        {...register("firstName")}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last name</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        autoComplete="current-lastname"
                        placeholder="Doe"
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        {...register("lastName")}
                      />
                    </div>
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-xs grid">
                      {errors.firstName.message}
                    </p>
                  )}
                  {errors.lastName && (
                    <p className="text-red-400 text-xs col-start-2 row-start-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      placeholder="m@example.com" 
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                      {...register("email")} 
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="password"
                      placeholder="Min. 8 characters"
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs">{errors.password.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? <Spinner /> : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Create account</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                  <Github className="mr-2 h-4 w-4" />
                  Sign up with GitHub
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
