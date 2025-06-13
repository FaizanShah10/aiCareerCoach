"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { generateCoverLetter } from "../../../../actions/coverletter";
import useFetch from "../../../../hooks/useFetch";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data,
    loading,
    error,
    fn: generateFn,
  } = useFetch(generateCoverLetter);

  const onSubmit = async (data: any) => {
    // console.log(data.role)
    // console.log(data.description)
    await generateFn(data.role, data.description);
    
  };

  
  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <div>
        <h1 className="gradient-title animate-gradient text-2xl lg:text-5xl mt-32">
          Cover Letter
        </h1>
        <p className="mb-4">
          Generate a tailored cover letter for the job application
        </p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-1/2">
              <div className="grid w-full items-center gap-7">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="role">Job Role</Label>
                  <Input
                    {...register("role", { required: true })}
                    id="role"
                    placeholder="Role of the Job"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    className="resize-none"
                    rows={5}
                    id="description"
                    placeholder="Description of the Job"
                    {...register("description", { required: true })}
                  />
                </div>
                <Button>
                  {loading ? "Generating..." : "Generate Cover Letter"}
                </Button>
              </div>
              {error && (
                <p className="text-center text-red-700 text-sm">{error}</p>
              )}
            </form>

            {/* Generated Result Section */}
            <div className="w-full lg:w-1/2 border border-muted p-4 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold mb-2">
                Generated Cover Letter
              </h3>
              <p className="whitespace-pre-wrap">
                {data || "Your generated letter will appear here."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
